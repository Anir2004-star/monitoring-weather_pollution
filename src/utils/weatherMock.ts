import SunCalc from 'suncalc';
import type {
  WeatherCondition,
  RegionalWeather,
  RegionalAQI,
  HourlyForecastPoint,
  DayForecastPoint,
} from '../types';

// ─── Deterministic pseudo-random (seeded by string) ───────────────────────────
const hash = (str: string): number => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
};

const seededRandom = (seed: string, index: number): number => {
  return ((hash(seed + index) % 1000) + 1000) % 1000 / 1000;
};

const pick = <T>(arr: T[], seed: string, index: number): T =>
  arr[Math.floor(seededRandom(seed, index) * arr.length)];

const range = (min: number, max: number, seed: string, index: number): number =>
  Math.round(min + seededRandom(seed, index) * (max - min));

// ─── Weather condition pools ──────────────────────────────────────────────────
const DAY_CONDITIONS:   WeatherCondition[] = ['clear-day', 'cloudy', 'rain', 'thunderstorm'];
const NIGHT_CONDITIONS: WeatherCondition[] = ['clear-night', 'cloudy-night'];
const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/**
 * Returns true if it is currently daytime at the given coordinates.
 * Uses SunCalc sunrise/sunset. Falls back to hour-based check if SunCalc fails.
 */
const isDaytime = (lat: number, lng: number, at: Date = new Date()): boolean => {
  try {
    const times = SunCalc.getTimes(at, lat, lng);
    const now = at.getTime();
    return now >= times.sunrise.getTime() && now < times.sunset.getTime();
  } catch {
    const h = at.getHours();
    return h >= 6 && h < 19;
  }
};

/**
 * Returns the golden-hour condition during sunrise/sunset transition windows.
 * Outside transition → returns null (pick from normal day/night pool).
 */
const getTransitionCondition = (lat: number, lng: number, at: Date = new Date()): WeatherCondition | null => {
  try {
    const times = SunCalc.getTimes(at, lat, lng);
    const now = at.getTime();
    const TRANSITION_MS = 45 * 60 * 1000; // 45-minute golden-hour window
    const nearSunrise = Math.abs(now - times.sunrise.getTime()) < TRANSITION_MS;
    const nearSunset  = Math.abs(now - times.sunset.getTime())  < TRANSITION_MS;
    if (nearSunrise || nearSunset) return 'clear-day'; // golden tones handled by useSolarTheme
    return null;
  } catch {
    return null;
  }
};


const WEATHER_DESCRIPTIONS: Record<WeatherCondition, string[]> = {
  'clear-day':    ['Clear skies with excellent visibility', 'Bright sunshine, low particulate risk', 'Sunny with light breeze'],
  'cloudy':       ['Overcast with dense cloud cover', 'Thick cloud layer, reduced UV', 'Stratocumulus clouds at low altitude'],
  'rain':         ['Moderate rainfall, visibility reduced', 'Rain washing particulates from atmosphere', 'Wet conditions, AQI improving'],
  'thunderstorm': ['Active thunderstorm, strong wind gusts', 'Lightning detected, stay indoors', 'Convective storm system passing'],
  'clear-night':  ['Clear night, good stellar visibility', 'Cool clear night, AQI slightly elevated', 'Calm night conditions'],
  'cloudy-night': ['Overcast night, clouds trapping heat', 'Cloud cover reducing overnight cooling', 'Dense clouds, moon obscured'],
};


// ─── Main generators ──────────────────────────────────────────────────────────

/**
 * getRegionalWeather — now fully time-aware.
 * Pass real coordinates so SunCalc can determine day vs night.
 */
export const getRegionalWeather = (
  locationId: string,
  lat: number = 28.6139,
  lng: number = 77.2090,
): RegionalWeather => {
  const now = new Date();
  const day = isDaytime(lat, lng, now);

  // Pick condition from the correct time-of-day pool
  const pool = day ? DAY_CONDITIONS : NIGHT_CONDITIONS;
  const condition: WeatherCondition = pool.length === 1
    ? pool[0]  // night: always clear-night
    : pick(pool, locationId, 0);  // day: seeded pick from day conditions

  const isHot = ['delhi', 'rajasthan', 'gujarat', 'up'].some((s) => locationId.includes(s));
  const baseTemp = isHot ? 38 : 28;
  // At night, temperature is lower
  const nightCooldown = day ? 0 : range(4, 9, locationId, 99);
  const temp = range(baseTemp - 6, baseTemp + 6, locationId, 1) - nightCooldown;

  // Real sunrise/sunset strings from SunCalc
  const times = SunCalc.getTimes(now, lat, lng);
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();

  return {
    condition,
    temperature: temp,
    feelsLike: temp + range(-2, 4, locationId, 2),
    humidity: range(condition === 'rain' || condition === 'thunderstorm' ? 70 : 40, 95, locationId, 3),
    windSpeed: range(
      condition === 'thunderstorm' ? 30 : 5,
      condition === 'thunderstorm' ? 65 : 25,
      locationId, 4,
    ),
    windDirection: pick(WIND_DIRS, locationId, 5),
    pressure: range(1005, 1020, locationId, 6),
    visibility: range(
      condition === 'rain' || condition === 'thunderstorm' ? 2 : condition === 'cloudy' ? 5 : 8,
      condition === 'clear-day' || condition === 'clear-night' ? 20 : 12,
      locationId, 7,
    ),
    uvIndex: !day ? 0 : range(condition === 'cloudy' ? 1 : 5, condition === 'clear-day' ? 11 : 7, locationId, 8),
    sunrise: fmtTime(times.sunrise),
    sunset:  fmtTime(times.sunset),
    description: pick(WEATHER_DESCRIPTIONS[condition], locationId, 11),
  };
};

export const getRegionalAQI = (locationId: string): RegionalAQI => {
  // Northern plains cities are typically more polluted
  const isNorthIndia = ['delhi', 'up', 'haryana', 'punjab', 'rajasthan'].some((s) =>
    locationId.includes(s),
  );
  const baseAQI = isNorthIndia ? 140 : 80;
  const aqi = range(baseAQI - 40, baseAQI + 80, locationId, 12);

  return {
    aqi,
    pm25: range(15, 85, locationId, 13),
    pm10: range(30, 150, locationId, 14),
    no2: range(10, 60, locationId, 15),
    o3: range(20, 90, locationId, 16),
    so2: range(5, 30, locationId, 17),
    co: range(1, 8, locationId, 18),
    dominant: ['PM2.5', 'PM10', 'NO₂', 'O₃'][Math.floor(seededRandom(locationId, 19) * 4)],
  };
};

// ─── Hourly forecast (2-hour intervals, 24h) ──────────────────────────────────
export const getHourlyForecast = (
  locationId: string,
  lat: number = 28.6139,
  lng: number = 77.2090,
): HourlyForecastPoint[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const entries: HourlyForecastPoint[] = [];
  const baseWeather = getRegionalWeather(locationId, lat, lng);
  const baseAQI = getRegionalAQI(locationId);
  const times = SunCalc.getTimes(now, lat, lng);
  const sunriseHour = times.sunrise.getHours();
  const sunsetHour  = times.sunset.getHours();

  for (let i = 0; i < 12; i++) {
    const hourOffset = i * 2;
    const hour = (currentHour + hourOffset) % 24;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    // Time-accurate day/night using real sunrise/sunset for this location
    const isNightHour = hour < sunriseHour || hour >= sunsetHour;

    const seed = `${locationId}-h${i}`;
    const condition: WeatherCondition = isNightHour
      ? 'clear-night'
      : pick(['clear-day', 'cloudy', 'rain'] as WeatherCondition[], seed, i);

    entries.push({
      time: i === 0 ? 'Now' : `${displayHour} ${ampm}`,
      condition,
      temperature: baseWeather.temperature + range(-3, 5, seed, 1) - (isNightHour ? 5 : 0),
      aqi: Math.max(20, baseAQI.aqi + range(-30, 40, seed, 2)),
      rainProbability: ['rain', 'thunderstorm'].includes(condition) ? range(55, 95, seed, 3) : range(0, 25, seed, 3),
    });
  }
  return entries;
};

// ─── Tomorrow forecast ────────────────────────────────────────────────────────
export const getTomorrowForecast = (
  locationId: string,
  lat: number = 28.6139,
  lng: number = 77.2090,
): DayForecastPoint => {
  const seed = `${locationId}-tomorrow`;
  const baseWeather = getRegionalWeather(locationId, lat, lng);
  const baseAQI = getRegionalAQI(locationId);
  // Tomorrow forecast always shows daytime condition
  const condition = pick(DAY_CONDITIONS, seed, 0);
  const maxTemp = baseWeather.temperature + range(2, 8, seed, 1);
  return {
    day: 'Tomorrow',
    date: (() => {
      const d = new Date(); d.setDate(d.getDate() + 1);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    })(),
    condition,
    maxTemp,
    minTemp: maxTemp - range(6, 12, seed, 2),
    rainProbability: ['rain', 'thunderstorm'].includes(condition) ? range(60, 90, seed, 3) : range(0, 30, seed, 3),
    aqi: Math.max(20, baseAQI.aqi + range(-20, 30, seed, 4)),
  };
};

// ─── 7-day forecast ───────────────────────────────────────────────────────────
export const getSevenDayForecast = (
  locationId: string,
  lat: number = 28.6139,
  lng: number = 77.2090,
): DayForecastPoint[] => {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const baseWeather = getRegionalWeather(locationId, lat, lng);
  const baseAQI = getRegionalAQI(locationId);
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const seed = `${locationId}-day${i}`;
    // Day 0 uses the real current condition; days 1+ always daytime forecast
    const condition = i === 0
      ? baseWeather.condition
      : pick(DAY_CONDITIONS, seed, 0);
    const maxTemp = baseWeather.temperature + range(-4, 8, seed, 1);

    return {
      day: i === 0 ? 'Today' : DAYS[d.getDay()],
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      condition,
      maxTemp,
      minTemp: maxTemp - range(5, 12, seed, 2),
      rainProbability: ['rain', 'thunderstorm'].includes(condition) ? range(60, 95, seed, 3) : range(0, 35, seed, 3),
      aqi: Math.max(20, baseAQI.aqi + range(-40, 50, seed, 4)),
    };
  });
};

// ─── AQI helpers ──────────────────────────────────────────────────────────────
export const getAQILevel = (aqi: number) => {
  if (aqi <= 50)  return { label: 'Good',       color: '#00E676', bg: 'rgba(0,230,118,0.12)'   };
  if (aqi <= 100) return { label: 'Moderate',   color: '#FFD54F', bg: 'rgba(255,213,79,0.12)'  };
  if (aqi <= 150) return { label: 'USG',         color: '#FF9800', bg: 'rgba(255,152,0,0.12)'   };
  if (aqi <= 200) return { label: 'Unhealthy',  color: '#FF7043', bg: 'rgba(255,112,67,0.12)'  };
  if (aqi <= 300) return { label: 'V.Unhealthy',color: '#AB47BC', bg: 'rgba(171,71,188,0.12)'  };
  return                  { label: 'Hazardous', color: '#D50000', bg: 'rgba(213,0,0,0.12)'     };
};

export const getAQIColor = (aqi: number) => getAQILevel(aqi).color;

// ─── Weather theme metadata ───────────────────────────────────────────────────
export const WEATHER_THEMES: Record<WeatherCondition, { bg: string; label: string; icon: string }> = {
  'clear-day':    { bg: '#4FC3F7', label: 'Sunny',        icon: '☀️'  },
  'cloudy':       { bg: '#6A9DC0', label: 'Cloudy',       icon: '⛅'  },
  'rain':         { bg: '#475359', label: 'Rainfall',     icon: '🌧️' },
  'thunderstorm': { bg: '#3A4147', label: 'Thunderstorm', icon: '⛈️' },
  'clear-night':  { bg: '#0D1B3E', label: 'Clear Night',  icon: '🌙'  },
  'cloudy-night': { bg: '#1E2645', label: 'Cloudy Night', icon: '🌙'  },
};
