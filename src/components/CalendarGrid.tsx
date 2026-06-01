import React, { useMemo } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { PHASE_COLORS, PHASE_LABELS } from '../utils/constants';
import { Phase } from '../types';
import DayCard from './DayCard';
import './CalendarGrid.css';

export default function CalendarGrid() {
  const { weekGroups, selectedDay, todayIso, selectDay, completedDays, activeFilter, loadMore } = useWorkoutEngine();
  
  const sortedWeeks = useMemo(() => {
    return Array.from(weekGroups.entries()).sort((a, b) => a[0] - b[0]);
  }, [weekGroups]);
  
  return (
    <div className="calendar-container">
      {sortedWeeks.map(([weekNum, days]) => {
        const phase = days[0]?.phase as Phase || 'adaptation';
        const phaseWeek = days[0]?.phaseWeek || 1;
        const mesocycle = days[0]?.mesocycle || 1;
        const pc = PHASE_COLORS[phase];
        
        return (
          <div key={weekNum} className="week-group fade-in" style={{ animationDelay: `${(weekNum % 5) * 0.05}s` }}>
            <div className="week-header">
              <div
                className="week-badge"
                style={{ color: pc, background: `${pc}12`, borderColor: `${pc}25` }}
              >
                W{weekNum} · MC{mesocycle} · {PHASE_LABELS[phase]}
              </div>
              <div className="week-line" style={{ background: `${pc}20` }} />
            </div>
            <div className="week-grid">
              {days.map(day => (
                <DayCard
                  key={day.id}
                  day={day}
                  isSelected={selectedDay?.id === day.id}
                  isToday={day.isoDate === todayIso}
                  isPast={day.isoDate < todayIso}
                  isCompleted={completedDays.includes(day.isoDate)}
                  onSelect={selectDay}
                />
              ))}
            </div>
          </div>
        );
      })}
      
      {activeFilter === 'all' && (
        <button className="load-more-btn" onClick={loadMore}>
          ⬇ LOAD MORE WEEKS
        </button>
      )}
    </div>
  );
}
