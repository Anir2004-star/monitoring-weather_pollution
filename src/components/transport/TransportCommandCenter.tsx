import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TransportDestination, TransportRoute, TransportSource } from '../../utils/transportData';

interface TransportCommandCenterProps {
  destination: TransportDestination | null;
  incomingRoutes: TransportRoute[];
  allSources: TransportSource[];
}

const statusColors: Record<string, string> = {
  GOOD: '#00E676',
  MODERATE: '#FFEA00',
  POOR: '#FF9100',
  'VERY POOR': '#FF3D00',
  SEVERE: '#D50000',
  UNHEALTHY: '#FF1744'
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export const TransportCommandCenter: React.FC<TransportCommandCenterProps> = ({
  destination,
  incomingRoutes,
  allSources
}) => {

  if (!destination) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[rgba(2,5,16,0.6)] backdrop-blur-md border-l border-[rgba(255,255,255,0.05)] p-6 text-center">
        <div className="text-[#8B9CC8] text-[13px] font-mono tracking-widest uppercase">
          Awaiting Atmospheric Telemetry...<br/>
          Hover over a region or destination node to initialize command sequence.
        </div>
      </div>
    );
  }

  const primaryRoute = incomingRoutes.length > 0 ? incomingRoutes.sort((a,b) => b.confidence - a.confidence)[0] : null;
  const primarySource = primaryRoute ? allSources.find(s => s.id === primaryRoute.sourceId) : null;
  const statusColor = statusColors[destination.status] || '#FF1744';

  return (
    <div className="w-full h-full bg-[rgba(2,5,16,0.85)] backdrop-blur-xl border-l border-[rgba(255,255,255,0.05)] flex flex-col overflow-y-auto custom-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div 
          key={destination.id}
          initial="hidden" animate="visible" exit="exit" variants={fadeUp}
          className="p-6 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="border-b border-[rgba(255,255,255,0.05)] pb-4">
            <h2 className="text-[10px] font-mono text-[#8B9CC8] tracking-widest uppercase mb-1">Region Name</h2>
            <div className="text-[24px] font-bold text-[#E8F0FF] tracking-tight">{destination.name}</div>
            
            <div className="flex items-center gap-4 mt-3">
              <div>
                <div className="text-[10px] font-mono text-[#8B9CC8] tracking-widest uppercase mb-1">Live AQI</div>
                <div className="text-[32px] font-bold mono-data leading-none" style={{ color: statusColor }}>{destination.aqi}</div>
              </div>
              <div className="w-px h-8 bg-[rgba(255,255,255,0.1)]"></div>
              <div>
                <div className="text-[10px] font-mono text-[#8B9CC8] tracking-widest uppercase mb-1">Status</div>
                <div className="text-[14px] font-bold uppercase tracking-widest" style={{ color: statusColor }}>
                  {destination.status}
                </div>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div>
            <h3 className="text-[11px] font-bold tracking-widest text-[#4DEEEA] uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DEEEA] animate-pulse"></span>
              Top Contributors
            </h3>
            <div className="flex flex-col gap-3">
              {destination.contributors.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between text-[11px] text-[#E8F0FF] mb-1">
                    <span>{c.name}</span>
                    <span className="font-mono">{c.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${c.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#4DEEEA] to-[#8A7CFF] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Analytics */}
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
            <h3 className="text-[11px] font-bold tracking-widest text-[#E8F0FF] uppercase mb-3">Transport Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-[#8B9CC8] uppercase tracking-wider mb-1">Distance</div>
                <div className="text-[14px] text-white mono-data">{primaryRoute?.distance || '--'} km</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8B9CC8] uppercase tracking-wider mb-1">Dominant Source</div>
                <div className="text-[12px] text-[#FFB74D] font-medium leading-tight">{primarySource?.name || '--'}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8B9CC8] uppercase tracking-wider mb-1">Estimated Arrival</div>
                <div className="text-[14px] text-white mono-data">In 4 Hours</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8B9CC8] uppercase tracking-wider mb-1">Risk Trend</div>
                <div className="text-[14px] text-[#FF1744] font-bold">Escalating</div>
              </div>
            </div>
          </div>

          {/* Forecast Intelligence */}
          <div>
            <h3 className="text-[11px] font-bold tracking-widest text-[#E8F0FF] uppercase mb-3">Forecast Intelligence</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] pb-1">
                <span className="text-[#8B9CC8]">Peak Window</span>
                <span className="text-white mono-data">{destination.forecast.peakWindow}</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] pb-1">
                <span className="text-[#8B9CC8]">Expected AQI</span>
                <span className="text-[#FF1744] font-bold mono-data">{destination.forecast.expectedAqi}</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] pb-1">
                <span className="text-[#8B9CC8]">Confidence</span>
                <span className="text-[#00E676] font-bold mono-data">{destination.forecast.confidence}%</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] pb-1">
                <span className="text-[#8B9CC8]">Stability</span>
                <span className="text-white">{destination.forecast.stability}</span>
              </div>
            </div>
          </div>

          {/* Atmospheric Insight */}
          <div className="bg-[rgba(77,238,234,0.03)] border-l-2 border-[#4DEEEA] p-3 text-[12px] leading-relaxed text-[#8B9CC8]">
            <span className="font-bold text-[#4DEEEA] uppercase tracking-widest text-[10px] block mb-1">Atmospheric Insight</span>
            {destination.insight}
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TransportCommandCenter;
