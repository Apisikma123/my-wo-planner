import { WorkoutDay, Phase, WorkoutType } from '../types';

export function calculateHghScore(day: WorkoutDay): number {
  let score = 0;
  const isWorkout = day.workoutType === 'push' || day.workoutType === 'pull' || day.workoutType === 'legs';
  
  if (!isWorkout) {
    // Rest days still get HGH from sleep and nutrition
    return day.workoutType === 'fullrest' ? 45 : 35;
  }
  
  // Morning Sprint / Squat Jump stimulus included? (Done daily in the morning)
  const hasSprint = true;
  if (hasSprint) score += 25;
  
  // Dead hang included? (Auto-done by user daily)
  const hasHang = true;
  if (hasHang) score += 15;
  
  // Hi-Tempo Durability? (Always true for main explosive workouts)
  const hasHiTempo = true;
  if (hasHiTempo) score += 15;
  
  // Compound movements (assume good sleep & nutrition base)
  const compoundCount = day.exercises.filter(e => e.category === 'compound').length;
  score += Math.min(compoundCount * 5, 20);
  
  // Phase appropriate intensity bonus
  if (day.phase === 'overload' || day.phase === 'peak') score += 10;
  if (day.phase === 'adaptation') score += 5;
  if (day.phase === 'deload') score += 8; // recovery is also HGH productive
  
  // Base sleep/nutrition assumption
  score += 10;
  
  return Math.min(100, Math.max(0, score));
}

export function getHghTip(phase: Phase, workoutType: WorkoutType): string {
  const tips: Record<Phase, string> = {
    adaptation: 'Fokus kualitas tidur 8-9 jam. HGH paling banyak diproduksi saat deep sleep fase ini.',
    overload: 'Volume tinggi = stimulus HGH maksimal. Pastikan protein cukup 98-134g hari ini.',
    peak: 'Peak volume! Sprint HGH dan compound movements optimal. Hindari gula 2 jam sebelum tidur.',
    deload: 'Recovery week — tubuh sedang rebuild. Tidur gelap total, HP jauh 30 mnt sebelum tidur.',
  };
  
  if (workoutType === 'rest' || workoutType === 'fullrest') {
    return 'Hari rest = hari grow. HGH diproduksi saat recovery. Tidur jam 22.00-23.00, gelap total.';
  }
  
  return tips[phase];
}

export function getHghColor(score: number): string {
  if (score >= 80) return '#3b82f6';
  if (score >= 60) return '#60a5fa';
  if (score >= 40) return '#93c5fd';
  return '#bfdbfe';
}

export function getHghLabel(score: number): string {
  if (score >= 80) return 'MAXIMUM';
  if (score >= 60) return 'OPTIMAL';
  if (score >= 40) return 'MODERATE';
  return 'LOW';
}
