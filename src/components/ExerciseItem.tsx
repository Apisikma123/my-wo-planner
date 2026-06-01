import React, { memo } from 'react';
import { Exercise, WorkoutType } from '../types';
import { TYPE_COLORS } from '../utils/constants';
import './ExerciseItem.css';

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  workoutType: WorkoutType;
}

const ExerciseItem = memo(function ExerciseItem({ exercise, index, workoutType }: ExerciseItemProps) {
  const col = TYPE_COLORS[workoutType];
  
  let bgClass = 'ex-default';
  if (exercise.isHgh) bgClass = 'ex-hgh';
  else if (exercise.isHang) bgClass = 'ex-hang';
  else if (exercise.isDurability) bgClass = 'ex-durability';
  else if (exercise.name.includes('Warm') || exercise.name.includes('Cool')) bgClass = 'ex-mobility';
  else if (exercise.name.includes('Full Total') || exercise.name.includes('Tidur')) bgClass = 'ex-sleep';
  
  return (
    <div className={`exercise-item ${bgClass}`} style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="exercise-number" style={{ background: `${col}18`, borderColor: `${col}35`, color: col }}>
        {index + 1}
      </div>
      <div className="exercise-content">
        <div className="exercise-name">{exercise.name}</div>
        <div className="exercise-detail">{exercise.detail}</div>
      </div>
      {exercise.category === 'compound' && (
        <div className="exercise-intensity" style={{ color: col }}>
          {exercise.intensity}%
        </div>
      )}
    </div>
  );
});

export default ExerciseItem;
