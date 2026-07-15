import React, { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from 'react';
import { GrowthState, GrowthAction, SleepLog, NutritionLog, SupplementLog, PlyoLog, HeightEntry } from '../types';
import { GROWTH_STORAGE_KEY, USER_PROFILE } from '../utils/constants';
import { evaluateSleepQuality } from '../engine/sleepEngine';
import { calculateNutritionScore } from '../engine/nutritionEngine';
import { toIsoString } from '../utils/dateUtils';

const getInitialGrowthState = (): GrowthState => {
  try {
    const stored = localStorage.getItem(GROWTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load growth state:', e);
  }

  return {
    sleepLogs: {},
    nutritionLogs: {},
    supplementLogs: {},
    plyoLogs: {},
    heightHistory: [
      { date: toIsoString(new Date()), heightCm: USER_PROFILE.currentHeight, notes: 'Tinggi awal' },
    ],
    currentHeight: USER_PROFILE.currentHeight,
  };
};

function growthReducer(state: GrowthState, action: GrowthAction): GrowthState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'LOG_SLEEP': {
      const log = { ...action.log, score: evaluateSleepQuality(action.log) };
      return {
        ...state,
        sleepLogs: { ...state.sleepLogs, [log.date]: log },
      };
    }
    case 'LOG_NUTRITION':
      return {
        ...state,
        nutritionLogs: { ...state.nutritionLogs, [action.log.date]: action.log },
      };
    case 'LOG_SUPPLEMENT':
      return {
        ...state,
        supplementLogs: { ...state.supplementLogs, [action.log.date]: action.log },
      };
    case 'LOG_PLYO':
      return {
        ...state,
        plyoLogs: { ...state.plyoLogs, [action.log.date]: action.log },
      };
    case 'LOG_HEIGHT': {
      const exists = state.heightHistory.some(e => e.date === action.entry.date);
      const heightHistory = exists
        ? state.heightHistory.map(e => (e.date === action.entry.date ? action.entry : e))
        : [...state.heightHistory, action.entry].sort((a, b) => a.date.localeCompare(b.date));
      return {
        ...state,
        heightHistory,
        currentHeight: action.entry.heightCm,
      };
    }
    case 'UPDATE_HEIGHT':
      return {
        ...state,
        currentHeight: action.heightCm,
      };
    default:
      return state;
  }
}

interface GrowthContextType {
  state: GrowthState;
  dispatch: React.Dispatch<GrowthAction>;
  todayIso: string;
  todaySleep: SleepLog | null;
  todayNutrition: NutritionLog | null;
  todaySupplement: SupplementLog | null;
  todayPlyo: PlyoLog | null;
  compositeScore: number;
}

const GrowthContext = createContext<GrowthContextType | null>(null);

export function GrowthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(growthReducer, null, getInitialGrowthState);
  
  const todayIso = useMemo(() => toIsoString(new Date()), []);
  
  const todaySleep = state.sleepLogs[todayIso] || null;
  const todayNutrition = state.nutritionLogs[todayIso] || null;
  const todaySupplement = state.supplementLogs[todayIso] || null;
  const todayPlyo = state.plyoLogs[todayIso] || null;

  const compositeScore = useMemo(() => {
    let total = 0;
    let count = 0;

    if (todaySleep) {
      total += todaySleep.score;
      count++;
    }
    if (todaySupplement) {
      let suppScore = 0;
      if (todaySupplement.d3k2Taken) suppScore += 25;
      if (todaySupplement.d3k2WithFat) suppScore += 25;
      if (todaySupplement.zincB2Taken) suppScore += 25;
      if (todaySupplement.zincB2EmptyStomach) suppScore += 25;
      total += suppScore;
      count++;
    }

    return count > 0 ? Math.round(total / count) : 0;
  }, [todaySleep, todaySupplement]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(GROWTH_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Fetch from backend on mount
  useEffect(() => {
    fetch('/api/growth')
      .then(res => res.json())
      .then(data => {
         dispatch({ type: 'SET_STATE', payload: data });
      })
      .catch(err => console.error('Failed to load from backend', err));
  }, []);

  // Async dispatch that also syncs to backend
  const asyncDispatch = React.useCallback((action: GrowthAction) => {
    dispatch(action);

    const sync = async () => {
      try {
        if (action.type === 'LOG_SLEEP') {
          await fetch('/api/growth/sleep', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.log) });
        } else if (action.type === 'LOG_NUTRITION') {
          await fetch('/api/growth/nutrition', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.log) });
        } else if (action.type === 'LOG_SUPPLEMENT') {
          await fetch('/api/growth/supplement', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.log) });
        } else if (action.type === 'LOG_PLYO') {
          await fetch('/api/growth/plyo', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.log) });
        } else if (action.type === 'LOG_HEIGHT') {
          await fetch('/api/growth/height', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(action.entry) });
        }
      } catch (err) {
        console.error('Failed to sync with backend:', err);
      }
    };
    sync();
  }, [dispatch]);

  const contextValue = useMemo(
    () => ({ state, dispatch: asyncDispatch, todayIso, todaySleep, todayNutrition, todaySupplement, todayPlyo, compositeScore }),
    [state, asyncDispatch, todayIso, todaySleep, todayNutrition, todaySupplement, todayPlyo, compositeScore]
  );

  return (
    <GrowthContext.Provider value={contextValue}>
      {children}
    </GrowthContext.Provider>
  );
}

export function useGrowth() {
  const context = useContext(GrowthContext);
  if (!context) throw new Error('useGrowth must be used within GrowthProvider');
  return context;
}
