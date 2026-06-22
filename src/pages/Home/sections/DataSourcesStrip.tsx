/**
 * DataSourcesStrip — Compact Scientific Credibility Bar
 *
 * A single-row horizontal strip that communicates data provenance without
 * consuming screen space. Replaces the large DataSourcesSection.
 *
 * Design: Bloomberg Terminal / Sentinel Hub metadata footer aesthetic.
 * ~60px tall, monospace, divider-separated categories.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_VIEWPORT } from '../../../motion/variants';

const SOURCES = [
  { category: 'SATELLITE', status: 'ONLINE', color: '#00E676' },
  { category: 'GROUND NETWORK', status: 'ONLINE', color: '#00E676' },
  { category: 'FORECAST MODEL', status: 'ONLINE', color: '#00E676' },
];

const DataSourcesStrip: React.FC = () => (
  <motion.section
    id="data-sources"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={DEFAULT_VIEWPORT}
    transition={{ duration: 0.6 }}
    className="relative border-t border-[rgba(255,255,255,0.06)] bg-[#020510]"
  >
    <div className="max-w-[1280px] mx-auto px-6 py-4">
      <div className="flex flex-wrap items-center gap-x-0 gap-y-3">

        {SOURCES.map((src, i) => (
          <React.Fragment key={src.category}>
            {/* Category block */}
            <div className="flex items-center gap-2.5 px-4 first:pl-0">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: src.color }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: src.color }} />
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#3D4F70',
                  marginRight: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                {src.category}
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 11,
                  color: src.color,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                {src.status}
              </span>
            </div>

            {/* Divider between categories (not after last) */}
            {i < SOURCES.length - 1 && (
              <div
                style={{
                  width: 1,
                  height: 14,
                  background: 'rgba(255,255,255,0.1)',
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Right: refresh cadence */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00E676]" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
          </span>
          <span
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: '#3D4F70',
              textTransform: 'uppercase',
            }}
          >
            LAST UPDATE 2 MIN AGO
          </span>
        </div>

      </div>
    </div>
  </motion.section>
);

export default DataSourcesStrip;
