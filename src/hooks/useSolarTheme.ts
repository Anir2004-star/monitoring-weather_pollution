import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';

// ─── Color Palettes ──────────────────────────────────────────────────────────
// Each color defined as [r, g, b, a]
const NIGHT  = { bg: [4, 8, 22], surface1: [7, 13, 30], surface2: [12, 21, 48], textPrimary: [232, 240, 255], textSecondary: [139, 156, 200], textTertiary: [61, 79, 112], borderAlpha: 0.06 };
const GOLDEN = { bg: [30, 18, 10], surface1: [50, 30, 15], surface2: [70, 40, 20], textPrimary: [255, 220, 180], textSecondary: [220, 160, 100], textTertiary: [160, 100, 60], borderAlpha: 0.15 };
const DAY    = { bg: [245, 247, 250], surface1: [240, 244, 248], surface2: [226, 232, 240], textPrimary: [26, 32, 44], textSecondary: [74, 85, 104], textTertiary: [113, 128, 150], borderAlpha: 0.08 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const blendPalette = (
  p1: typeof NIGHT,
  p2: typeof NIGHT,
  t: number
) => ({
  bg: p1.bg.map((c, i) => Math.round(lerp(c, p2.bg[i], t))),
  surface1: p1.surface1.map((c, i) => Math.round(lerp(c, p2.surface1[i], t))),
  surface2: p1.surface2.map((c, i) => Math.round(lerp(c, p2.surface2[i], t))),
  textPrimary: p1.textPrimary.map((c, i) => Math.round(lerp(c, p2.textPrimary[i], t))),
  textSecondary: p1.textSecondary.map((c, i) => Math.round(lerp(c, p2.textSecondary[i], t))),
  textTertiary: p1.textTertiary.map((c, i) => Math.round(lerp(c, p2.textTertiary[i], t))),
  borderAlpha: lerp(p1.borderAlpha, p2.borderAlpha, t),
});

const toRgb = ([r, g, b]: number[]) => `rgb(${r}, ${g}, ${b})`;

const applyPalette = (palette: ReturnType<typeof blendPalette>) => {
  const root = document.documentElement;
  root.style.setProperty('--void',           toRgb(palette.bg));
  root.style.setProperty('--deep',           toRgb(palette.bg));
  root.style.setProperty('--surface-01',     toRgb(palette.surface1));
  root.style.setProperty('--surface-02',     toRgb(palette.surface2));
  root.style.setProperty('--border-01',      `rgba(${palette.textTertiary.join(',')}, ${palette.borderAlpha})`);
  root.style.setProperty('--border-02',      `rgba(${palette.textTertiary.join(',')}, ${palette.borderAlpha * 2})`);
  root.style.setProperty('--text-primary',   toRgb(palette.textPrimary));
  root.style.setProperty('--text-secondary', toRgb(palette.textSecondary));
  root.style.setProperty('--text-tertiary',  toRgb(palette.textTertiary));
  root.style.setProperty('--text-inverse',   toRgb(palette.bg));
};

// ─── Normalize time to minutes since midnight ─────────────────────────────────
const toMins = (date: Date) => date.getHours() * 60 + date.getMinutes();

// ─── Main Hook ─────────────────────────────────────────────────────────────────
const useSolarTheme = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // Keep default Delhi coords on failure
      );
    }
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const times = SunCalc.getTimes(now, coords.lat, coords.lng);

      // Key solar times in minutes since midnight
      const sunriseStart = toMins(times.nightEnd);       // Astronomical dawn
      const sunriseEnd   = toMins(times.goldenHourEnd);  // End of golden hour (morning)
      const sunsetStart  = toMins(times.goldenHour);     // Start of golden hour (evening)
      const sunsetEnd    = toMins(times.night);           // Astronomical dusk

      const nowMins = toMins(now);

      let palette: ReturnType<typeof blendPalette>;

      if (nowMins < sunriseStart || nowMins >= sunsetEnd) {
        // Full night
        palette = blendPalette(NIGHT, NIGHT, 0);
      } else if (nowMins >= sunriseStart && nowMins < sunriseEnd) {
        // Sunrise transition: night → golden → day
        const halfPoint = (sunriseStart + sunriseEnd) / 2;
        if (nowMins < halfPoint) {
          // night → golden
          const t = (nowMins - sunriseStart) / (halfPoint - sunriseStart);
          palette = blendPalette(NIGHT, GOLDEN, Math.max(0, Math.min(1, t)));
        } else {
          // golden → day
          const t = (nowMins - halfPoint) / (sunriseEnd - halfPoint);
          palette = blendPalette(GOLDEN, DAY, Math.max(0, Math.min(1, t)));
        }
      } else if (nowMins >= sunriseEnd && nowMins < sunsetStart) {
        // Full daytime
        palette = blendPalette(DAY, DAY, 0);
      } else {
        // Sunset transition: day → golden → night
        const halfPoint = (sunsetStart + sunsetEnd) / 2;
        if (nowMins < halfPoint) {
          // day → golden
          const t = (nowMins - sunsetStart) / (halfPoint - sunsetStart);
          palette = blendPalette(DAY, GOLDEN, Math.max(0, Math.min(1, t)));
        } else {
          // golden → night
          const t = (nowMins - halfPoint) / (sunsetEnd - halfPoint);
          palette = blendPalette(GOLDEN, NIGHT, Math.max(0, Math.min(1, t)));
        }
      }

      applyPalette(palette);
    };

    updateTheme(); // Apply immediately
    const interval = setInterval(updateTheme, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [coords]);
};

export default useSolarTheme;
