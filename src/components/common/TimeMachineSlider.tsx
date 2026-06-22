import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeOffset } from '../../store/slices/uiSlice';
import type { RootState } from '../../store';

const HOURS = [0, 6, 12, 18, 24];

const TimeMachineSlider: React.FC = () => {
  const dispatch = useDispatch();
  const timeOffset = useSelector((state: RootState) => state.ui.timeOffset);

  const formatTime = (hr: number) => `${hr.toString().padStart(2, '0')}:00`;

  const getLabel = (hr: number) => {
    if (hr === 0) return 'NOW';
    return `+${hr}H`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-6 px-6">
      <div className="max-w-[800px] mx-auto pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgba(4,8,22,0.85)] backdrop-blur-xl border border-[rgba(77,238,234,0.3)] rounded-2xl p-4 shadow-[0_0_30px_rgba(77,238,234,0.1)] flex flex-col gap-2 relative overflow-hidden"
        >
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4DEEEA] to-transparent opacity-50" />

          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#4DEEEA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#4DEEEA] uppercase" style={{ fontFamily: 'ui-monospace, monospace' }}>
              Atmospheric Time Machine
            </span>
            <span className="ml-auto text-[12px] font-bold text-[#E8F0FF] mono-data bg-[#15234B] px-2 py-0.5 rounded">
              {formatTime(timeOffset)}
            </span>
          </div>

          <div className="relative pt-2 pb-6">
            <input 
              type="range"
              min={0}
              max={24}
              step={6}
              value={timeOffset}
              onChange={(e) => dispatch(setTimeOffset(Number(e.target.value)))}
              className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer outline-none relative z-10"
              style={{
                accentColor: '#4DEEEA',
              }}
            />
            
            <div className="absolute left-0 right-0 top-6 flex justify-between px-1">
              {HOURS.map(hr => {
                const isActive = timeOffset === hr;
                return (
                  <div key={hr} className="flex flex-col items-center">
                    <div className={`w-0.5 h-1.5 mb-1 ${isActive ? 'bg-[#4DEEEA]' : 'bg-[rgba(255,255,255,0.2)]'}`} />
                    <span 
                      className={`text-[10px] font-mono transition-colors ${isActive ? 'text-[#4DEEEA] font-bold' : 'text-[#3D4F70]'}`}
                    >
                      {getLabel(hr)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeMachineSlider;
