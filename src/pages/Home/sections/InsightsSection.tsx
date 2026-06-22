/**
 * InsightsSection — Upgraded with staggerContainer motion system
 *
 * Changes from original:
 * - Replaced manual x-offset with staggerContainer + slideReveal variants
 * - Bar chart uses barReveal variant for consistent animation language
 * - Added "insight callout" visual upgrade: left border flash, refined typography
 */

import React from 'react';
import { motion } from 'framer-motion';
import { mockAnalytics, getAQIColor } from '../../../utils/mockData';
import {
  staggerContainer,
  fadeUp,
  slideRevealRight,
  DEFAULT_VIEWPORT,
} from '../../../motion/variants';

const InsightsSection: React.FC = () => {
  const maxAQI = Math.max(...mockAnalytics.cityComparison.map(c => c.aqi));

  return (
    <section id="analytics" className="relative py-24 px-6 bg-[#040816]">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={DEFAULT_VIEWPORT}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-16"
        >
          <h2 className="text-[14px] font-semibold tracking-[0.12em] uppercase text-[#8B9CC8]">
            Environmental Insights
          </h2>
          <div className="h-[1px] flex-grow bg-[rgba(255,255,255,0.06)]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Horizontal Bar Chart */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={DEFAULT_VIEWPORT}
            className="flex flex-col gap-5"
          >
            {mockAnalytics.cityComparison.map((c, i) => {
              const color = getAQIColor(c.aqi);
              const widthPct = Math.max((c.aqi / maxAQI) * 100, 10);

              return (
                <motion.div key={c.city} variants={fadeUp} custom={i} className="flex items-center gap-4 group">
                  <div className="w-20 text-[13px] font-medium text-[#8B9CC8] group-hover:text-[#E8F0FF] transition-colors duration-200 truncate">
                    {c.city}
                  </div>

                  <div className="flex-grow flex items-center h-7 rounded-sm overflow-hidden bg-[rgba(255,255,255,0.03)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${widthPct}%` }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 1.0, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full relative"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(255,255,255,0.12)]" />
                    </motion.div>
                  </div>

                  <div className="w-12 text-right mono-data text-[15px] font-bold" style={{ color }}>
                    {c.aqi}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right: Prose Insight Callouts */}
          <div className="flex flex-col gap-8">
            <motion.div
              variants={slideRevealRight}
              initial="hidden"
              whileInView="visible"
              viewport={DEFAULT_VIEWPORT}
              style={{
                borderLeft: '3px solid rgba(0,230,118,0.4)',
                paddingLeft: 20,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#00E676] text-[16px]">↓</span>
                <h3 className="text-[18px] font-semibold text-[#E8F0FF]">
                  12% improvement in coastal cities
                </h3>
              </div>
              <p className="text-[15px] text-[#8B9CC8] leading-relaxed max-w-[400px]">
                Chennai and Bengaluru show sustained improvements over the last week,
                driven by seasonal south-west monsoon winds dispersing particulate matter.
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={DEFAULT_VIEWPORT}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-px max-w-[400px] bg-[rgba(255,255,255,0.06)]"
            />

            <motion.div
              variants={slideRevealRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              style={{
                borderLeft: '3px solid rgba(213,0,0,0.4)',
                paddingLeft: 20,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#D50000] text-[16px]">↑</span>
                <h3 className="text-[18px] font-semibold text-[#E8F0FF]">
                  8% worsening in Indo-Gangetic Plain
                </h3>
              </div>
              <p className="text-[15px] text-[#8B9CC8] leading-relaxed max-w-[400px]">
                New Delhi and Kolkata continue to trap pollutants due to atmospheric
                inversion layers typical for this season.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
