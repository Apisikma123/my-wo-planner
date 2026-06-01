import { ExerciseTemplate, Exercise, WorkoutType, Phase } from '../types';
import { progressExercise } from './progressionEngine';

const pushTemplates: ExerciseTemplate[] = [
  {
    name: 'Warm-up',
    category: 'mobility',
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 30,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '7 mnt — Arm Circles 15s, Dynamic Pec Stretch 15s, Scapular Push-ups 10 rep, Inchworms 5 rep, Lompat Tali Pelan 2 mnt',
  },
  {
    name: 'DB Floor Press',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 65,
    recoveryCost: 6, progressionRate: 2, maxReps: 15, maxSets: 5,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Shoulder Press',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 65,
    recoveryCost: 6, progressionRate: 2, maxReps: 15, maxSets: 5,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Chest Fly',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1,
    baseReps: 10, baseSets: 3, baseIntensity: 60,
    recoveryCost: 4, progressionRate: 2, maxReps: 15, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Front Raise',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1,
    baseReps: 10, baseSets: 3, baseIntensity: 55,
    recoveryCost: 3, progressionRate: 2, maxReps: 15, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Lateral Raise',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 55,
    recoveryCost: 3, progressionRate: 2, maxReps: 18, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Tricep Kickback',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 55,
    recoveryCost: 3, progressionRate: 2, maxReps: 18, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },

  {
    name: 'Cool-down',
    category: 'mobility',
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 20,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '5 mnt — chest opener, shoulder cross-body, tricep stretch, cat-cow',
  },
];

const pullTemplates: ExerciseTemplate[] = [
  {
    name: 'Warm-up',
    category: 'mobility',
    equipmentType: 'pullupbar',
    baseReps: 0, baseSets: 1, baseIntensity: 30,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '7 mnt — Arm Swings 15s, Cat-Cow Stretch 30s, Spiderman Stretch 5/sisi, Active Dead Hang 20 dtk, Lompat Tali Pelan 2 mnt',
  },
  {
    name: 'DB Pullover',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1,
    baseReps: 10, baseSets: 3, baseIntensity: 65,
    recoveryCost: 6, progressionRate: 2, maxReps: 15, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight} (Satu DB dipegang 2 tangan)',
  },
  {
    name: 'Bent-over Row Overhand',
    category: 'compound',
    equipmentType: 'barbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 8kg
    baseReps: 10, baseSets: 3, baseIntensity: 65,
    recoveryCost: 7, progressionRate: 2, maxReps: 15, maxSets: 5,
    detailTemplate: '{sets} × {reps} rep · Barbell {weight}',
  },
  {
    name: 'DB Row (tiap sisi)',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 60,
    recoveryCost: 5, progressionRate: 2, maxReps: 15, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Curl',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 55,
    recoveryCost: 3, progressionRate: 2, maxReps: 18, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },
  {
    name: 'DB Rear Delt Fly',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 55,
    recoveryCost: 3, progressionRate: 2, maxReps: 18, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · DB {weight}',
  },

  {
    name: 'Cool-down',
    category: 'mobility',
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 20,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '5 mnt — forward fold, lat stretch, bicep wall stretch, thoracic rotation',
  },
];

const legsTemplates: ExerciseTemplate[] = [
  {
    name: 'Warm-up',
    category: 'mobility',
    equipmentType: 'jumprope',
    baseReps: 0, baseSets: 1, baseIntensity: 30,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '7 mnt — Hip Circles 15s, Leg Swings 30s/sisi, Deep Bodyweight Squats 10-12 rep, Calf Stretch 30s, Lompat Tali Pelan 2 mnt',
  },
  {
    name: 'Jump Squat',
    category: 'compound',
    equipmentType: 'bodyweight',
    baseReps: 10, baseSets: 3, baseIntensity: 65,
    recoveryCost: 7, progressionRate: 2, maxReps: 18, maxSets: 5,
    detailTemplate: '{sets} × {reps} rep · Bodyweight (aman growth plate)',
  },
  {
    name: 'Romanian Deadlift',
    category: 'compound',
    equipmentType: 'barbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 8kg
    baseReps: 10, baseSets: 3, baseIntensity: 65,
    recoveryCost: 7, progressionRate: 2, maxReps: 15, maxSets: 5,
    detailTemplate: '{sets} × {reps} rep · Barbell {weight}',
  },
  {
    name: 'Goblet Squat',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 60,
    recoveryCost: 6, progressionRate: 2, maxReps: 15, maxSets: 5,
    detailTemplate: '{sets} × {reps} rep · DB {weight} (Pegang vertikal di dada)',
  },
  {
    name: 'Lunge (alternating)',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseWeightIndex: 0, weightProgressionRate: 1, // Starts at 4kg
    baseReps: 10, baseSets: 3, baseIntensity: 60,
    recoveryCost: 6, progressionRate: 2, maxReps: 15, maxSets: 4,
    detailTemplate: '{sets} × {reps}/sisi · DB {weight}',
  },
  {
    name: 'Calf Raise',
    category: 'isolation',
    equipmentType: 'bodyweight',
    baseReps: 10, baseSets: 3, baseIntensity: 50,
    recoveryCost: 2, progressionRate: 3, maxReps: 25, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · Bodyweight',
  },

  {
    name: 'Cool-down',
    category: 'mobility',
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 20,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '5 mnt — child\'s pose, hip flexor 30 dtk/sisi, hamstring, pigeon pose',
  },
];

const restExercises: Exercise[] = [

  { id: 'rest-3', name: 'Stretching Ringan', detail: '10 mnt — cat-cow, child\'s pose, forward fold, hip flexor', sets: 1, reps: '10 mnt', intensity: 20, category: 'mobility', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'rest-4', name: 'Tidur 8–9 Jam', detail: 'Tidur jam 22.00–23.00 · HGH 80% diproduksi saat tidur dalam', sets: 1, reps: '8-9 jam', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'rest-5', name: 'Nutrisi', detail: 'Protein 98–134g · hindari gula 2 jam sebelum tidur · minum 2.5L air', sets: 1, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
];

const fullRestExercises: Exercise[] = [
  { id: 'frest-1', name: 'Full Total Rest', detail: 'Tidak ada aktivitas fisik sama sekali — biarkan otot & tulang recover penuh', sets: 0, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'frest-2', name: 'Tidur 8–9 Jam', detail: 'Tidur jam 22.00–23.00 · HGH paling tinggi saat tidur dalam malam ini', sets: 1, reps: '8-9 jam', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'frest-3', name: 'Nutrisi', detail: 'Makan cukup protein · hindari gula sebelum tidur · minum 2.5L air', sets: 1, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'frest-4', name: 'Hindari Layar', detail: 'HP jauh 30 mnt sebelum tidur · tidur gelap total = HGH maksimal', sets: 1, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
];

const templateMap: Record<string, ExerciseTemplate[]> = {
  push: pushTemplates,
  pull: pullTemplates,
  legs: legsTemplates,
};

export function generateWorkout(type: WorkoutType, mesocycle: number, phase: Phase): Exercise[] {
  if (type === 'fullrest') return fullRestExercises;
  if (type === 'rest') return restExercises;
  
  const templates = templateMap[type];
  if (!templates) return [];
  
  return templates.map(template => progressExercise(template, mesocycle, phase));
}

export { pushTemplates, pullTemplates, legsTemplates };
