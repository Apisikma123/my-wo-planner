import React from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { formatFullDate } from '../utils/dateUtils';
import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS } from '../utils/constants';
import './TodayBanner.css';

export default function TodayBanner() {
  const { todayWorkout, todayIso, selectDay, roster } = useWorkoutEngine();
  
  const todayLabel = formatFullDate(new Date());
  const col = todayWorkout ? TYPE_COLORS[todayWorkout.workoutType] : '#1e3050';
  
  const isBeforeProgram = roster.length > 0 && todayIso < roster[0].isoDate;
  const isAfterProgram = roster.length > 0 && todayIso > roster[roster.length - 1].isoDate;
  
  return (
    <div
      className="today-banner fade-in"
      style={{
        background: todayWorkout
          ? `linear-gradient(135deg, ${col}25, ${col}08)`
          : 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderColor: todayWorkout ? `${col}60` : '#1e3050',
        boxShadow: todayWorkout ? `0 0 20px ${col}15` : 'none',
      }}
    >
      <div className="today-label">📍 HARI INI</div>
      <div className="today-content">
        <div>
          <div className="today-date">{todayLabel}</div>
          {todayWorkout ? (
            <div className="today-type" style={{ color: col }}>
              {TYPE_ICONS[todayWorkout.workoutType]} {TYPE_LABELS[todayWorkout.workoutType]}
            </div>
          ) : (
            <div className="today-status">
              {isBeforeProgram
                ? '⏳ Program belum mulai'
                : isAfterProgram
                ? '✅ Roster ini sudah selesai — load more!'
                : '—'}
            </div>
          )}
        </div>
        {todayWorkout && (
          <button
            className="today-btn"
            onClick={() => selectDay(todayWorkout.id)}
            style={{
              background: `${col}25`,
              borderColor: `${col}60`,
              color: col,
            }}
          >
            LIHAT DETAIL
          </button>
        )}
      </div>
    </div>
  );
}
