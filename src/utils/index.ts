import type { AQICategory } from '../types';

// ─── AQI Helpers ──────────────────────────────────────────────────────────────

export const AQI_BREAKPOINTS: { max: number; category: AQICategory; color: string }[] = [
  { max: 50,  category: 'Good',                             color: '#22c55e' },
  { max: 100, category: 'Moderate',                         color: '#eab308' },
  { max: 150, category: 'Unhealthy for Sensitive Groups',   color: '#f97316' },
  { max: 200, category: 'Unhealthy',                        color: '#ef4444' },
  { max: 300, category: 'Very Unhealthy',                   color: '#a855f7' },
  { max: 500, category: 'Hazardous',                        color: '#7f1d1d' },
];

export const getAQICategory = (aqi: number): AQICategory => {
  const bp = AQI_BREAKPOINTS.find((b) => aqi <= b.max);
  return bp?.category ?? 'Hazardous';
};

export const getAQIColor = (aqi: number): string => {
  const bp = AQI_BREAKPOINTS.find((b) => aqi <= b.max);
  return bp?.color ?? '#7f1d1d';
};

// ─── Date / Time Helpers ──────────────────────────────────────────────────────

export const formatTimestamp = (iso: string): string => {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (iso: string): string => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
};

// ─── Number Helpers ───────────────────────────────────────────────────────────

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const round2 = (value: number): number => Math.round(value * 100) / 100;

// ─── Class Name Utility ───────────────────────────────────────────────────────

export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');
