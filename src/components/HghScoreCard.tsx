import { Exercise } from '../types';
import { getHghColor, getHghLabel } from '../engine/hghEngine';
import './HghScoreCard.css';

interface HghScoreCardProps {
  score: number;
  tip: string;
  exercises: Exercise[];
}

export default function HghScoreCard({ score, exercises }: HghScoreCardProps) {
  const color = getHghColor(score);
  const label = getHghLabel(score);

  const hasSprint = true; // Morning HGH (Sprint or Squat Jump) is done daily
  const hasHang = true; // Auto-done by user daily
  const hasHiTempo = true; // High-tempo explosive workout stimulates durability
  const hasCompound = exercises.some(e => e.category === 'compound');

  const factors = [
    { icon: '⚡', name: 'Sprint/Jump Pagi', active: hasSprint, points: 25 },
    { icon: '🪝', name: 'Dead Hang', active: hasHang, points: 15 },
    { icon: '🔥', name: 'Hi-Tempo Durab', active: hasHiTempo, points: 15 },
    { icon: '🏋️', name: 'Compound', active: hasCompound, points: 20 },
  ];

  return (
    <div className="hgh-card" style={{ borderColor: `${color}25` }}>
      <div className="hgh-header">
        <div className="hgh-title">
          <span className="hgh-icon">🧬</span>
          <span>HGH SCORE</span>
        </div>
        <div className="hgh-score" style={{ color }}>
          {score}
          <span className="hgh-label" style={{ color: `${color}aa` }}>{label}</span>
        </div>
      </div>

      {/* Progress arc */}
      <div className="hgh-bar-container">
        <div className="hgh-bar-track">
          <div
            className="hgh-bar-fill"
            style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${color}40, ${color})`,
              boxShadow: `0 0 12px ${color}30`,
            }}
          />
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="hgh-factors">
        {factors.map(f => (
          <div
            key={f.name}
            className={`hgh-factor ${f.active ? 'active' : ''}`}
          >
            <span className="hgh-factor-icon">{f.icon}</span>
            <span className="hgh-factor-name">{f.name}</span>
            <span className="hgh-factor-pts" style={{ color: f.active ? '#22c55e' : 'var(--text-dim)' }}>
              {f.active ? `+${f.points}` : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
