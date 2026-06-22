// ─── Weather & Regional Types ───────────────────────────────────────────────

export type WeatherCondition =
  | 'clear-day'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'clear-night'
  | 'cloudy-night';

export interface WeatherTheme {
  condition: WeatherCondition;
  background: string;
  label: string;
  icon: string;
}

export interface RegionalWeather {
  condition: WeatherCondition;
  temperature: number;        // °C
  feelsLike: number;          // °C
  humidity: number;           // %
  windSpeed: number;          // km/h
  windDirection: string;      // e.g. 'NE'
  pressure: number;           // hPa
  visibility: number;         // km
  uvIndex: number;
  sunrise: string;            // 'HH:MM AM'
  sunset: string;             // 'HH:MM PM'
  description: string;
}

export interface RegionalAQI {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  dominant: string;
}

export interface HourlyForecastPoint {
  time: string;               // e.g. '2 PM'
  condition: WeatherCondition;
  temperature: number;
  aqi: number;
  rainProbability: number;    // 0–100
}

export interface DayForecastPoint {
  day: string;                // e.g. 'Mon', 'Tue'
  date: string;               // e.g. '13 Jun'
  condition: WeatherCondition;
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  aqi: number;
}

export interface LocationRegion {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface LocationCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  regions: LocationRegion[];
}

export interface LocationState {
  id: string;
  name: string;
  capital: string;
  cities: LocationCity[];
}

// ─── Air Quality Types ──────────────────────────────────────────────────────

export interface AQIReading {
  id: string;
  stationId: string;
  timestamp: string;
  aqi: number;
  category: AQICategory;
  pollutants: Pollutants;
  location: GeoLocation;
}

export interface Pollutants {
  pm25: number;   // µg/m³
  pm10: number;   // µg/m³
  no2: number;    // ppb
  so2: number;    // ppb
  co: number;     // ppm
  o3: number;     // ppb
}

export interface GeoLocation {
  lat: number;
  lng: number;
  city?: string;
  region?: string;
  country?: string;
}

export interface Station {
  id: string;
  name: string;
  location: GeoLocation;
  active: boolean;
  lastUpdated: string;
}

export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

// ─── Forecast Types ──────────────────────────────────────────────────────────

export interface ForecastEntry {
  timestamp: string;
  aqi: number;
  category: AQICategory;
  pollutants: Pollutants;
}

export interface Forecast {
  stationId: string;
  generatedAt: string;
  hourly: ForecastEntry[];
  daily: ForecastEntry[];
}

// ─── Hotspot Types ───────────────────────────────────────────────────────────

export interface Hotspot {
  id: string;
  location: GeoLocation;
  aqi: number;
  category: AQICategory;
  radius: number; // meters
  detectedAt: string;
}

// ─── Analytics Types ─────────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface AnalyticsSummary {
  period: 'day' | 'week' | 'month' | 'year';
  average: number;
  peak: number;
  lowest: number;
  series: TimeSeriesPoint[];
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
}
