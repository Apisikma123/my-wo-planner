import { useMemo } from 'react';
import { useWorkout } from '../store/workoutStore';
import { WorkoutDay } from '../types';
import { MONTH_NAMES_ID } from '../utils/constants';

export interface MonthGroup {
  key: string;
  label: string;
  days: WorkoutDay[];
}

export function useCalendar() {
  const { state } = useWorkout();
  
  const monthGroups = useMemo((): MonthGroup[] => {
    const groups = new Map<string, WorkoutDay[]>();
    
    for (const day of state.roster) {
      const date = new Date(day.isoDate + 'T00:00:00');
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(day);
    }
    
    return Array.from(groups.entries()).map(([key, days]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        key,
        label: `${MONTH_NAMES_ID[month - 1]} ${year}`,
        days,
      };
    });
  }, [state.roster]);
  
  return { monthGroups };
}
