import React, { useMemo } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import './WeekFilter.css';

export default function WeekFilter() {
  const { weeks, activeFilter, setFilter, loadMore } = useWorkoutEngine();
  
  const displayWeeks = useMemo(() => {
    // Show max 10 week buttons + all
    const maxShow = Math.min(weeks.length, 10);
    return weeks.slice(0, maxShow);
  }, [weeks]);
  
  return (
    <div className="week-filter">
      <button
        className={`week-btn ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        SEMUA
      </button>
      {displayWeeks.map(w => (
        <button
          key={w}
          className={`week-btn ${activeFilter === String(w) ? 'active' : ''}`}
          onClick={() => setFilter(String(w))}
        >
          W{w}
        </button>
      ))}
      {weeks.length > 10 && (
        <button className="week-btn more" onClick={loadMore}>+{weeks.length - 10}</button>
      )}
    </div>
  );
}
