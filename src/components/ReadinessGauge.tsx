import { useMemo } from 'react';
import { getReadinessScore } from '../engine/recoveryEngine';
import './ReadinessGauge.css';

interface ReadinessGaugeProps {
  fatigue: number;
  recovery: number;
}

export default function ReadinessGauge({ fatigue, recovery }: ReadinessGaugeProps) {
  const readiness = useMemo(() => getReadinessScore(recovery, fatigue, 0), [recovery, fatigue]);

  const gaugeColor = readiness >= 75 ? '#22c55e' : readiness >= 50 ? '#eab308' : readiness >= 30 ? '#f59e0b' : '#ef4444';
  const gaugeLabel = readiness >= 75 ? 'READY' : readiness >= 50 ? 'OK' : readiness >= 30 ? 'TIRED' : 'EXHAUSTED';

  // SVG circular gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness / 100) * circumference;

  return (
    <div className="readiness-gauge">
      <svg viewBox="0 0 90 90" className="gauge-svg">
        {/* Background circle */}
        <circle
          cx="45" cy="45" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="5"
        />
        {/* Gradient arc */}
        <circle
          cx="45" cy="45" r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90, 45, 45)"
          style={{
            transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
            filter: `drop-shadow(0 0 4px ${gaugeColor}60)`,
          }}
        />
      </svg>
      <div className="gauge-center">
        <div className="gauge-value" style={{ color: gaugeColor }}>{readiness}</div>
        <div className="gauge-label" style={{ color: `${gaugeColor}aa` }}>{gaugeLabel}</div>
      </div>
    </div>
  );
}
