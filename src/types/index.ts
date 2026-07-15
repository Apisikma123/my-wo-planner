export type Phase = 'adaptation' | 'overload' | 'peak' | 'deload';
export type WorkoutType = 'push' | 'pull' | 'legs' | 'rest' | 'fullrest';
export type ExerciseCategory = 'compound' | 'isolation' | 'conditioning' | 'hiit' | 'mobility' | 'recovery';

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
  | { type: 'REGENERATE_ROSTER' }
  | { type: 'SET_STATE'; payload: WorkoutState };

// ── HGH Growth System Types ──

export interface UserProfile {
  age: number;
  currentHeight: number;
  targetHeight: number;
  sleepHours: number;
  supplements: string[];
}

export interface SleepLog {
  date: string; // ISO date
  bedtime: string; // HH:MM format
  duration: number; // hours
  darkRoom: boolean;
  score: number; // 0–100
}

export interface FoodEntry {
  name: string;
  calciumMg: number;
  quantity: number;
}

export interface NutritionLog {
  date: string;
  calciumMg: number;
  proteinG: number;
  waterL: number;
  sugarBeforeBed: boolean;
  foods: FoodEntry[];
}

export interface HeightEntry {
  date: string;
  heightCm: number;
  notes: string;
}

export interface SupplementLog {
  date: string;
  d3k2Taken: boolean;
  d3k2WithFat: boolean;
  zincB2Taken: boolean;
  zincB2EmptyStomach: boolean;
}

export interface PlyoLog {
  date: string;
  hangMinutes: number; // cumulative dead hang minutes
  plyoMinutes: number; // jumping rope / squat jumps
  coreMinutes: number; // plank / hollow body
}

export interface DailyHghReport {
  date: string;
  sleepScore: number;
  nutritionScore: number;
  exerciseScore: number;
  supplementScore: number;
  plyoScore: number;
  compositeScore: number;
}

export interface GrowthState {
  sleepLogs: Record<string, SleepLog>;
  nutritionLogs: Record<string, NutritionLog>;
  supplementLogs: Record<string, SupplementLog>;
  plyoLogs: Record<string, PlyoLog>;
  heightHistory: HeightEntry[];
  currentHeight: number;
}

export type GrowthAction =
  | { type: 'LOG_SLEEP'; log: SleepLog }
  | { type: 'LOG_NUTRITION'; log: NutritionLog }
  | { type: 'LOG_SUPPLEMENT'; log: SupplementLog }
  | { type: 'LOG_PLYO'; log: PlyoLog }
  | { type: 'LOG_HEIGHT'; entry: HeightEntry }
  | { type: 'UPDATE_HEIGHT'; heightCm: number }
  | { type: 'SET_STATE'; payload: GrowthState };
