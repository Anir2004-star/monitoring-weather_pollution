import React from 'react';
import { getAQILevel } from '../../utils/mockData';

interface AQIBadgeProps {
  aqi: number;
  className?: string;
  dotOnly?: boolean;
}

const AQIBadge: React.FC<AQIBadgeProps> = ({ aqi, className = '', dotOnly = false }) => {
  const level = getAQILevel(aqi);
  
  if (dotOnly) {
    return (
      <span
        className={`inline-block rounded-full ${className}`}
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: level.color,
          boxShadow: `0 0 12px ${level.color}80`
        }}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: level.color,
          boxShadow: `0 0 8px ${level.color}80`
        }}
      />
      <span className="text-[11px] font-medium tracking-[0.06em] uppercase" style={{ color: level.color }}>
        {level.label}
      </span>
    </span>
  );
};

export default AQIBadge;
