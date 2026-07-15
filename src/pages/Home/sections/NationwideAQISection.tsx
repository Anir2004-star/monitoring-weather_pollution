/**
 * NationwideAQISection — Upgraded with animated counters + enhanced hover states
 *
 * Changes from original:
 * - AQI digit uses AnimatedCounter (spring physics from 0 to value)
 * - Section header wrapped in staggerContainer for progressive reveal
 * - City card whileHover: border + glow shadow matching AQI color
 * - Sparkline opacity transitions smoothly on hover
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AQIBadge, AnimatedCounter } from '../../../components/common';
import { Sparkline } from '../../../components/charts';
import { mockCities, getAQIColor } from '../../../utils/mockData';
import { staggerContainerFast, fadeUp, DEFAULT_VIEWPORT } from '../../../motion/variants';

const NationwideAQISection: React.FC = () => (
  <section id="overview" className="relative py-14 px-6 border-t border-[rgba(255,255,255,0.03)] bg-[var(--deep)]">
    <div className="max-w-[1280px] mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={DEFAULT_VIEWPORT}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
      >
        <h2 className="text-[14px] font-semibold tracking-[0.12em] uppercase text-[#8B9CC8]">
          Nationwide Air Quality
        </h2>
      </motion.div>

      <div className="h-[1px] w-full bg-[rgba(255,255,255,0.06)] mb-8" />

      {/* Grid */}
      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        whileInView="visible"
        viewport={DEFAULT_VIEWPORT}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {mockCities.map((city, i) => {
          const color = getAQIColor(city.aqi);
          return (
            <motion.div
              key={city.id}
              variants={fadeUp}
              custom={i}
              whileHover={{
                borderColor: `${color}50`,
                boxShadow: `0 4px 24px ${color}20`,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              className="surface-01 rounded-xl p-5 flex flex-col justify-between h-[170px] group cursor-default"
              style={{ transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }}
            >
              {/* Top: Name & AQI */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#E8F0FF] mb-3">{city.name}</h3>

                {/* Animated counter for AQI value */}
                <AnimatedCounter
                  value={city.aqi}
                  className="mono-data"
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: 6,
                    color,
                  }}
                />
                <AQIBadge aqi={city.aqi} />
              </div>

              {/* Bottom: Sparkline */}
              <div className="mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkline data={city.trend} width={100} height={20} color={color} strokeWidth={1.5} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  </section>
);

export default NationwideAQISection;
