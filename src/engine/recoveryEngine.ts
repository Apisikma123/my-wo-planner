import { Phase } from '../types';

export function calculateRecovery(
  fatigue: number,
  daysSinceLastWorkout: number,
  phase: Phase
): number {
  // Base recovery inversely related to fatigue
  let recovery = 100 - fatigue;
  
  // Rest days boost recovery
  recovery += daysSinceLastWorkout * 12;
  
  // Phase bonus
  const phaseBonus: Record<Phase, number> = {
    adaptation: 10,
    overload: -5,
    peak: -10,
    deload: 25,
  };
  recovery += phaseBonus[phase];
  
  return Math.min(100, Math.max(0, Math.round(recovery)));
}

export function getReadinessScore(
  recovery: number,
  fatigue: number,
  streak: number
): number {
  // Weighted composite score
  let readiness = (recovery * 0.5) + ((100 - fatigue) * 0.35) + Math.min(streak * 3, 15);
  return Math.min(100, Math.max(0, Math.round(readiness)));
}

export function getRecoveryColor(recovery: number): string {
  if (recovery >= 80) return '#22c55e';
  if (recovery >= 60) return '#84cc16';
  if (recovery >= 40) return '#eab308';
  return '#ef4444';
}

export function getRecoveryLabel(recovery: number): string {
  if (recovery >= 80) return 'OPTIMAL';
  if (recovery >= 60) return 'BAIK';
  if (recovery >= 40) return 'CUKUP';
  return 'KURANG';
}
