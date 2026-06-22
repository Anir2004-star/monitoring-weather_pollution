import React from 'react';

interface PollutantBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color?: string;
}

const PollutantBar: React.FC<PollutantBarProps> = ({
  label, value, max, unit = 'µg/m³', color = '#06b6d4',
}) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: '#475569' }}>{label}</span>
        <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
          {value.toFixed(1)} <span style={{ color: '#334155' }}>{unit}</span>
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  );
};

export default PollutantBar;
