import { useState, useCallback } from 'react';
import { useGrowth } from '../store/growthStore';
import { evaluateSleepQuality, isBedtimeOptimal, getSleepLabel, getSleepColor, getSleepTips, calculateSWSWindow } from '../engine/sleepEngine';
import { Moon, Clock, Eye, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import './SleepLogger.css';

export default function SleepLogger() {
  const { todaySleep, todayIso, dispatch } = useGrowth();

  const [bedtime, setBedtime] = useState(todaySleep?.bedtime || '22:30');
  const [duration, setDuration] = useState(todaySleep?.duration || 9);
  const [darkRoom, setDarkRoom] = useState(todaySleep?.darkRoom ?? true);
  const [expanded, setExpanded] = useState(!todaySleep);

  const score = evaluateSleepQuality({ date: todayIso, bedtime, duration, darkRoom, score: 0 });
  const sleepLabel = getSleepLabel(score);
  const sleepColor = getSleepColor(score);
  const isOptimalBedtime = isBedtimeOptimal(bedtime);
  const swsWindow = calculateSWSWindow(bedtime, duration);
  const tips = getSleepTips({ date: todayIso, bedtime, duration, darkRoom, score });

  const handleSave = useCallback(() => {
    dispatch({
      type: 'LOG_SLEEP',
      log: { date: todayIso, bedtime, duration, darkRoom, score: 0 },
    });
    setExpanded(false);
  }, [dispatch, todayIso, bedtime, duration, darkRoom]);

  return (
    <div className="sleep-logger glass fade-in">
      <button className="sleep-header" onClick={() => setExpanded(!expanded)}>
        <div className="sleep-title-row">
          <span className="sleep-icon"><Moon size={16} /></span>
          <span className="sleep-title">SLEEP & HGH SYNC</span>
        </div>
        <div className="sleep-header-right">
          {todaySleep && (
            <span className="sleep-score-badge" style={{ color: sleepColor, borderColor: `${sleepColor}40` }}>
              {todaySleep.score}
            </span>
          )}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="sleep-body slide-up">
          {/* Live Score Preview */}
          <div className="sleep-score-preview" style={{ borderColor: `${sleepColor}30` }}>
            <div className="score-number" style={{ color: sleepColor }}>{score}</div>
            <div className="score-label" style={{ color: `${sleepColor}cc` }}>{sleepLabel}</div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${sleepColor}60, ${sleepColor})` }} />
            </div>
          </div>

          {/* Bedtime Input */}
          <div className="sleep-field">
            <label className="field-label">
              <Clock size={13} /> Jam Tidur (Tadi Malam)
            </label>
            <div className="bedtime-row">
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="time-input"
              />
              <span className={`bedtime-status ${isOptimalBedtime ? 'optimal' : 'late'}`}>
                {isOptimalBedtime ? '✅ Optimal' : '⚠️ Terlalu Larut'}
              </span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="sleep-field">
            <label className="field-label">
              <Moon size={13} /> Durasi Tidur
            </label>
            <div className="duration-row">
              <input
                type="range"
                min={5}
                max={11}
                step={0.5}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="duration-slider"
                style={{
                  background: `linear-gradient(to right, ${sleepColor} 0%, ${sleepColor} ${((duration - 5) / 6) * 100}%, rgba(255,255,255,0.1) ${((duration - 5) / 6) * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <span className="duration-value">{duration} jam</span>
            </div>
          </div>

          {/* Dark Room Toggle */}
          <div className="sleep-field">
            <label className="field-label">
              <Eye size={13} /> Kamar Gelap Total?
            </label>
            <button
              className={`dark-toggle ${darkRoom ? 'active' : ''}`}
              onClick={() => setDarkRoom(!darkRoom)}
            >
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              <span className="toggle-label">
                {darkRoom ? '🌑 Gelap Total — Melatonin ↑ HGH ↑' : '💡 Ada Cahaya — Melatonin ↓'}
              </span>
            </button>
          </div>

          {/* SWS Window Info */}
          <div className="sws-info">
            <Zap size={12} style={{ color: '#fbbf24' }} />
            <span>HGH Peak: <strong>{swsWindow.hghPeakTime}</strong> · SWS Window: {swsWindow.peakStart}–{swsWindow.peakEnd}</span>
          </div>

          {/* Tips */}
          <div className="sleep-tips">
            {tips.map((tip, i) => (
              <div key={i} className="sleep-tip">{tip}</div>
            ))}
          </div>

          {/* Save Button */}
          <button className="sleep-save-btn" onClick={handleSave}>
            {todaySleep ? 'UPDATE SLEEP LOG' : 'SIMPAN SLEEP LOG'}
          </button>
        </div>
      )}
    </div>
  );
}
