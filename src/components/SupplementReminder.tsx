import { useState, useCallback } from 'react';
import { useGrowth } from '../store/growthStore';
import { evaluateSupplementTiming } from '../engine/nutritionEngine';
import { SUPPLEMENT_SCHEDULE } from '../utils/constants';
import { Pill, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import './SupplementReminder.css';

export default function SupplementReminder() {
  const { todaySupplement, todayIso, dispatch } = useGrowth();

  const [d3k2Taken, setD3k2Taken] = useState(todaySupplement?.d3k2Taken ?? false);
  const [d3k2WithFat, setD3k2WithFat] = useState(todaySupplement?.d3k2WithFat ?? false);
  const [zincB2Taken, setZincB2Taken] = useState(todaySupplement?.zincB2Taken ?? false);
  const [zincB2EmptyStomach, setZincB2EmptyStomach] = useState(todaySupplement?.zincB2EmptyStomach ?? false);
  const [expanded, setExpanded] = useState(!todaySupplement);

  const suppLog = { date: todayIso, d3k2Taken, d3k2WithFat, zincB2Taken, zincB2EmptyStomach };
  const { score, issues } = evaluateSupplementTiming(suppLog);

  const handleSave = useCallback(() => {
    dispatch({ type: 'LOG_SUPPLEMENT', log: suppLog });
    setExpanded(false);
  }, [dispatch, suppLog]);

  const allTaken = d3k2Taken && zincB2Taken;

  return (
    <div className="supplement-reminder glass fade-in">
      <button className="supp-header" onClick={() => setExpanded(!expanded)}>
        <div className="supp-title-row">
          <span className="supp-icon"><Pill size={16} /></span>
          <span className="supp-title">SUPPLEMENT TIMING</span>
        </div>
        <div className="supp-header-right">
          {todaySupplement && (
            <span className="supp-score-badge" style={{
              color: score >= 80 ? '#22c55e' : score >= 50 ? '#fbbf24' : '#ef4444',
              borderColor: score >= 80 ? '#22c55e40' : score >= 50 ? '#fbbf2440' : '#ef444440',
            }}>
              {score}
            </span>
          )}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="supp-body slide-up">
          {/* D3+K2 Card */}
          <div className={`supp-card ${d3k2Taken ? 'taken' : ''}`}>
            <div className="supp-card-header">
              <span className="supp-emoji">{SUPPLEMENT_SCHEDULE.d3k2.icon}</span>
              <div className="supp-card-info">
                <span className="supp-card-name">{SUPPLEMENT_SCHEDULE.d3k2.name}</span>
                <span className="supp-card-timing">{SUPPLEMENT_SCHEDULE.d3k2.timing}</span>
              </div>
              <button
                className={`supp-check-btn ${d3k2Taken ? 'checked' : ''}`}
                onClick={() => setD3k2Taken(!d3k2Taken)}
              >
                {d3k2Taken ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>
            {d3k2Taken && (
              <div className="supp-sub-check">
                <button
                  className={`supp-sub-btn ${d3k2WithFat ? 'active' : ''}`}
                  onClick={() => setD3k2WithFat(!d3k2WithFat)}
                >
                  <span className={`sub-dot ${d3k2WithFat ? 'filled' : ''}`} />
                  <span>Diminum bersama makanan berlemak?</span>
                </button>
                {!d3k2WithFat && (
                  <p className="supp-warning-text">
                    ⚠️ {SUPPLEMENT_SCHEDULE.d3k2.rule}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Zinc+B2 Card */}
          <div className={`supp-card ${zincB2Taken ? 'taken' : ''}`}>
            <div className="supp-card-header">
              <span className="supp-emoji">{SUPPLEMENT_SCHEDULE.zincB2.icon}</span>
              <div className="supp-card-info">
                <span className="supp-card-name">{SUPPLEMENT_SCHEDULE.zincB2.name}</span>
                <span className="supp-card-timing">{SUPPLEMENT_SCHEDULE.zincB2.timing}</span>
              </div>
              <button
                className={`supp-check-btn ${zincB2Taken ? 'checked' : ''}`}
                onClick={() => setZincB2Taken(!zincB2Taken)}
              >
                {zincB2Taken ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>
            {zincB2Taken && (
              <div className="supp-sub-check">
                <button
                  className={`supp-sub-btn ${zincB2EmptyStomach ? 'active' : ''}`}
                  onClick={() => setZincB2EmptyStomach(!zincB2EmptyStomach)}
                >
                  <span className={`sub-dot ${zincB2EmptyStomach ? 'filled' : ''}`} />
                  <span>Diminum saat perut kosong?</span>
                </button>
                {!zincB2EmptyStomach && (
                  <p className="supp-warning-text">
                    ℹ️ {SUPPLEMENT_SCHEDULE.zincB2.rule}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Issues */}
          {issues.length > 0 && (
            <div className="supp-issues">
              {issues.map((issue, i) => (
                <div key={i} className="supp-issue">{issue}</div>
              ))}
            </div>
          )}

          {/* Save */}
          <button className="supp-save-btn" onClick={handleSave}>
            {todaySupplement ? 'UPDATE SUPLEMEN' : 'SIMPAN SUPLEMEN'}
          </button>
        </div>
      )}
    </div>
  );
}
