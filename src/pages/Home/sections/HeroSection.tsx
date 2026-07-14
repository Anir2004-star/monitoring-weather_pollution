/**
 * HeroSection — Atmospheric Command Center Hero
 *
 * Upgraded from a good hero into a world-class atmospheric intelligence interface.
 * Motion: Word-by-word staggered headline, sequential element reveals, spring-based CTA.
 * Visual: AtmosphericCommandCenter replaces the plain EarthOrb.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AtmosphericCommandCenter, ParticleField } from '../../../components/earth';
import { AnimatedCounter } from '../../../components/common';
import {
  wordStaggerContainer,
  wordReveal,
  scaleIn,
  EASE_PREMIUM,
} from '../../../motion/variants';

// Hero headline split into animatable word groups
const HEADLINE_LINE_1 = ["Earth's", "atmosphere,"];
const HEADLINE_LINE_2_GRADIENT = "revealed";
const HEADLINE_LINE_2_SUFFIX = "in real time.";

const HeroSection: React.FC = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-14">

    {/* Background */}
    <div className="absolute inset-0 bg-[var(--deep)] z-0" />
    <ParticleField count={80} />

    {/* Subtle radial glow behind Earth */}
    <div
      className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at 70% 50%, rgba(77,238,234,0.04) 0%, transparent 60%)',
      }}
    />

    {/* Content Container */}
    <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* ── Left Column: Text ─────────────────────────────────────── */}
      <div className="flex flex-col items-start text-left pt-20 lg:pt-0">

        {/* Eyebrow — slides in from left */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: EASE_PREMIUM }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00E676]" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
          </span>
          <span className="text-[12px] font-medium tracking-[0.12em] uppercase text-[#8B9CC8]">
            LIVE · INDIA REGION · ATMOSPHERIC INTELLIGENCE
          </span>
        </motion.div>

        {/* H1 Headline — word-by-word staggered reveal */}
        <motion.h1
          variants={wordStaggerContainer}
          initial="hidden"
          animate="visible"
          className="font-bold leading-[1.05] tracking-[-0.04em] mb-6 text-[#E8F0FF]"
          style={{ fontSize: 'clamp(44px, 5.5vw, 76px)' }}
        >
          {/* Line 1: word-by-word */}
          <span className="flex flex-wrap gap-x-[0.25em] mb-1">
            {HEADLINE_LINE_1.map((word) => (
              <motion.span key={word} variants={wordReveal} style={{ display: 'inline-block' }}>
                {word}
              </motion.span>
            ))}
          </span>

          {/* Line 2: gradient word + plain suffix */}
          <span className="flex flex-wrap gap-x-[0.25em]">
            <motion.span
              variants={wordReveal}
              style={{ display: 'inline-block' }}
              className="text-gradient-primary"
            >
              {HEADLINE_LINE_2_GRADIENT}
            </motion.span>
            {HEADLINE_LINE_2_SUFFIX.split(' ').map((word) => (
              <motion.span key={word} variants={wordReveal} style={{ display: 'inline-block' }}>
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>


        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE_PREMIUM }}
          className="flex items-center gap-8 mb-10"
        >
          {/* 847 Ground Sensors */}
          <div>
            <AnimatedCounter
              value={847}
              className="mono-data"
              style={{ fontSize: 20, fontWeight: 700, color: '#E8F0FF', lineHeight: 1, display: 'block', marginBottom: 4 }}
            />
            <div className="text-[11px] text-[#3D4F70] uppercase tracking-[0.08em]">Ground sensors</div>
          </div>
          {/* 23 Active Hotspots */}
          <div>
            <AnimatedCounter
              value={23}
              className="mono-data"
              style={{ fontSize: 20, fontWeight: 700, color: '#E8F0FF', lineHeight: 1, display: 'block', marginBottom: 4 }}
            />
            <div className="text-[11px] text-[#3D4F70] uppercase tracking-[0.08em]">Active hotspots</div>
          </div>
          {/* 94% Forecast Accuracy */}
          <div>
            <AnimatedCounter
              value={94}
              suffix="%"
              className="mono-data"
              style={{ fontSize: 20, fontWeight: 700, color: '#E8F0FF', lineHeight: 1, display: 'block', marginBottom: 4 }}
            />
            <div className="text-[11px] text-[#3D4F70] uppercase tracking-[0.08em]">Forecast accuracy</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={9}
        >
          <a
            href="#overview"
            className="group flex items-center gap-3 text-[14px] font-medium text-[#E8F0FF] transition-all"
          >
            <motion.span
              className="flex items-center justify-center w-8 h-8 rounded-full border border-[rgba(255,255,255,0.12)] group-hover:border-[#4DEEEA] transition-colors"
              whileHover={{ scale: 1.1, borderColor: '#4DEEEA' }}
              transition={{ duration: 0.2 }}
            >
              ↓
            </motion.span>
            Explore atmosphere
          </a>
        </motion.div>
      </div>

      {/* ── Right Column: Atmospheric Command Center ──────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
        className="relative flex items-center justify-center h-[400px] lg:h-auto"
      >
        <AtmosphericCommandCenter aqiValue={119} />
      </motion.div>

    </div>
  </section>
);

export default HeroSection;
