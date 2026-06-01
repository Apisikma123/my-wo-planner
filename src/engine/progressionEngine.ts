import { ExerciseTemplate, Exercise, Phase } from '../types';
import { getPhaseMultiplier } from './phaseEngine';
import { DUMBBELL_WEIGHTS, BARBELL_WEIGHTS } from '../utils/constants';

export function progressExercise(
  template: ExerciseTemplate,
  mesocycle: number,
  phase: Phase
): Exercise {
  const phaseMultiplier = getPhaseMultiplier(phase);
  const mesocycleBonus = mesocycle - 1;
  
  // Calculate progressed values
  let reps = Math.min(
    template.baseReps + (template.progressionRate * mesocycleBonus),
    template.maxReps
  );
  
  let sets = template.baseSets;
  // Add extra set every 3 mesocycles for compound exercises
  if (template.category === 'compound' && mesocycleBonus >= 2) {
    sets = Math.min(sets + Math.floor(mesocycleBonus / 2), template.maxSets);
  }
  
  // Apply phase multiplier
  reps = Math.max(1, Math.round(reps * phaseMultiplier.repsMult));
  const intensity = Math.round(template.baseIntensity * phaseMultiplier.intensityMult * (1 + mesocycleBonus * 0.05));
  
  // Build detail string from template
  const detail = buildDetail(template, sets, reps, mesocycle, phase);
  
  return {
    id: `ex-${template.name.replace(/\s+/g, '-').toLowerCase()}-m${mesocycle}`,
    name: template.name,
    detail,
    sets,
    reps: template.category === 'mobility' ? '-' : reps,
    intensity: Math.min(intensity, 100),
    category: template.category,
    recoveryCost: template.recoveryCost,
    isHgh: template.isHgh || false,
    isHang: template.isHang || false,
    isDurability: template.isDurability || false,
  };
}

function buildDetail(
  template: ExerciseTemplate,
  sets: number,
  reps: number,
  mesocycle: number,
  phase: Phase
): string {
  let detail = template.detailTemplate;
  detail = detail.replace(/{sets}/g, String(sets));
  detail = detail.replace(/{reps}/g, String(reps));
  
  // Handle custom weight progression
  let weightNote = '';
  if (template.equipmentType === 'dumbbell' || template.equipmentType === 'barbell') {
    const weightsArray = template.equipmentType === 'dumbbell' ? DUMBBELL_WEIGHTS : BARBELL_WEIGHTS;
    const baseIdx = template.baseWeightIndex || 0;
    const rate = template.weightProgressionRate || 1;
    // Calculate new index
    const targetIdx = baseIdx + ((mesocycle - 1) * rate);
    // Cap at the maximum weight available
    const finalIdx = Math.min(targetIdx, weightsArray.length - 1);
    const weightLabel = weightsArray[finalIdx].label;
    detail = detail.replace(/{weight}/g, weightLabel);
    
    // Add warning if they maxed out weights
    if (finalIdx === weightsArray.length - 1 && targetIdx > finalIdx) {
      weightNote = ' · ⬆ Mentok beban maksimum, perlambat tempo';
    }
  }
  
  // Add weighted variation note for high mesocycles if no weight list
  if (mesocycle >= 4 && template.category === 'compound' && reps >= template.maxReps && !template.equipmentType) {
    detail += ' · ⬆ Weighted variation';
  }
  
  if (weightNote) {
    detail += weightNote;
  }
  
  // Add deload note
  if (phase === 'deload') {
    detail += ' · 🟢 Deload';
  }
  
  return detail;
}

export function calculateProgression(
  base: number,
  rate: number,
  mesocycle: number,
  max: number
): number {
  return Math.min(base + rate * (mesocycle - 1), max);
}
