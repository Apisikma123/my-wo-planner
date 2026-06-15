import React, { useEffect, useReducer } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import './WorkoutSessionScreen.css';
import { initialWorkoutState, workoutReducer } from '../hooks/useWorkoutSession';

export const WorkoutSessionScreen: React.FC = () => {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);

  // ATURAN 1: Mencegah scroll pada body saat mode Full Screen aktif
  // Tidak menggunakan Modal, melainkan container fixed 100vw 100vh
  useEffect(() => {
    if (state.status !== 'idle' && state.status !== 'selesai') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [state.status]);

  // Demo: Mulai Latihan otomatis untuk memicu flow (biasanya ini dari tombol luar)
  useEffect(() => {
    if (state.status === 'idle') {
      dispatch({ type: 'MULAI_LATIHAN' });
    }
  }, [state.status]);

  // ATURAN 3: Jeda 10 Detik Bersiap (Countdown State)
  useEffect(() => {
    if (state.status === 'Mulai' && state.isPreparing) {
      if (state.prepTimeLeft > 0) {
        const timerId = setTimeout(() => {
          dispatch({ type: 'TICK_PREP' });
        }, 1000);
        return () => clearTimeout(timerId);
      } else {
        // JIKA isPreparing sudah selesai (0 detik), BARU ubah isPreparing = false
        dispatch({ type: 'SELESAI_PREP' });
      }
    }
  }, [state.status, state.isPreparing, state.prepTimeLeft]);

  // Timer Utama Latihan (berjalan HANYA setelah isPreparing = false)
  useEffect(() => {
    if (state.status === 'Mulai' && !state.isPreparing && state.isTimerBased) {
      if (state.exerciseTimeLeft > 0) {
        const timerId = setTimeout(() => {
          dispatch({ type: 'TICK_ACTIVE' });
        }, 1000);
        return () => clearTimeout(timerId);
      }
    }
  }, [state.status, state.isPreparing, state.exerciseTimeLeft, state.isTimerBased]);

  if (state.status === 'idle' || state.status === 'selesai') {
    return null; // Jangan render jika belum mulai atau sudah selesai
  }

  // ATURAN 1: WAJIB FULL SCREEN
  return (
    <div className="workout-strict-fullscreen">
      <div className="workout-content">
        
        {/* ATURAN 3: Tampilkan angka countdown besar di layar saat isPreparing */}
        {state.isPreparing ? (
          <div className="preparation-view">
            <h2>Bersiap...</h2>
            <div className="huge-countdown">{state.prepTimeLeft}</div>
          </div>
        ) : (
          <div className="active-view">
            <h2>Set {state.currentSetIndex} - Rep {state.currentRep}</h2>
            {state.isTimerBased && (
              <div className="main-timer">{state.exerciseTimeLeft}</div>
            )}
            {/* Animasi/Instruksi Gerakan Latihan bisa ditambahkan di sini */}
          </div>
        )}
      </div>

      {/* ATURAN 4: Tombol Selesai di posisi paling bawah layar HP (fixed/sticky) */}
      <div className="workout-bottom-controls">
        
        {/* ATURAN 2: Tombol Kembali ke Set/Reps Sebelumnya */}
        <button 
          className="btn-kembali-set" 
          onClick={() => dispatch({ type: 'KEMBALI_KE_SET_SEBELUMNYA' })}
          disabled={state.currentSetIndex <= 1}
        >
          <RotateCcw size={20} />
          <span>Kembali ke Set Sebelumnya</span>
        </button>

        {/* ATURAN 4: KONTROL MOBILE (Tombol Selesai) */}
        <button 
          className="btn-selesai-latihan" 
          onClick={() => dispatch({ type: 'SELESAI_LATIHAN' })}
        >
          <Check size={20} />
          <span>Selesai Latihan</span>
        </button>
      </div>
    </div>
  );
};
