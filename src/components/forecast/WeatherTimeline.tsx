import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HourlyForecastPoint, DayForecastPoint } from '../../types';
import { WEATHER_THEMES, getAQILevel } from '../../utils/weatherMock';

type TimelineMode = 'hourly' | 'tomorrow' | '7day';

interface WeatherTimelineProps {
  locationLabel: string;
  hourly: HourlyForecastPoint[];
  tomorrow: DayForecastPoint;
  sevenDay: DayForecastPoint[];
  className?: string;
}

const WeatherTimeline: React.FC<WeatherTimelineProps> = ({
  locationLabel,
  hourly,
  tomorrow,
  sevenDay,
  className = ''
}) => {
  const [mode, setMode] = useState<TimelineMode>('hourly');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const MODES: { id: TimelineMode; label: string }[] = [
    { id: 'hourly', label: 'Hourly' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: '7day', label: '7 Days' },
  ];

  // Map data based on mode
  const getTimelineData = (): { id: string; label: string; icon: string; temp: number; minTemp?: number; aqi: number; rain: number; wind: number; humidity: number; }[] => {
    switch (mode) {
      case 'hourly':
        return hourly.map((h, i) => ({
          id: `h-${i}`,
          label: h.time,
          icon: WEATHER_THEMES[h.condition].icon,
          temp: h.temperature,
          aqi: h.aqi,
          rain: h.rainProbability,
          wind: 12 + Math.floor(Math.random() * 10), // Mocked for timeline format
          humidity: 40 + Math.floor(Math.random() * 30), // Mocked
        }));
      case '7day':
        return sevenDay.map((d, i) => ({
          id: `d-${i}`,
          label: d.day,
          icon: WEATHER_THEMES[d.condition].icon,
          temp: d.maxTemp,
          minTemp: d.minTemp,
          aqi: d.aqi,
          rain: d.rainProbability,
          wind: 10 + Math.floor(Math.random() * 15),
          humidity: 50 + Math.floor(Math.random() * 20),
        }));
      case 'tomorrow':
      default:
        // For tomorrow, we can just show a 24-hour strip of tomorrow
        return Array.from({ length: 8 }).map((_, i) => ({
          id: `t-${i}`,
          label: `${(i * 3 + 6) % 12 || 12} ${i * 3 + 6 >= 12 ? 'PM' : 'AM'}`,
          icon: WEATHER_THEMES[tomorrow.condition].icon,
          temp: tomorrow.minTemp + Math.floor(Math.random() * (tomorrow.maxTemp - tomorrow.minTemp)),
          aqi: tomorrow.aqi + Math.floor(Math.random() * 20 - 10),
          rain: tomorrow.rainProbability,
          wind: 15,
          humidity: 60,
        }));
    }
  };

  const activeData = getTimelineData();
  const selectedPoint = selectedIndex !== null ? activeData[selectedIndex] : null;

  return (
    <div className={`surface-01 rounded-2xl p-6 relative overflow-hidden flex flex-col ${className}`}>
      
      {/* ── Top Controls ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[0.1em] uppercase text-[#8B9CC8] mb-1">
            Forecast Timeline
          </h3>
          <p className="text-[12px] text-[#3D4F70]">📍 {locationLabel}</p>
        </div>

        {/* Animated Pill Selector */}
        <div className="flex bg-[rgba(0,0,0,0.3)] p-1 rounded-full border border-[rgba(255,255,255,0.06)] relative">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setSelectedIndex(null); }}
              className="relative px-5 py-2 text-[12px] font-medium rounded-full tracking-wider z-10 transition-colors"
              style={{ color: mode === m.id ? '#040816' : '#8B9CC8' }}
            >
              {m.label}
              {mode === m.id && (
                <motion.div
                  layoutId="timeline-mode-pill"
                  className="absolute inset-0 bg-[#4DEEEA] rounded-full z-[-1]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Horizontal Scrolling Timeline ── */}
      <div className="relative mb-6 group">
        <div 
          className="overflow-x-auto flex gap-4 pb-4 scroll-smooth" 
          ref={scrollRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <AnimatePresence mode="popLayout">
            {activeData.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const aqiColor = getAQILevel(item.aqi).color;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 15px rgba(77,238,234,0.1)` }}
                  onClick={() => setSelectedIndex(isSelected ? null : idx)}
                  className={`min-w-[120px] flex-shrink-0 rounded-2xl p-4 flex flex-col items-center justify-between border transition-all duration-300 cursor-pointer
                    ${isSelected ? 'bg-[rgba(77,238,234,0.1)] border-[#4DEEEA]' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]'}
                  `}
                  style={{
                    boxShadow: isSelected ? '0 0 20px rgba(77,238,234,0.15)' : 'none'
                  }}
                >
                  <div className="text-[12px] tracking-wider text-[#8B9CC8] mb-3">{item.label}</div>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  
                  <div className="flex flex-col items-center gap-1 mb-3">
                    <div className="text-[20px] font-bold text-[#E8F0FF] mono-data">
                      {item.temp}°
                    </div>
                    {item.minTemp && (
                      <div className="text-[12px] text-[#3D4F70] mono-data">{item.minTemp}°</div>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2 mt-auto pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#3D4F70]">AQI</span>
                      <span className="font-bold mono-data" style={{ color: aqiColor }}>{item.aqi}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#3D4F70]">Rain</span>
                      <span className="text-[#4DEEEA] mono-data">{item.rain}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Left Scroll Indicator Overlay */}
        <div className="absolute left-0 top-0 bottom-4 w-24 bg-gradient-to-r from-[rgba(4,8,22,1)] to-transparent pointer-events-none flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-white shadow-lg pointer-events-auto hover:bg-[rgba(255,255,255,0.2)] transition-colors cursor-pointer"
          >
            <span className="text-xl">‹</span>
          </button>
        </div>

        {/* Right Scroll Indicator Overlay */}
        <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-[rgba(4,8,22,1)] to-transparent pointer-events-none flex items-center justify-end pr-2 opacity-80 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-white shadow-lg pointer-events-auto hover:bg-[rgba(255,255,255,0.2)] transition-colors cursor-pointer animate-pulse hover:animate-none"
          >
            <span className="text-xl">›</span>
          </button>
        </div>
      </div>

      {/* ── Mini Weather Summary Popover ── */}
      <AnimatePresence mode="wait">
        {selectedPoint && (
          <motion.div
            key={selectedPoint.id}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[rgba(4,8,22,0.8)] backdrop-blur-md border border-[rgba(77,238,234,0.3)] rounded-xl p-5 shadow-[0_0_30px_rgba(77,238,234,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{selectedPoint.icon}</div>
                <div>
                  <div className="text-[14px] text-[#E8F0FF] font-semibold">{selectedPoint.label} Summary</div>
                  <div className="text-[11px] tracking-wider uppercase text-[#8B9CC8]">Detailed Analysis</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#3D4F70] uppercase">Temperature</span>
                  <span className="text-[18px] font-bold text-[#E8F0FF] mono-data">{selectedPoint.temp}°C</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#3D4F70] uppercase">Humidity</span>
                  <span className="text-[18px] font-bold text-[#E8F0FF] mono-data">{selectedPoint.humidity}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#3D4F70] uppercase">Air Quality</span>
                  <span className="text-[18px] font-bold mono-data" style={{ color: getAQILevel(selectedPoint.aqi).color }}>
                    {selectedPoint.aqi}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#3D4F70] uppercase">Wind Speed</span>
                  <span className="text-[18px] font-bold text-[#E8F0FF] mono-data">{selectedPoint.wind} km/h</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#3D4F70] uppercase">Precipitation</span>
                  <span className="text-[18px] font-bold text-[#4DEEEA] mono-data">{selectedPoint.rain}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WeatherTimeline;
