import React from 'react';
import { useStats } from '../hooks/useStats';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { PHASE_COLORS, PHASE_LABELS } from '../utils/constants';
import { Phase } from '../types';
import { BarChart3, Flame } from 'lucide-react';
import './StatsPanel.css';

export default function StatsPanel() {
  const stats = useStats();
  const { streak } = useWorkoutEngine();
  
  const phaseColor = PHASE_COLORS[stats.currentPhase as Phase] || '#60a5fa';
  
  return (
    <div className="stats-panel slide-up">
      <div className="stats-header">
        <span className="stats-title">
          <BarChart3 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> DASHBOARD
        </span>
        <span className="stats-badge" style={{ color: phaseColor, borderColor: `${phaseColor}40`, background: `${phaseColor}12` }}>
          MC{stats.currentMesocycle} · {PHASE_LABELS[stats.currentPhase as Phase] || stats.currentPhase}
        </span>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ff6b35' }}>
            <Flame size={16} style={{ verticalAlign: 'middle', marginRight: 2 }} /> {streak}
          </div>
          <div className="stat-label">STREAK</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#22c55e' }}>{stats.completionRate}%</div>
          <div className="stat-label">COMPLETION</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.avgHgh}</div>
          <div className="stat-label">HGH SCORE</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#a855f7' }}>{stats.avgRecovery}</div>
          <div className="stat-label">RECOVERY</div>
        </div>
      </div>
      
      <div className="stats-month">
        <div className="stats-month-label">BULAN INI</div>
        <div className="stats-month-bar">
          <div
            className="stats-month-fill"
            style={{ width: `${stats.monthTotal > 0 ? (stats.monthCompleted / stats.monthTotal) * 100 : 0}%` }}
          />
        </div>
        <div className="stats-month-text">{stats.monthCompleted}/{stats.monthTotal} workout selesai</div>
      </div>
    </div>
  );
}
