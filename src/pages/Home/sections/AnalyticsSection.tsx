import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SectionLabel } from '../../../components/common';
import GlowOrb from '../../../components/common/GlowOrb';
import { mockAnalytics, getAQIColor } from '../../../utils/mockData';

const STAT_CARDS = [
  { label: 'National Avg AQI',     value: '119',   sub: 'Moderate — improving', color: '#f59e0b' },
  { label: 'Active Stations',      value: '847',   sub: 'Across 28 states',    color: '#06b6d4' },
  { label: 'Hotspots Detected',    value: '23',    sub: 'Last 24 hours',       color: '#ef4444' },
  { label: 'Cities Improving',     value: '+14',   sub: 'vs. last week',       color: '#10b981' },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const aqi = payload[0].value as number;
  return (
    <div className="glass rounded-xl px-4 py-3">
      <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>{label}</p>
      <p className="text-lg font-bold" style={{ color: getAQIColor(aqi) }}>{aqi} AQI</p>
    </div>
  );
};

const AnalyticsSection: React.FC = () => (
  <section id="analytics" className="relative py-32 px-6 overflow-hidden">
    <GlowOrb color="cyan" size={350} opacity={0.08} blur={100} className="-left-20 bottom-0" />

    {/* Top separator */}
    <div className="max-w-7xl mx-auto mb-20">
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
    </div>

    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <SectionLabel text="Analytics · Cross-City Intelligence" className="mb-5 justify-center" />
        <h2 className="font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
          <span className="text-gradient-white">Data that tells</span>
          <br />
          <span className="text-gradient-cyan">the full story.</span>
        </h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {STAT_CARDS.map(({ label, value, sub, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-2xl p-6"
            style={{ border: `1px solid ${color}20` }}
          >
            <div className="text-4xl font-black mb-2" style={{ color }}>{value}</div>
            <div className="text-sm font-medium text-white mb-1">{label}</div>
            <div className="text-xs" style={{ color: '#475569' }}>{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass rounded-3xl p-6 md:p-10"
      >
        <h3 className="font-semibold text-white text-lg mb-1">City AQI Comparison</h3>
        <p className="text-sm mb-8" style={{ color: '#475569' }}>Live readings across monitored metros</p>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={mockAnalytics.cityComparison}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="city"
              tick={{ fill: '#475569', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="aqi" radius={[6, 6, 0, 0]}>
              {mockAnalytics.cityComparison.map((entry) => (
                <Cell key={entry.city} fill={getAQIColor(entry.aqi)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {mockAnalytics.cityComparison.map((c) => (
            <div key={c.city} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: getAQIColor(c.aqi) }} />
              <span className="text-xs" style={{ color: '#94a3b8' }}>{c.city} — {c.aqi}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default AnalyticsSection;
