/**
 * Atmospheric Intelligence System — Motion System
 *
 * Centralized Framer Motion variant library.
 * Motion principles: Apple-like, Linear-like, Premium, Subtle, Information-focused.
 *
 * Physics curve: [0.16, 1, 0.3, 1] — fast initial movement, smooth settle.
 * All variants support `custom` for per-element stagger delay.
 */

import type { Variants, Transition } from 'framer-motion';

// ─── Core Easing ─────────────────────────────────────────────────────────────

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT     = [0.0, 0.0, 0.2, 1] as const;
export const EASE_IN_OUT  = [0.4, 0.0, 0.2, 1] as const;

// Default viewport config for all whileInView triggers
export const DEFAULT_VIEWPORT = { once: true, margin: '-80px' } as const;

// ─── Base Transition ──────────────────────────────────────────────────────────

export const baseTransition: Transition = {
  duration: 0.6,
  ease: EASE_PREMIUM,
};

// ─── Variants ─────────────────────────────────────────────────────────────────

/**
 * fadeUp — Fade in while rising 24px.
 * `custom` = stagger delay multiplier index (e.g., custom={i} with staggerChildren)
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: EASE_PREMIUM,
    },
  }),
};

/**
 * fadeIn — Pure opacity fade, no movement.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: EASE_OUT,
    },
  }),
};

/**
 * staggerContainer — Parent that orchestrates child stagger.
 * Pair with any child variant that uses `visible` state.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/**
 * staggerContainerFast — Tighter stagger for dense grids.
 */
export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.0,
    },
  },
};

/**
 * scaleIn — Scale from 0.94 while fading in. For cards and prominent elements.
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: i * 0.08,
      ease: EASE_PREMIUM,
    },
  }),
};

/**
 * slideReveal — Horizontal slide in. direction: 1 = from right, -1 = from left.
 * Pass `custom={{ i, dir }}` or just `custom={i}`.
 */
export const slideReveal: Variants = {
  hidden: (dir: 1 | -1 = 1) => ({
    opacity: 0,
    x: dir * 30,
  }),
  visible: (_dir: 1 | -1 = 1) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: EASE_PREMIUM,
    },
  }),
};

/**
 * slideRevealLeft — Convenience: slide from left.
 */
export const slideRevealLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: EASE_PREMIUM },
  },
};

/**
 * slideRevealRight — Convenience: slide from right.
 */
export const slideRevealRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: EASE_PREMIUM },
  },
};

/**
 * pulseGlow — Infinite subtle scale pulse for hotspot indicators and live badges.
 * Use with animate prop directly, not whileInView.
 */
export const pulseGlow = {
  animate: {
    scale: [1, 1.12, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2.4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * drawLine — SVG stroke-dashoffset draw animation.
 * Set strokeDasharray and initial strokeDashoffset to path length on the element.
 */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, delay: i * 0.3, ease: EASE_OUT },
      opacity: { duration: 0.3, delay: i * 0.3 },
    },
  }),
};

/**
 * barReveal — Width animation from 0% to target. For bar charts.
 * Use inline style for target width; this drives the opacity + clip.
 */
export const barReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0.5, originX: 0 },
  visible: (i: number = 0) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      scaleX: { duration: 1.0, delay: i * 0.1, ease: EASE_OUT },
      opacity: { duration: 0.3, delay: i * 0.1 },
    },
  }),
};

/**
 * wordReveal — Per-word stagger for hero headlines.
 * Wrap each word/span in this variant inside a staggerContainer.
 */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: EASE_PREMIUM,
    },
  },
};

/**
 * wordStaggerContainer — Parent for word-by-word reveals.
 */
export const wordStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

/**
 * intelligenceItem — For the Atmospheric Briefing intelligence items.
 * Slides up with left border flash.
 */
export const intelligenceItem: Variants = {
  hidden: { opacity: 0, y: 16, x: -8 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.55,
      delay: 0.3 + i * 0.12,
      ease: EASE_PREMIUM,
    },
  }),
};
