import React from 'react';
import { motion } from 'framer-motion';
import { AQIGauge } from '../../../components/charts';
import { AQIBadge, SectionLabel } from '../../../components/common';
import PollutantBar from '../../../components/charts/PollutantBar';
import { mockCities, getAQIColor } from '../../../utils/mockData';

import type { Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE },
  }),
};

const AQIOverviewSection: React.FC = () => (
  <section id="overview" className="relative py-32 px-6">
    {/* Section header */}
    <div className="max-w-7xl mx-auto mb-16 text-center">
      <SectionLabel text="Live AQI · Updated 2 min ago" live className="mb-5 justify-center" />
      <h2 className="font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
        <span className="text-gradient-white">City Air Quality</span>
        <br />
        <span className="text-gradient-cyan">At a Glance</span>
      </h2>
      <p className="text-base max-w-xl mx-auto" style={{ color: '#64748b' }}>
        Real-time AQI readings from major Indian cities, powered by ground-level sensor networks.
      </p>
    </div>

    {/* City cards grid */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {mockCities.map((city, i) => {
        const color = getAQIColor(city.aqi);
        return (
          <motion.div
            key={city.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="glass rounded-2xl p-6 group cursor-default transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${color}18`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-semibold text-base text-white mb-1">{city.name}</h3>
                <span className="text-xs" style={{ color: '#475569' }}>{city.state}</span>
              </div>
              <AQIBadge aqi={city.aqi} />
            </div>

            {/* Gauge + value */}
            <div className="flex items-center gap-5 mb-5">
              <AQIGauge value={city.aqi} size={110} />
              <div>
                <div className="text-4xl font-black leading-none mb-1" style={{ color }}>
                  {city.aqi}
                </div>
                <div className="text-xs" style={{ color: '#475569' }}>Air Quality Index</div>
              </div>
            </div>

            {/* Pollutant bars */}
            <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <PollutantBar label="PM2.5" value={city.pollutants.pm25} max={250} color={color} />
              <PollutantBar label="PM10"  value={city.pollutants.pm10} max={430} color={color} />
              <PollutantBar label="NO₂"   value={city.pollutants.no2}  max={200} color={color} />
            </div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default AQIOverviewSection;
