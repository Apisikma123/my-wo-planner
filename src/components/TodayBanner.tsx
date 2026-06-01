import React from 'react';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import { formatFullDate } from '../utils/dateUtils';
import { TYPE_COLORS, TYPE_LABELS } from '../utils/constants';
import { MapPin, Clock, CheckCircle2, Dumbbell, RotateCcw, Footprints, BedDouble, LucideIcon } from 'lucide-react';
import './TodayBanner.css';

const typeIconMap: Record<string, LucideIcon> = {
  push: Dumbbell,
  pull: RotateCcw,
  legs: Footprints,
  rest: Footprints,
  fullrest: BedDouble,
};

export default function TodayBanner() {
  const { todayWorkout, todayIso, selectDay, roster } = useWorkoutEngine();
  
  const todayLabel = formatFullDate(new Date());
  const col = todayWorkout ? TYPE_COLORS[todayWorkout.workoutType] : '#1e3050';
  
  const isBeforeProgram = roster.length > 0 && todayIso < roster[0].isoDate;
  const isAfterProgram = roster.length > 0 && todayIso > roster[roster.length - 1].isoDate;

  const TypeIcon = todayWorkout ? typeIconMap[todayWorkout.workoutType] : null;
  
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
      <div className="today-label">
        <MapPin size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} /> HARI INI
      </div>
      <div className="today-content">
        <div>
          <div className="today-date">{todayLabel}</div>
          {todayWorkout ? (
            <div className="today-type" style={{ color: col }}>
              {TypeIcon && <TypeIcon size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />}
              {TYPE_LABELS[todayWorkout.workoutType]}
            </div>
          ) : (
            <div className="today-status">
              {isBeforeProgram
                ? <><Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Program belum mulai</>
                : isAfterProgram
                ? <><CheckCircle2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Roster ini sudah selesai — load more!</>
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
