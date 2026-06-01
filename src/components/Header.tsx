import { useMemo } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { getMonthShortId } from '../utils/dateUtils';
import { TYPE_COLORS } from '../utils/constants';
import './Header.css';

const legendItems = [
  { color: TYPE_COLORS.push, label: '💪 PUSH' },
  { color: TYPE_COLORS.pull, label: '🔙 PULL' },
  { color: TYPE_COLORS.legs, label: '🦵 LEGS' },
  { color: TYPE_COLORS.rest, label: '🚶 REST' },
  { color: '#334155', label: '😴 FULL REST' },
];

interface HeaderProps {
  onSettingsClick?: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  const { roster } = useWorkoutEngine();

  const dateRange = useMemo(() => {
    if (roster.length === 0) return '';
    const first = new Date(roster[0].isoDate + 'T00:00:00');
    const last = new Date(roster[roster.length - 1].isoDate + 'T00:00:00');
    const fMonth = getMonthShortId(first);
    const lMonth = getMonthShortId(last);
    const fYear = first.getFullYear();
    const lYear = last.getFullYear();
    if (fYear === lYear) {
      return `${first.getDate()} ${fMonth} – ${last.getDate()} ${lMonth} ${fYear}`;
    }
    return `${first.getDate()} ${fMonth} ${fYear} – ${last.getDate()} ${lMonth} ${lYear}`;
  }, [roster]);

  return (
    <div className="header">
      <div className="header-bg" />
      <div className="header-scan-line" />
      <div className="header-content">
        <div className="header-top-row">
          <div className="header-label">PROGRAM PPL + HGH BOOST</div>
          {onSettingsClick && (
            <button className="header-settings-btn" onClick={onSettingsClick} aria-label="Settings">
              ⚙️
            </button>
          )}
        </div>
        <div className="header-title">SMART ROSTER</div>
        <div className="header-subtitle">{dateRange} · GROW MODE 🔝</div>
        <div className="header-legend">
          {legendItems.map(item => (
            <div key={item.label} className="legend-item" style={{ borderColor: `${item.color}40` }}>
              <div className="legend-dot" style={{ background: item.color }} />
              <span style={{ color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
