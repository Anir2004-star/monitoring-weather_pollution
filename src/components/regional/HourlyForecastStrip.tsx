import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { HourlyForecastPoint, WeatherCondition } from '../../types';
import { getAQILevel } from '../../utils/weatherMock';

const CONDITION_ICON: Record<WeatherCondition, string> = {
  'clear-day':    '☀️',
  'cloudy':       '☁️',
  'rain':         '🌧️',
  'thunderstorm': '⛈️',
  'clear-night':  '🌙',
  'cloudy-night': '☁️',
};

interface HourlyForecastStripProps {
  data: HourlyForecastPoint[];
}

const HourlyForecastStrip: React.FC<HourlyForecastStripProps> = ({ data }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(7,13,30,1), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(7,13,30,1), transparent)' }} />

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {data.map((entry, i) => {
          const aqiLevel = getAQILevel(entry.aqi);
          const isNow = i === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="flex flex-col items-center gap-2 rounded-xl px-3 py-3 flex-shrink-0 border transition-all"
              style={{
                minWidth: 72,
                background: isNow ? 'rgba(77,238,234,0.08)' : 'rgba(255,255,255,0.03)',
                borderColor: isNow ? 'rgba(77,238,234,0.35)' : 'rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-[11px] font-semibold tracking-wide"
                style={{ color: isNow ? '#4DEEEA' : '#8B9CC8' }}>
                {entry.time}
              </span>
              <span className="text-[20px] leading-none">{CONDITION_ICON[entry.condition]}</span>
              <span className="text-[14px] font-bold text-[#E8F0FF] mono-data">
                {entry.temperature}°
              </span>
              {/* AQI dot + value */}
              <div className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: aqiLevel.color }}
                />
                <span className="text-[10px] mono-data font-medium" style={{ color: aqiLevel.color }}>
                  {entry.aqi}
                </span>
              </div>
              {/* Rain prob */}
              {entry.rainProbability > 10 && (
                <span className="text-[10px] text-[#4DEEEA] font-medium">
                  {entry.rainProbability}%💧
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecastStrip;
