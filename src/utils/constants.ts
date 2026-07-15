import { WorkoutType, Phase } from '../types';

export const TYPE_COLORS: Record<WorkoutType, string> = {
  push: '#ff6b35',
  pull: '#a855f7',
  legs: '#22c55e',
  rest: '#1e4d6b',
  fullrest: '#1a1a2e',
};

export const TYPE_ICONS: Record<WorkoutType, string> = {
  push: 'PUSH', pull: 'PULL', legs: 'LEGS', rest: 'REST', fullrest: 'FULL REST',
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

  checklist.push(
    { icon: 'Anchor', label: 'Dead Hang', value: '3 × 30–60 dtk', color: '#00d4ff' },
    { icon: 'Moon', label: 'Tidur 8–9 Jam', value: 'Jam 22.00–23.00', color: '#a855f7' },
    { icon: 'Droplets', label: 'Air Putih', value: 'Min. 2.5L/hari', color: '#22c55e' },
    { icon: 'Beef', label: 'Protein', value: '98–134g/hari', color: '#ff6b35' }
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

// ── HGH Growth System Constants ──

export const USER_PROFILE = {
  age: 17,
  currentHeight: 168,
  targetHeight: 180,
  sleepHours: 9,
  supplements: ['Vitamin D3 + K2', 'Zinc + Vitamin B2'],
};

export const CALCIUM_DAILY_TARGET = 1200; // mg
export const PROTEIN_DAILY_MIN = 98; // g
export const PROTEIN_DAILY_MAX = 134; // g
export const WATER_DAILY_TARGET = 2.5; // liters
export const SLEEP_IDEAL_BEDTIME = '23:00';
export const SLEEP_IDEAL_DURATION = 9; // hours

export const CALCIUM_FOODS = [
  { name: 'Susu (1 gelas)', calciumMg: 300, icon: '🥛' },
  { name: 'Yogurt (1 cup)', calciumMg: 200, icon: '🥄' },
  { name: 'Keju (1 slice)', calciumMg: 200, icon: '🧀' },
  { name: 'Tahu (100g)', calciumMg: 350, icon: '🫘' },
  { name: 'Tempe (100g)', calciumMg: 120, icon: '🫘' },
  { name: 'Bayam (100g)', calciumMg: 100, icon: '🥬' },
  { name: 'Brokoli (100g)', calciumMg: 47, icon: '🥦' },
  { name: 'Ikan Sarden (100g)', calciumMg: 382, icon: '🐟' },
  { name: 'Kacang Almond (30g)', calciumMg: 75, icon: '🥜' },
  { name: 'Telur (1 butir)', calciumMg: 28, icon: '🥚' },
];

export const SUPPLEMENT_SCHEDULE = {
  d3k2: {
    name: 'Vitamin D3 + K2',
    timing: 'Setelah makan berlemak (siang/malam)',
    rule: 'Fat-soluble — HARUS diminum bersama makanan yang mengandung lemak',
    icon: '☀️',
  },
  zincB2: {
    name: 'Zinc + Vitamin B2',
    timing: 'Perut kosong (pagi) atau makan ringan',
    rule: 'Penyerapan optimal saat perut kosong. Jika mual, minum dengan makanan ringan',
    icon: '💊',
  },
};

export const GROWTH_STORAGE_KEY = 'hgh-growth-data';

export const PLYO_TARGETS = {
  hangMinutes: 5,    // 5 min cumulative dead hang
  plyoMinutes: 15,   // 15-20 min jumping rope / squat jumps
  coreMinutes: 5,    // 5 min plank / hollow body
};

