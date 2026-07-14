/**
 * DataSourcesSection — Scientific Credibility Grid
 *
 * Establishes the platform's data provenance and scientific credibility.
 * Shows satellite sources, weather data, ground sensors, and forecast models.
 *
 * Design: Clean, precise, institutional — like a methods section in a Nature paper.
 * Not a marketing section — a factual data lineage declaration.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  staggerContainer,
  scaleIn,
  slideRevealLeft,
  DEFAULT_VIEWPORT,
} from '../../../motion/variants';

interface DataSource {
  id: string;
  name: string;
  org: string;
  description: string;
  coverage: string;
  latency: string;
  color: string;
}

interface SourceCategory {
  category: string;
  label: string;
  color: string;
  sources: DataSource[];
}

const SOURCE_CATEGORIES: SourceCategory[] = [
  {
    category: 'SATELLITE',
    label: 'Satellite Observation',
    color: '#4DEEEA',
    sources: [
      {
        id: 'sentinel5p',
        name: 'Sentinel-5P',
        org: 'ESA / Copernicus',
        description: 'UV-VIS-NIR-SWIR spectrometer. NO₂, SO₂, O₃, CO, CH₄, aerosol index.',
        coverage: 'Global · Daily',
        latency: '3h delay',
        color: '#4DEEEA',
      },
      {
        id: 'modis',
        name: 'MODIS Terra/Aqua',
        org: 'NASA',
        description: 'Moderate Resolution Imaging Spectroradiometer. AOD, fire detection.',
        coverage: 'Global · 1–2 daily',
        latency: '6h delay',
        color: '#4DEEEA',
      },
    ],
  },
  {
    category: 'WEATHER',
    label: 'Meteorological Data',
    color: '#8A7CFF',
    sources: [
      {
        id: 'era5',
        name: 'ERA5 Reanalysis',
        org: 'ECMWF / Copernicus',
        description: 'Global climate reanalysis. Wind, temperature, humidity, pressure at 31km res.',
        coverage: 'Global · Hourly',
        latency: '5-day delay',
        color: '#8A7CFF',
      },
      {
        id: 'gfs',
        name: 'NOAA GFS',
        org: 'NOAA / NCEP',
        description: 'Global Forecast System. NWP model for 16-day atmospheric forecast.',
        coverage: 'Global · 6h cycle',
        latency: 'Real-time',
        color: '#8A7CFF',
      },
    ],
  },
  {
    category: 'GROUND',
    label: 'Ground Sensor Network',
    color: '#00E676',
    sources: [
      {
        id: 'cpcb',
        name: 'CPCB CAAQMS',
        org: 'Central Pollution Control Board',
        description: 'Continuous Ambient Air Quality Monitoring — 847 stations across 28 states.',
        coverage: 'India · 15 min',
        latency: 'Real-time',
        color: '#00E676',
      },
    ],
  },
  {
    category: 'MODELS',
    label: 'Forecast Models',
    color: '#FFD54F',
    sources: [
      {
        id: 'xgboost',
        name: 'XGBoost Ensemble',
        org: 'Internal · v3.1',
        description: 'Gradient-boosted tree ensemble trained on 5 years of multi-source data fusion.',
        coverage: 'India · Hourly',
        latency: 'Inference: 2min',
        color: '#FFD54F',
      },
      {
        id: 'lstm',
        name: 'LSTM Network',
        org: 'Internal · v2.4',
        description: 'Long Short-Term Memory recurrent network for temporal AQI correction layer.',
        coverage: 'India · Hourly',
        latency: 'Inference: 4min',
        color: '#FFD54F',
      },
    ],
  },
];

const DataSourcesSection: React.FC = () => (
  <section
    id="data-sources"
    className="relative py-24 px-6 bg-[var(--deep)] border-t border-[rgba(255,255,255,0.03)]"
  >
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
            color: '#8B9CC8',
          }}
        >
          DATA PROVENANCE · SCIENTIFIC SOURCES
        </div>
        <h2
          className="font-bold text-[#E8F0FF] mb-3"
          style={{ fontSize: 'clamp(26px, 3vw, 40px)', letterSpacing: '-0.03em' }}
        >
          Powered by the world's best atmospheric data.
        </h2>
        <p className="text-[15px] text-[#8B9CC8] max-w-[560px]">
          Every forecast, hotspot, and insight is grounded in validated
          satellite, reanalysis, and sensor data from leading scientific institutions.
        </p>
      </motion.div>

      {/* ── Source Categories ───────────────────────────────────────── */}
      <div className="flex flex-col gap-10">
        {SOURCE_CATEGORIES.map((category, ci) => (
          <div key={category.category}>
            {/* Category header */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={DEFAULT_VIEWPORT}
              transition={{ duration: 0.5, delay: ci * 0.05 }}
              className="flex items-center gap-4 mb-5"
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: category.color,
                  boxShadow: `0 0 8px ${category.color}80`,
                }}
              />
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: category.color,
                }}
              >
                {category.label}
              </span>
              <div
                className="flex-grow h-px"
                style={{ background: `${category.color}20` }}
              />
            </motion.div>

            {/* Source cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={DEFAULT_VIEWPORT}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {category.sources.map((source, si) => (
                <motion.div
                  key={source.id}
                  variants={scaleIn}
                  custom={si}
                  whileHover={{
                    borderColor: `${source.color}40`,
                    transition: { duration: 0.2 },
                  }}
                  style={{
                    background: 'rgba(7, 13, 30, 0.6)',
                    border: `1px solid rgba(255,255,255,0.06)`,
                    borderRadius: 10,
                    padding: '20px',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${source.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Source name + org */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className="font-semibold text-[#E8F0FF] mb-1"
                        style={{ fontSize: 15 }}
                      >
                        {source.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#3D4F70',
                          fontFamily: 'ui-monospace, monospace',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {source.org}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontFamily: 'ui-monospace, monospace',
                        letterSpacing: '0.08em',
                        color: source.color,
                        padding: '3px 8px',
                        border: `1px solid ${source.color}30`,
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {source.coverage}
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-[#8B9CC8] leading-relaxed mb-4"
                    style={{ fontSize: 13 }}
                  >
                    {source.description}
                  </p>

                  {/* Latency footer */}
                  <div
                    className="flex items-center gap-2 pt-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: source.color,
                        opacity: 0.6,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'ui-monospace, monospace',
                        letterSpacing: '0.06em',
                        color: '#3D4F70',
                      }}
                    >
                      {source.latency}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default DataSourcesSection;
