import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ForecastChart from '../../../components/charts/ForecastChart';
import { AQIBadge } from '../../../components/common';
import { mockCities, mockForecast24h, mockForecast7d, getAQIColor } from '../../../utils/mockData';

type Mode = '24H' | '7D';

const ForecastSection: React.FC = () => {
  const [activeCity, setActiveCity] = useState(mockCities[0].id);
  const [mode, setMode] = useState<Mode>('24H');

  const city  = mockCities.find((c) => c.id === activeCity)!;
  const data  = mode === '24H' ? mockForecast24h(activeCity) : mockForecast7d(activeCity);
  const color = getAQIColor(city.aqi);

  // Derive mock insights
  const maxForecast = Math.max(...data.map(d => d.aqi));
  const avgForecast = Math.round(data.reduce((acc, curr) => acc + curr.aqi, 0) / data.length);

  return (
    <section id="forecast" className="relative py-16 px-6 bg-[#040816]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-[14px] font-semibold tracking-[0.12em] uppercase text-[#8B9CC8]">
            AI Forecasting
          </h2>
          <div className="h-[1px] flex-grow bg-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          
          {/* City Dropdown Simulator */}
          <div className="relative group">
            <select 
              value={activeCity} 
              onChange={(e) => setActiveCity(e.target.value)}
              className="appearance-none bg-[#070D1E] border border-[rgba(255,255,255,0.12)] text-[#E8F0FF] text-[18px] font-semibold px-4 py-2 pr-10 rounded-lg outline-none focus:border-[#4DEEEA] transition-colors cursor-pointer"
            >
              {mockCities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B9CC8]">
              ▾
            </div>
          </div>

          {/* Time Toggle */}
          <div className="flex bg-[#070D1E] p-1 rounded-lg border border-[rgba(255,255,255,0.06)]">
            {(['24H', '7D'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-1.5 text-[12px] font-medium rounded-md tracking-wider transition-all ${
                  mode === m 
                    ? 'bg-[#15234B] text-[#E8F0FF] shadow-sm' 
                    : 'text-[#3D4F70] hover:text-[#8B9CC8]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Chart (Left) + Insights (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Chart */}
          <div className="lg:col-span-2 surface-01 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-[18px] font-semibold text-[#E8F0FF]">{city.name}</span>
                <AQIBadge aqi={city.aqi} />
              </div>
              <div className="text-[12px] text-[#8B9CC8] uppercase tracking-wider">
                {mode === '24H' ? 'Hourly' : 'Daily'}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCity}-${mode}`}
                initial={{ opacity: 0, strokeDashoffset: 1000 }}
                animate={{ opacity: 1, strokeDashoffset: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              >
                <ForecastChart data={data} color={color} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Operational Forecast Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-02 rounded-2xl p-6 flex flex-col gap-0 border-l-2"
            style={{ borderLeftColor: getAQIColor(maxForecast) }}
          >
            {/* Peak predicted */}
            <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[10px] font-semibold tracking-[0.1em] text-[#8B9CC8] uppercase mb-1"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                Peak Predicted
              </div>
              <div className="mono-data text-[28px] font-bold" style={{ color: getAQIColor(maxForecast) }}>
                {maxForecast}
              </div>
              <div className="text-[12px] text-[#8B9CC8] mt-1">
                {mode === '24H' ? '3 PM – 7 PM tomorrow' : 'Later this week'}
              </div>
            </div>

            {/* Average */}
            <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[10px] font-semibold tracking-[0.1em] text-[#8B9CC8] uppercase mb-1"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                Period Average
              </div>
              <div className="mono-data text-[22px] font-bold text-[#E8F0FF]">{avgForecast}</div>
            </div>

            {/* Operational metadata */}
            <div className="flex flex-col gap-3">
              {[
                { label: 'Confidence', value: '94%',    color: '#8A7CFF' },
                { label: 'Primary Driver', value: 'PM2.5',   color: '#FF7043' },
                { label: 'Risk Level',  value: maxForecast > 200 ? 'High' : maxForecast > 100 ? 'Moderate' : 'Low', color: getAQIColor(maxForecast) },
                { label: 'Window',   value: mode === '24H' ? '24 Hours' : '7 Days', color: '#4DEEEA' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span
                    className="text-[11px] uppercase tracking-[0.08em]"
                    style={{ fontFamily: 'ui-monospace, monospace', color: '#3D4F70' }}
                  >
                    {label}
                  </span>
                  <span
                    className="mono-data text-[12px] font-semibold"
                    style={{ color }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ForecastSection;
