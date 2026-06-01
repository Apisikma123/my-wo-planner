import { useMemo } from 'react';
import { useWorkout } from '../store/workoutStore';

export function useStats() {
  const { state, todayIso } = useWorkout();
  
  return useMemo(() => {
    const workoutDays = state.roster.filter(
      d => d.workoutType === 'push' || d.workoutType === 'pull' || d.workoutType === 'legs'
    );
    
    const totalWorkouts = workoutDays.length;
    const completedWorkouts = workoutDays.filter(d => state.completedDays.includes(d.isoDate)).length;
    const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
    
    // Current month stats
    const currentMonth = todayIso.substring(0, 7);
    const monthWorkouts = workoutDays.filter(d => d.isoDate.startsWith(currentMonth));
    const monthCompleted = monthWorkouts.filter(d => state.completedDays.includes(d.isoDate)).length;
    const monthTotal = monthWorkouts.length;
    
    // Average scores
    const avgHgh = workoutDays.length > 0
      ? Math.round(workoutDays.reduce((sum, d) => sum + d.hghScore, 0) / workoutDays.length)
      : 0;
    const avgRecovery = state.roster.length > 0
      ? Math.round(state.roster.reduce((sum, d) => sum + d.recoveryScore, 0) / state.roster.length)
      : 0;
    const avgFatigue = state.roster.length > 0
      ? Math.round(state.roster.reduce((sum, d) => sum + d.fatigueLevel, 0) / state.roster.length)
      : 0;
    
    // Current mesocycle
    const todayDay = state.roster.find(d => d.isoDate === todayIso);
    const currentMesocycle = todayDay?.mesocycle || 1;
    const currentPhase = todayDay?.phase || 'adaptation';
    const currentWeek = todayDay?.weekIndex || 1;
    
    return {
      totalWorkouts,
      completedWorkouts,
      completionRate,
      monthCompleted,
      monthTotal,
      avgHgh,
      avgRecovery,
      avgFatigue,
      currentMesocycle,
      currentPhase,
      currentWeek,
      streak: state.streak,
    };
  }, [state.roster, state.completedDays, todayIso, state.streak]);
}
