import React, { useMemo } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import './WeekFilter.css';

export default function WeekFilter() {
  const { weeks, activeFilter, setFilter, loadMore } = useWorkoutEngine();

  // Determine active month based on the active filter
  const activeMonth = useMemo(() => {
    if (activeFilter === 'all') return 1;
    if (activeFilter.startsWith('month-')) {
      return parseInt(activeFilter.replace('month-', ''), 10);
    }
    const weekNum = parseInt(activeFilter, 10);
    return isNaN(weekNum) ? 1 : Math.ceil(weekNum / 4);
  }, [activeFilter]);

  // Determine total months generated in roster
  const totalMonths = useMemo(() => {
    if (weeks.length === 0) return 1;
    return Math.ceil(weeks.length / 4);
  }, [weeks]);

  // Get weeks belonging to the active month
  const subWeeks = useMemo(() => {
    const startWeek = (activeMonth - 1) * 4 + 1;
    return [startWeek, startWeek + 1, startWeek + 2, startWeek + 3].filter(w => weeks.includes(w));
  }, [activeMonth, weeks]);

  const handleMonthSelect = (monthNum: number) => {
    setFilter(`month-${monthNum}`);
  };

  const handleShowAll = () => {
    setFilter('all');
  };

  return (
    <div className="filter-navigation-container">
      {/* Month Tabs Pagination */}
      <div className="month-pagination">
        <button
          className={`month-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={handleShowAll}
        >
          📅 SEMUA BULAN
        </button>
        {Array.from({ length: totalMonths }, (_, i) => i + 1).map((m) => (
          <button
            key={m}
            className={`month-tab ${activeFilter.startsWith('month-') && activeMonth === m ? 'active' : activeFilter !== 'all' && activeMonth === m ? 'active-parent' : ''}`}
            onClick={() => handleMonthSelect(m)}
          >
            🌙 BULAN {m}
          </button>
        ))}
        <button className="month-tab load-more-tab" onClick={loadMore} title="Tambah Bulan Baru">
          ➕ TAMBAH MINGGU
        </button>
      </div>

      {/* Sub-Week Tabs for Active Month */}
      {activeFilter !== 'all' && (
        <div className="sub-week-filter fade-in">
          <button
            className={`sub-week-btn ${activeFilter === `month-${activeMonth}` ? 'active' : ''}`}
            onClick={() => handleMonthSelect(activeMonth)}
          >
            Semua Minggu (Bulan {activeMonth})
          </button>
          {subWeeks.map((w) => (
            <button
              key={w}
              className={`sub-week-btn ${activeFilter === String(w) ? 'active' : ''}`}
              onClick={() => setFilter(String(w))}
            >
              Minggu {w}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
