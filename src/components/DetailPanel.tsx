import { useCallback, useState, useEffect } from 'react';
import { WorkoutDay, Exercise } from '../types';
import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS, PHASE_COLORS, PHASE_LABELS } from '../utils/constants';
import { formatFullDate } from '../utils/dateUtils';
import { getHghTip } from '../engine/hghEngine';
import { getFatigueLabel, getFatigueColor } from '../engine/fatigueEngine';
import { getRecoveryLabel, getRecoveryColor } from '../engine/recoveryEngine';
import { useWorkoutEngine } from '../hooks/useWorkoutEngine';
import ExerciseItem from './ExerciseItem';
import DailyChecklist from './DailyChecklist';
import ReadinessGauge from './ReadinessGauge';
import RecoveryMeter from './RecoveryMeter';
import HghScoreCard from './HghScoreCard';
import WorkoutPlayer from './WorkoutPlayer';
import './DetailPanel.css';

// Dictionary of warm-up and cool-down movement instruction guides
const MOVEMENT_GUIDES: Record<string, string> = {
  'arm circles': 'Putar lengan perlahan melingkar ke depan dan belakang untuk melumasi sendi bahu.',
  'dynamic pec stretch': 'Buka lengan lebar ke samping secara dinamis, dorong dada ke depan untuk meregangkan otot dada.',
  'scapular push-ups': 'Posisi plank, gerakkan belikat naik dan turun tanpa menekuk siku untuk mengaktifkan scapula.',
  'inchworms': 'Bungkukkan badan, jalan dengan tangan ke posisi plank, lalu jalan dengan kaki merapat kembali.',
  'lompat tali pelan': 'Lompat tali dengan tempo santai untuk meningkatkan detak jantung & suhu tubuh.',
  'arm swings': 'Ayunkan lengan mendatar menyilang di depan dada secara bergantian.',
  'cat-cow stretch': 'Posisi merangkak, lengkungkan punggung ke atas (cat) dan ke bawah (cow) bergantian.',
  'spiderman stretch': 'Lunge panjang ke depan, letakkan tangan di lantai sebelah kaki depan, lalu putar dada & satu tangan ke atas.',
  'active dead hang': 'Bergantung di pullup bar dengan mengaktifkan otot bahu dan belikat (tidak pasif).',
  'hip circles': 'Berdiri tegak, putar pinggul melingkar lebar searah & berlawanan jarum jam.',
  'leg swings': 'Berpegangan, ayunkan kaki ke depan & belakang secara bebas untuk fleksibilitas panggul.',
  'deep bodyweight squats': 'Squat dalam dengan berat badan sendiri, tahan sejenak di bawah untuk membuka panggul.',
  'calf stretch': 'Letakkan satu kaki di belakang dengan tumit menempel lantai, dorong pinggul ke depan untuk meregang betis.',
  'chest opener': 'Tautkan kedua tangan di belakang punggung, di pundak ditarik ke belakang untuk meregang dada.',
  'shoulder cross-body': 'Tarik satu lengan menyilang di depan dada dengan tangan satunya untuk meregangkan bahu belakang.',
  'tricep stretch': 'Tekuk satu siku di belakang kepala, dorong siku ke bawah dengan tangan satunya.',
  'cat-cow': 'Posisi merangkak, gerakkan tulang belakang naik-turun perlahan untuk dekompresi.',
  'forward fold': 'Bungkukkan badan ke depan, biarkan tangan menggelantung bebas untuk melonggarkan hamstring.',
  'lat stretch': 'Berpegangan pada tiang, condongkan pinggul ke belakang untuk meregangkan otot latissimus.',
  'bicep wall stretch': 'Tempelkan telapak tangan pada dinding, lalu putar badan menjauhi dinding untuk meregangkan bisep.',
  'thoracic rotation': 'Posisi merangkak, letakkan tangan di belakang kepala, putar siku ke atas menghadap langit-langit.',
  'child\'s pose': 'Duduk di atas tumit, selonjorkan tangan ke depan di lantai, dan rilekskan dahi ke lantai.',
  'hip flexor': 'Lunge berlutut, dorong panggul ke depan untuk meregangkan otot bagian depan paha & panggul.',
  'hamstring': 'Duduk dengan satu kaki lurus, raih jari kaki untuk meregangkan hamstring belakang.',
  'pigeon pose': 'Tekuk satu kaki di depan secara melintang, luruskan kaki satunya ke belakang, rebahkan badan ke depan.'
};

const getMovementInstruction = (name: string): string => {
  const cleanName = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(MOVEMENT_GUIDES)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return value;
    }
  }
  return 'Lakukan gerakan peregangan secara perlahan dengan fokus pernapasan hidung.';
};

// Helper to parse compound Warm-up detail string into individual Exercise objects
const expandWarmUp = (warmUpExercise: Exercise): Exercise[] => {
  const parts = warmUpExercise.detail.split('—');
  if (parts.length < 2) return [warmUpExercise];
  
  const movements = parts[1].split(',').map(m => m.trim());
  return movements.map((moveStr, index) => {
    // Matches patterns like "Arm Circles 15s" or "Lompat Tali Pelan 2 mnt"
    const match = moveStr.match(/(.+?)\s+(\d+(?:-\d+)?\s*(?:s|dtk|rep|mnt|\/sisi).*)$/i);
    
    let name = moveStr;
    let reps = '1 set';
    
    if (match) {
      name = match[1].trim();
      reps = match[2].trim();
    }
    
    // Normalize time units to standard 'dtk' (seconds) for WorkoutPlayer parsing
    if (reps.toLowerCase().endsWith('s')) {
      reps = reps.replace(/s$/i, ' dtk');
    }
    
    const instruction = getMovementInstruction(name);
    
    return {
      id: `${warmUpExercise.id}-step-${index}`,
      name: name,
      detail: `Cara: ${instruction} (${reps})`,
      sets: 1,
      reps: reps,
      intensity: 30,
      category: 'mobility',
      recoveryCost: 0,
      isHgh: false,
      isHang: false,
      isDurability: false
    };
  });
};

// Helper to parse compound Cool-down detail string into individual Exercise objects
const expandCoolDown = (coolDownExercise: Exercise): Exercise[] => {
  const parts = coolDownExercise.detail.split('—');
  if (parts.length < 2) return [coolDownExercise];
  
  const movements = parts[1].split(',').map(m => m.trim());
  return movements.map((moveStr, index) => {
    // Try to match specific timing if exists, else assign default 60s
    const match = moveStr.match(/(.+?)\s+(\d+(?:-\d+)?\s*(?:s|dtk|rep|mnt|\/sisi).*)$/i);
    
    let name = moveStr;
    let reps = '60 dtk';
    
    if (match) {
      name = match[1].trim();
      reps = match[2].trim();
    } else {
      const specialMatch = moveStr.match(/(.+?)\s+(\d+\s*(?:dtk|s|rep)?\/sisi.*)$/i);
      if (specialMatch) {
        name = specialMatch[1].trim();
        reps = specialMatch[2].trim();
      }
    }
    
    if (reps.toLowerCase().endsWith('s')) {
      reps = reps.replace(/s$/i, ' dtk');
    }
    
    const instruction = getMovementInstruction(name);
    
    return {
      id: `${coolDownExercise.id}-step-${index}`,
      name: name,
      detail: `Cara: ${instruction} (${reps})`,
      sets: 1,
      reps: reps,
      intensity: 20,
      category: 'mobility',
      recoveryCost: 0,
      isHgh: false,
      isHang: false,
      isDurability: false
    };
  });
};

interface DetailPanelProps {
  day: WorkoutDay;
  onClose: () => void;
}

export default function DetailPanel({ day, onClose }: DetailPanelProps) {
  const { toggleComplete, completedDays } = useWorkoutEngine();
  const [isPlaying, setIsPlaying] = useState(false);
  const savedSessionKey = `hgh_workout_session_${day.isoDate}`;
  const [hasSavedSession, setHasSavedSession] = useState(false);

  // Sync saved session status when panel is open or playing state changes
  useEffect(() => {
    setHasSavedSession(!!localStorage.getItem(savedSessionKey));
  }, [day.isoDate, isPlaying, savedSessionKey]);

  const col = TYPE_COLORS[day.workoutType];
  const isWorkout = day.workoutType === 'push' || day.workoutType === 'pull' || day.workoutType === 'legs';
  const isCompleted = completedDays.includes(day.isoDate);
  const fullDate = formatFullDate(new Date(day.isoDate + 'T00:00:00'));
  const hghTip = getHghTip(day.phase, day.workoutType);
  const fatigueColor = getFatigueColor(day.fatigueLevel);
  const fatigueLabel = getFatigueLabel(day.fatigueLevel);
  const recoveryColor = getRecoveryColor(day.recoveryScore);
  const recoveryLabel = getRecoveryLabel(day.recoveryScore);
  const phaseColor = PHASE_COLORS[day.phase];

  const handleComplete = useCallback(() => {
    toggleComplete(day.id);
  }, [toggleComplete, day.id]);

  // Find raw Warm-Up & Cool-Down entries from the workout day exercises
  const rawWarmUp = day.exercises.find(ex => ex.name.toLowerCase().includes('warm-up') || ex.category === 'mobility' && ex.id === 'warm-up');
  const rawCoolDown = day.exercises.find(ex => ex.name.toLowerCase().includes('cool-down'));

  // Expand them dynamically into arrays of separate exercises
  const expandedWarmUps = rawWarmUp ? expandWarmUp(rawWarmUp) : [];
  const expandedCoolDowns = rawCoolDown ? expandCoolDown(rawCoolDown) : [];
  
  // Main routine exercises
  const mainExercises = day.exercises.filter(ex => !ex.name.toLowerCase().includes('warm-up') && !ex.name.toLowerCase().includes('cool-down'));

  // consolidated array passed to WorkoutPlayer
  const playableExercises = [
    ...expandedWarmUps,
    ...mainExercises,
    ...expandedCoolDowns
  ];

  // Calculate high-level metrics
  const getWorkoutDuration = () => {
    if (day.workoutType === 'legs') return '45 Mnt';
    if (day.workoutType === 'push' || day.workoutType === 'pull') return '40 Mnt';
    return '15 Mnt';
  };

  const getEstimatedCalories = () => {
    if (day.workoutType === 'legs') return '480 kkal';
    if (day.workoutType === 'push' || day.workoutType === 'pull') return '380 kkal';
    return '90 kkal';
  };

  const getDifficultyLevel = () => {
    if (day.phase === 'peak') return 'EXTREME';
    if (day.phase === 'overload') return 'TINGGI';
    if (day.phase === 'adaptation') return 'SEDANG';
    return 'RINGAN';
  };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel scale-in" onClick={e => e.stopPropagation()}>
        <div className="detail-drag-handle" />
        {/* Close button */}
        <button className="detail-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Hero Cover Image Section */}
        <div 
          className="detail-hero-cover"
          style={{
            background: `linear-gradient(180deg, rgba(8, 12, 20, 0.4) 0%, #080c14 100%), linear-gradient(135deg, ${col}60 0%, #000 100%)`,
          }}
        >
          <div className="detail-hero-content">
            <span className="detail-hero-tag" style={{ background: `${col}20`, color: col, borderColor: `${col}40` }}>
              {TYPE_ICONS[day.workoutType]} {TYPE_LABELS[day.workoutType]}
            </span>
            <h1 className="detail-hero-title">
              {day.workoutType === 'push' ? 'Upper Body Push Booster' : day.workoutType === 'pull' ? 'Back & Biceps HGH Pull' : day.workoutType === 'legs' ? 'Legs & Durability Plyo' : 'Active Recovery Session'}
            </h1>
            <div className="detail-hero-meta">
              <span>MC{day.mesocycle} · W{day.phaseWeek}</span>
              <span className="phase-badge" style={{ color: phaseColor }}>{PHASE_LABELS[day.phase]}</span>
            </div>
          </div>
        </div>

        {/* High-Level Labeled Metrics */}
        {isWorkout && (
          <div className="detail-metrics-grid">
            <div className="metric-item">
              <span className="metric-icon">⏱️</span>
              <div className="metric-info">
                <span className="metric-lbl">DURASI</span>
                <span className="metric-val">{getWorkoutDuration()}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon">🔥</span>
              <div className="metric-info">
                <span className="metric-lbl">EST. KALORI</span>
                <span className="metric-val">{getEstimatedCalories()}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon">💪</span>
              <div className="metric-info">
                <span className="metric-lbl">KESULITAN</span>
                <span className="metric-val" style={{ color: day.phase === 'peak' ? '#ff3e3e' : '#fff' }}>{getDifficultyLevel()}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon">🧬</span>
              <div className="metric-info">
                <span className="metric-lbl">HGH STIMULUS</span>
                <span className="metric-val" style={{ color: '#ccff00' }}>EXTREME</span>
              </div>
            </div>
          </div>
        )}

        <div className="detail-body-scrollable">
          {/* Header Metadata Info */}
          <div className="detail-info-strip">
            <div className="detail-date">{fullDate}</div>
            <span className="detail-week-tag">WEEK {day.weekIndex}</span>
          </div>

          {/* Scores Row */}
          {isWorkout && (
            <div className="detail-scores">
              <ReadinessGauge fatigue={day.fatigueLevel} recovery={day.recoveryScore} />
              <div className="detail-meters">
                <RecoveryMeter value={day.recoveryScore} label={recoveryLabel} color={recoveryColor} title="RECOVERY" />
                <RecoveryMeter value={day.fatigueLevel} label={fatigueLabel} color={fatigueColor} title="FATIGUE" />
              </div>
            </div>
          )}

          {/* HGH Score Card */}
          {isWorkout && (
            <HghScoreCard score={day.hghScore} tip={hghTip} exercises={day.exercises} />
          )}

          {/* Warm-Up Section */}
          {isWorkout && expandedWarmUps.length > 0 && (
            <div className="detail-section warm-up-section">
              <div className="detail-section-title">
                <span>⚡ 1. PEMANASAN DINAMIS (WARM-UP)</span>
                <span className="mandatory-tag">WAJIB</span>
              </div>
              <p className="section-subtitle">Disesuaikan khusus untuk mempersiapkan otot yang akan dilatih hari ini.</p>
              
              <div className="detail-exercise-list">
                {expandedWarmUps.map((ex, i) => (
                  <ExerciseItem
                    key={ex.id}
                    exercise={ex}
                    index={i}
                    workoutType={day.workoutType}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main Workout Routine Timeline */}
          <div className="detail-section">
            <div className="detail-section-title">
              <span>{isWorkout ? '🏋️ 2. RUTINITAS UTAMA' : '📋 PROGRAM HARI INI'}</span>
            </div>
            <div className="detail-exercise-list">
              {(isWorkout ? mainExercises : day.exercises).map((ex, i) => (
                <ExerciseItem
                  key={ex.id}
                  exercise={ex}
                  index={i + (isWorkout ? expandedWarmUps.length : 0)}
                  workoutType={day.workoutType}
                />
              ))}
            </div>
          </div>

          {/* Cool-Down Section */}
          {isWorkout && expandedCoolDowns.length > 0 && (
            <div className="detail-section cool-down-section">
              <div className="detail-section-title">
                <span>🧘 3. PENDINGINAN (COOL-DOWN)</span>
              </div>
              <div className="detail-exercise-list">
                {expandedCoolDowns.map((ex, i) => (
                  <ExerciseItem
                    key={ex.id}
                    exercise={ex}
                    index={i + expandedWarmUps.length + mainExercises.length}
                    workoutType={day.workoutType}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Daily Checklist */}
          <DailyChecklist isoDate={day.isoDate} workoutType={day.workoutType} />

          {/* HGH Tip */}
          <div className="detail-tip">
            <div className="detail-tip-label">💡 HGH TIP</div>
            <div className="detail-tip-text">{hghTip}</div>
          </div>
        </div>

        {/* Sticky Action Buttons */}
        <div className="detail-actions-footer">
          {isWorkout && (
            hasSavedSession ? (
              <div className="resume-workout-actions">
                <button
                  className="start-workout-btn resume-btn"
                  onClick={() => setIsPlaying(true)}
                >
                  🚀 LANJUTKAN LATIHAN
                </button>
                <button
                  className="reset-workout-btn"
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mengulang latihan dari awal?')) {
                      localStorage.removeItem(savedSessionKey);
                      setHasSavedSession(false);
                    }
                  }}
                  title="Mulai Ulang dari Awal"
                >
                  🔄 Ulang Baru
                </button>
              </div>
            ) : (
              <button
                className="start-workout-btn"
                onClick={() => setIsPlaying(true)}
              >
                🚀 MULAI LATIHAN SEKARANG
              </button>
            )
          )}

          <button
            className={`detail-complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleComplete}
            style={{
              background: isCompleted ? 'rgba(34, 197, 94, 0.15)' : `${col}20`,
              borderColor: isCompleted ? 'rgba(34, 197, 94, 0.5)' : `${col}60`,
              color: isCompleted ? '#22c55e' : col,
            }}
          >
            {isCompleted ? '✓ TANDAI BELUM SELESAI' : '✓ TANDAI SELESAI MANUAL'}
          </button>
        </div>

        {/* Active Workout Player Modal Overlay */}
        {isPlaying && (
          <WorkoutPlayer 
            day={day} 
            exercises={playableExercises}
            onClose={() => setIsPlaying(false)} 
            onComplete={() => {
              if (!isCompleted) {
                handleComplete();
              }
              setIsPlaying(false);
            }} 
          />
        )}
      </div>
    </div>
  );
}
