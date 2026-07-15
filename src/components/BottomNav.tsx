import { ClipboardList, Dna, AlertCircle } from 'lucide-react';
import { useGrowth } from '../store/growthStore';
import { CALCIUM_DAILY_TARGET } from '../utils/constants';
import './BottomNav.css';

interface BottomNavProps {
  activeTab: 'roster' | 'growth';
  onTabChange: (tab: 'roster' | 'growth') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { todayNutrition } = useGrowth();
  
  const hasCalciumDeficit = todayNutrition 
    ? todayNutrition.calciumMg < CALCIUM_DAILY_TARGET 
    : true; // No log = deficit assumed

  return (
    <nav className="bottom-nav glass-strong">
      <button
        className={`nav-tab ${activeTab === 'roster' ? 'active' : ''}`}
        onClick={() => onTabChange('roster')}
        id="nav-roster"
      >
        <span className="nav-icon">
          <ClipboardList size={20} />
        </span>
        <span className="nav-label">ROSTER</span>
        {activeTab === 'roster' && <span className="nav-indicator" />}
      </button>

      <button
        className={`nav-tab ${activeTab === 'growth' ? 'active' : ''}`}
        onClick={() => onTabChange('growth')}
        id="nav-growth"
      >
        <span className="nav-icon">
          <Dna size={20} />
          {hasCalciumDeficit && (
            <span className="nav-alert-dot" />
          )}
        </span>
        <span className="nav-label">GROWTH</span>
        {activeTab === 'growth' && <span className="nav-indicator" />}
      </button>
    </nav>
  );
}
