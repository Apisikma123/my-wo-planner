import React, { memo, useCallback } from 'react';
import { WorkoutDay } from '../types';
import { TYPE_COLORS } from '../utils/constants';
import { Dumbbell, RotateCcw, Footprints, BedDouble, Minus, Check, LucideIcon } from 'lucide-react';
import './DayCard.css';

const typeIconMap: Record<string, LucideIcon> = {
  push: Dumbbell,
  pull: RotateCcw,
  legs: Footprints,
  rest: Footprints,
  fullrest: BedDouble,
};

interface DayCardProps {
  day: WorkoutDay;
  isSelected: boolean;
  isToday: boolean;
  isPast: boolean;
  onSelect: (id: string | null) => void;
  isCompleted: boolean;
}

const DayCard = memo(function DayCard({ day, isSelected, isToday, isPast, onSelect, isCompleted }: DayCardProps) {
  const col = TYPE_COLORS[day.workoutType];
  const isWorkout = day.workoutType === 'push' || day.workoutType === 'pull' || day.workoutType === 'legs';
  
  const handleClick = useCallback(() => {
    onSelect(isSelected ? null : day.id);
  }, [isSelected, day.id, onSelect]);
  
  const datePart = day.displayDate.split(' ')[1] || day.displayDate;
  const TypeIcon = typeIconMap[day.workoutType];
  
  if (day.isBeforeStart) {
    return (
      <div className="day-card empty" style={{ opacity: 0.2, pointerEvents: 'none' }}>
        <div className="day-icon">
          <Minus size={12} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="day-name" style={{ color: 'var(--text-muted)' }}>
          {day.displayDate.split(' ')[0]}
        </div>
        <div className="day-date" style={{ color: 'var(--text-muted)' }}>{datePart}</div>
        <div className="day-dot" style={{ visibility: 'hidden' }} />
      </div>
    );
  }
  
  return (
    <button
      className={`day-card ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={handleClick}
      style={{
        '--day-color': col,
        borderColor: isSelected ? col : isToday ? `${col}90` : isWorkout ? `${col}35` : 'var(--border-subtle)',
        background: isSelected ? `${col}28` : isToday ? `${col}18` : isPast ? '#0a1020' : isWorkout ? `${col}0c` : 'var(--bg-secondary)',
      } as React.CSSProperties}
    >
      {isToday && <div className="today-indicator" style={{ background: col, boxShadow: `0 0 6px ${col}` }} />}
      {isCompleted && <div className="completed-check"><Check size={10} strokeWidth={3} /></div>}
      <div className="day-icon">
        {TypeIcon && <TypeIcon size={16} style={{ color: isSelected || isToday ? col : `${col}99` }} />}
      </div>
      <div className="day-name" style={{ color: isSelected || isToday ? col : `${col}99` }}>
        {day.displayDate.split(' ')[0]}
      </div>
      <div className="day-date">{datePart}</div>
      <div
        className="day-dot"
        style={{
          background: isPast ? `${col}50` : col,
          boxShadow: isPast ? 'none' : `0 0 4px ${col}`,
          visibility: isWorkout ? 'visible' : 'hidden',
        }}
      />
    </button>
  );
});

export default DayCard;
