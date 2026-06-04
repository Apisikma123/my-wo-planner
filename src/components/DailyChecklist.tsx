import { getDailyChecklist } from '../utils/constants';
import { Zap, Activity, Anchor, Moon, Droplets, Beef, LucideIcon } from 'lucide-react';
import './DailyChecklist.css';

const iconMap: Record<string, LucideIcon> = {
  Zap, Activity, Anchor, Moon, Droplets, Beef,
};

interface DailyChecklistProps {
  isoDate?: string;
  workoutType?: string;
}

export default function DailyChecklist({ isoDate, workoutType }: DailyChecklistProps) {
  const list = getDailyChecklist(isoDate, workoutType);
  
  return (
    <div className="daily-checklist">
      <div className="dc-header">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}>
          <path d="M12 2L12 22" /><path d="M5 5L12 2L19 5" />
        </svg>
        WAJIB HARIAN
      </div>
      <div className="dc-list">
        {list.map(item => {
          const IconComp = iconMap[item.icon];
          return (
            <div key={item.label} className="dc-item">
              <div className="dc-icon" style={{ background: `${item.color}15` }}>
                {IconComp ? <IconComp size={18} style={{ color: item.color }} /> : <span style={{ color: item.color }}>{item.icon}</span>}
              </div>
              <div className="dc-info">
                <div className="dc-label">{item.label}</div>
                <div className="dc-value" style={{ color: item.color }}>{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
