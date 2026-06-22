import React, { useMemo } from 'react';
import SunCalc from 'suncalc';

interface SunriseSunsetArcProps {
  lat: number;
  lng: number;
  sunriseLabel: string;
  sunsetLabel: string;
  className?: string;
}

const toMins = (d: Date) => d.getHours() * 60 + d.getMinutes();

const SunriseSunsetArc: React.FC<SunriseSunsetArcProps> = ({
  lat,
  lng,
  sunriseLabel,
  sunsetLabel,
  className = '',
}) => {
  const { progress, sunX, sunY } = useMemo(() => {
    const now = new Date();
    const times = SunCalc.getTimes(now, lat, lng);
    const riseMin = toMins(times.sunrise);
    const setMin  = toMins(times.sunset);
    const nowMin  = toMins(now);
    const prog = Math.max(0, Math.min(1, (nowMin - riseMin) / (setMin - riseMin)));

    // Arc: semi-circle from left (180°) to right (0°), peaking at top (90°)
    const angleDeg = 180 - prog * 180; // 180 at sunrise, 0 at sunset
    const angleRad = (angleDeg * Math.PI) / 180;
    const cx = 50, cy = 72, r = 38;
    const sx = cx + r * Math.cos(Math.PI - angleRad); // x on arc
    const sy = cy - r * Math.sin(angleRad);            // y on arc (inverted)

    return { progress: prog, sunX: sx, sunY: sy };
  }, [lat, lng]);

  const isDaytime = progress >= 0 && progress <= 1;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 80" className="w-full max-w-[200px]" style={{ overflow: 'visible' }}>
        {/* Arc track */}
        <path
          d="M 12 72 A 38 38 0 0 1 88 72"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Progress arc */}
        {isDaytime && (
          <path
            d={`M 12 72 A 38 38 0 0 1 ${sunX} ${sunY}`}
            fill="none"
            stroke="url(#sunGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Sun marker */}
        <circle
          cx={isDaytime ? sunX : 12}
          cy={isDaytime ? sunY : 72}
          r="4.5"
          fill="#FFD54F"
          style={{ filter: 'drop-shadow(0 0 6px #FFD54F)' }}
        />
        <circle
          cx={isDaytime ? sunX : 12}
          cy={isDaytime ? sunY : 72}
          r="8"
          fill="rgba(255,213,79,0.15)"
        />

        {/* Sunrise dot */}
        <circle cx="12" cy="72" r="2" fill="rgba(255,213,79,0.4)" />
        {/* Sunset dot */}
        <circle cx="88" cy="72" r="2" fill="rgba(255,152,0,0.4)" />

        {/* Horizon line */}
        <line x1="8" y1="74" x2="92" y2="74" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Gradient def */}
        <defs>
          <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF9800" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <div className="flex items-center justify-between w-full max-w-[200px] px-1">
        <div className="flex flex-col items-center">
          <span className="text-[9px] tracking-[0.08em] uppercase text-[#3D4F70]">Rise</span>
          <span className="text-[12px] font-semibold mono-data text-[#FFD54F]">{sunriseLabel}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-[#8B9CC8]">
            {isDaytime ? `${Math.round(progress * 100)}% elapsed` : 'After sunset'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] tracking-[0.08em] uppercase text-[#3D4F70]">Set</span>
          <span className="text-[12px] font-semibold mono-data text-[#FF9800]">{sunsetLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunsetArc;
