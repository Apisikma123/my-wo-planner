import { useState, useCallback, useMemo } from 'react';
import { useGrowth } from '../store/growthStore';
import { FoodEntry } from '../types';
import { evaluateCalciumIntake, calculateNutritionScore, generateNutritionWarnings, suggestCalciumFoods } from '../engine/nutritionEngine';
import { CALCIUM_FOODS, CALCIUM_DAILY_TARGET, PROTEIN_DAILY_MIN, PROTEIN_DAILY_MAX } from '../utils/constants';
import { Beef, Droplets, ChevronDown, ChevronUp, AlertTriangle, Plus, Minus } from 'lucide-react';
import './NutritionLogger.css';

export default function NutritionLogger() {
  const { todayNutrition, todayIso, dispatch } = useGrowth();

  const [foods, setFoods] = useState<FoodEntry[]>(todayNutrition?.foods || []);
  const [proteinG, setProteinG] = useState(todayNutrition?.proteinG || 0);
  const [waterL, setWaterL] = useState(todayNutrition?.waterL || 0);
  const [sugarBeforeBed, setSugarBeforeBed] = useState(todayNutrition?.sugarBeforeBed || false);
  const [expanded, setExpanded] = useState(!todayNutrition);

  const totalCalcium = useMemo(() => foods.reduce((sum, f) => sum + f.calciumMg * f.quantity, 0), [foods]);
  const calciumStatus = evaluateCalciumIntake(totalCalcium);

  const nutritionLog = useMemo(() => ({
    date: todayIso,
    calciumMg: totalCalcium,
    proteinG,
    waterL,
    sugarBeforeBed,
    foods,
  }), [todayIso, totalCalcium, proteinG, waterL, sugarBeforeBed, foods]);

  const nutritionScore = calculateNutritionScore(nutritionLog);
  const warnings = generateNutritionWarnings(nutritionLog);

  const addFood = (name: string, calciumMg: number) => {
    const existing = foods.find(f => f.name === name);
    if (existing) {
      setFoods(foods.map(f => f.name === name ? { ...f, quantity: f.quantity + 1 } : f));
    } else {
      setFoods([...foods, { name, calciumMg, quantity: 1 }]);
    }
  };

  const removeFood = (name: string) => {
    const existing = foods.find(f => f.name === name);
    if (existing && existing.quantity > 1) {
      setFoods(foods.map(f => f.name === name ? { ...f, quantity: f.quantity - 1 } : f));
    } else {
      setFoods(foods.filter(f => f.name !== name));
    }
  };

  const handleSave = useCallback(() => {
    dispatch({ type: 'LOG_NUTRITION', log: nutritionLog });
    setExpanded(false);
  }, [dispatch, nutritionLog]);

  const calciumPercent = Math.min(100, (totalCalcium / CALCIUM_DAILY_TARGET) * 100);

  return (
    <div className="nutrition-logger glass fade-in">
      <button className="nutri-header" onClick={() => setExpanded(!expanded)}>
        <div className="nutri-title-row">
          <span className="nutri-icon">🦴</span>
          <span className="nutri-title">NUTRISI & KALSIUM</span>
        </div>
        <div className="nutri-header-right">
          {todayNutrition && (
            <span className="nutri-score-badge" style={{
              color: calciumStatus.status === 'critical' ? '#ef4444' : calciumStatus.status === 'excellent' ? '#22c55e' : '#fbbf24',
              borderColor: calciumStatus.status === 'critical' ? '#ef444440' : calciumStatus.status === 'excellent' ? '#22c55e40' : '#fbbf2440',
            }}>
              {nutritionScore}
            </span>
          )}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="nutri-body slide-up">
          {/* Calcium Deficit Alert */}
          {calciumStatus.status === 'critical' && (
            <div className="calcium-critical-alert">
              <div className="alert-header">
                <AlertTriangle size={16} />
                <span>⚠️ CRITICAL WARNING: CALCIUM DEFICIT</span>
              </div>
              <p className="alert-message">
                D3+K2 <strong>TIDAK BISA</strong> mengkalsifikasi tulang menjadi matriks yang lebih panjang tanpa building block kalsium yang cukup!
                Kamu butuh <strong>{calciumStatus.deficit}mg</strong> lagi.
              </p>
            </div>
          )}

          {/* Calcium Progress Bar */}
          <div className="calcium-progress-section">
            <div className="calcium-label-row">
              <span className="calcium-label">KALSIUM HARI INI</span>
              <span className="calcium-value" style={{
                color: calciumStatus.status === 'critical' ? '#ef4444' : calciumStatus.status === 'excellent' ? '#22c55e' : '#fbbf24'
              }}>
                {totalCalcium}mg / {CALCIUM_DAILY_TARGET}mg
              </span>
            </div>
            <div className="calcium-bar">
              <div
                className="calcium-bar-fill"
                style={{
                  width: `${calciumPercent}%`,
                  background: calciumStatus.status === 'critical'
                    ? 'linear-gradient(90deg, #ef4444, #f97316)'
                    : calciumStatus.status === 'excellent'
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                }}
              />
            </div>
          </div>

          {/* Food Grid */}
          <div className="food-section">
            <span className="food-section-label">Tambah Sumber Kalsium:</span>
            <div className="food-grid">
              {CALCIUM_FOODS.map(food => {
                const count = foods.find(f => f.name === food.name)?.quantity || 0;
                return (
                  <div key={food.name} className={`food-item ${count > 0 ? 'active' : ''}`}>
                    <button className="food-add-btn" onClick={() => addFood(food.name, food.calciumMg)}>
                      <span className="food-emoji">{food.icon}</span>
                      <span className="food-name">{food.name}</span>
                      <span className="food-mg">+{food.calciumMg}mg</span>
                    </button>
                    {count > 0 && (
                      <div className="food-count-row">
                        <button className="food-minus" onClick={() => removeFood(food.name)}>
                          <Minus size={12} />
                        </button>
                        <span className="food-count">{count}×</span>
                        <button className="food-plus" onClick={() => addFood(food.name, food.calciumMg)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Protein Input */}
          <div className="nutri-field">
            <label className="field-label">
              <Beef size={13} /> Protein (g)
            </label>
            <div className="protein-row">
              <input
                type="range"
                min={0}
                max={200}
                value={proteinG}
                onChange={(e) => setProteinG(parseInt(e.target.value))}
                className="protein-slider"
                style={{
                  background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${(proteinG / 200) * 100}%, rgba(255,255,255,0.1) ${(proteinG / 200) * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <span className="protein-value" style={{
                color: proteinG >= PROTEIN_DAILY_MIN ? '#22c55e' : '#fbbf24'
              }}>{proteinG}g</span>
            </div>
            <span className="protein-target">Target: {PROTEIN_DAILY_MIN}–{PROTEIN_DAILY_MAX}g</span>
          </div>

          {/* Water Input */}
          <div className="nutri-field">
            <label className="field-label">
              <Droplets size={13} /> Air Putih (Liter)
            </label>
            <div className="water-row">
              {[0.5, 1, 1.5, 2, 2.5, 3].map(v => (
                <button
                  key={v}
                  className={`water-btn ${waterL === v ? 'active' : ''}`}
                  onClick={() => setWaterL(v)}
                >
                  {v}L
                </button>
              ))}
            </div>
          </div>

          {/* Sugar toggle */}
          <div className="nutri-field">
            <button
              className={`sugar-toggle ${sugarBeforeBed ? 'active-bad' : ''}`}
              onClick={() => setSugarBeforeBed(!sugarBeforeBed)}
            >
              <span>{sugarBeforeBed ? '🍬' : '🚫'}</span>
              <span>{sugarBeforeBed ? 'Makan gula < 2 jam sebelum tidur' : 'Tidak makan gula sebelum tidur ✅'}</span>
            </button>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="nutri-warnings">
              {warnings.map((w, i) => (
                <div key={i} className={`nutri-warning ${w.type}`}>
                  <span className="warning-title">{w.title}</span>
                  <span className="warning-msg">{w.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Save */}
          <button className="nutri-save-btn" onClick={handleSave}>
            {todayNutrition ? 'UPDATE NUTRISI' : 'SIMPAN NUTRISI'}
          </button>
        </div>
      )}
    </div>
  );
}
