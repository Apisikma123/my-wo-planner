import { WorkoutDay, WorkoutType } from '../types';
import { addDays, toIsoString, formatDisplayDate, getDayShortId, getDayNameId, getNextMonday } from '../utils/dateUtils';
import { getPhaseInfo } from './phaseEngine';
import { generateWorkout } from './exerciseEngine';
import { calculateFatigue } from './fatigueEngine';
import { calculateRecovery, getReadinessScore } from './recoveryEngine';
import { calculateHghScore } from './hghEngine';

const DAY_TYPE_MAP: Record<number, WorkoutType> = {
  1: 'push',
  2: 'rest',
  3: 'rest',
  4: 'pull',
  5: 'rest',
  6: 'legs',
  0: 'fullrest',
};

export function generateRoster(startDate: Date, weekCount: number = 8, completedDays: string[] = []): WorkoutDay[] {
  const monday = getNextMonday(startDate);
  const totalDays = weekCount * 7;
  const roster: WorkoutDay[] = [];
  
  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(monday, i);
    const dayOfWeek = currentDate.getDay();
    const workoutType = DAY_TYPE_MAP[dayOfWeek];
    const weekIndex = Math.floor(i / 7) + 1;
    const isoDate = toIsoString(currentDate);
    
    const phaseInfo = getPhaseInfo(weekIndex);
    const exercises = generateWorkout(workoutType, phaseInfo.mesocycle, phaseInfo.phase);
    
    const isCompleted = completedDays.includes(isoDate);
    const isBeforeStart = currentDate.getTime() < startDate.getTime();
    const completedCount = completedDays.filter(d => d <= isoDate).length;
    
    const fatigueLevel = calculateFatigue(weekIndex, phaseInfo.phase, completedCount);
    const isWorkoutDay = workoutType === 'push' || workoutType === 'pull' || workoutType === 'legs';
    const daysSinceWorkout = isWorkoutDay ? 0 : (dayOfWeek === 0 ? 1 : (dayOfWeek === 2 || dayOfWeek === 3 ? 1 : (dayOfWeek === 5 ? 1 : 2)));
    const recoveryScore = calculateRecovery(fatigueLevel, daysSinceWorkout, phaseInfo.phase);
    const hghScore = calculateHghScore({
      id: `day-${i}`,
      isoDate,
      dayName: getDayNameId(currentDate),
      displayDate: formatDisplayDate(currentDate),
      workoutType,
      weekIndex,
      mesocycle: phaseInfo.mesocycle,
      phase: phaseInfo.phase,
      phaseWeek: phaseInfo.phaseWeek,
      fatigueLevel,
      recoveryScore,
      hghScore: 0,
      exercises,
      isCompleted,
      isBeforeStart,
    });
    
    roster.push({
      id: `day-${isoDate}`,
      isoDate,
      dayName: getDayNameId(currentDate),
      displayDate: formatDisplayDate(currentDate),
      workoutType,
      weekIndex,
      mesocycle: phaseInfo.mesocycle,
      phase: phaseInfo.phase,
      phaseWeek: phaseInfo.phaseWeek,
      fatigueLevel,
      recoveryScore,
      hghScore,
      exercises,
      isCompleted,
      isBeforeStart,
    });
  }
  
  return roster;
}

export function getMonthGroups(roster: WorkoutDay[]): Map<string, WorkoutDay[]> {
  const groups = new Map<string, WorkoutDay[]>();
  for (const day of roster) {
    const date = new Date(day.isoDate + 'T00:00:00');
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(day);
  }
  return groups;
}
