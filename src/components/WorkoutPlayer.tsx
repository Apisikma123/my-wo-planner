import React, { useState, useEffect, useRef } from 'react';
import { Exercise, WorkoutDay } from '../types';
import { 
  X, Trophy, Dna, AlertTriangle, Play, Pause, 
  Check, Flag, ArrowRight, SkipForward,
  PersonStanding, Zap, Activity, Anchor, Dumbbell, RotateCcw
} from 'lucide-react';
import './WorkoutPlayer.css';

interface WorkoutPlayerProps {
  day: WorkoutDay;
  exercises?: Exercise[];
  onClose: () => void;
  onComplete: () => void;
}

export default function WorkoutPlayer({ day, exercises: propExercises, onClose, onComplete }: WorkoutPlayerProps) {
  const exercises = propExercises || day.exercises;
  
  // Retrieve saved session synchronously on initialization to prevent flashing
  const getSavedSession = () => {
    try {
      const saved = localStorage.getItem(`hgh_workout_session_${day.isoDate}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved workout progress', e);
    }
    return null;
  };

  const savedSession = getSavedSession();
  
  const [currentIdx, setCurrentIdx] = useState<number>(() => savedSession?.currentIdx ?? 0);
  const [currentSet, setCurrentSet] = useState<number>(() => savedSession?.currentSet ?? 1);
  const [isResting, setIsResting] = useState<boolean>(() => savedSession?.isResting ?? false);
  const [restDuration, setRestDuration] = useState<number>(() => savedSession?.restDuration ?? 60);
  const [timeRemaining, setTimeRemaining] = useState<number>(() => savedSession?.timeRemaining ?? 0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState<boolean>(false);
  
  // Custom timer for timed exercises (e.g. Warm-up, Dead hang, Cool-down)
  const [exerciseTimer, setExerciseTimer] = useState<number | null>(() => {
    if (typeof savedSession?.exerciseTimer !== 'undefined') return savedSession.exerciseTimer;
    return null;
  });
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(() => savedSession?.isTimerPaused ?? false);

  // Aturan 3: Jeda 10 Detik Bersiap (Hanya saat baru mulai, tidak dari saved session)
  const [isPreparing, setIsPreparing] = useState<boolean>(() => !savedSession);
  const [prepTimeLeft, setPrepTimeLeft] = useState<number>(10);
  
  const intervalRef = useRef<any>(null);
  const beepedSeconds = useRef<Record<number, boolean>>({});
  const isFirstRender = useRef(true);

  const currentExercise: Exercise | undefined = exercises[currentIdx];
  const isLastExercise = currentIdx === exercises.length - 1;
  const totalSets = currentExercise ? currentExercise.sets : 1;
  
  // Auto-save session progress on changes
  useEffect(() => {
    if (isFinished) {
      localStorage.removeItem(`hgh_workout_session_${day.isoDate}`);
    } else {
      const session = {
        currentIdx,
        currentSet,
        isResting,
        restDuration,
        timeRemaining,
        exerciseTimer,
        isTimerPaused,
      };
      localStorage.setItem(`hgh_workout_session_${day.isoDate}`, JSON.stringify(session));
    }
  }, [currentIdx, currentSet, isResting, restDuration, timeRemaining, exerciseTimer, isTimerPaused, isFinished, day.isoDate]);

  // Synthesize premium synth beeps for countdown
  const playBeep = (frequency = 880, duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('AudioContext blocked or unsupported:', e);
    }
  };

  // Determine dynamic rest time based on exercise category and intensity
  const getRestTime = (ex: Exercise): number => {
    if (ex.category === 'compound') return 90;
    if (ex.category === 'isolation') return 60;
    if (ex.category === 'conditioning') return 60;
    if (ex.category === 'hiit') return 45;
    return 30; // default/mobility
  };

  // Initialize or update timers for timed exercises
  useEffect(() => {
    if (!currentExercise || isResting || isFinished) return;
    
    // If we just mounted and restored a saved session for the current index, do NOT overwrite it!
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (savedSession && savedSession.currentIdx === currentIdx) {
        return; // Retain restored values
      }
    }
    
    // Parse duration if it is a timed exercise
    let durationSec: number | null = null;
    if (typeof currentExercise.reps === 'string' && currentExercise.reps.includes('dtk')) {
      const match = currentExercise.reps.match(/(\d+)/);
      if (match) durationSec = parseInt(match[1], 10);
    } else if (typeof currentExercise.reps === 'string' && currentExercise.reps.includes('mnt')) {
      const match = currentExercise.reps.match(/(\d+)/);
      if (match) durationSec = parseInt(match[1], 10) * 60;
    } else if (currentExercise.name.toLowerCase().includes('warm-up')) {
      durationSec = 7 * 60; // 7 mins warm up default
    } else if (currentExercise.name.toLowerCase().includes('cool-down')) {
      durationSec = 5 * 60; // 5 mins cool down default
    }
    
    if (durationSec) {
      setExerciseTimer(durationSec);
      setIsTimerPaused(false);
      
      // Jeda 10 detik persiapan setiap kali latihan berbasis waktu (pemanasan/pendinginan) dimulai
      setIsPreparing(true);
      setPrepTimeLeft(10);
    } else {
      setExerciseTimer(null);
    }
  }, [currentIdx, isResting, isFinished]);

  // Workout state timer loop
  useEffect(() => {
    // Clear any active interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    beepedSeconds.current = {};

    intervalRef.current = setInterval(() => {
      if (showCloseConfirm) return; // Pause timer when confirmation modal is visible
      
      // Aturan 3: Countdown Bersiap 10 Detik
      if (isPreparing) {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            playBeep(1200, 0.5); // Bunyi panjang saat mulai
            setIsPreparing(false);
            return 0;
          }
          if (prev <= 4) {
            playBeep(880, 0.1); // Bunyi beep 3, 2, 1
          }
          return prev - 1;
        });
        return;
      }

      if (isResting) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsResting(false);
            // Go to next set or next exercise
            handleRestCompleted();
            return 0;
          }

          const nextTime = prev - 1;
          // Play countdown alerts at 3, 2, 1, 0 seconds
          if (nextTime <= 3 && !beepedSeconds.current[nextTime]) {
            beepedSeconds.current[nextTime] = true;
            if (nextTime > 0) {
              playBeep(880, 0.1); // High pitch beep
            }
          }
          return nextTime;
        });
      } else if (exerciseTimer !== null && !isTimerPaused) {
        setExerciseTimer((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            playBeep(1200, 0.35); // Long beep to alert timed exercise finished
            handleDone();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isResting, exerciseTimer, isTimerPaused, currentIdx, currentSet, showCloseConfirm, isPreparing]);

  const handleDone = () => {
    if (!currentExercise) return;

    // Check if there are sets left
    if (currentSet < totalSets) {
      // Transition to REST between sets
      const rest = getRestTime(currentExercise);
      setRestDuration(rest);
      setTimeRemaining(rest);
      setIsResting(true);
      playBeep(600, 0.2); // Medium warning tone for resting state transition
    } else {
      // All sets done for this exercise.
      if (isLastExercise) {
        setIsFinished(true);
        playBeep(1000, 0.5);
      } else {
        // Transition to REST before next exercise
        const rest = getRestTime(currentExercise);
        setRestDuration(rest);
        setTimeRemaining(rest);
        setIsResting(true);
        playBeep(600, 0.2);
      }
    }
  };

  const handleRestCompleted = () => {
    playBeep(1200, 0.35); // Start work tone
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
    } else {
      // Proceed to next exercise
      setCurrentIdx((prev) => prev + 1);
      setCurrentSet(1);
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    handleRestCompleted();
  };

  const getExerciseIcon = (category: string) => {
    if (category === 'mobility') return <PersonStanding size={48} />;
    if (category === 'hiit') return <Zap size={48} />;
    if (category === 'conditioning') return <Activity size={48} />;
    if (category === 'recovery') return <Anchor size={48} />;
    return <Dumbbell size={48} />;
  };

  // Aturan 2: Tombol Kembali ke Set/Reps Sebelumnya
  const handleRewind = () => {
    if (isResting) {
      setIsResting(false);
      // Reset timer exercise to full
      setIsTimerPaused(true);
      setTimeout(() => setIsTimerPaused(false), 100);
      return;
    }
    
    if (currentSet > 1) {
      setCurrentSet(currentSet - 1);
    } else if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      const prevEx = exercises[currentIdx - 1];
      setCurrentSet(prevEx ? prevEx.sets : 1);
    }
    
    // Reset timer
    if (exerciseTimer !== null) {
      setIsTimerPaused(true);
      setTimeout(() => setIsTimerPaused(false), 100);
    }
  };

  // Nasal breathing biohacking tips for growth hormone stimulus
  const breathingTips = [
    "Bernafas dalam melalui HIDUNG mengaktifkan Nitric Oxide untuk melebarkan pembuluh darah.",
    "Nasal Breathing (nafas hidung) membantu menyeimbangkan hormon stres kortisol agar HGH diproduksi maksimal.",
    "Fokus pada hembusan nafas lambat untuk memicu pemulihan detak jantung lebih cepat.",
    "Gunakan metode pernapasan 4-7-8 untuk menenangkan sistem saraf pusat di antara set berat."
  ];

  const currentTip = breathingTips[currentIdx % breathingTips.length];

  if (isFinished) {
    return (
      <div className="workout-player-overlay">
        <div className="workout-player-card scale-in finished-card">
          <div className="trophy-icon"><Trophy size={64} strokeWidth={1.5} /></div>
          <h2 className="finished-title">WORKOUT SELESAI!</h2>
          <p className="finished-subtitle">Tubuh Anda telah dirangsang untuk melepas HGH alami & meningkatkan durability fisik.</p>
          
          <div className="finished-stats">
            <div className="finished-stat">
              <span className="stat-num">{exercises.length}</span>
              <span className="stat-lbl">Latihan</span>
            </div>
            <div className="finished-stat">
              <span className="stat-num">{exercises.reduce((sum, ex) => sum + ex.sets, 0)}</span>
              <span className="stat-lbl">Total Set</span>
            </div>
            <div className="finished-stat">
              <span className="stat-num" style={{ color: '#22c55e' }}>EXTREME</span>
              <span className="stat-lbl">HGH Stimulus</span>
            </div>
          </div>

          <button className="finished-close-btn" onClick={() => {
            onComplete();
            onClose();
          }}>
            SIMPAN & SELESAI
          </button>
        </div>
      </div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="workout-player-overlay">
      <div className="workout-player-card scale-in">
        {showCloseConfirm && (
          <div className="player-confirm-overlay">
            <div className="player-confirm-modal scale-in">
              <div className="confirm-icon"><AlertTriangle size={36} strokeWidth={1.5} /></div>
              <h3 className="confirm-title">Batalkan Latihan?</h3>
              <p className="confirm-text">
                Apakah Anda yakin ingin keluar dari latihan ini? Progres latihan Anda telah disimpan secara otomatis dan dapat dilanjutkan kapan saja.
              </p>
              <div className="confirm-actions">
                <button 
                  className="confirm-btn-primary" 
                  onClick={() => setShowCloseConfirm(false)}
                >
                  Tetap Latihan
                </button>
                <button 
                  className="confirm-btn-danger" 
                  onClick={onClose}
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Navbar */}
        <div className="player-header">
          <button className="player-back" onClick={() => setShowCloseConfirm(true)}>
            <X size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Batal
          </button>
          <div className="player-progress">
            Latihan {currentIdx + 1} dari {exercises.length}
          </div>
          <span className={`player-phase-tag ${day.phase}`}>
            {day.phase.toUpperCase()}
          </span>
        </div>

        {/* REST OVERLAY SCREEN */}
        {isResting ? (
          <div className="player-rest-screen fade-in">
            <div className="rest-timer-glow" style={{ animationDuration: `${restDuration}s` }} />
            <div className="rest-header">
              <span className="rest-label">JEDA ISTIRAHAT</span>
              <h3 className="next-exercise-label">
                Selanjutnya: Set {currentSet < totalSets ? currentSet + 1 : 1} - {currentSet < totalSets ? currentExercise.name : exercises[currentIdx + 1]?.name}
              </h3>
            </div>

            {/* Pulsing Nasal Breathing Guidance */}
            <div className="breathing-circle-container">
              <div className="breathing-circle-pulse" />
              <div className="breathing-circle">
                <span className="timer-seconds">{timeRemaining}</span>
                <span className="timer-label">detik</span>
              </div>
            </div>

            <div className="breathing-guide-text">
              <span className="breath-instruction">Tarik Nafas (Hidung) 4 dtk · Buang (Hidung) 6 dtk</span>
            </div>

            <div className="rest-tip-card">
              <div className="tip-icon"><Dna size={20} /></div>
              <div className="tip-content">
                <div className="tip-title">HGH OPTIMIZATION TIP</div>
                <p className="tip-desc">{currentTip}</p>
              </div>
            </div>

            <button className="skip-rest-btn" onClick={handleSkipRest}>
              LEWATI ISTIRAHAT <SkipForward size={14} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
            </button>
          </div>
        ) : isPreparing ? (
          /* PREPARATION VIEW */
          <div className="player-rest-screen fade-in" style={{ justifyContent: 'center' }}>
             <h2 style={{ fontSize: '32px', color: '#fff', marginBottom: '20px' }}>BERSIAP...</h2>
             <div className="breathing-circle-container" style={{ transform: 'scale(1.5)', margin: '40px 0' }}>
               <div className="breathing-circle-pulse" />
               <div className="breathing-circle" style={{ borderColor: '#ff3e3e' }}>
                 <span className="timer-seconds" style={{ color: '#ff3e3e', fontSize: '64px' }}>{prepTimeLeft}</span>
               </div>
             </div>
             <p style={{ color: '#ccff00', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
               {currentExercise.name}
             </p>
             <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '80%', lineHeight: '1.5', textAlign: 'center' }}>
               {currentExercise.detail}
             </p>
          </div>
        ) : (
          /* ACTIVE EXERCISE VIEW */
          <div className="player-active-screen fade-in">
            <div className="exercise-media-placeholder">
              <div className="media-icon">{getExerciseIcon(currentExercise.category)}</div>
              <div className="media-glow" />
            </div>

            <div className="exercise-info">
              <span className="exercise-category">{currentExercise.category.toUpperCase()}</span>
              <h2 className="exercise-name">{currentExercise.name}</h2>
              <p className="exercise-detail">{currentExercise.detail}</p>
            </div>

            {/* Sets and Reps Tracker / Timer */}
            <div className="exercise-tracker-card">
              <div className="tracker-header">
                <div className="tracker-set">
                  Set <span className="highlight">{currentSet}</span> dari {totalSets}
                </div>
                <div className="tracker-intensity" style={{ borderColor: currentExercise.intensity > 70 ? '#ff3e3e40' : '#ccff0040' }}>
                  Intensitas: <span className="highlight" style={{ color: currentExercise.intensity > 70 ? '#ff3e3e' : '#ccff00' }}>{currentExercise.intensity}%</span>
                </div>
              </div>

              {/* Action / Countdown Container */}
              <div className="tracker-action-area">
                {exerciseTimer !== null ? (
                  <div className="timer-display">
                    <div className="timer-numbers">
                      {Math.floor(exerciseTimer / 60)}:
                      {String(exerciseTimer % 60).padStart(2, '0')}
                    </div>
                    <button 
                      className={`timer-control-btn ${isTimerPaused ? 'paused' : ''}`}
                      onClick={() => setIsTimerPaused(!isTimerPaused)}
                    >
                      {isTimerPaused ? (
                        <><Play size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> MULAI TIMER</>
                      ) : (
                        <><Pause size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> JEDA TIMER</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="rep-display">
                    <span className="rep-count">{currentExercise.reps}</span>
                    <span className="rep-label">Repetisi</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next / Complete Button & Rewind */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', zIndex: 10 }}>
              <button 
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#ccc', 
                  padding: '16px', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: (currentIdx === 0 && currentSet === 1) ? 0.3 : 1
                }} 
                onClick={handleRewind}
                disabled={currentIdx === 0 && currentSet === 1}
                title="Kembali ke Set Sebelumnya"
              >
                <RotateCcw size={20} />
              </button>
              
              <button className="complete-set-btn" style={{ flex: 1 }} onClick={handleDone}>
                {currentSet < totalSets ? (
                  <><Check size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> SELESAI SET INI</>
                ) : (isLastExercise ? (
                  <><Flag size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> SELESAIKAN LATIHAN</>
                ) : (
                  <><ArrowRight size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> SELESAI & LANJUT</>
                ))}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
