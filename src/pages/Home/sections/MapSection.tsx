import React from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from '../../../components/common';
import GlowOrb from '../../../components/common/GlowOrb';
import { mockCities, getAQIColor, getAQILevel } from '../../../utils/mockData';

// Simple India-outline SVG map placeholder with animated city dots
const MapPlaceholder: React.FC = () => (
  <div
    className="relative w-full h-full rounded-2xl overflow-hidden grid-lines"
    style={{
      background: 'radial-gradient(ellipse at 40% 40%, rgba(6,182,212,0.06) 0%, rgba(3,7,18,0.9) 60%)',
      border: '1px solid rgba(6,182,212,0.2)',
      boxShadow: '0 0 40px rgba(6,182,212,0.1), inset 0 0 40px rgba(6,182,212,0.03)',
    }}
  >
    {/* Scanning line animation */}
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)' }}
      animate={{ top: ['5%', '95%', '5%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* SVG city dots */}
    <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" style={{ opacity: 0.9 }}>
      {/* Rough India shape as reference lines */}
      <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none">
        <line x1="50" y1="100" x2="350" y2="100" />
        <line x1="50" y1="200" x2="350" y2="200" />
        <line x1="50" y1="300" x2="350" y2="300" />
        <line x1="50" y1="400" x2="350" y2="400" />
        <line x1="100" y1="50"  x2="100" y2="470" />
        <line x1="200" y1="50"  x2="200" y2="470" />
        <line x1="300" y1="50"  x2="300" y2="470" />
      </g>

      {/* City markers mapped to relative SVG coords */}
      {[
        { id: '1', name: 'New Delhi',  x: 190, y: 130, aqi: 187 },
        { id: '2', name: 'Mumbai',     x: 130, y: 290, aqi: 89  },
        { id: '3', name: 'Chennai',    x: 230, y: 390, aqi: 54  },
        { id: '4', name: 'Kolkata',    x: 300, y: 220, aqi: 156 },
        { id: '5', name: 'Bengaluru',  x: 200, y: 370, aqi: 67  },
        { id: '6', name: 'Hyderabad',  x: 210, y: 310, aqi: 103 },
      ].map(({ id, name, x, y, aqi }) => {
        const color = getAQIColor(aqi);
        const r = 6 + (aqi / 500) * 10;
        return (
          <g key={id}>
            {/* Outer pulse ring */}
            <circle cx={x} cy={y} r={r + 6} fill={color} opacity={0.08} />
            <circle cx={x} cy={y} r={r + 3} fill={color} opacity={0.12} />
            {/* Core dot */}
            <circle cx={x} cy={y} r={r} fill={color} opacity={0.85} />
            {/* City label */}
            <text x={x + r + 5} y={y + 4} fontSize="9" fill={color} opacity={0.9} fontFamily="Inter, sans-serif">
              {name}
            </text>
            <text x={x + r + 5} y={y + 14} fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="Inter, sans-serif">
              AQI {aqi}
            </text>
          </g>
        );
      })}
    </svg>

    {/* Corner decorations */}
    <div className="absolute top-4 left-4 text-xs font-mono tracking-wider" style={{ color: '#06b6d4', opacity: 0.6 }}>
      SAT / 17.3°N 78.4°E
    </div>
    <div className="absolute bottom-4 right-4 text-xs font-mono" style={{ color: '#475569' }}>
      ATMOS · INDIA REGION
    </div>

    {/* Legend */}
    <div className="absolute bottom-4 left-4 glass rounded-xl p-3 space-y-1.5">
      {[
        { label: 'Good',       color: '#10b981' },
        { label: 'Moderate',   color: '#f59e0b' },
        { label: 'Unhealthy',  color: '#ef4444' },
        { label: 'Hazardous',  color: '#a855f7' },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs" style={{ color: '#94a3b8' }}>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const MapSection: React.FC = () => (
  <section id="map" className="relative py-32 px-6 overflow-hidden">
    <GlowOrb color="violet" size={500} opacity={0.1} blur={120} className="-left-40 top-0" />

    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Left: text */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel text="Satellite View · India" className="mb-6" />
          <h2 className="font-bold tracking-tight mb-6" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            <span className="text-gradient-white">Pollution mapped</span>
            <br />
            <span className="text-gradient-cyan">from orbit.</span>
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#64748b' }}>
            Visualise AQI hotspots across India in real-time. Station data is fused
            with satellite imagery to produce a continuous pollution field.
          </p>

          <div className="space-y-4">
            {mockCities.slice(0, 4).map((city) => {
              const level = getAQILevel(city.aqi);
              return (
                <div key={city.id} className="flex items-center justify-between py-3 border-b"
                     style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: level.color }} />
                    <span className="text-sm font-medium text-white">{city.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: level.color }}>{city.aqi}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: map */}
        <motion.div
          className="lg:col-span-3 h-[480px]"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <MapPlaceholder />
        </motion.div>
      </div>
    </div>
  </section>
);

export default MapSection;
