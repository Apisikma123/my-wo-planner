import { getDailyChecklist } from '../utils/constants';
import './DailyChecklist.css';

interface DailyChecklistProps {
  isoDate?: string;
  workoutType?: string;
}

export default function DailyChecklist({ isoDate, workoutType }: DailyChecklistProps) {
  const list = getDailyChecklist(isoDate, workoutType);
  
  return (
    <div className="daily-checklist">
      <div className="checklist-title">📌 WAJIB HARIAN</div>
      <div className="checklist-grid">
        {list.map(item => (
          <div key={item.label} className="checklist-item" style={{ borderColor: `${item.color}25` }}>
            <div className="checklist-icon">{item.icon}</div>
            <div className="checklist-content">
              <div className="checklist-label">{item.label}</div>
              <div className="checklist-value" style={{ color: item.color }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

