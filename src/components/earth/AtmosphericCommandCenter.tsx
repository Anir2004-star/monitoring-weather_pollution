/**
 * AtmosphericCommandCenter — Premium Earth visualization for the Hero section.
 *
 * Wraps the existing Three.js EarthOrb with:
 * - SVG satellite orbit rings (animated rotation via CSS)
 * - Animated satellite dot traversing the outer orbit
 * - Atmospheric layer labels (stratosphere / troposphere)
 * - Live AQI badge with animated counter
 * - Atmospheric glow pulse (Framer Motion infinite)
 *
 * Design intent: The user immediately reads "this system monitors Earth's atmosphere."
 */

import React from 'react';
import { motion } from 'framer-motion';
import EarthOrb from './EarthOrb';
import AnimatedCounter from '../common/AnimatedCounter';

interface AtmosphericCommandCenterProps {
  /** Current national average AQI to display */
  aqiValue?: number;
}

const AtmosphericCommandCenter: React.FC<AtmosphericCommandCenterProps> = ({
  aqiValue = 119,
}) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 540, height: 540 }}>

      {/* ── Outer atmospheric glow pulse ───────────────────────────────── */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(77,238,234,0.06) 0%, rgba(138,124,255,0.04) 50%, transparent 70%)',
        }}
        animate={{ opacity: [0.3, 0.75, 0.3], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── SVG Orbit Rings + Latitude/Longitude Grid ────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 540 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer orbit ellipse — tilted ~20deg */}
        <ellipse
          cx="270" cy="270"
          rx="228" ry="84"
          stroke="rgba(77,238,234,0.16)"
          strokeWidth="0.8"
          strokeDasharray="4 6"
          transform="rotate(-20 270 270)"
        />

        {/* Inner orbit ellipse — tilted ~30deg */}
        <ellipse
          cx="270" cy="270"
          rx="196" ry="64"
          stroke="rgba(138,124,255,0.12)"
          strokeWidth="0.6"
          strokeDasharray="3 8"
          transform="rotate(35 270 270)"
        />

        {/* Latitude bands — equator + 30° parallels */}
        <ellipse cx="270" cy="270" rx="152" ry="23" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <ellipse cx="270" cy="234" rx="128" ry="14" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
        <ellipse cx="270" cy="306" rx="128" ry="14" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
        <ellipse cx="270" cy="200" rx="90"  ry="8"  stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
        <ellipse cx="270" cy="340" rx="90"  ry="8"  stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />

        {/* Longitude meridians — 4 faint vertical lines */}
        <line x1="270" y1="118" x2="270" y2="422" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="230" y1="125" x2="230" y2="415" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" strokeDasharray="2 6" />
        <line x1="310" y1="125" x2="310" y2="415" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" strokeDasharray="2 6" />
        <line x1="190" y1="140" x2="190" y2="400" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="2 8" />
        <line x1="350" y1="140" x2="350" y2="400" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="2 8" />
      </svg>

      {/* ── Animated Satellite Dot (outer orbit) ──────────────────────── */}
      <motion.div
        className="absolute"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#4DEEEA',
          boxShadow: '0 0 8px #4DEEEA, 0 0 16px rgba(77,238,234,0.4)',
          top: '50%',
          left: '50%',
          transformOrigin: '0 0',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        // Offset to sit on the outer orbit ellipse (rx≈195, ry≈72 at -20deg)
        // We use a CSS motion path via transform for the elliptical path
      >
        {/* The dot is offset to approximate orbit position */}
        <div
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            transform: 'translate(-192px, -3px)',
          }}
        />
      </motion.div>

      {/* ── Second satellite dot (inner orbit) ────────────────────────── */}
      <motion.div
        className="absolute"
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#8A7CFF',
          boxShadow: '0 0 6px #8A7CFF',
          top: '50%',
          left: '50%',
        }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Core Three.js Earth ────────────────────────────────────────── */}
      <div className="relative z-10">
        <EarthOrb />
      </div>

      {/* ── Atmospheric Layer Labels ───────────────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ top: '10%', left: '6%' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div style={{
          fontSize: 9,
          fontFamily: 'ui-monospace, monospace',
          color: 'rgba(77,238,234,0.5)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          STRATOSPHERE
        </div>
        <div style={{
          width: 28,
          height: 1,
          background: 'linear-gradient(to right, rgba(77,238,234,0.3), transparent)',
          marginTop: 3,
        }} />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: '12%', right: '6%' }}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <div style={{
          width: 28,
          height: 1,
          background: 'linear-gradient(to left, rgba(138,124,255,0.3), transparent)',
          marginBottom: 3,
          marginLeft: 'auto',
        }} />
        <div style={{
          fontSize: 9,
          fontFamily: 'ui-monospace, monospace',
          color: 'rgba(138,124,255,0.5)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'right',
        }}>
          TROPOSPHERE
        </div>
      </motion.div>

      {/* ── Live AQI Instrument Readout ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
        style={{
          bottom: '8%',
          right: '-4%',
          background: 'rgba(7, 13, 30, 0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: 10,
          padding: '12px 16px',
          minWidth: 130,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Live dot */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00E676]" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
          </span>
          <span style={{
            fontSize: 9,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#3D4F70',
            fontFamily: 'ui-monospace, monospace',
          }}>
            NATIONAL AVG
          </span>
        </div>

        <div className="flex items-end gap-2">
          <AnimatedCounter
            value={aqiValue}
            className="mono-data"
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#FFD54F',
              lineHeight: 1,
              display: 'block',
            }}
          />
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#FFD54F',
            marginBottom: 3,
            fontFamily: 'ui-monospace, monospace',
          }}>↑ MOD</span>
        </div>
      </motion.div>

      {/* ── Satellite Telemetry Badge ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
        style={{
          top: '6%',
          right: '2%',
          background: 'rgba(7, 13, 30, 0.8)',
          border: '1px solid rgba(77,238,234,0.2)',
          backdropFilter: 'blur(12px)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{
          fontSize: 9,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#4DEEEA',
          fontFamily: 'ui-monospace, monospace',
          marginBottom: 4,
        }}>
          SENTINEL-5P
        </div>
        <div style={{
          fontSize: 9,
          color: '#3D4F70',
          fontFamily: 'ui-monospace, monospace',
        }}>
          Orbit 15min refresh
        </div>
      </motion.div>

      {/* ── Confidence indicator ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute"
        style={{ bottom: '4%', left: '4%' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {[1, 1, 1, 1, 0.4].map((opacity, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 3,
                borderRadius: 2,
                background: '#4DEEEA',
                opacity,
              }}
            />
          ))}
          <span style={{
            fontSize: 9,
            color: '#3D4F70',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '0.08em',
          }}>94% CONF</span>
        </div>
      </motion.div>

    </div>
  );
};

export default AtmosphericCommandCenter;
