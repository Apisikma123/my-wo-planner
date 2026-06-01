import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { WorkoutDay, WorkoutState, WorkoutAction } from '../types';
import { generateRoster } from '../engine/calendarEngine';
import { toIsoString, getNextMonday, fromIsoString } from '../utils/dateUtils';
import { DEFAULT_VISIBLE_WEEKS, STORAGE_KEY } from '../utils/constants';

const getInitialState = (): WorkoutState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Regenerate roster from stored start date
      const startDate = fromIsoString(parsed.startDate);
      const roster = generateRoster(startDate, parsed.visibleWeeks || DEFAULT_VISIBLE_WEEKS, parsed.completedDays || []);
      return {
        ...parsed,
        roster,
      };
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  
  // Default: start from next Monday
  const defaultStart = getNextMonday(new Date());
  return {
    startDate: toIsoString(defaultStart),
    roster: generateRoster(defaultStart, DEFAULT_VISIBLE_WEEKS),
    visibleWeeks: DEFAULT_VISIBLE_WEEKS,
    completedDays: [],
    selectedDayId: null,
    activeFilter: 'all',
    streak: 0,
  };
};

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'SET_START_DATE': {
      const startDate = action.date;
      const roster = generateRoster(fromIsoString(startDate), state.visibleWeeks, state.completedDays);
      return { ...state, startDate, roster, selectedDayId: null, activeFilter: 'all' };
    }
    case 'TOGGLE_COMPLETE': {
      const dayId = action.dayId;
      const day = state.roster.find(d => d.id === dayId);
      if (!day) return state;
      
      let completedDays: string[];
      if (state.completedDays.includes(day.isoDate)) {
        completedDays = state.completedDays.filter(d => d !== day.isoDate);
      } else {
        completedDays = [...state.completedDays, day.isoDate];
      }
      
      // Recalculate streak
      const streak = calculateStreak(completedDays, state.roster);
      const roster = generateRoster(fromIsoString(state.startDate), state.visibleWeeks, completedDays);
      
      return { ...state, completedDays, streak, roster };
    }
    case 'SELECT_DAY':
      return { ...state, selectedDayId: action.dayId };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.filter };
    case 'LOAD_MORE_WEEKS': {
      const visibleWeeks = state.visibleWeeks + 5;
      const roster = generateRoster(fromIsoString(state.startDate), visibleWeeks, state.completedDays);
      return { ...state, visibleWeeks, roster };
    }
    case 'REGENERATE_ROSTER': {
      const roster = generateRoster(fromIsoString(state.startDate), state.visibleWeeks, state.completedDays);
      return { ...state, roster };
    }
    default:
      return state;
  }
}

function calculateStreak(completedDays: string[], roster: WorkoutDay[]): number {
  if (completedDays.length === 0) return 0;
  const workoutDays = roster.filter(d => d.workoutType === 'push' || d.workoutType === 'pull' || d.workoutType === 'legs');
  const sortedCompleted = [...completedDays].sort().reverse();
  let streak = 0;
  for (const day of workoutDays.reverse()) {
    if (sortedCompleted.includes(day.isoDate)) {
      streak++;
    } else if (day.isoDate < sortedCompleted[0]) {
      break;
    }
  }
  return streak;
}

interface WorkoutContextType {
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
  todayIso: string;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, null, getInitialState);
  
  const todayIso = useMemo(() => {
    const now = new Date();
    return toIsoString(now);
  }, []);
  
  // Persist to localStorage
  useEffect(() => {
    const { roster, ...persistable } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [state]);
  
  const contextValue = useMemo(() => ({ state, dispatch, todayIso }), [state, dispatch, todayIso]);
  
  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within WorkoutProvider');
  return context;
}
