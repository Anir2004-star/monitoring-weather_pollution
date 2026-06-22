import React from 'react';
import { motion } from 'framer-motion';

interface GlowOrbProps {
  color?: 'cyan' | 'violet' | 'green' | 'red';
  size?: number;       // px
  opacity?: number;    // 0–1
  blur?: number;       // px
  className?: string;
  animate?: boolean;
}

const COLOR_MAP = {
  cyan:   '#06b6d4',
  violet: '#8b5cf6',
  green:  '#10b981',
  red:    '#ef4444',
};

const GlowOrb: React.FC<GlowOrbProps> = ({
  color = 'cyan',
  size = 400,
  opacity = 0.25,
  blur = 120,
  className = '',
  animate = true,
}) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: COLOR_MAP[color],
    opacity,
    filter: `blur(${blur}px)`,
    pointerEvents: 'none',
  };

  if (!animate) {
    return <div className={`absolute ${className}`} style={style} />;
  }

  return (
    <motion.div
      className={`absolute ${className}`}
      style={style}
      animate={{ opacity: [opacity * 0.7, opacity, opacity * 0.7], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

export default GlowOrb;
