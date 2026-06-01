import './RecoveryMeter.css';

interface RecoveryMeterProps {
  value: number;
  label: string;
  color: string;
  title: string;
}

export default function RecoveryMeter({ value, label, color, title }: RecoveryMeterProps) {
  return (
    <div className="recovery-meter">
      <div className="meter-header">
        <span className="meter-title">{title}</span>
        <span className="meter-value" style={{ color }}>{value} <span className="meter-label">{label}</span></span>
      </div>
      <div className="meter-track">
        <div
          className="meter-fill"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
