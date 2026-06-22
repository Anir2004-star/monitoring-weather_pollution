/**
 * AnimatedCounter — Counts from 0 to a target value when it enters the viewport.
 *
 * Uses Framer Motion's useMotionValue + useSpring + useInView for a smooth,
 * physics-based number animation. No external deps beyond framer-motion.
 *
 * Usage:
 *   <AnimatedCounter value={187} className="mono-data text-3xl" />
 *   <AnimatedCounter value={847} prefix="" suffix="+" />
 */

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  /** Target numeric value to count up to */
  value: number;
  /** Optional text to prepend (e.g., "+") */
  prefix?: string;
  /** Optional text to append (e.g., "%", " µg/m³") */
  suffix?: string;
  /** Decimal places to show (default: 0) */
  decimals?: number;
  /** Spring stiffness — lower = slower (default: 60) */
  stiffness?: number;
  /** Spring damping (default: 20) */
  damping?: number;
  /** CSS class names applied to the wrapping span */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  stiffness = 60,
  damping = 20,
  className,
  style,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness, damping });

  // Track the DOM element's displayed text
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent =
          prefix + latest.toFixed(decimals) + suffix;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      <span ref={displayRef}>{prefix}0{suffix}</span>
    </span>
  );
};

export default AnimatedCounter;
