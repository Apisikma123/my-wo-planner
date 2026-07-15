import { Exercise } from '../types';
import { getHghColor, getHghLabel } from '../engine/hghEngine';
import { Zap, Anchor, Flame, Dumbbell, Dna } from 'lucide-react';
import './HghScoreCard.css';

interface HghScoreCardProps {
  score: number;
  tip: string;
  exercises: Exercise[];
  isoDate?: string;
}

export default function HghScoreCard({ score, tip, exercises, isoDate }: HghScoreCardProps) {
  const color = getHghColor(score);
  const label = getHghLabel(score);
  const hasHang = exercises.some(e => e.name.toLowerCase().includes('hang') || e.name.toLowerCase().includes('pullup') || e.name.toLowerCase().includes('chin'));
  const hasHiTempo = exercises.some(e => e.name.toLowerCase().includes('jump') || e.name.toLowerCase().includes('sprint') || e.category === 'hiit');
  const hasCompound = exercises.some(e => e.category === 'compound');

  const factors = [
    { Icon: Anchor, name: 'Dead Hang', active: hasHang, points: 15 },
    { Icon: Flame, name: 'Hi-Tempo Durab', active: hasHiTempo, points: 15 },
    { Icon: Dumbbell, name: 'Compound', active: hasCompound, points: 20 },
  ];

  return (
    <div className="hgh-card" style={{ borderColor: `${color}25` }}>
      <div className="hgh-header">
        <div className="hgh-title">
          <span className="hgh-icon"><Dna size={16} /></span>
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
            <span className="hgh-factor-icon"><f.Icon size={14} /></span>
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
