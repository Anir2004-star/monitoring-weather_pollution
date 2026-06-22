import React from 'react';
import { getAQIColor } from '../../utils/mockData';

interface AQIGaugeProps {
  value: number;
  max?: number;
  size?: number;
}

const AQIGauge: React.FC<AQIGaugeProps> = ({ value, max = 500, size = 130 }) => {
  const r = 42;
  const cx = 55;
  const cy = 55;
  const viewBox = '0 0 110 110';
  const circumference = 2 * Math.PI * r;       // 263.89
  const ARC_FRAC    = 0.72;                     // 260° out of 360°
  const arcLength   = circumference * ARC_FRAC; // 190
  const gapLength   = circumference - arcLength;

  const progress   = Math.min(Math.max(value, 0), max) / max;
  const filled     = arcLength * progress;
  const color      = getAQIColor(value);

  // Rotate so the arc starts at bottom-left (144° from 0° = 3-o'clock)
  const rotation = `rotate(144 ${cx} ${cy})`;

  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <svg viewBox={viewBox} width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${gapLength}`}
          transform={rotation}
        />

        {/* Filled arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform={rotation}
          filter={`url(#glow-${value})`}
          style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease' }}
        />
      </svg>

      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold leading-none" style={{ fontSize: size * 0.24, color }}>
          {value}
        </span>
        <span className="text-xs mt-0.5" style={{ color: '#475569' }}>AQI</span>
      </div>
    </div>
  );
};

export default AQIGauge;
