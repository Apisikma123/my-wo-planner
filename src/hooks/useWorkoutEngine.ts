import { useMemo, useCallback } from 'react';
import { useWorkout } from '../store/workoutStore';
import { WorkoutDay } from '../types';

export function useWorkoutEngine() {
  const { state, dispatch, todayIso } = useWorkout();
  
  const todayWorkout = useMemo(() => {
    return state.roster.find(d => d.isoDate === todayIso) || null;
  }, [state.roster, todayIso]);
  
  const weeks = useMemo(() => {
    const weekSet = new Set(state.roster.map(d => d.weekIndex));
    return Array.from(weekSet).sort((a, b) => a - b);
  }, [state.roster]);
  
  const visibleDays = useMemo(() => {
    if (state.activeFilter === 'all') return state.roster;
    if (state.activeFilter.startsWith('month-')) {
      const monthNum = parseInt(state.activeFilter.replace('month-', ''), 10);
      const startWeek = (monthNum - 1) * 4 + 1;
      const endWeek = monthNum * 4;
      return state.roster.filter(d => d.weekIndex >= startWeek && d.weekIndex <= endWeek);
    }
    const weekNum = parseInt(state.activeFilter);
    return state.roster.filter(d => d.weekIndex === weekNum);
  }, [state.roster, state.activeFilter]);
  
  const selectedDay = useMemo(() => {
    if (!state.selectedDayId) return null;
    return state.roster.find(d => d.id === state.selectedDayId) || null;
  }, [state.roster, state.selectedDayId]);
  
  const weekGroups = useMemo(() => {
    const groups = new Map<number, WorkoutDay[]>();
    for (const day of visibleDays) {
      if (!groups.has(day.weekIndex)) groups.set(day.weekIndex, []);
      groups.get(day.weekIndex)!.push(day);
    }
    return groups;
  }, [visibleDays]);
  
  const selectDay = useCallback((dayId: string | null) => {
    dispatch({ type: 'SELECT_DAY', dayId });
  }, [dispatch]);
  
  const toggleComplete = useCallback((dayId: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', dayId });
  }, [dispatch]);
  
  const setFilter = useCallback((filter: string) => {
    dispatch({ type: 'SET_FILTER', filter });
  }, [dispatch]);
  
  const setStartDate = useCallback((date: string) => {
    dispatch({ type: 'SET_START_DATE', date });
  }, [dispatch]);
  
  const loadMore = useCallback(() => {
    dispatch({ type: 'LOAD_MORE_WEEKS' });
  }, [dispatch]);
  
  return {
    roster: state.roster,
    todayWorkout,
    todayIso,
    weeks,
    visibleDays,
    selectedDay,
    weekGroups,
    activeFilter: state.activeFilter,
    startDate: state.startDate,
    completedDays: state.completedDays,
    streak: state.streak,
    visibleWeeks: state.visibleWeeks,
    selectDay,
    toggleComplete,
    setFilter,
    setStartDate,
    loadMore,
  };
}
