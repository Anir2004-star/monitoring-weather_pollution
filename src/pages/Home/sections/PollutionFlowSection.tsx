/**
 * PollutionFlowSection — "How Pollution Spreads"
 *
 * Flagship feature: Visualizes the full pollution lifecycle as a pipeline.
 * Source → Transport → Accumulation → Impact
 *
 * Uses SVG motion.path for draw-on-scroll connector lines.
 * Each node staggers in after the connector draws.
 *
 * Design: Scientific process diagram — not an infographic, not a chart.
 * Feels like a systems diagram from a climate science paper.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  staggerContainer,
  fadeUp,
  drawLine,
  slideRevealLeft,
  DEFAULT_VIEWPORT,
} from '../../../motion/variants';

interface FlowNode {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  items: string[];
  color: string;
  icon: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: 'source',
    step: '01',
    title: 'Emission Source',
    subtitle: 'Point of origin',
    items: ['Industrial combustion', 'Vehicle exhaust', 'Agricultural burning'],
    color: '#D50000',
    icon: '▲',
  },
  {
    id: 'transport',
    step: '02',
    title: 'Atmospheric Transport',
    subtitle: 'Dispersion dynamics',
    items: ['Wind patterns (2.1 m/s)', 'Temperature gradients', 'Boundary layer height'],
    color: '#FF7043',
    icon: '⟶',
  },
  {
    id: 'accumulation',
    step: '03',
    title: 'Accumulation Zone',
    subtitle: 'High-risk regions',
    items: ['Delhi NCR corridor', 'Kolkata basin', 'Indo-Gangetic Plain'],
    color: '#FFD54F',
    icon: '◉',
  },
  {
    id: 'impact',
    step: '04',
    title: 'Human Impact',
    subtitle: 'Health & visibility',
    items: ['PM2.5 inhalation risk', 'Visibility < 2km', 'AQI: Very Unhealthy'],
    color: '#8A7CFF',
    icon: '◆',
  },
];

const PollutionFlowSection: React.FC = () => (
  <section
    id="pollution-flow"
    className="relative py-24 px-6 bg-[var(--void)] border-t border-[rgba(255,255,255,0.03)] overflow-hidden"
  >
    {/* Background gradient accent */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 100%, rgba(213,0,0,0.04) 0%, transparent 60%)',
      }}
    />

    <div className="max-w-[1280px] mx-auto">

      {/* ── Section Header ──────────────────────────────────────────── */}
      <motion.div
        variants={slideRevealLeft}
        initial="hidden"
        whileInView="visible"
        viewport={DEFAULT_VIEWPORT}
        className="mb-16"
      >
        <div
          className="mb-2"
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FF7043',
          }}
        >
          POLLUTION DYNAMICS · LIFECYCLE ANALYSIS
        </div>
        <h2
          className="font-bold text-[#E8F0FF] mb-3"
          style={{ fontSize: 'clamp(26px, 3vw, 40px)', letterSpacing: '-0.03em' }}
        >
          How Pollution Spreads
        </h2>
        <p className="text-[15px] text-[#8B9CC8] max-w-[500px]">
          From point-source emission to human exposure — the complete atmospheric pathway,
          tracked in real time using multi-source fusion.
        </p>
      </motion.div>

      {/* ── Flow Diagram ─────────────────────────────────────────────── */}
      <div className="relative">

        {/* SVG connector lines between nodes */}
        <div className="hidden lg:block absolute top-[52px] left-0 right-0 z-0 px-[12.5%]">
          <svg
            className="w-full"
            style={{ height: 4, overflow: 'visible' }}
            viewBox="0 0 900 4"
            preserveAspectRatio="none"
          >
            {/* Main horizontal connector */}
            <motion.line
              x1="0" y1="2" x2="900" y2="2"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Animated gradient line on top */}
            <motion.line
              x1="0" y1="2" x2="900" y2="2"
              stroke="url(#flowGradient)"
              strokeWidth="1.5"
              variants={drawLine}
              initial="hidden"
              whileInView="visible"
              viewport={DEFAULT_VIEWPORT}
              custom={0}
              strokeDasharray="900"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D50000" stopOpacity="0.8" />
                <stop offset="33%" stopColor="#FF7043" stopOpacity="0.8" />
                <stop offset="66%" stopColor="#FFD54F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8A7CFF" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Node grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={DEFAULT_VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10"
        >
          {FLOW_NODES.map((node, i) => (
            <motion.div
              key={node.id}
              variants={fadeUp}
              custom={i}
              whileHover={{
                y: -3,
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
            >
              {/* Node card */}
              <div
                style={{
                  background: 'rgba(7, 13, 30, 0.8)',
                  border: `1px solid ${node.color}30`,
                  borderTop: `3px solid ${node.color}`,
                  borderRadius: 10,
                  padding: '24px',
                  height: '100%',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${node.color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Step + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      color: '#3D4F70',
                    }}
                  >
                    STEP {node.step}
                  </span>
                  <motion.span
                    style={{ color: node.color, fontSize: 18, display: 'inline-block' }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  >
                    {node.icon}
                  </motion.span>
                </div>

                {/* Title */}
                <div
                  className="font-semibold text-[#E8F0FF] mb-1"
                  style={{ fontSize: 16 }}
                >
                  {node.title}
                </div>
                <div
                  className="mb-4"
                  style={{
                    fontSize: 12,
                    color: node.color,
                    fontFamily: 'ui-monospace, monospace',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                  }}
                >
                  {node.subtitle}
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2">
                  {node.items.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div
                        className="mt-1.5 rounded-full flex-shrink-0"
                        style={{ width: 4, height: 4, background: node.color, opacity: 0.7 }}
                      />
                      <span className="text-[13px] text-[#8B9CC8] leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: arrow between nodes */}
              {i < FLOW_NODES.length - 1 && (
                <div
                  className="lg:hidden flex justify-center my-3"
                  style={{ color: '#3D4F70', fontSize: 20 }}
                >
                  ↓
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Footer note ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={DEFAULT_VIEWPORT}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-10"
        style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: 11,
          color: '#3D4F70',
          letterSpacing: '0.08em',
          textAlign: 'center',
        }}
      >
        PATHWAY MODELED USING WRF-CHEM · ERA5 REANALYSIS · CPCB GROUND TRUTH
      </motion.div>

    </div>
  </section>
);

export default PollutionFlowSection;
