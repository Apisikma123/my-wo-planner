import { SleepLog } from '../types';
import { SLEEP_IDEAL_BEDTIME, SLEEP_IDEAL_DURATION } from '../utils/constants';

/**
 * Parse HH:MM time string to minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check if bedtime is before the ideal time (23:00).
 * Returns true if bedtime is between 20:00 and 23:00.
 */
export function isBedtimeOptimal(bedtime: string): boolean {
  const minutes = timeToMinutes(bedtime);
  const idealMinutes = timeToMinutes(SLEEP_IDEAL_BEDTIME);
  // Bedtime between 20:00 (1200) and 23:00 (1380) is optimal
  return minutes >= 1200 && minutes <= idealMinutes;
}

/**
 * Calculate bedtime score (0–30 points).
 * Best: before 22:00. Good: before 23:00. Late: after 23:00.
 */
export function getBedtimeScore(bedtime: string): number {
  const minutes = timeToMinutes(bedtime);
  
  if (minutes <= 1320) return 30; // before 22:00 — perfect
  if (minutes <= 1380) return 25; // before 23:00 — good
  if (minutes <= 1410) return 15; // before 23:30 — okay
  if (minutes <= 1440 || minutes < 60) return 8; // before 00:00–01:00 — poor
  return 3; // after 01:00 — very poor
}

/**
 * Calculate duration score (0–30 points).
 */
export function getDurationScore(duration: number): number {
  if (duration >= 9) return 30;
  if (duration >= 8.5) return 27;
  if (duration >= 8) return 22;
  if (duration >= 7.5) return 16;
  if (duration >= 7) return 10;
  return 5;
}

/**
 * Dark room bonus for melatonin–HGH synergy (0–20 points).
 */
export function getDarkRoomBonus(isDark: boolean): number {
  return isDark ? 20 : 5;
}

/**
 * Calculate comprehensive sleep quality score (0–100).
 */
export function evaluateSleepQuality(log: SleepLog): number {
  const bedtimeScore = getBedtimeScore(log.bedtime);
  const durationScore = getDurationScore(log.duration);
  const darkBonus = getDarkRoomBonus(log.darkRoom);
  
  // Base score from sleep quality
  const baseScore = bedtimeScore + durationScore + darkBonus;
  
  // Consistency bonus: 20 points max (always given since we track daily)
  const consistencyBonus = 20;
  
  return Math.min(100, baseScore + consistencyBonus);
}

/**
 * Estimate the Slow-Wave Sleep (SWS) peak window.
 * SWS occurs primarily in the first 3-4 hours of sleep.
 * HGH secretion peaks ~1 hour after sleep onset during the first SWS cycle.
 */
export function calculateSWSWindow(bedtime: string, duration: number): {
  peakStart: string;
  peakEnd: string;
  hghPeakTime: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
} {
  const bedMinutes = timeToMinutes(bedtime);
  
  // HGH peak occurs ~60-90 minutes after sleep onset (first SWS cycle)
  const peakStartMinutes = bedMinutes + 60;
  const peakEndMinutes = bedMinutes + 240; // First 4 hours
  const hghPeakMinutes = bedMinutes + 90; // Peak at ~90 min
  
  const formatMinutes = (m: number): string => {
    const normalized = ((m % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const min = normalized % 60;
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  };
  
  let quality: 'excellent' | 'good' | 'fair' | 'poor';
  if (bedMinutes <= 1350 && duration >= 8.5) quality = 'excellent';
  else if (bedMinutes <= 1380 && duration >= 8) quality = 'good';
  else if (bedMinutes <= 1440 && duration >= 7) quality = 'fair';
  else quality = 'poor';
  
  return {
    peakStart: formatMinutes(peakStartMinutes),
    peakEnd: formatMinutes(peakEndMinutes),
    hghPeakTime: formatMinutes(hghPeakMinutes),
    quality,
  };
}

/**
 * Get sleep quality label.
 */
export function getSleepLabel(score: number): string {
  if (score >= 85) return 'EXCELLENT';
  if (score >= 70) return 'BAIK';
  if (score >= 50) return 'CUKUP';
  return 'PERLU PERBAIKAN';
}

/**
 * Get sleep quality color.
 */
export function getSleepColor(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#3b82f6';
  if (score >= 50) return '#fbbf24';
  return '#ef4444';
}

/**
 * Generate sleep improvement tips based on the log.
 */
export function getSleepTips(log: SleepLog): string[] {
  const tips: string[] = [];
  
  if (!isBedtimeOptimal(log.bedtime)) {
    tips.push('⏰ Tidur sebelum jam 23:00 untuk memaksimalkan produksi HGH saat deep sleep.');
  }
  
  if (log.duration < 8.5) {
    tips.push(`😴 Durasi tidur ${log.duration} jam kurang optimal. Target 9 jam untuk HGH peak.`);
  }
  
  if (!log.darkRoom) {
    tips.push('🌙 Kamar WAJIB gelap total. Cahaya menghambat melatonin → langsung menurunkan HGH.');
  }
  
  if (tips.length === 0) {
    tips.push('✅ Sleep score excellent! HGH production optimal malam ini. Keep it up! 💪');
  }
  
  return tips;
}
