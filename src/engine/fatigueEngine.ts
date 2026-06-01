import { Phase } from '../types';

export function calculateFatigue(weekIndex: number, phase: Phase, completedWorkouts: number): number {
  // Base fatigue from training phase
  const phaseBaseFatigue: Record<Phase, number> = {
    adaptation: 30,
    overload: 60,
    peak: 75,
    deload: 20,
  };
  
  let fatigue = phaseBaseFatigue[phase];
  
  // Accumulation from completed workouts (each workout adds ~3 fatigue, rest removes ~5)
  const weekInCycle = ((weekIndex - 1) % 5) + 1;
  fatigue += weekInCycle * 5;
  
  // Cap at 100
  fatigue = Math.min(100, Math.max(0, fatigue));
  
  return Math.round(fatigue);
}

export function shouldAutoDeload(fatigue: number): boolean {
  return fatigue > 85;
}

export function getFatigueAdjustment(fatigue: number): { volumeMult: number; note: string } {
  if (fatigue > 85) return { volumeMult: 0.6, note: '[!] Fatigue tinggi — auto deload' };
  if (fatigue > 70) return { volumeMult: 0.85, note: '[~] Fatigue moderate — volume sedikit dikurangi' };
  return { volumeMult: 1.0, note: '[OK] Fatigue normal' };
}

export function getFatigueColor(fatigue: number): string {
  if (fatigue > 80) return '#ef4444';
  if (fatigue > 60) return '#f59e0b';
  if (fatigue > 40) return '#eab308';
  return '#22c55e';
}

export function getFatigueLabel(fatigue: number): string {
  if (fatigue > 80) return 'TINGGI';
  if (fatigue > 60) return 'MODERATE';
  if (fatigue > 40) return 'NORMAL';
  return 'RENDAH';
}
