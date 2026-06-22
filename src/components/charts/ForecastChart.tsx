import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { getAQIColor } from '../../utils/mockData';

interface DataPoint { time: string; aqi: number; }

interface ForecastChartProps {
  data: DataPoint[];
  color?: string; // We'll keep color for the line, but fill will use a multi-stop gradient
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const aqi = payload[0].value as number;
  return (
    <div className="surface-02 rounded-xl px-4 py-3 border border-[rgba(255,255,255,0.06)] shadow-xl">
      <p className="text-[11px] mb-1 text-[#8B9CC8]">{label}</p>
      <p className="text-lg font-bold" style={{ color: getAQIColor(aqi) }}>
        {aqi} <span className="text-[11px] font-normal text-[#3D4F70]">AQI</span>
      </p>
    </div>
  );
};

const ForecastChart: React.FC<ForecastChartProps> = ({ data, color = '#E8F0FF' }) => {
  const gradId = 'fc-grad';
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#00E676" stopOpacity={0.1} />
            <stop offset="40%"  stopColor="#FFD54F" stopOpacity={0.3} />
            <stop offset="80%"  stopColor="#FF7043" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#D50000" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: '#3D4F70', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#3D4F70', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="aqi"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: '#040816', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ForecastChart;
