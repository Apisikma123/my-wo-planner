import { HeightEntry } from '../types';
import { USER_PROFILE } from '../utils/constants';

/**
 * Calculate height progress metrics from historical entries.
 */
export function calculateHeightProgress(entries: HeightEntry[]) {
  if (entries.length === 0) {
    return {
      currentHeight: USER_PROFILE.currentHeight,
      heightGained: 0,
      remaining: USER_PROFILE.targetHeight - USER_PROFILE.currentHeight,
      progressPercent: 0,
      velocityCmPerMonth: 0,
      projectedMonthsToTarget: null as number | null,
    };
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const currentHeight = latest.heightCm;
  const heightGained = currentHeight - USER_PROFILE.currentHeight;
  const remaining = Math.max(0, USER_PROFILE.targetHeight - currentHeight);
  const progressPercent = Math.min(100, (heightGained / (USER_PROFILE.targetHeight - USER_PROFILE.currentHeight)) * 100);

  const velocity = calculateGrowthVelocity(sorted);
  const projectedMonthsToTarget = velocity > 0 ? Math.ceil(remaining / velocity) : null;

  return {
    currentHeight,
    heightGained,
    remaining,
    progressPercent: Math.max(0, progressPercent),
    velocityCmPerMonth: velocity,
    projectedMonthsToTarget,
  };
}

/**
 * Calculate growth velocity in cm/month from sorted entries.
 */
export function calculateGrowthVelocity(entries: HeightEntry[]): number {
  if (entries.length < 2) return 0;

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstDate = new Date(first.date + 'T00:00:00');
  const lastDate = new Date(last.date + 'T00:00:00');
  const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff < 7) return 0; // need at least a week of data

  const monthsDiff = daysDiff / 30.44; // average days per month
  const heightDiff = last.heightCm - first.heightCm;

  return Math.round((heightDiff / monthsDiff) * 100) / 100;
}

/**
 * Project final height given current growth rate.
 */
export function getHeightProjection(
  currentHeight: number,
  velocityCmPerMonth: number,
  monthsRemaining: number
): number {
  return Math.round((currentHeight + velocityCmPerMonth * monthsRemaining) * 10) / 10;
}

/**
 * Estimate growth plate status based on age.
 * Growth plates typically close between 16–21 for males.
 */
export function getGrowthPlateStatus(age: number): {
  status: 'open' | 'closing' | 'closed';
  label: string;
  description: string;
  yearsRemaining: number;
  color: string;
} {
  if (age < 16) {
    return {
      status: 'open',
      label: 'TERBUKA LEBAR',
      description: 'Growth plates sangat aktif. Fase pertumbuhan optimal.',
      yearsRemaining: 21 - age,
      color: '#22c55e',
    };
  } else if (age <= 18) {
    return {
      status: 'open',
      label: 'TERBUKA AKTIF',
      description: 'Growth plates masih terbuka. Window pertumbuhan kritis — maksimalkan sekarang!',
      yearsRemaining: 21 - age,
      color: '#fbbf24',
    };
  } else if (age <= 21) {
    return {
      status: 'closing',
      label: 'MULAI MENUTUP',
      description: 'Growth plates mulai menutup. Setiap bulan sangat berharga.',
      yearsRemaining: Math.max(0, 21 - age),
      color: '#f97316',
    };
  } else {
    return {
      status: 'closed',
      label: 'TERTUTUP',
      description: 'Growth plates kemungkinan sudah tertutup. Fokus pada postur dan dekompresi.',
      yearsRemaining: 0,
      color: '#ef4444',
    };
  }
}

/**
 * Format growth projection as a readable timeline.
 */
export function formatProjectionTimeline(monthsToTarget: number | null): string {
  if (monthsToTarget === null) return 'Data belum cukup';
  if (monthsToTarget <= 0) return 'Target tercapai! 🎉';
  
  const years = Math.floor(monthsToTarget / 12);
  const months = monthsToTarget % 12;
  
  if (years > 0 && months > 0) {
    return `~${years} tahun ${months} bulan lagi`;
  } else if (years > 0) {
    return `~${years} tahun lagi`;
  } else {
    return `~${months} bulan lagi`;
  }
}
