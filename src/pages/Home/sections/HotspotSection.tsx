/**
 * HotspotSection — Operational Hotspot Detection Table with Sort Controls
 *
 * Sort by: AQI (default), Growth Rate, Detection Time.
 * All 6 rows always visible. Stagger-in on scroll.
 * Enterprise monitoring aesthetic — no cards, no flair.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '../../../components/common';
import { mockHotspots, getAQIColor, getAQILabel } from '../../../utils/mockData';
import { staggerContainer, fadeUp, DEFAULT_VIEWPORT } from '../../../motion/variants';

type SortKey = 'aqi' | 'growth' | 'time';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'aqi',    label: 'AQI'        },
  { key: 'growth', label: 'Growth'     },
  { key: 'time',   label: 'Detected'   },
];

// Parse growth rate string to numeric for sorting
const parseGrowth = (g: string) => parseInt(g.replace(/[^0-9-]/g, ''), 10) || 0;

// Parse detected-at into sortable minutes-ago number
const parseTime = (t: string) => {
  const h = t.match(/(\d+)h/);
  const m = t.match(/(\d+)\s*min/);
  return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
};

const HotspotSection: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortKey>('aqi');

  const sorted = useMemo(() => {
    return [...mockHotspots].sort((a, b) => {
      if (sortBy === 'aqi')    return b.aqi - a.aqi;
      if (sortBy === 'growth') return parseGrowth(b.growthRate) - parseGrowth(a.growthRate);
      if (sortBy === 'time')   return parseTime(a.detectedAt) - parseTime(b.detectedAt);
      return 0;
    });
  }, [sortBy]);

  return (
    <section id="hotspots" className="relative py-14 px-6 bg-[var(--void)] border-t border-[rgba(255,255,255,0.03)]">
      <div className="max-w-[1280px] mx-auto">

        {/* ── Header + Sort Controls ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={DEFAULT_VIEWPORT}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-6"
        >
          <SectionLabel text="Hotspot Detection" live className="flex-shrink-0" />
          <div className="h-px flex-grow bg-[rgba(255,255,255,0.06)]" />

          {/* Sort controls */}
          <div className="flex items-center gap-1 bg-[var(--surface-01)] p-1 rounded-lg border border-[rgba(255,255,255,0.06)]">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className="transition-all rounded-md"
                style={{
                  padding: '4px 12px',
                  fontSize: 10,
                  fontFamily: 'ui-monospace, monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: sortBy === opt.key ? '#E8F0FF' : '#3D4F70',
                  background: sortBy === opt.key ? '#15234B' : 'transparent',
                  fontWeight: sortBy === opt.key ? 600 : 400,
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="mono-data text-[11px] tracking-wider" style={{ color: '#FF7043', flexShrink: 0 }}>
            {mockHotspots.length} ACTIVE · INDIA
          </span>
        </motion.div>

        {/* ── Column headers ───────────────────────────────────── */}
        <div
          className="grid mb-2 px-4"
          style={{
            gridTemplateColumns: '24px 1fr 90px 80px 160px 110px',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#3D4F70',
          }}
        >
          <div />
          <div>Location</div>
          <div className="text-right">AQI</div>
          <div className="text-right">1h Δ</div>
          <div className="hidden md:block text-center">Coordinates</div>
          <div className="text-right">Detected</div>
        </div>

        <div className="h-px w-full bg-[rgba(255,255,255,0.06)] mb-1" />

        {/* ── Table Rows ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sortBy}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {sorted.map((spot, i) => {
              const color = getAQIColor(spot.aqi);
              const label = getAQILabel(spot.aqi);
              const severityPct = Math.min(Math.max((spot.aqi / 300) * 100, 20), 100);

              return (
                <motion.div
                  key={spot.id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ background: 'rgba(12, 21, 48, 0.5)' }}
                  transition={{ duration: 0.15 }}
                  className="grid items-center px-4 py-3 rounded-lg cursor-default group"
                  style={{
                    gridTemplateColumns: '24px 1fr 90px 80px 160px 110px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  {/* Pulse dot */}
                  <div className="flex items-center justify-center">
                    <div className="relative flex items-center justify-center" style={{ width: 14, height: 14 }}>
                      <motion.div
                        className="absolute rounded-full"
                        style={{ width: '100%', height: '100%', border: `1px solid ${color}` }}
                        animate={{ scale: [1, 1.9, 1.9], opacity: [0.7, 0, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 0.25 }}
                      />
                      <div
                        className="rounded-full"
                        style={{ width: 5, height: 5, background: color, boxShadow: `0 0 5px ${color}` }}
                      />
                    </div>
                  </div>

                  {/* City + Zone */}
                  <div>
                    <div className="text-[14px] font-semibold text-[#E8F0FF] leading-tight group-hover:text-white transition-colors">
                      {spot.city}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ fontFamily: 'ui-monospace, monospace', color: '#3D4F70' }}>
                      {spot.zone}
                    </div>
                  </div>

                  {/* AQI + label */}
                  <div className="text-right">
                    <div className="mono-data text-[16px] font-bold leading-tight" style={{ color }}>
                      {spot.aqi}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ fontFamily: 'ui-monospace, monospace', color, opacity: 0.6 }}>
                      {label.split(' ')[0].toUpperCase()}
                    </div>
                  </div>

                  {/* Growth + mini bar */}
                  <div className="text-right">
                    <span className="mono-data text-[14px] font-semibold" style={{ color: '#FF7043' }}>
                      {spot.growthRate}
                    </span>
                    <div className="mt-1.5 rounded-full overflow-hidden ml-auto" style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${severityPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="hidden md:block text-center mono-data text-[11px]" style={{ color: '#3D4F70' }}>
                    {spot.lat.toFixed(2)}°N {spot.lng.toFixed(2)}°E
                  </div>

                  {/* Detected */}
                  <div className="text-right mono-data text-[12px]" style={{ color: '#3D4F70' }}>
                    {spot.detectedAt}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default HotspotSection;
