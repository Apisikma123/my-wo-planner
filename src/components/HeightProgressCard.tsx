import { useState } from 'react';
import { useGrowth } from '../store/growthStore';
import { USER_PROFILE } from '../utils/constants';
import { calculateHeightProgress, getGrowthPlateStatus, formatProjectionTimeline } from '../engine/growthEngine';
import { Ruler, Activity, TrendingUp, Edit3, X, Check } from 'lucide-react';
import { toIsoString, formatDisplayDate } from '../utils/dateUtils';
import './HeightProgressCard.css';

export default function HeightProgressCard() {
  const { state, dispatch, todayIso } = useGrowth();
  const [isEditing, setIsEditing] = useState(false);
  const [newHeight, setNewHeight] = useState(state.currentHeight.toString());
  const [notes, setNotes] = useState('');

  const progress = calculateHeightProgress(state.heightHistory);
  const plateStatus = getGrowthPlateStatus(USER_PROFILE.age);
  
  const handleSave = () => {
    const val = parseFloat(newHeight);
    if (!isNaN(val) && val > 0) {
      dispatch({
        type: 'LOG_HEIGHT',
        entry: {
          date: todayIso,
          heightCm: val,
          notes: notes || 'Update reguler',
        }
      });
      setIsEditing(false);
      setNotes('');
    }
  };

  return (
    <div className="height-card glass-strong fade-in">
      {/* Plate Status Banner */}
      <div className="plate-status-banner" style={{ backgroundColor: `${plateStatus.color}20`, borderColor: `${plateStatus.color}40` }}>
        <span className="plate-icon">🧬</span>
        <div className="plate-info">
          <span className="plate-label" style={{ color: plateStatus.color }}>
            GROWTH PLATES {plateStatus.label}
          </span>
          <span className="plate-desc">{plateStatus.description}</span>
        </div>
      </div>

      <div className="height-main">
        {/* Current Height Display */}
        <div className="current-height-section">
          <div className="ch-label">TINGGI SAAT INI</div>
          <div className="ch-value">
            {state.currentHeight} <span className="ch-unit">cm</span>
          </div>
          <div className="ch-target">Target: {USER_PROFILE.targetHeight} cm</div>
        </div>

        {/* Edit Button or Form */}
        {isEditing ? (
          <div className="height-edit-form slide-up">
            <input 
              type="number" 
              step="0.1"
              value={newHeight} 
              onChange={(e) => setNewHeight(e.target.value)}
              className="height-input"
              autoFocus
            />
            <input 
              type="text" 
              placeholder="Catatan (opsional)" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-input"
            />
            <div className="edit-actions">
              <button className="edit-cancel" onClick={() => setIsEditing(false)}>
                <X size={14} /> Batal
              </button>
              <button className="edit-save" onClick={handleSave}>
                <Check size={14} /> Simpan
              </button>
            </div>
          </div>
        ) : (
          <button className="update-height-btn" onClick={() => {
            setNewHeight(state.currentHeight.toString());
            setIsEditing(true);
          }}>
            <Edit3 size={14} /> Update
          </button>
        )}
      </div>

      {/* Progress Arc/Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="prog-gained">+{progress.heightGained.toFixed(1)} cm gained</span>
          <span className="prog-remaining">{progress.remaining.toFixed(1)} cm to go</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-box">
          <TrendingUp size={14} className="metric-icon" />
          <div className="metric-data">
            <span className="md-val">{progress.velocityCmPerMonth > 0 ? `+${progress.velocityCmPerMonth}` : '0.0'}</span>
            <span className="md-unit">cm/bln</span>
          </div>
          <span className="md-label">KEC. TUMBUH</span>
        </div>
        <div className="metric-box">
          <Activity size={14} className="metric-icon" style={{ color: '#a855f7' }} />
          <div className="metric-data">
            <span className="md-text">{formatProjectionTimeline(progress.projectedMonthsToTarget)}</span>
          </div>
          <span className="md-label">ESTIMASI TARGET</span>
        </div>
      </div>
      
      {/* Last Update */}
      {state.heightHistory.length > 0 && (
        <div className="last-update">
          Update terakhir: {formatDisplayDate(new Date(state.heightHistory[state.heightHistory.length - 1].date))}
        </div>
      )}
    </div>
  );
}
