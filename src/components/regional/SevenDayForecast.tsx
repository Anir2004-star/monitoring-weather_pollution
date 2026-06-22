import React from 'react';
import { motion } from 'framer-motion';
import type { DayForecastPoint, WeatherCondition } from '../../types';
import { getAQILevel } from '../../utils/weatherMock';

const CONDITION_ICON: Record<WeatherCondition, string> = {
  'clear-day':    '☀️',
  'cloudy':       '☁️',
  'rain':         '🌧️',
  'thunderstorm': '⛈️',
  'clear-night':  '🌙',
  'cloudy-night': '☁️',
};

interface SevenDayForecastProps {
  data: DayForecastPoint[];
}

const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ data }) => {
  const allMaxTemps = data.map((d) => d.maxTemp);
  const allMinTemps = data.map((d) => d.minTemp);
  const globalMax = Math.max(...allMaxTemps);
  const globalMin = Math.min(...allMinTemps);
  const tempRange = globalMax - globalMin || 1;

  return (
    <div className="flex flex-col gap-2">
      {data.map((day, i) => {
        const aqiLevel = getAQILevel(day.aqi);
        const isToday = i === 0;
        // Position of the temp bar relative to the global range
        const barStart = ((day.minTemp - globalMin) / tempRange) * 100;
        const barWidth = ((day.maxTemp - day.minTemp) / tempRange) * 100;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all"
            style={{
              background: isToday ? 'rgba(77,238,234,0.05)' : 'rgba(255,255,255,0.025)',
              borderColor: isToday ? 'rgba(77,238,234,0.2)' : 'rgba(255,255,255,0.06)',
            }}
          >
            {/* Day + Date */}
            <div className="flex flex-col w-16 flex-shrink-0">
              <span className="text-[13px] font-semibold"
                style={{ color: isToday ? '#4DEEEA' : '#E8F0FF' }}>
                {day.day}
              </span>
              <span className="text-[10px] text-[#3D4F70]">{day.date}</span>
            </div>

            {/* Weather icon */}
            <span className="text-[20px] w-8 text-center flex-shrink-0">
              {CONDITION_ICON[day.condition]}
            </span>

            {/* Rain probability */}
            <div className="flex items-center gap-1 w-12 flex-shrink-0">
              {day.rainProbability > 5 ? (
                <>
                  <span className="text-[11px]">💧</span>
                  <span className="text-[11px] text-[#4DEEEA] mono-data font-medium">
                    {day.rainProbability}%
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-[#3D4F70]">—</span>
              )}
            </div>

            {/* Temp bar — relative range */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[12px] text-[#8B9CC8] mono-data w-8 text-right flex-shrink-0">
                {day.minTemp}°
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] relative overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    left: `${barStart}%`,
                    width: `${Math.max(barWidth, 8)}%`,
                    background: 'linear-gradient(to right, #4DEEEA, #FFD54F, #FF7043)',
                  }}
                />
              </div>
              <span className="text-[12px] text-[#E8F0FF] mono-data font-semibold w-8 flex-shrink-0">
                {day.maxTemp}°
              </span>
            </div>

            {/* AQI */}
            <div
              className="text-[11px] font-semibold mono-data w-10 text-right flex-shrink-0"
              style={{ color: aqiLevel.color }}
            >
              {day.aqi}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SevenDayForecast;
