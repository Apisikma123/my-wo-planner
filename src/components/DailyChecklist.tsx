import { getDailyChecklist } from '../utils/constants';
import { Zap, Activity, Anchor, Moon, Droplets, Beef, LucideIcon, CheckCircle2 } from 'lucide-react';
import { useGrowth } from '../store/growthStore';
import './DailyChecklist.css';

const iconMap: Record<string, LucideIcon> = {
  Zap, Activity, Anchor, Moon, Droplets, Beef,
};

interface DailyChecklistProps {
  isoDate?: string;
  workoutType?: string;
}

export default function DailyChecklist({ isoDate, workoutType }: DailyChecklistProps) {
  const { state, todayIso } = useGrowth();
  
  // Use today's data or specific date data if available in the future. We'll fallback to today's data for this view.
  const dateToUse = isoDate || todayIso;
  const sleepLog = state.sleepLogs[dateToUse];

  const list = getDailyChecklist(isoDate, workoutType);
  
  const checkCompletion = (label: string) => {
    if (label.includes('Tidur')) {
      return sleepLog && sleepLog.duration >= 8;
    }
    return false;
  };
  
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
          const isComplete = checkCompletion(item.label);
          
          return (
            <div key={item.label} className="dc-item">
              <div className="dc-icon" style={{ background: isComplete ? '#22c55e20' : `${item.color}15` }}>
                {IconComp ? <IconComp size={18} style={{ color: isComplete ? '#22c55e' : item.color }} /> : <span style={{ color: isComplete ? '#22c55e' : item.color }}>{item.icon}</span>}
              </div>
              <div className="dc-info">
                <div className="dc-label">{item.label}</div>
                <div className="dc-value" style={{ color: isComplete ? '#22c55e' : item.color }}>
                  {isComplete ? 'Selesai ✅' : item.value}
                </div>
              </div>
              {isComplete && <CheckCircle2 size={16} color="#22c55e" style={{ marginLeft: 'auto' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
