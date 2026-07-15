import Header from '../components/Header';
import HeightProgressCard from '../components/HeightProgressCard';
import GrowthChart from '../components/GrowthChart';
import SleepLogger from '../components/SleepLogger';
import SupplementReminder from '../components/SupplementReminder';
import { useGrowth } from '../store/growthStore';
import { formatFullDate } from '../utils/dateUtils';
import './GrowthDashboard.css';

export default function GrowthDashboard() {
  const { compositeScore, todayIso } = useGrowth();
  const fullDate = formatFullDate(new Date(todayIso + 'T00:00:00'));

  return (
    <div className="growth-dashboard">
      <Header />
      
      <div className="dashboard-content">
        <div className="growth-page-title">
          <span className="title-date">{fullDate}</span>
          <h1 className="title-text">HGH Optimization</h1>
        </div>

        {/* Height Hero */}
        <HeightProgressCard />

        {/* Daily Composite Score */}
        <div className="composite-score-banner glass-strong">
          <div className="cs-info">
            <span className="cs-label">DAILY GROWTH SCORE</span>
            <span className="cs-desc">Sinergi antara nutrisi, tidur & bone stimulus</span>
          </div>
          <div className="cs-value" style={{ color: compositeScore >= 80 ? '#22c55e' : compositeScore >= 50 ? '#fbbf24' : '#ef4444' }}>
            {compositeScore}
          </div>
        </div>

        {/* Growth Tracking Chart */}
        <GrowthChart />

        <div className="section-divider">
          <span>DAILY OPTIMIZATION LOGS</span>
        </div>

        {/* Logging Components */}
        <div className="logs-container">
          <SleepLogger />
          <SupplementReminder />
        </div>
        
        {/* Extra bottom padding for BottomNav */}
        <div className="bottom-spacing"></div>
      </div>
    </div>
  );
}
