export type Phase = 'adaptation' | 'overload' | 'peak' | 'deload';
export type WorkoutType = 'push' | 'pull' | 'legs' | 'rest' | 'fullrest';
export type ExerciseCategory = 'compound' | 'isolation' | 'conditioning' | 'sprint' | 'mobility' | 'recovery';

export interface WorkoutDay {
  id: string;
  isoDate: string;
  dayName: string;
  displayDate: string;
  workoutType: WorkoutType;
  weekIndex: number;
  mesocycle: number;
  phase: Phase;
  phaseWeek: number;
  fatigueLevel: number;
  recoveryScore: number;
  hghScore: number;
  exercises: Exercise[];
  isCompleted: boolean;
  isBeforeStart?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  detail: string;
  sets: number;
  reps: number | string;
  intensity: number;
  category: ExerciseCategory;
  recoveryCost: number;
  isHgh: boolean;
  isHang: boolean;
  isDurability: boolean;
}

export type EquipmentType = 'dumbbell' | 'barbell' | 'bodyweight' | 'jumprope' | 'pullupbar' | 'none';

export interface ExerciseTemplate {
  name: string;
  category: ExerciseCategory;
  equipmentType?: EquipmentType;
  baseWeightIndex?: number;
  weightProgressionRate?: number;
  baseReps: number;
  baseSets: number;
  baseIntensity: number;
  recoveryCost: number;
  progressionRate: number;
  maxReps: number;
  maxSets: number;
  isHgh?: boolean;
  isHang?: boolean;
  isDurability?: boolean;
  detailTemplate: string;
}

export interface PhaseInfo {
  phase: Phase;
  mesocycle: number;
  phaseWeek: number;
}

export interface PhaseMultiplier {
  volumeMult: number;
  intensityMult: number;
  repsMult: number;
}

export interface WorkoutState {
  startDate: string;
  roster: WorkoutDay[];
  visibleWeeks: number;
  completedDays: string[];
  selectedDayId: string | null;
  activeFilter: string;
  streak: number;
}

export type WorkoutAction =
  | { type: 'SET_START_DATE'; date: string }
  | { type: 'TOGGLE_COMPLETE'; dayId: string }
  | { type: 'SELECT_DAY'; dayId: string | null }
  | { type: 'SET_FILTER'; filter: string }
  | { type: 'LOAD_MORE_WEEKS' }
  | { type: 'REGENERATE_ROSTER' };
