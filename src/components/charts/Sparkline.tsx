import React from 'react';
import { getAQIColor } from '../../utils/mockData';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  width = 100, 
  height = 24, 
  strokeWidth = 2,
  color
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid division by zero
  const padding = strokeWidth;

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * innerWidth;
    const y = height - padding - ((d - min) / range) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  // Get color based on the latest value if not provided
  const lineColor = color || getAQIColor(data[data.length - 1]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
