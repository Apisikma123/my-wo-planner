import { useState } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import Header from '../components/Header';
import TodayBanner from '../components/TodayBanner';
import StartDatePicker from '../components/StartDatePicker';
import StatsPanel from '../components/StatsPanel';
import ProgressionBadge from '../components/ProgressionBadge';
import WeekFilter from '../components/WeekFilter';
import CalendarGrid from '../components/CalendarGrid';
import DetailPanel from '../components/DetailPanel';
import './RosterPage.css';

export default function RosterPage() {
  const { selectedDay, selectDay } = useWorkoutEngine();
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="roster-page">
      <div className="roster-body">
        <div className="roster-sidebar">
          <Header onSettingsClick={() => setShowDatePicker(!showDatePicker)} />
          {showDatePicker && (
            <div className="slide-down">
              <StartDatePicker />
            </div>
          )}
          <TodayBanner />
          <ProgressionBadge />
          <StatsPanel />
        </div>
        <div className="roster-main">
          <WeekFilter />
          <CalendarGrid />
        </div>
      </div>

      {selectedDay && (
        <DetailPanel day={selectedDay} onClose={() => selectDay(null)} />
      )}
    </div>
  );
}
