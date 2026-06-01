import React, { useMemo } from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { PHASE_COLORS, PHASE_LABELS } from '../utils/constants';
import { Phase } from '../types';
import { CalendarDays, ChevronDown } from 'lucide-react';
import DayCard from './DayCard';
import './CalendarGrid.css';

export default function CalendarGrid() {
  const { weekGroups, selectedDay, todayIso, selectDay, completedDays, activeFilter, loadMore } = useWorkoutEngine();
  
  const sortedWeeks = useMemo(() => {
    return Array.from(weekGroups.entries()).sort((a, b) => a[0] - b[0]);
  }, [weekGroups]);

  // Determine the current active month number for the banner
  const activeMonthNum = useMemo(() => {
    if (activeFilter.startsWith('month-')) {
      return parseInt(activeFilter.replace('month-', ''), 10);
    }
    if (sortedWeeks.length > 0) {
      return Math.ceil(sortedWeeks[0][0] / 4);
    }
    return null;
  }, [activeFilter, sortedWeeks]);

  const showMonthBanner = activeFilter.startsWith('month-') && activeMonthNum !== null;

  // Get phase of first visible week for month banner color
  const bannerPhase = sortedWeeks[0]?.[1]?.[0]?.phase as Phase || 'adaptation';
  const bannerColor = PHASE_COLORS[bannerPhase];

  // Get first week's start date for month banner subtitle
  const bannerStartDate = useMemo(() => {
    if (sortedWeeks.length === 0) return '';
    const firstDay = sortedWeeks[0][1][0];
    if (!firstDay) return '';
    const d = new Date(firstDay.isoDate + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [sortedWeeks]);

  return (
    <div className="calendar-container">
      {/* Month Banner */}
      {showMonthBanner && (
        <div className="month-banner fade-in">
          <CalendarDays size={16} className="month-banner-icon" />
          <div>
            <div className="month-banner-title">Bulan {activeMonthNum}</div>
            <div className="month-banner-sub">Mulai {bannerStartDate} · {sortedWeeks.length} Minggu</div>
          </div>
        </div>
      )}

      {/* Week Groups */}
      {sortedWeeks.map(([weekNum, days]) => {
        const phase = days[0]?.phase as Phase || 'adaptation';
        const mesocycle = days[0]?.mesocycle || 1;
        const pc = PHASE_COLORS[phase];
        
        return (
          <div key={weekNum} className="week-group fade-in" style={{ animationDelay: `${(weekNum % 4) * 0.08}s` }}>
            <div className="week-header">
              <div
                className="week-badge"
                style={{ color: pc, background: `${pc}12`, borderColor: `${pc}30` }}
              >
                MINGGU {weekNum} · MC{mesocycle} · {PHASE_LABELS[phase]}
              </div>
              <div className="week-line" style={{ background: `${pc}25` }} />
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
      
      {/* fallback load more for 'all' filter */}
      {activeFilter === 'all' && (
        <button className="load-more-btn" onClick={loadMore}>
          <ChevronDown size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> MUAT LEBIH BANYAK MINGGU
        </button>
      )}
    </div>
  );
}
