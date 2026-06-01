import { WorkoutType, Phase } from '../types';

export const TYPE_COLORS: Record<WorkoutType, string> = {
  push: '#ff6b35',
  pull: '#a855f7',
  legs: '#22c55e',
  rest: '#1e4d6b',
  fullrest: '#1a1a2e',
};

export const TYPE_ICONS: Record<WorkoutType, string> = {
  push: '💪', pull: '🔙', legs: '🦵', rest: '🚶', fullrest: '😴',
};

export const TYPE_LABELS: Record<WorkoutType, string> = {
  push: 'PUSH DAY', pull: 'PULL DAY', legs: 'LEG DAY', rest: 'REST', fullrest: 'FULL REST',
};

export const PHASE_COLORS: Record<Phase, string> = {
  adaptation: '#00d4ff',
  overload: '#00ff9f',
  peak: '#fbbf24',
  deload: '#f472b6',
};

export const PHASE_LABELS: Record<Phase, string> = {
  adaptation: 'ADAPTASI',
  overload: 'OVERLOAD',
  peak: 'PEAK',
  deload: 'DELOAD',
};

export const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  adaptation: 'Volume rendah · Fokus form & pattern',
  overload: 'Volume & reps naik · Maximum stimulus',
  peak: 'Peak volume · Progressive overload',
  deload: 'Recovery week · Volume turun 40-50%',
};

export const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const DAY_SHORT_ID = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
export const MONTH_NAMES_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const MONTH_SHORT_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function getDailyChecklist(isoDate?: string, workoutType?: string) {
  const date = isoDate ? new Date(isoDate + 'T00:00:00') : new Date();
  const isSunday = date.getDay() === 0;
  const isFullRest = workoutType === 'fullrest' || isSunday;
  
  const checklist = [];
  
  if (!isFullRest) {
    const dayOfMonth = date.getDate();
    const isEven = dayOfMonth % 2 === 0;
    const morningExercise = isEven
      ? { icon: '🏃⚡', label: 'Sprint di Tempat', value: '30 dtk × 5-6 set (Pagi)', color: '#fbbf24' }
      : { icon: '🦵⚡', label: 'Squat Jump', value: '3 set × 10-12 rep (Pagi)', color: '#fbbf24' };
    checklist.push(morningExercise);
  }

  checklist.push(
    { icon: '🪝', label: 'Dead Hang', value: '3 × 30–60 dtk', color: '#00d4ff' },
    { icon: '😴', label: 'Tidur 8–9 Jam', value: 'Jam 22.00–23.00', color: '#a855f7' },
    { icon: '💧', label: 'Air Putih', value: 'Min. 2.5L/hari', color: '#22c55e' },
    { icon: '🥩', label: 'Protein', value: '98–134g/hari', color: '#ff6b35' }
  );

  return checklist;
}

export const DAILY_CHECKLIST = getDailyChecklist();


export const MESOCYCLE_LENGTH = 5; // 5 weeks per mesocycle
export const DEFAULT_VISIBLE_WEEKS = 8; // show 8 weeks initially
export const STORAGE_KEY = 'hgh-boost-system-state';

export const DUMBBELL_WEIGHTS = [
  { label: '4 kg (2+1+1)', value: 4 },
  { label: '4.5 kg (2+1.25+1.25)', value: 4.5 },
  { label: '5 kg (2+2+1)', value: 5 },
  { label: '6 kg (2+2+1+1)', value: 6 },
  { label: '6.5 kg (2+2+1.25+1.25)', value: 6.5 },
  { label: '7 kg (2+2+2+1)', value: 7 },
];

export const BARBELL_WEIGHTS = [
  { label: '8 kg (2+2/sisi)', value: 8 },
  { label: '10 kg (2+2+1/sisi)', value: 10 },
  { label: '12 kg (2+2+1+1/sisi)', value: 12 },
  { label: '13 kg (2+2+1.25+1.25/sisi)', value: 13 },
  { label: '14 kg (2+2+2+1/sisi)', value: 14 },
];
