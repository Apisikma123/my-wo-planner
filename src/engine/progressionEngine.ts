import { ExerciseTemplate, Exercise, Phase } from '../types';
import { getPhaseMultiplier } from './phaseEngine';
import { DUMBBELL_WEIGHTS, BARBELL_WEIGHTS } from '../utils/constants';

export function progressExercise(
  template: ExerciseTemplate,
  mesocycle: number,
  phase: Phase,
  phaseWeek: number = 1
): Exercise {
  const phaseMultiplier = getPhaseMultiplier(phase);
  const mesocycleBonus = mesocycle - 1;
  
  // Professional PT Progressive Overload Logic:
  // Base progression across mesocycles (very gradual, e.g. +1 rep per mesocycle instead of fast jumps)
  const mesoRepsBonus = Math.floor((mesocycleBonus * template.progressionRate) / 2);
  const baseRepsForMeso = Math.min(template.baseReps + mesoRepsBonus, template.maxReps);
  
  let reps = baseRepsForMeso;
  let sets = template.baseSets;
  
  // Weekly micro-progression within the mesocycle
  if (template.category !== 'mobility' && template.category !== 'recovery') {
    if (phase === 'deload' || phaseWeek === 5) {
      // Deload week: drop volume significantly to recover
      sets = Math.max(1, sets - 1);
      reps = Math.max(1, baseRepsForMeso - 2);
    } else {
      // Active weeks (1 to 4) - Progression every 2 weeks (safe for puberty/growth)
      if (phaseWeek === 2) {
        // Week 2: Adaptasi (sama dengan minggu 1, nambah tiap 2 minggu)
        reps = baseRepsForMeso;
      } else if (phaseWeek === 3) {
        // Week 3: Overload (+1 rep setelah 2 minggu)
        reps = Math.min(baseRepsForMeso + 1, template.maxReps);
      } else if (phaseWeek === 4) {
        // Week 4: Peak (reps sama dengan minggu 3)
        reps = Math.min(baseRepsForMeso + 1, template.maxReps);
        // Tambahan set di minggu peak untuk compound movement
        if (template.category === 'compound') {
          sets = Math.min(sets + 1, template.maxSets);
        }
      }
    }
  }

  // Tambahan 1 set permanen setiap 3 mesocycle (sangat bertahap)
  if (template.category === 'compound' && mesocycleBonus >= 3) {
    sets = Math.min(sets + 1, template.maxSets);
  }
  
  // Calculate intensity based on phase multiplier
  const intensity = Math.round(template.baseIntensity * phaseMultiplier.intensityMult * (1 + mesocycleBonus * 0.05));
  
  // Build detail string from template
  const detail = buildDetail(template, sets, reps, mesocycle, phase, phaseWeek);
  
  return {
    id: `ex-${template.name.replace(/\s+/g, '-').toLowerCase()}-m${mesocycle}`,
    name: template.name,
    detail,
    sets,
    reps: template.category === 'mobility' ? '-' : (template.isHang ? `${reps} dtk` : reps),
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
  phase: Phase,
  phaseWeek: number
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
    
    // Calculate new index - add slight weight bump for week 2 if they are ready
    let microProgression = 0;
    if (phaseWeek === 2 && phase === 'adaptation') {
      // Every mesocycle >= 2, we might bump weight in week 2. 
      // Or just let reps increase in week 2. The user asked for "beban atau set", reps is safest.
    }
    
    const targetIdx = Math.floor(baseIdx + ((mesocycle - 1) * rate));
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
