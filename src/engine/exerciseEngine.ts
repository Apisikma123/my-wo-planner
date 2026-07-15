import { ExerciseTemplate, Exercise, WorkoutType, Phase } from '../types';
import { progressExercise } from './progressionEngine';

const pushTemplates: ExerciseTemplate[] = [
  {
    name: 'Warm-up',
    category: 'mobility',
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 30,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '7 mnt — Arm Circles 15s, Dynamic Pec Stretch 15s, Wall Presses (Dorong dinding) 10 rep, Inchworms 5 rep, Lompat Tali Pelan 2 mnt',
  },
  {
    name: 'Dumbbell Floor Press',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseReps: 10, baseSets: 3, baseIntensity: 75,
    recoveryCost: 7, progressionRate: 1, maxReps: 15, maxSets: 5,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Berbaring di lantai, dorong beban ke atas)',
  },
  {
    name: 'Dumbbell Shoulder Press',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseReps: 8, baseSets: 3, baseIntensity: 75,
    recoveryCost: 7, progressionRate: 1, maxReps: 12, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Posisi duduk bersandar, dorong beban ke atas kepala)',
  },
  {
    name: 'Dumbbell Chest Fly',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseReps: 12, baseSets: 3, baseIntensity: 60,
    recoveryCost: 5, progressionRate: 1, maxReps: 15, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Berbaring di lantai, rentangkan tangan ke samping lalu tutup)',
  },
  {
    name: 'Dumbbell Tricep Extension',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseReps: 12, baseSets: 3, baseIntensity: 55,
    recoveryCost: 4, progressionRate: 1, maxReps: 15, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Angkat 1 dumbbell di atas kepala, turunkan ke belakang leher)',
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
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 30,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '7 mnt — Arm Swings 30s, Band Pull-Aparts 20 rep, Cat-Cow Stretch 30s, Superman Holds 10 rep',
  },
  {
    name: 'Dumbbell Pullover',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseReps: 10, baseSets: 3, baseIntensity: 75,
    recoveryCost: 6, progressionRate: 1, maxReps: 15, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Berbaring, pegang 1 dumbbell di atas dada, turunkan lurus ke belakang kepala)',
  },
  {
    name: 'Chest-Supported Dumbbell Row',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseReps: 10, baseSets: 3, baseIntensity: 75,
    recoveryCost: 6, progressionRate: 1, maxReps: 15, maxSets: 5,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Dada bersandar di bangku/kursi miring, sangat aman tanpa kompresi tulang belakang)',
  },
  {
    name: 'Dumbbell Reverse Fly',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseReps: 12, baseSets: 3, baseIntensity: 60,
    recoveryCost: 5, progressionRate: 1, maxReps: 15, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Membungkuk ringan/bersandar, angkat dumbbell ke samping seperti sayap)',
  },
  {
    name: 'Dumbbell Bicep Curl',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseReps: 12, baseSets: 3, baseIntensity: 60,
    recoveryCost: 4, progressionRate: 1, maxReps: 15, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Tahan posisi siku tetap)',
  },
  {
    name: 'Cool-down',
    category: 'mobility',
    equipmentType: 'bodyweight',
    baseReps: 0, baseSets: 1, baseIntensity: 20,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '5 mnt — Active Dead Hang 60 dtk (Dekompresi tulang), lat stretch, bicep wall stretch',
  },
];

const legsTemplates: ExerciseTemplate[] = [
  {
    name: 'Warm-up',
    category: 'mobility',
    equipmentType: 'jumprope',
    baseReps: 0, baseSets: 1, baseIntensity: 30,
    recoveryCost: 0, progressionRate: 0, maxReps: 0, maxSets: 1,
    detailTemplate: '7 mnt — Hip Circles 15s, Leg Swings 30s/sisi, Deep Bodyweight Squats 12 rep, Calf Stretch 30s, Lompat Tali Pelan 2 mnt',
  },
  {
    name: 'Dumbbell Goblet Squat',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseReps: 10, baseSets: 3, baseIntensity: 75,
    recoveryCost: 8, progressionRate: 1, maxReps: 15, maxSets: 5,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Pegang 1 dumbbell vertikal di depan dada)',
  },
  {
    name: 'Jump Squat',
    category: 'compound',
    equipmentType: 'bodyweight',
    baseReps: 12, baseSets: 3, baseIntensity: 80,
    recoveryCost: 7, progressionRate: 2, maxReps: 20, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · Explosive Plyometric (Sangat bagus untuk bone stimulus HGH)',
  },
  {
    name: 'Dumbbell RDL (Romanian Deadlift)',
    category: 'compound',
    equipmentType: 'dumbbell',
    baseReps: 10, baseSets: 3, baseIntensity: 70,
    recoveryCost: 7, progressionRate: 1, maxReps: 15, maxSets: 4,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Dorong pinggul ke belakang, sedikit tekuk lutut)',
  },
  {
    name: 'Glute Bridge',
    category: 'isolation',
    equipmentType: 'bodyweight',
    baseReps: 15, baseSets: 3, baseIntensity: 50,
    recoveryCost: 4, progressionRate: 2, maxReps: 25, maxSets: 4,
    detailTemplate: '{sets} × {reps} rep · Tahan 2 detik di puncak kontraksi pantat',
  },
  {
    name: 'Calf Raise (Weighted)',
    category: 'isolation',
    equipmentType: 'dumbbell',
    baseReps: 15, baseSets: 3, baseIntensity: 60,
    recoveryCost: 4, progressionRate: 2, maxReps: 25, maxSets: 5,
    baseWeightIndex: 0, weightProgressionRate: 0.5,
    detailTemplate: '{sets} × {reps} rep · {weight} (Pegang beban, gunakan tangga untuk full ROM)',
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
  { id: 'rest-4', name: 'Tidur 9 Jam', detail: 'Tidur sebelum jam 23.00 · HGH 80% diproduksi saat tidur dalam', sets: 1, reps: '9 jam', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'rest-5', name: 'Nutrisi', detail: 'Protein 98–134g · hindari gula 2 jam sebelum tidur · minum 2.5L air', sets: 1, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
];

const fullRestExercises: Exercise[] = [
  { id: 'frest-1', name: 'Full Total Rest', detail: 'Tidak ada aktivitas fisik sama sekali — biarkan otot & tulang recover penuh', sets: 0, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'frest-2', name: 'Tidur 9 Jam', detail: 'Tidur sebelum jam 23.00 · HGH paling tinggi saat tidur dalam malam ini', sets: 1, reps: '9 jam', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'frest-3', name: 'Nutrisi', detail: 'Makan cukup protein · hindari gula sebelum tidur · minum 2.5L air', sets: 1, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
  { id: 'frest-4', name: 'Hindari Layar', detail: 'HP jauh 30 mnt sebelum tidur · tidur gelap total = HGH maksimal', sets: 1, reps: '-', intensity: 0, category: 'recovery', recoveryCost: 0, isHgh: false, isHang: false, isDurability: false },
];

const templateMap: Record<string, ExerciseTemplate[]> = {
  push: pushTemplates,
  pull: pullTemplates,
  legs: legsTemplates,
};

export function generateWorkout(type: WorkoutType, mesocycle: number, phase: Phase, phaseWeek: number = 1): Exercise[] {
  if (type === 'fullrest') return fullRestExercises;
  if (type === 'rest') return restExercises;
  
  const templates = templateMap[type];
  if (!templates) return [];
  
  return templates.map(template => progressExercise(template, mesocycle, phase, phaseWeek));
}

export { pushTemplates, pullTemplates, legsTemplates };
