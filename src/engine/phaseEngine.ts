import { Phase, PhaseInfo, PhaseMultiplier } from '../types';
import { MESOCYCLE_LENGTH } from '../utils/constants';

export function getPhaseInfo(weekIndex: number): PhaseInfo {
  const zeroBasedWeek = weekIndex - 1;
  const mesocycle = Math.floor(zeroBasedWeek / MESOCYCLE_LENGTH) + 1;
  const weekInCycle = (zeroBasedWeek % MESOCYCLE_LENGTH) + 1;
  
  let phase: Phase;
  if (weekInCycle <= 2) {
    phase = 'adaptation';
  } else if (weekInCycle === 3) {
    phase = 'overload';
  } else if (weekInCycle === 4) {
    phase = 'peak';
  } else {
    phase = 'deload';
  }
  
  return { phase, mesocycle, phaseWeek: weekInCycle };
}

export function getPhaseMultiplier(phase: Phase): PhaseMultiplier {
  switch (phase) {
    case 'adaptation':
      return { volumeMult: 0.8, intensityMult: 0.9, repsMult: 0.9 }; // e.g. 9 reps
    case 'overload':
      return { volumeMult: 1.0, intensityMult: 1.0, repsMult: 1.0 }; // e.g. 10 reps
    case 'peak':
      return { volumeMult: 1.1, intensityMult: 1.05, repsMult: 1.1 }; // e.g. 11 reps
    case 'deload':
      return { volumeMult: 0.6, intensityMult: 0.7, repsMult: 0.7 }; // e.g. 7 reps
  }
}

export function getPhaseLabel(phase: Phase, weekInCycle: number): string {
  const labels: Record<Phase, string> = {
    adaptation: 'ADAPTASI',
    overload: 'OVERLOAD',
    peak: 'PEAK VOLUME',
    deload: 'DELOAD',
  };
  return `W${weekInCycle} · ${labels[phase]}`;
}
