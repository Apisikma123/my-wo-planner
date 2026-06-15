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
import WorkoutPlayer from '../components/WorkoutPlayer';
import './RosterPage.css';

export default function RosterPage() {
  const { selectedDay, selectDay, toggleComplete, completedDays } = useWorkoutEngine();
  const [activeSession, setActiveSession] = useState<{day: any, exercises: any[]} | null>(null);

  if (activeSession) {
    return (
      <WorkoutPlayer
        day={activeSession.day}
        exercises={activeSession.exercises}
        onClose={() => setActiveSession(null)}
        onComplete={() => {
          if (!completedDays.includes(activeSession.day.isoDate)) {
            toggleComplete(activeSession.day.id);
          }
          setActiveSession(null);
        }}
      />
    );
  }

  return (
    <div className="roster-page">
      <div className="roster-body">
        <div className="roster-sidebar">
          <Header />
          <StartDatePicker />
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
        <DetailPanel 
          day={selectedDay} 
          onClose={() => selectDay(null)} 
          onStartSession={(exercises) => setActiveSession({day: selectedDay, exercises})}
        />
      )}
    </div>
  );
}
