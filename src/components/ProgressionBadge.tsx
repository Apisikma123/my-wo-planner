import { useStats } from '../hooks/useStats';
import { PHASE_COLORS, PHASE_LABELS, PHASE_DESCRIPTIONS } from '../utils/constants';
import { Phase } from '../types';
import './ProgressionBadge.css';

export default function ProgressionBadge() {
  const stats = useStats();
  const phase = stats.currentPhase as Phase;
  const color = PHASE_COLORS[phase] || '#60a5fa';
  const label = PHASE_LABELS[phase] || phase;
  const desc = PHASE_DESCRIPTIONS[phase] || '';

  // Phase cycle visualization
  const phases: Phase[] = ['adaptation', 'overload', 'peak', 'deload'];
  const currentPhaseIndex = phases.indexOf(phase);

  return (
    <div className="progression-badge" style={{ borderColor: `${color}20` }}>
      <div className="pb-header">
        <div className="pb-title">
          <span className="pb-cycle-icon">⚙️</span>
          <span>MESOCYCLE {stats.currentMesocycle}</span>
        </div>
        <div className="pb-week" style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
          WEEK {stats.currentWeek}
        </div>
      </div>

      {/* Phase cycle dots */}
      <div className="pb-phases">
        {phases.map((p, i) => {
          const pc = PHASE_COLORS[p];
          const isActive = i === currentPhaseIndex;
          const isPast = i < currentPhaseIndex;
          return (
            <div key={p} className="pb-phase-slot">
              <div
                className={`pb-phase-dot ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                style={{
                  background: isActive ? pc : isPast ? `${pc}60` : 'var(--bg-elevated)',
                  borderColor: isActive ? pc : `${pc}30`,
                  boxShadow: isActive ? `0 0 8px ${pc}50` : 'none',
                }}
              />
              <div className="pb-phase-name" style={{ color: isActive ? pc : `${pc}50` }}>
                {PHASE_LABELS[p]}
              </div>
              {i < phases.length - 1 && (
                <div className="pb-phase-line" style={{
                  background: isPast ? `${pc}60` : 'var(--border-subtle)',
                }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="pb-desc" style={{ color: `${color}bb` }}>
        {desc}
      </div>
    </div>
  );
}
