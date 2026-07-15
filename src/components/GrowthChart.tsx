import { useGrowth } from '../store/growthStore';
import { USER_PROFILE } from '../utils/constants';
import { formatDisplayDate } from '../utils/dateUtils';
import './GrowthChart.css';

export default function GrowthChart() {
  const { state } = useGrowth();
  const { heightHistory } = state;

  // We need at least one point to draw something meaningful. 
  // If there's only one, we just show a dot.
  
  const minHeight = USER_PROFILE.currentHeight - 2;
  const maxHeight = USER_PROFILE.targetHeight + 2;
  const heightRange = maxHeight - minHeight;

  // SVG dimensions
  const width = 300; // viewBox width
  const height = 150; // viewBox height
  const paddingX = 40;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const getCoordinates = () => {
    if (heightHistory.length === 0) return [];

    if (heightHistory.length === 1) {
       return [{
         x: paddingX + chartWidth / 2,
         y: paddingY + chartHeight - ((heightHistory[0].heightCm - minHeight) / heightRange) * chartHeight,
         val: heightHistory[0].heightCm,
         date: formatDisplayDate(new Date(heightHistory[0].date))
       }];
    }

    const firstDate = new Date(heightHistory[0].date).getTime();
    const lastDate = new Date(heightHistory[heightHistory.length - 1].date).getTime();
    const timeRange = Math.max(lastDate - firstDate, 1); // Avoid division by zero

    return heightHistory.map(entry => {
      const entryTime = new Date(entry.date).getTime();
      const xPercent = (entryTime - firstDate) / timeRange;
      const yPercent = (entry.heightCm - minHeight) / heightRange;

      return {
        x: paddingX + xPercent * chartWidth,
        y: paddingY + chartHeight - (yPercent * chartHeight),
        val: entry.heightCm,
        date: formatDisplayDate(new Date(entry.date))
      };
    });
  };

  const points = getCoordinates();

  // Create path string
  const pathD = points.length > 1 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` 
    : '';

  // Calculate target line Y
  const targetYPercent = (USER_PROFILE.targetHeight - minHeight) / heightRange;
  const targetY = paddingY + chartHeight - (targetYPercent * chartHeight);

  return (
    <div className="growth-chart-container glass">
      <div className="chart-header">
        <span className="chart-title">GRAFIK PERTUMBUHAN</span>
      </div>
      
      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="growth-svg">
          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} className="grid-line" />
          <line x1={paddingX} y1={paddingY + chartHeight/2} x2={width - paddingX} y2={paddingY + chartHeight/2} className="grid-line" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="grid-line" />
          
          {/* Y-Axis Labels */}
          <text x={paddingX - 8} y={paddingY + 4} className="axis-label">{maxHeight}</text>
          <text x={paddingX - 8} y={paddingY + chartHeight/2 + 4} className="axis-label">{minHeight + heightRange/2}</text>
          <text x={paddingX - 8} y={height - paddingY + 4} className="axis-label">{minHeight}</text>

          {/* Target Line */}
          <line x1={paddingX} y1={targetY} x2={width - paddingX} y2={targetY} className="target-line" strokeDasharray="4 4" />
          <text x={width - paddingX + 5} y={targetY + 3} className="target-label">{USER_PROFILE.targetHeight}</text>

          {/* Data Path */}
          {pathD && (
            <path d={pathD} className="data-line" />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" className="data-point" />
              {/* Only show label for last point or if only one point */}
              {(i === points.length - 1 || points.length === 1) && (
                <>
                  <text x={p.x} y={p.y - 12} className="point-label-val" textAnchor="middle">{p.val}</text>
                  <text x={p.x} y={height - paddingY + 12} className="point-label-date" textAnchor="middle">{p.date}</text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
