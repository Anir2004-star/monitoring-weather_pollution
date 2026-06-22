import React from 'react';
import { motion } from 'framer-motion';

interface AtmosphericMetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  color?: string;
  subValue?: string;
}

const AtmosphericMetricCard: React.FC<AtmosphericMetricCardProps> = ({
  label,
  value,
  unit,
  highlight = false,
  color,
  subValue,
}) => (
  <motion.div
    whileHover={{ scale: 1.02, borderColor: color ? `${color}40` : 'rgba(77,238,234,0.25)' }}
    transition={{ duration: 0.2 }}
    className="glass rounded-xl p-4 flex flex-col gap-1.5 border border-[rgba(255,255,255,0.08)]"
    style={{
      boxShadow: highlight && color ? `0 0 20px ${color}18` : undefined,
    }}
  >
    <div className="flex items-center justify-end min-h-[18px]">
      {highlight && color && (
        <span
          className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full"
          style={{ color, background: `${color}18` }}
        >
          Live
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-1 mt-1">
      <span
        className="text-[22px] font-bold leading-none mono-data"
        style={{ color: '#FFFFFF' }}
      >
        {value}
      </span>
      {unit && (
        <span className="text-[11px] text-[#8B9CC8]">{unit}</span>
      )}
    </div>
    <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-[#8B9CC8]">
      {label}
    </div>
    {subValue && (
      <div className="text-[11px] text-[#3D4F70] mt-0.5">{subValue}</div>
    )}
  </motion.div>
);

export default AtmosphericMetricCard;
