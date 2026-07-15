import { NutritionLog, SupplementLog, FoodEntry } from '../types';
import { CALCIUM_DAILY_TARGET, PROTEIN_DAILY_MIN, PROTEIN_DAILY_MAX, CALCIUM_FOODS } from '../utils/constants';

/**
 * Evaluate calcium intake and determine deficit status.
 */
export function evaluateCalciumIntake(calciumMg: number): {
  status: 'critical' | 'warning' | 'good' | 'excellent';
  deficit: number;
  percent: number;
  message: string;
} {
  const percent = Math.min(100, (calciumMg / CALCIUM_DAILY_TARGET) * 100);
  const deficit = Math.max(0, CALCIUM_DAILY_TARGET - calciumMg);

  if (calciumMg >= CALCIUM_DAILY_TARGET) {
    return {
      status: 'excellent',
      deficit: 0,
      percent,
      message: `✅ Kalsium tercukupi (${calciumMg}mg). D3+K2 bisa bekerja optimal untuk kalsifikasi tulang.`,
    };
  } else if (calciumMg >= 900) {
    return {
      status: 'good',
      deficit,
      percent,
      message: `👍 Kalsium cukup baik (${calciumMg}mg) tapi belum ideal. Tambahkan ${deficit}mg lagi.`,
    };
  } else if (calciumMg >= 500) {
    return {
      status: 'warning',
      deficit,
      percent,
      message: `⚠️ Kalsium kurang (${calciumMg}mg). D3+K2 tidak bisa memaksimalkan pertumbuhan tulang tanpa kalsium yang cukup.`,
    };
  } else {
    return {
      status: 'critical',
      deficit,
      percent,
      message: `🚨 KALSIUM DEFISIT KRITIS (${calciumMg}mg/${CALCIUM_DAILY_TARGET}mg). D3+K2 TIDAK BISA mengkalsifikasi tulang menjadi matriks yang lebih panjang tanpa building block kalsium yang cukup!`,
    };
  }
}

/**
 * Calculate total calcium from food entries.
 */
export function getCalciumFromFoods(foods: FoodEntry[]): number {
  return foods.reduce((total, food) => total + food.calciumMg * food.quantity, 0);
}

/**
 * Check D3+K2 effectiveness based on calcium and fat intake.
 * The Calcium-D3-K2 Bridge logic:
 * - D3 helps absorb calcium from gut
 * - K2 directs calcium to bones (not arteries)
 * - Without enough calcium, D3+K2 has nothing to work with
 */
export function checkD3K2Effectiveness(
  calciumMg: number,
  d3k2WithFat: boolean
): {
  score: number;
  label: string;
  explanation: string;
} {
  let score = 0;

  // Calcium availability (0-60 points)
  if (calciumMg >= CALCIUM_DAILY_TARGET) score += 60;
  else if (calciumMg >= 900) score += 45;
  else if (calciumMg >= 500) score += 25;
  else score += 10;

  // Fat co-ingestion for absorption (0-40 points)
  if (d3k2WithFat) score += 40;
  else score += 10;

  let label: string;
  let explanation: string;

  if (score >= 90) {
    label = 'MAXIMUM ABSORPTION';
    explanation = 'D3 menyerap kalsium optimal → K2 mengarahkan ke tulang → pertumbuhan tulang maksimal.';
  } else if (score >= 70) {
    label = 'BAIK';
    explanation = 'Penyerapan baik. Tingkatkan kalsium sedikit lagi untuk hasil optimal.';
  } else if (score >= 45) {
    label = 'KURANG EFEKTIF';
    explanation = 'D3+K2 tidak bekerja optimal. Kalsium kurang atau tidak diminum dengan lemak.';
  } else {
    label = 'HAMPIR SIA-SIA';
    explanation = 'Supplement D3+K2 hampir tidak berguna tanpa kalsium yang cukup sebagai building block tulang.';
  }

  return { score, label, explanation };
}

/**
 * Evaluate supplement timing correctness.
 */
export function evaluateSupplementTiming(log: SupplementLog): {
  score: number;
  issues: string[];
} {
  let score = 0;
  const issues: string[] = [];

  if (log.d3k2Taken) {
    score += 25;
    if (log.d3k2WithFat) {
      score += 25;
    } else {
      issues.push('D3+K2 harus diminum setelah makan yang mengandung lemak untuk penyerapan optimal.');
    }
  } else {
    issues.push('D3+K2 belum diminum hari ini. Vitamin ini kritis untuk mengarahkan kalsium ke tulang.');
  }

  if (log.zincB2Taken) {
    score += 25;
    if (log.zincB2EmptyStomach) {
      score += 25;
    } else {
      issues.push('Zinc+B2 idealnya diminum saat perut kosong. Jika mual, boleh dengan makan ringan.');
    }
  } else {
    issues.push('Zinc+B2 belum diminum hari ini. Zinc penting untuk produksi HGH dan imunitas.');
  }

  return { score, issues };
}

/**
 * Generate comprehensive nutrition warnings.
 */
export function generateNutritionWarnings(log: NutritionLog): Array<{
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
}> {
  const warnings: Array<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
  }> = [];

  // Calcium check
  if (log.calciumMg < 500) {
    warnings.push({
      type: 'critical',
      title: 'CALCIUM DEFICIT KRITIS',
      message: `Hanya ${log.calciumMg}mg dari ${CALCIUM_DAILY_TARGET}mg target. D3+K2 TIDAK BISA mengkalsifikasi tulang tanpa building block kalsium!`,
    });
  } else if (log.calciumMg < CALCIUM_DAILY_TARGET) {
    warnings.push({
      type: 'warning',
      title: 'Kalsium Belum Tercukupi',
      message: `${log.calciumMg}mg dari ${CALCIUM_DAILY_TARGET}mg. Tambahkan ${CALCIUM_DAILY_TARGET - log.calciumMg}mg lagi.`,
    });
  }

  // Protein check
  if (log.proteinG < PROTEIN_DAILY_MIN) {
    warnings.push({
      type: 'warning',
      title: 'Protein Kurang',
      message: `Protein ${log.proteinG}g kurang dari target ${PROTEIN_DAILY_MIN}–${PROTEIN_DAILY_MAX}g. Otot perlu protein untuk recovery setelah latihan.`,
    });
  }

  // Sugar before bed
  if (log.sugarBeforeBed) {
    warnings.push({
      type: 'warning',
      title: 'Gula Sebelum Tidur ⚠️',
      message: 'Gula meningkatkan insulin → langsung menekan sekresi HGH saat tidur. Hindari gula 2 jam sebelum tidur!',
    });
  }

  // Water check
  if (log.waterL < 2.0) {
    warnings.push({
      type: 'info',
      title: 'Minum Air Kurang',
      message: `Baru ${log.waterL}L dari target 2.5L. Hidrasi penting untuk transportasi nutrisi ke growth plate.`,
    });
  }

  return warnings;
}

/**
 * Calculate overall nutrition score (0-100).
 */
export function calculateNutritionScore(log: NutritionLog): number {
  let score = 0;

  // Calcium (0-35)
  const calciumRatio = Math.min(1, log.calciumMg / CALCIUM_DAILY_TARGET);
  score += Math.round(calciumRatio * 35);

  // Protein (0-30)
  const proteinRatio = Math.min(1, log.proteinG / PROTEIN_DAILY_MIN);
  score += Math.round(proteinRatio * 30);

  // Water (0-15)
  const waterRatio = Math.min(1, log.waterL / 2.5);
  score += Math.round(waterRatio * 15);

  // No sugar before bed bonus (0-20)
  if (!log.sugarBeforeBed) score += 20;
  else score += 5;

  return Math.min(100, score);
}

/**
 * Suggest foods to cover calcium deficit.
 */
export function suggestCalciumFoods(deficit: number): typeof CALCIUM_FOODS {
  return CALCIUM_FOODS
    .filter(f => f.calciumMg >= 100) // only meaningful sources
    .sort((a, b) => b.calciumMg - a.calciumMg)
    .slice(0, 4);
}
