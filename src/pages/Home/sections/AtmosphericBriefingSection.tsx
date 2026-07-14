/**
 * AtmosphericBriefingSection — AI Intelligence Briefing
 *
 * Renders an atmospheric intelligence report. Aesthetic: classified document,
 * mission control briefing, real-time field report.
 *
 * Layout: Full-width dark section with monospace timestamp header, sequential
 * intelligence items that reveal on scroll with staggered animation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  staggerContainer,
  intelligenceItem,
  slideRevealLeft,
  DEFAULT_VIEWPORT,
} from '../../../motion/variants';

interface BriefingItem {
  id: string;
  index: string;
  headline: string;
  detail: string;
  tag: string;
  tagColor: string;
  severity: 'critical' | 'warning' | 'nominal' | 'info';
}

const BRIEFING_ITEMS: BriefingItem[] = [
  {
    id: 'b1',
    index: '01',
    headline: 'PM2.5 accumulation expected across Delhi NCR over next 6 hours.',
    detail: 'Contributing factor: Low wind speed (2.1 m/s) from NW quadrant. Atmospheric boundary layer compressed to 400m.',
    tag: 'CRITICAL',
    tagColor: '#D50000',
    severity: 'critical',
  },
  {
    id: 'b2',
    index: '02',
    headline: 'Coastal winds reducing particulate concentration near Chennai.',
    detail: 'Surface AQI improving at 8µg/m³ per hour. Projected to reach Good category by 06:00 IST.',
    tag: 'IMPROVING',
    tagColor: '#00E676',
    severity: 'nominal',
  },
  {
    id: 'b3',
    index: '03',
    headline: 'Elevated NO₂ activity detected in industrial corridors of Pune.',
    detail: 'Source: Satellite-confirmed thermal signature via Sentinel-5P. Ground sensor corroboration pending.',
    tag: 'ALERT',
    tagColor: '#FF7043',
    severity: 'warning',
  },
  {
    id: 'b4',
    index: '04',
    headline: 'Forecast model confidence remains above 90% for next 48h window.',
    detail: 'Primary model: XGBoost ensemble with LSTM correction layer. 847 ground sensors active nationwide.',
    tag: 'FORECAST',
    tagColor: '#8A7CFF',
    severity: 'info',
  },
];

const severityBorderColor: Record<BriefingItem['severity'], string> = {
  critical: 'rgba(213, 0, 0, 0.4)',
  warning: 'rgba(255, 112, 67, 0.35)',
  nominal: 'rgba(0, 230, 118, 0.3)',
  info: 'rgba(138, 124, 255, 0.3)',
};

const AtmosphericBriefingSection: React.FC = () => (
  <section
    id="briefing"
    className="relative py-12 px-6 bg-[var(--void)] border-t border-[rgba(255,255,255,0.03)]"
  >
    {/* Subtle left-edge glow */}
    <div
      className="absolute left-0 top-0 bottom-0 w-px"
      style={{ background: 'linear-gradient(to bottom, transparent, rgba(138,124,255,0.4), transparent)' }}
    />

    <div className="max-w-[1280px] mx-auto">

      {/* ── Section Header ──────────────────────────────────────────── */}
      <motion.div
        variants={slideRevealLeft}
        initial="hidden"
        whileInView="visible"
        viewport={DEFAULT_VIEWPORT}
        className="mb-6"
      >
        {/* Classification header */}
        <div
          className="flex items-center gap-4"
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: '#3D4F70' }}>▮</span>
          <span style={{ color: '#8A7CFF' }}>ATMOSPHERIC BRIEFING</span>
          <div style={{ height: 1, width: 40, background: 'rgba(138,124,255,0.3)' }} />
          <span style={{ color: '#3D4F70' }}>INDIA REGION</span>
          <div className="flex-grow h-px bg-[rgba(255,255,255,0.04)]" />
          <span style={{ color: '#3D4F70' }}>
            UPDATED: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST
          </span>
        </div>
      </motion.div>

      {/* ── Confidence Bar ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={DEFAULT_VIEWPORT}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className="h-px w-full mb-10 bg-gradient-to-r from-[rgba(138,124,255,0.5)] via-[rgba(77,238,234,0.3)] to-transparent"
      />

      {/* ── Intelligence Items ─────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={DEFAULT_VIEWPORT}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {BRIEFING_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            variants={intelligenceItem}
            custom={i}
            className="relative group"
            style={{
              background: 'rgba(7, 13, 30, 0.6)',
              border: `1px solid ${severityBorderColor[item.severity]}`,
              borderLeft: `3px solid ${severityBorderColor[item.severity].replace('0.', '0.8')}`,
              borderRadius: 8,
              padding: '20px 24px',
              transition: 'background 0.3s ease, box-shadow 0.3s ease',
            }}
            whileHover={{
              background: 'rgba(12, 21, 48, 0.8)',
              transition: { duration: 0.2 },
            }}
          >
            {/* Index + Tag row */}
            <div className="flex items-center justify-between mb-3">
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 11,
                  color: '#3D4F70',
                  letterSpacing: '0.1em',
                }}
              >
                {item.index}
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: item.tagColor,
                  padding: '3px 8px',
                  border: `1px solid ${item.tagColor}40`,
                  borderRadius: 3,
                }}
              >
                {item.tag}
              </span>
            </div>

            {/* Headline */}
            <p
              className="text-[#E8F0FF] font-medium mb-2 leading-snug"
              style={{ fontSize: 15 }}
            >
              {item.headline}
            </p>

            {/* Detail */}
            <p
              className="text-[#8B9CC8] leading-relaxed"
              style={{ fontSize: 13 }}
            >
              {item.detail}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Footer metadata ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={DEFAULT_VIEWPORT}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 flex items-center gap-6"
        style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 11,
          color: '#3D4F70',
          letterSpacing: '0.08em',
        }}
      >
        <span>DATA SOURCES: SENTINEL-5P · ERA5 · CPCB · XGBOOST</span>
        <div className="flex-grow h-px bg-[rgba(255,255,255,0.04)]" />
        <span>CONFIDENCE: 94%</span>
      </motion.div>

    </div>
  </section>
);

export default AtmosphericBriefingSection;
