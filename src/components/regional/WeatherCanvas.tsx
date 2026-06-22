/**
 * WeatherCanvas — Cinematic, photo-realistic animated weather backgrounds
 * Indian cities only. All conditions are time-aware via SunCalc.
 *
 *  clear-day    → Bright sky, atmospheric sun with corona + lens flare
 *  cloudy       → Layered SVG cumulus clouds, blue sky below
 *  cloudy-night → Dark sky, dark SVG clouds, crescent moon (LEFT position)
 *  clear-night  → SVG star field (circles, not divs), full moon (LEFT position)
 *  rain         → Dark overcast, diagonal rain streaks, ground fog
 *  thunderstorm → SVG lightning bolts, thunder flash, heavy rain, wind
 */

import React from 'react';
import type { WeatherCondition } from '../../types';

interface WeatherCanvasProps {
  condition: WeatherCondition;
  className?: string;
  children?: React.ReactNode;
}

// ─── Sky gradients ─────────────────────────────────────────────────────────────
const BG_MAP: Record<WeatherCondition, string> = {
  'clear-day':
    'linear-gradient(175deg, #1E6FA8 0%, #2D8EC8 18%, #45A8DC 42%, #62BCE8 68%, #88CFF2 100%)',
  'cloudy':
    'linear-gradient(175deg, #4C80A8 0%, #6496BC 28%, #80AECE 58%, #98C2DC 100%)',
  'cloudy-night':
    'linear-gradient(175deg, #05091A 0%, #080E22 30%, #0C142E 62%, #101838 100%)',
  'clear-night':
    'linear-gradient(175deg, #01030E 0%, #020818 32%, #030C22 65%, #040E28 100%)',
  'rain':
    'linear-gradient(175deg, #1E2830 0%, #26333E 35%, #2E3E4C 68%, #344455 100%)',
  'thunderstorm':
    'linear-gradient(175deg, #0A0F12 0%, #10181E 38%, #182028 68%, #1E2830 100%)',
};

// ─── Pre-computed star data (deterministic hash, no Math.random) ──────────────
const makeStars = (count: number, salt = 0) =>
  Array.from({ length: count }, (_, i) => {
    const h  = (((i + salt + 1) * 2_654_435_769) >>> 0);
    const h2 = ((h  * 1_664_525 + 1_013_904_223) >>> 0);
    const h3 = ((h2 * 1_664_525 + 1_013_904_223) >>> 0);
    return {
      x:       ((h  & 0xFFFF) / 65535) * 100,
      y:       (((h >> 8) & 0x3FFF) / 16383) * 86,
      r:       0.4 + (h % 22) / 22 * 1.6,
      opacity: 0.25 + (h2 % 68) / 100,
      color:   ['#FFFFFF','#FFFFFF','#FFFFFF','#FFF5E0','#E0EEFF','#FFFFD0'][(h3 >> 4) % 6],
      delay:   `${((h2 >> 3) % 38) / 10}s`,
      dur:     `${1.8 + (h3 % 36) / 10}s`,
      bright:  (h3 % 10) === 0,
    };
  });

const CLEAR_STARS  = makeStars(85);
const CLOUDY_STARS = makeStars(10, 99);

// ─── Shared SVG cumulus cloud path ────────────────────────────────────────────
// A single cloud shape (bezier path in a ~280×130 coordinate space)
const C =
  'M22,118 Q2,118 2,102 Q2,86 18,82 Q14,70 22,60 Q32,46 50,52' +
  ' Q58,36 76,32 Q100,24 112,42 Q126,30 148,34 Q172,28 180,50' +
  ' Q198,38 216,46 Q236,46 240,62 Q256,56 262,72 Q278,72 280,88' +
  ' Q282,102 262,108 Q262,118 240,120 Z';

const WeatherCanvas: React.FC<WeatherCanvasProps> = ({
  condition,
  className = '',
  children,
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl ${className}`}
    style={{ background: BG_MAP[condition], transition: 'background 1.6s ease' }}
  >

    {/* ══════════════════════════════════════════════════════════════════
        CLEAR DAY — Realistic atmospheric sun, corona, lens flare, rays
    ══════════════════════════════════════════════════════════════════ */}
    {condition === 'clear-day' && (
      <>
        {/* Sky brightening bloom near sun */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 65% 60% at 74% 10%, rgba(255,255,255,0.28) 0%, rgba(180,225,255,0.12) 40%, transparent 70%)',
        }} />

        {/* Sun SVG — top-right, atmospheric sun */}
        <svg className="absolute top-0 right-0 pointer-events-none" width="300" height="260" viewBox="0 0 300 260">
          <defs>
            <radialGradient id="cd-atmos" cx="72%" cy="22%" r="72%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.28)" />
              <stop offset="22%"  stopColor="rgba(255,240,160,0.16)" />
              <stop offset="55%"  stopColor="rgba(180,220,255,0.08)" />
              <stop offset="100%" stopColor="rgba(180,220,255,0)" />
            </radialGradient>
            <radialGradient id="cd-disc" cx="40%" cy="36%" r="60%">
              <stop offset="0%"   stopColor="#FFFEF8" />
              <stop offset="28%"  stopColor="#FFFBE0" />
              <stop offset="62%"  stopColor="#FFE840" />
              <stop offset="100%" stopColor="#FFD000" />
            </radialGradient>
            <radialGradient id="cd-core" cx="42%" cy="38%" r="52%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.90)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="cd-blur4"><feGaussianBlur stdDeviation="4" /></filter>
            <filter id="cd-blur8"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>

          {/* Atmosphere scatter */}
          <ellipse cx="222" cy="58" rx="140" ry="135" fill="url(#cd-atmos)" />

          {/* Soft corona rings */}
          <circle cx="222" cy="58" r="78" fill="rgba(255,238,100,0.07)" filter="url(#cd-blur8)" />
          <circle cx="222" cy="58" r="58" fill="rgba(255,228,60,0.11)"  filter="url(#cd-blur4)" />

          {/* Sun disc — animated pulse */}
          <circle cx="222" cy="58" r="46" fill="url(#cd-disc)" className="wc-sun-disc-anim" />
          {/* Hot inner core */}
          <circle cx="222" cy="58" r="28" fill="url(#cd-core)" />

          {/* Lens flares */}
          <line x1="0"   y1="58" x2="174" y2="58" stroke="rgba(255,252,200,0.22)" strokeWidth="1.5" className="wc-flare" />
          <line x1="222" y1="0"  x2="222" y2="172" stroke="rgba(255,252,200,0.18)" strokeWidth="1.5" className="wc-flare" />
          <rect x="98" y="51" width="14" height="14" rx="2" fill="rgba(150,210,255,0.32)"
            transform="rotate(45,105,58)" className="wc-flare" />
          <rect x="54" y="54" width="8"  height="8"  rx="1" fill="rgba(255,170,130,0.24)"
            transform="rotate(45,58,58)"  className="wc-flare" />
        </svg>

        {/* Crepuscular light rays — SVG percentage-based */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {([[-12,0.055],[-5,0.048],[3,0.048],[11,0.055],[20,0.042]] as [number,number][]).map(([a, op], i) => (
            <line key={i}
              x1="78" y1="0" x2={78 + a * 3} y2="100"
              stroke={`rgba(255,255,200,${op})`} strokeWidth="9"
              className="wc-ray"
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          ))}
        </svg>

        {/* Horizon atmosphere */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(190,225,255,0.28) 0%, transparent 38%)',
        }} />
      </>
    )}

    {/* ══════════════════════════════════════════════════════════════════
        CLOUDY DAY — 3-layer SVG cumulus bank, blue sky below
    ══════════════════════════════════════════════════════════════════ */}
    {condition === 'cloudy' && (
      <>
        {/* Faint sun glow behind clouds */}
        <div className="absolute pointer-events-none" style={{
          top: '4%', right: '22%', width: 110, height: 110, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,238,150,0.28) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }} />

        <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: '62%' }}
          viewBox="0 0 1000 320" preserveAspectRatio="xMidYMin slice">
          <defs>
            <linearGradient id="cld-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(222,236,248,0.88)" />
              <stop offset="100%" stopColor="rgba(205,222,240,0.80)" />
            </linearGradient>
            <linearGradient id="cld-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(242,250,255,0.95)" />
              <stop offset="100%" stopColor="rgba(225,238,252,0.88)" />
            </linearGradient>
            <linearGradient id="cld-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(252,255,255,1.00)" />
              <stop offset="100%" stopColor="rgba(235,246,255,0.95)" />
            </linearGradient>
            <filter id="cld-soft"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>

          {/* Back layer — grey-blue, slowest drift */}
          <g className="wc-cloud-back">
            <path d={C} transform="translate(-80,8)  scale(2.0,1.5)" fill="url(#cld-back)" />
            <path d={C} transform="translate(410,-12) scale(2.2,1.6)" fill="url(#cld-back)" />
            <path d={C} transform="translate(750,4)  scale(1.8,1.4)" fill="rgba(210,226,242,0.82)" />
          </g>

          {/* Mid layer */}
          <g className="wc-cloud-mid">
            <path d={C} transform="translate(-50,45)  scale(1.7,1.35)" fill="url(#cld-mid)" />
            <path d={C} transform="translate(360,28)  scale(1.95,1.50)" fill="url(#cld-mid)" />
            <path d={C} transform="translate(700,38)  scale(1.65,1.35)" fill="url(#cld-mid)" />
          </g>

          {/* Front layer — brightest white */}
          <g className="wc-cloud-front">
            <path d={C} transform="translate(80,72)   scale(1.5,1.25)" fill="url(#cld-front)" />
            <path d={C} transform="translate(460,55)  scale(1.70,1.40)" fill="url(#cld-front)" />
            {/* Shadow ellipses under front clouds */}
            <ellipse cx="265" cy="236" rx="200" ry="16" fill="rgba(140,168,196,0.16)" filter="url(#cld-soft)" />
            <ellipse cx="755" cy="246" rx="230" ry="16" fill="rgba(140,168,196,0.13)" filter="url(#cld-soft)" />
          </g>
        </svg>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(110,170,215,0.14) 0%, transparent 40%)',
        }} />
      </>
    )}

    {/* ══════════════════════════════════════════════════════════════════
        CLOUDY NIGHT — Dark sky, dark layered clouds, crescent moon LEFT
        Moon positioned LEFT to not overlap AQI chip (top-right in content)
    ══════════════════════════════════════════════════════════════════ */}
    {condition === 'cloudy-night' && (
      <>
        {/* Stars peeking through gaps — scattered naturally */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {CLOUDY_STARS.map((s, i) => (
            <circle key={i}
              cx={`${20 + s.x * 0.65}%`} cy={`${s.y * 0.38}%`}
              r={s.r * 0.75} fill={s.color} opacity={s.opacity * 0.6}
              className="wc-star" style={{ animationDelay: s.delay, animationDuration: s.dur }}
            />
          ))}
        </svg>

        {/* Crescent moon — shifted right to avoid top-left text */}
        <svg className="absolute top-[4%] left-[28%] pointer-events-none" width="185" height="155" viewBox="0 0 185 155">
          <defs>
            <radialGradient id="cn-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(185,205,255,0.18)" />
              <stop offset="65%"  stopColor="rgba(185,205,255,0.06)" />
              <stop offset="100%" stopColor="rgba(185,205,255,0)" />
            </radialGradient>
            <radialGradient id="cn-surf" cx="36%" cy="33%" r="64%">
              <stop offset="0%"   stopColor="#ECF0FF" />
              <stop offset="48%"  stopColor="#D4DCFA" />
              <stop offset="100%" stopColor="#BAC8EF" />
            </radialGradient>
          </defs>
          <circle cx="72" cy="62" r="68" fill="url(#cn-halo)" className="wc-moon-pulse" />
          <circle cx="72" cy="62" r="34" fill="url(#cn-surf)" />
          {/* Crescent shadow bite */}
          <circle cx="87" cy="57" r="29" fill="#0C1628" />
          {/* Subtle craters on visible crescent */}
          <circle cx="60" cy="52" r="3.5" fill="rgba(165,185,235,0.32)" />
          <circle cx="68" cy="70" r="2.5" fill="rgba(165,185,235,0.25)" />
        </svg>

        {/* Dark cloud layers SVG */}
        <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: '70%' }}
          viewBox="0 0 1000 330" preserveAspectRatio="xMidYMin slice">
          <defs>
            <linearGradient id="dc-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(52,65,98,0.88)" />
              <stop offset="100%" stopColor="rgba(36,48,78,0.95)" />
            </linearGradient>
            <linearGradient id="dc-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(40,52,82,0.94)" />
              <stop offset="100%" stopColor="rgba(26,36,62,0.99)" />
            </linearGradient>
          </defs>
          {/* Back layer */}
          <path d={C} transform="translate(-90,52)  scale(2.0,1.6)" fill="rgba(68,84,125,0.75)" />
          <path d={C} transform="translate(390,32)  scale(2.2,1.7)" fill="rgba(65,80,120,0.78)" />
          <path d={C} transform="translate(730,48)  scale(1.8,1.5)" fill="rgba(70,86,128,0.72)" />
          {/* Mid layer */}
          <path d={C} transform="translate(-55,90)  scale(1.8,1.4)" fill="url(#dc-mid)" className="wc-cloud-mid" />
          <path d={C} transform="translate(340,68)  scale(2.0,1.55)" fill="url(#dc-mid)" className="wc-cloud-mid" />
          <path d={C} transform="translate(670,78)  scale(1.65,1.40)" fill="url(#dc-mid)" className="wc-cloud-mid" />
          {/* Front layer */}
          <path d={C} transform="translate(90,122)  scale(1.6,1.3)" fill="url(#dc-front)" className="wc-cloud-front" />
          <path d={C} transform="translate(490,102) scale(1.80,1.45)" fill="url(#dc-front)" className="wc-cloud-front" />
        </svg>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(5,10,22,0.60) 0%, transparent 46%)',
        }} />
      </>
    )}

    {/* ══════════════════════════════════════════════════════════════════
        CLEAR NIGHT — SVG star field (circles), full moon LEFT, milky way
        Moon positioned LEFT to not overlap AQI chip (top-right in content)
    ══════════════════════════════════════════════════════════════════ */}
    {condition === 'clear-night' && (
      <>
        {/* Realistic star field — SVG circles, not divs (no cartoon look) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <filter id="cn-starglow">
              <feGaussianBlur stdDeviation="0.7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {CLEAR_STARS.map((s, i) => (
            <g key={i}>
              {s.bright ? (
                <>
                  {/* Outer soft halo for bright star */}
                  <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r * 3.5}
                    fill={s.color} opacity={s.opacity * 0.18} />
                  {/* Main bright star disc */}
                  <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r * 1.3}
                    fill={s.color} opacity={s.opacity}
                    filter="url(#cn-starglow)"
                    className="wc-star" style={{ animationDelay: s.delay, animationDuration: s.dur }} />
                  {/* Sparkle cross lines — percentage-based so they scale with container */}
                  <line x1={`${s.x - 1.4}%`} y1={`${s.y}%`} x2={`${s.x + 1.4}%`} y2={`${s.y}%`}
                    stroke={s.color} strokeWidth="0.4" opacity={s.opacity * 0.45} />
                  <line x1={`${s.x}%`} y1={`${s.y - 2.2}%`} x2={`${s.x}%`} y2={`${s.y + 2.2}%`}
                    stroke={s.color} strokeWidth="0.4" opacity={s.opacity * 0.45} />
                </>
              ) : (
                <circle cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
                  fill={s.color} opacity={s.opacity}
                  className="wc-star"
                  style={{ animationDelay: s.delay, animationDuration: s.dur }} />
              )}
            </g>
          ))}
        </svg>

        {/* Full moon — shifted right to avoid top-left text, craters for realism */}
        <svg className="absolute top-[2%] left-[28%] pointer-events-none" width="210" height="180" viewBox="0 0 210 180">
          <defs>
            <radialGradient id="nm-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(205,220,255,0.20)" />
              <stop offset="58%"  stopColor="rgba(200,218,255,0.07)" />
              <stop offset="100%" stopColor="rgba(200,218,255,0)" />
            </radialGradient>
            <radialGradient id="nm-surf" cx="35%" cy="32%" r="66%">
              <stop offset="0%"   stopColor="#F2F6FF" />
              <stop offset="42%"  stopColor="#DDE6FF" />
              <stop offset="100%" stopColor="#C4D2F4" />
            </radialGradient>
            <radialGradient id="nm-dark" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(160,178,224,0.28)" />
              <stop offset="100%" stopColor="rgba(160,178,224,0)" />
            </radialGradient>
          </defs>
          {/* Outer glow halo */}
          <circle cx="82" cy="68" r="82" fill="url(#nm-glow)" className="wc-moon-pulse" />
          {/* Mid glow */}
          <circle cx="82" cy="68" r="55" fill="rgba(205,220,255,0.08)" />
          {/* Moon disc */}
          <circle cx="82" cy="68" r="44" fill="url(#nm-surf)" />
          {/* Surface maria (dark patches) */}
          <circle cx="72"  cy="58"  r="8"   fill="url(#nm-dark)" />
          <circle cx="90"  cy="75"  r="6"   fill="url(#nm-dark)" />
          <circle cx="78"  cy="80"  r="4.5" fill="url(#nm-dark)" />
          {/* Craters */}
          <circle cx="65"  cy="54"  r="3.8" fill="rgba(172,190,234,0.35)" />
          <circle cx="92"  cy="62"  r="3.0" fill="rgba(172,190,234,0.28)" />
          <circle cx="76"  cy="82"  r="2.5" fill="rgba(172,190,234,0.22)" />
          <circle cx="88"  cy="50"  r="2.2" fill="rgba(172,190,234,0.20)" />
          <circle cx="62"  cy="76"  r="1.8" fill="rgba(172,190,234,0.18)" />
        </svg>

        {/* Milky Way band — subtle diagonal shimmer */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(128deg, transparent 18%, rgba(70,90,180,0.055) 42%, rgba(110,130,210,0.075) 54%, transparent 74%)',
        }} />

        {/* Horizon atmosphere */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(8,18,48,0.55) 0%, transparent 42%)',
        }} />
      </>
    )}

    {/* ══════════════════════════════════════════════════════════════════
        RAIN — Dark overcast, diagonal rain streaks, ground mist
    ══════════════════════════════════════════════════════════════════ */}
    {condition === 'rain' && (
      <>
        {/* Dense dark cloud bank */}
        <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: '58%' }}
          viewBox="0 0 1000 285" preserveAspectRatio="xMidYMin slice">
          <path d={C} transform="translate(-95,-22) scale(2.2,1.7)" fill="rgba(60,76,88,0.95)" />
          <path d={C} transform="translate(360,-32) scale(2.4,1.8)" fill="rgba(56,72,84,0.97)" />
          <path d={C} transform="translate(720,-18) scale(2.0,1.6)" fill="rgba(62,78,90,0.92)" />
          <path d={C} transform="translate(-40,52)  scale(1.9,1.5)" fill="rgba(50,65,76,0.90)" />
          <path d={C} transform="translate(420,35)  scale(2.1,1.6)" fill="rgba(48,62,74,0.92)" />
        </svg>

        {/* Diagonal rain streaks */}
        {Array.from({ length: 38 }, (_, i) => (
          <div key={i} className="wc-rain pointer-events-none absolute"
            style={{
              left:              `${((i * 2.75 + (i % 6) * 1.5)) % 102}%`,
              animationDelay:    `${(i * 0.085) % 1.6}s`,
              animationDuration: `${0.50 + (i % 8) * 0.055}s`,
              opacity:           0.38 + (i % 5) * 0.11,
              height:            `${17 + (i % 5) * 4}px`,
            }}
          />
        ))}

        {/* Visibility haze */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(38,50,60,0.18)' }} />
        {/* Ground fog / mist */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(38,50,60,0.58) 0%, rgba(38,50,60,0.16) 22%, transparent 46%)',
        }} />
      </>
    )}

    {/* ══════════════════════════════════════════════════════════════════
        THUNDERSTORM — SVG bolts, thunder flash, heavy rain, wind lines
    ══════════════════════════════════════════════════════════════════ */}
    {condition === 'thunderstorm' && (
      <>
        {/* Rolling dark storm clouds */}
        <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: '65%' }}
          viewBox="0 0 1000 310" preserveAspectRatio="xMidYMin slice">
          <defs>
            <linearGradient id="storm-cld" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(28,38,44,0.97)" />
              <stop offset="100%" stopColor="rgba(18,26,30,0.99)" />
            </linearGradient>
          </defs>
          <path d={C} transform="translate(-110,-30) scale(2.4,1.9)" fill="rgba(22,32,38,0.98)" />
          <path d={C} transform="translate(330,-42)  scale(2.6,2.0)" fill="rgba(18,28,34,0.99)" />
          <path d={C} transform="translate(690,-26)  scale(2.2,1.8)" fill="rgba(24,34,40,0.96)" />
          {/* Greenish storm underbelly */}
          <path d={C} transform="translate(-65,58)   scale(2.1,1.5)" fill="rgba(24,36,28,0.90)" />
          <path d={C} transform="translate(380,42)   scale(2.3,1.6)" fill="rgba(22,34,26,0.92)" />
          <path d={C} transform="translate(730,50)   scale(1.9,1.4)" fill="rgba(26,38,30,0.88)" />
        </svg>

        {/* ── Full-canvas thunder flash ── */}
        <div className="wc-thunder-flash pointer-events-none absolute inset-0" style={{ zIndex: 8 }} />

        {/* ── Lightning bolt #1 (main, left-center) ── */}
        <svg className="absolute pointer-events-none wc-bolt-1"
          style={{ top: '6%', left: '20%', width: 52, height: 105, zIndex: 9 }}
          viewBox="0 0 52 105">
          <defs>
            <filter id="bolt-glow-1"><feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Outer glow */}
          <path d="M32,0 L11,56 L26,56 L7,105 L48,42 L31,42 Z"
            fill="rgba(180,210,255,0.30)" filter="url(#bolt-glow-1)" />
          {/* Main bolt body */}
          <path d="M32,0 L11,56 L26,56 L7,105 L48,42 L31,42 Z" fill="#FFFCE5" />
          {/* Bright hot core */}
          <path d="M30,5 L15,50 L24,50 L10,98 L42,46 L28,46 Z" fill="rgba(255,255,255,0.85)" />
        </svg>

        {/* ── Lightning bolt #2 (right) ── */}
        <svg className="absolute pointer-events-none wc-bolt-2"
          style={{ top: '4%', left: '63%', width: 40, height: 85, zIndex: 9 }}
          viewBox="0 0 40 85">
          <defs>
            <filter id="bolt-glow-2"><feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M25,0 L9,45 L20,45 L5,85 L37,34 L22,34 Z"
            fill="rgba(180,210,255,0.28)" filter="url(#bolt-glow-2)" />
          <path d="M25,0 L9,45 L20,45 L5,85 L37,34 L22,34 Z" fill="#FFFCE5" />
          <path d="M23,5 L12,40 L19,40 L7,78 L32,37 L20,37 Z" fill="rgba(255,255,255,0.82)" />
        </svg>

        {/* ── Lightning bolt #3 (faint background) ── */}
        <svg className="absolute pointer-events-none wc-bolt-3"
          style={{ top: '8%', left: '42%', width: 30, height: 68, zIndex: 9 }}
          viewBox="0 0 30 68">
          <path d="M18,0 L6,36 L15,36 L4,68 L28,28 L16,28 Z" fill="rgba(210,228,255,0.65)" />
        </svg>

        {/* Heavy diagonal rain */}
        {Array.from({ length: 44 }, (_, i) => (
          <div key={i} className="wc-rain wc-rain-storm pointer-events-none absolute"
            style={{
              left:              `${((i * 2.35 + (i % 7) * 1.2)) % 102}%`,
              animationDelay:    `${(i * 0.068) % 1.2}s`,
              animationDuration: `${0.38 + (i % 6) * 0.045}s`,
              opacity:           0.48 + (i % 4) * 0.13,
              height:            `${22 + (i % 5) * 4}px`,
            }}
          />
        ))}

        {/* Wind gust lines */}
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="wc-wind pointer-events-none absolute"
            style={{
              top:            `${22 + i * 10}%`,
              width:          `${30 + i * 14}px`,
              animationDelay: `${i * 0.20}s`,
            }}
          />
        ))}

        {/* Dark atmosphere */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(8,14,18,0.35)' }} />
      </>
    )}

    {/* Content overlay — always above all weather effects */}
    {children && <div className="absolute inset-0" style={{ zIndex: 20 }}>{children}</div>}
  </div>
);

export default WeatherCanvas;
