import { useState, useCallback, useEffect, useRef } from 'react';
import { useGrowth } from '../store/growthStore';
import { PLYO_TARGETS } from '../utils/constants';
import { Zap, Play, Square, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import './PlyoEnforcer.css';

type TimerType = 'hang' | 'core' | null;

export default function PlyoEnforcer() {
  const { todayPlyo, todayIso, dispatch } = useGrowth();

  const [hangMinutes, setHangMinutes] = useState(todayPlyo?.hangMinutes || 0);
  const [plyoMinutes, setPlyoMinutes] = useState(todayPlyo?.plyoMinutes || 0);
  const [coreMinutes, setCoreMinutes] = useState(todayPlyo?.coreMinutes || 0);
  
  const [expanded, setExpanded] = useState(!todayPlyo || (hangMinutes < PLYO_TARGETS.hangMinutes || plyoMinutes < PLYO_TARGETS.plyoMinutes || coreMinutes < PLYO_TARGETS.coreMinutes));

  // Timer state
  const [activeTimer, setActiveTimer] = useState<TimerType>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveTimer(null);
    setSecondsLeft(0);
  };

  const startTimer = (type: TimerType, durationSeconds: number) => {
    if (activeTimer) stopTimer();
    
    setActiveTimer(type);
    setSecondsLeft(durationSeconds);
    
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Timer finished
          if (type === 'hang') {
            setHangMinutes(m => m + (durationSeconds / 60));
          } else if (type === 'core') {
            setCoreMinutes(m => m + (durationSeconds / 60));
          }
          
          if (timerRef.current !== null) clearInterval(timerRef.current);
          setActiveTimer(null);
          // Auto-save on timer finish
          savePlyo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const savePlyo = useCallback(() => {
    // Add current timer value to total if stopped early? Not for now.
    dispatch({
      type: 'LOG_PLYO',
      log: {
        date: todayIso,
        hangMinutes,
        plyoMinutes,
        coreMinutes,
      }
    });
  }, [dispatch, todayIso, hangMinutes, plyoMinutes, coreMinutes]);

  const handleManualSave = () => {
    savePlyo();
    setExpanded(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const isHangComplete = hangMinutes >= PLYO_TARGETS.hangMinutes;
  const isPlyoComplete = plyoMinutes >= PLYO_TARGETS.plyoMinutes;
  const isCoreComplete = coreMinutes >= PLYO_TARGETS.coreMinutes;

  return (
    <div className="plyo-enforcer glass fade-in">
      <button className="plyo-header" onClick={() => setExpanded(!expanded)}>
        <div className="plyo-title-row">
          <span className="plyo-icon"><Zap size={16} /></span>
          <span className="plyo-title">BONE STIMULUS (PLYO)</span>
        </div>
        <div className="plyo-header-right">
          {isHangComplete && isPlyoComplete && isCoreComplete ? (
            <span className="plyo-status-badge complete">SELESAI ✅</span>
          ) : (
            <span className="plyo-status-badge pending">PENDING</span>
          )}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="plyo-body slide-up">
          <p className="plyo-intro">
            Micro-fracture pada tulang panjang saat siang/sore akan direrespon oleh HGH saat tidur menjadi tulang yang lebih panjang & padat (remodeling).
          </p>

          {/* 1. Decompression (Hang) */}
          <div className={`plyo-task ${isHangComplete ? 'complete' : ''}`}>
            <div className="task-header">
              <span className="task-num">1</span>
              <div className="task-info">
                <span className="task-name">Dekompresi (Dead Hang)</span>
                <span className="task-desc">Target: {PLYO_TARGETS.hangMinutes} Menit akumulasi</span>
              </div>
              <div className="task-progress">
                <span className="task-val">{hangMinutes}</span>
                <span className="task-target">/ {PLYO_TARGETS.hangMinutes} mnt</span>
              </div>
            </div>
            
            <div className="task-actions">
              {activeTimer === 'hang' ? (
                <div className="active-timer">
                  <span className="timer-display">{formatTime(secondsLeft)}</span>
                  <button className="timer-stop" onClick={stopTimer}><Square size={14} /> Stop</button>
                </div>
              ) : (
                <>
                  <button className="timer-start" onClick={() => startTimer('hang', 60)} disabled={isHangComplete}>
                    <Play size={12} /> Timer 60s
                  </button>
                  <button className="timer-start" onClick={() => startTimer('hang', 30)} disabled={isHangComplete}>
                    <Play size={12} /> Timer 30s
                  </button>
                </>
              )}
              {isHangComplete && <CheckCircle2 size={18} className="task-check" />}
            </div>
            <div className="task-progress-bar">
              <div className="tpb-fill" style={{ width: `${Math.min(100, (hangMinutes / PLYO_TARGETS.hangMinutes) * 100)}%`, background: isHangComplete ? '#22c55e' : '#a855f7' }} />
            </div>
          </div>

          {/* 2. Plyometric Shockwave */}
          <div className={`plyo-task ${isPlyoComplete ? 'complete' : ''}`}>
            <div className="task-header">
              <span className="task-num">2</span>
              <div className="task-info">
                <span className="task-name">Plyometric Shockwave</span>
                <span className="task-desc">Lompat tali / Jump Squats / Lari Sprint</span>
              </div>
              <div className="task-progress">
                <span className="task-val">{plyoMinutes}</span>
                <span className="task-target">/ {PLYO_TARGETS.plyoMinutes} mnt</span>
              </div>
            </div>
            
            <div className="task-slider-row">
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="5" 
                value={plyoMinutes} 
                onChange={(e) => setPlyoMinutes(parseInt(e.target.value))}
                className="task-slider"
                style={{
                  background: `linear-gradient(to right, ${isPlyoComplete ? '#22c55e' : '#f59e0b'} 0%, ${isPlyoComplete ? '#22c55e' : '#f59e0b'} ${(plyoMinutes / 30) * 100}%, rgba(255,255,255,0.1) ${(plyoMinutes / 30) * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              {isPlyoComplete && <CheckCircle2 size={18} className="task-check" />}
            </div>
          </div>

          {/* 3. Core Stability */}
          <div className={`plyo-task ${isCoreComplete ? 'complete' : ''}`}>
            <div className="task-header">
              <span className="task-num">3</span>
              <div className="task-info">
                <span className="task-name">Core Stability</span>
                <span className="task-desc">Plank / Hollow Body (Mencegah spinal slouch)</span>
              </div>
              <div className="task-progress">
                <span className="task-val">{coreMinutes}</span>
                <span className="task-target">/ {PLYO_TARGETS.coreMinutes} mnt</span>
              </div>
            </div>
            
            <div className="task-actions">
              {activeTimer === 'core' ? (
                <div className="active-timer">
                  <span className="timer-display">{formatTime(secondsLeft)}</span>
                  <button className="timer-stop" onClick={stopTimer}><Square size={14} /> Stop</button>
                </div>
              ) : (
                <>
                  <button className="timer-start" onClick={() => startTimer('core', 60)} disabled={isCoreComplete}>
                    <Play size={12} /> Timer 60s
                  </button>
                  <button className="timer-start" onClick={() => startTimer('core', 30)} disabled={isCoreComplete}>
                    <Play size={12} /> Timer 30s
                  </button>
                </>
              )}
              {isCoreComplete && <CheckCircle2 size={18} className="task-check" />}
            </div>
            <div className="task-progress-bar">
              <div className="tpb-fill" style={{ width: `${Math.min(100, (coreMinutes / PLYO_TARGETS.coreMinutes) * 100)}%`, background: isCoreComplete ? '#22c55e' : '#3b82f6' }} />
            </div>
          </div>

          {/* Save Button */}
          <button className="plyo-save-btn" onClick={handleManualSave}>
            SIMPAN PROGRESS PLYO
          </button>
        </div>
      )}
    </div>
  );
}
