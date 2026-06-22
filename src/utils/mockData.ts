import type { AQICategory } from '../types';

// ─── AQI Helpers ──────────────────────────────────────────────────────────────

export const AQI_LEVELS = [
  { max: 50,  label: 'Good',                           color: '#00E676' },
  { max: 100, label: 'Moderate',                       color: '#FFD54F' },
  { max: 150, label: 'Unhealthy for Sensitive Groups', color: '#FF7043' },
  { max: 200, label: 'Unhealthy',                      color: '#FF7043' },
  { max: 300, label: 'Very Unhealthy',                 color: '#D50000' },
  { max: 500, label: 'Hazardous',                      color: '#D50000' },
] as const;

export const getAQILevel = (aqi: number) =>
  AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];

export const getAQIColor  = (aqi: number) => getAQILevel(aqi).color;
export const getAQILabel  = (aqi: number) => getAQILevel(aqi).label as AQICategory;

// ─── Mock City Data ───────────────────────────────────────────────────────────

export const mockCities = [
  {
    id: '1', name: 'New Delhi', state: 'Delhi',
    aqi: 187, lat: 28.6139, lng: 77.2090,
    pollutants: { pm25: 87.3, pm10: 142.1, no2: 48.2, so2: 12.1, co: 1.8, o3: 34.5 },
    trend: [120, 130, 145, 160, 175, 180, 187]
  },
  {
    id: '2', name: 'Mumbai', state: 'Maharashtra',
    aqi: 89, lat: 19.0760, lng: 72.8777,
    pollutants: { pm25: 38.1, pm10: 72.4, no2: 29.3, so2: 8.7, co: 0.9, o3: 28.1 },
    trend: [100, 95, 80, 85, 90, 88, 89]
  },
  {
    id: '3', name: 'Chennai', state: 'Tamil Nadu',
    aqi: 54, lat: 13.0827, lng: 80.2707,
    pollutants: { pm25: 18.2, pm10: 41.3, no2: 18.9, so2: 5.2, co: 0.6, o3: 22.4 },
    trend: [60, 58, 55, 52, 50, 53, 54]
  },
  {
    id: '4', name: 'Kolkata', state: 'West Bengal',
    aqi: 156, lat: 22.5726, lng: 88.3639,
    pollutants: { pm25: 72.4, pm10: 118.9, no2: 41.2, so2: 14.8, co: 1.4, o3: 31.7 },
    trend: [140, 145, 150, 148, 152, 155, 156]
  },
  {
    id: '5', name: 'Bengaluru', state: 'Karnataka',
    aqi: 67, lat: 12.9716, lng: 77.5946,
    pollutants: { pm25: 24.1, pm10: 52.8, no2: 22.4, so2: 6.3, co: 0.7, o3: 25.9 },
    trend: [75, 70, 68, 65, 62, 64, 67]
  },
  {
    id: '6', name: 'Hyderabad', state: 'Telangana',
    aqi: 103, lat: 17.3850, lng: 78.4867,
    pollutants: { pm25: 44.2, pm10: 88.3, no2: 33.7, so2: 9.8, co: 1.1, o3: 29.8 },
    trend: [90, 95, 100, 105, 102, 100, 103]
  },
];

// ─── Mock Forecast Data ───────────────────────────────────────────────────────

const BASE_AQI: Record<string, number> = {
  '1': 187, '2': 89, '3': 54, '4': 156, '5': 67, '6': 103,
};

export const mockForecast24h = (cityId: string) => {
  const base = BASE_AQI[cityId] ?? 100;
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    aqi: Math.max(10, Math.round(base + Math.sin(i / 3.5) * 35 + (Math.random() - 0.5) * 20)),
  }));
};

export const mockForecast7d = (cityId: string) => {
  const base = BASE_AQI[cityId] ?? 100;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    time: day,
    aqi: Math.max(10, Math.round(base + Math.sin(i / 2) * 40 + (Math.random() - 0.5) * 30)),
  }));
};

// ─── Mock Hotspot Data ────────────────────────────────────────────────────────

export const mockHotspots = [
  { id: '1', city: 'Delhi NCR',  zone: 'Industrial Corridor',   aqi: 287, lat: 28.50, lng: 77.10, detectedAt: '14 min ago', growthRate: '+14%' },
  { id: '2', city: 'Kanpur',     zone: 'Manufacturing Hub',     aqi: 243, lat: 26.46, lng: 80.33, detectedAt: '28 min ago', growthRate: '+9%'  },
  { id: '3', city: 'Patna',      zone: 'Transport Corridor',    aqi: 198, lat: 25.61, lng: 85.14, detectedAt: '41 min ago', growthRate: '+6%'  },
  { id: '4', city: 'Agra',       zone: 'Urban Core',            aqi: 176, lat: 27.18, lng: 78.00, detectedAt: '1h 2m ago',  growthRate: '+4%'  },
  { id: '5', city: 'Lucknow',    zone: 'Thermal Plant Zone',    aqi: 165, lat: 26.85, lng: 80.95, detectedAt: '1h 18m ago', growthRate: '+3%'  },
  { id: '6', city: 'Varanasi',   zone: 'Riverine District',     aqi: 152, lat: 25.32, lng: 82.97, detectedAt: '2h 5m ago',  growthRate: '+2%'  },
];

// ─── Mock Analytics Data ──────────────────────────────────────────────────────

export const mockAnalytics = {
  nationalAvgAQI: 119,
  activeStations: 847,
  hotspotsDetected: 23,
  improvedCities: 14,
  cityComparison: mockCities.map((c) => ({
    city: c.name,
    aqi: c.aqi,
    pm25: c.pollutants.pm25,
    no2: c.pollutants.no2,
  })).sort((a, b) => b.aqi - a.aqi), // Sorted descending for horizontal bar chart
};

// ─── Mock State Pollution Density (For Choropleth Map) ─────────────────────────

export const mockStatePollution: Record<string, { aqi: number, pm25: number, no2: number, temperature: number, rain: number, name: string }> = {
  'dl': { aqi: 92, pm25: 95, no2: 88, temperature: 42, rain: 5,  name: 'Delhi' },
  'up': { aqi: 85, pm25: 88, no2: 80, temperature: 40, rain: 15, name: 'Uttar Pradesh' },
  'br': { aqi: 80, pm25: 82, no2: 75, temperature: 38, rain: 20, name: 'Bihar' },
  'hr': { aqi: 78, pm25: 80, no2: 72, temperature: 41, rain: 10, name: 'Haryana' },
  'pb': { aqi: 72, pm25: 75, no2: 65, temperature: 39, rain: 12, name: 'Punjab' },
  'wb': { aqi: 65, pm25: 70, no2: 60, temperature: 36, rain: 45, name: 'West Bengal' },
  'jh': { aqi: 60, pm25: 65, no2: 55, temperature: 37, rain: 30, name: 'Jharkhand' },
  'rj': { aqi: 55, pm25: 58, no2: 50, temperature: 45, rain: 2,  name: 'Rajasthan' },
  'mp': { aqi: 48, pm25: 50, no2: 45, temperature: 40, rain: 25, name: 'Madhya Pradesh' },
  'ct': { aqi: 42, pm25: 45, no2: 38, temperature: 38, rain: 35, name: 'Chhattisgarh' },
  'or': { aqi: 38, pm25: 40, no2: 35, temperature: 35, rain: 55, name: 'Odisha' },
  'mh': { aqi: 35, pm25: 38, no2: 40, temperature: 34, rain: 65, name: 'Maharashtra' },
  'gj': { aqi: 33, pm25: 35, no2: 38, temperature: 39, rain: 15, name: 'Gujarat' },
  'tg': { aqi: 24, pm25: 28, no2: 30, temperature: 36, rain: 40, name: 'Telangana' },
  'ap': { aqi: 22, pm25: 25, no2: 28, temperature: 35, rain: 50, name: 'Andhra Pradesh' },
  'ka': { aqi: 20, pm25: 22, no2: 25, temperature: 30, rain: 70, name: 'Karnataka' },
  'tn': { aqi: 18, pm25: 20, no2: 22, temperature: 34, rain: 45, name: 'Tamil Nadu' },
  'kl': { aqi: 15, pm25: 18, no2: 20, temperature: 29, rain: 85, name: 'Kerala' },
  'ga': { aqi: 12, pm25: 15, no2: 18, temperature: 31, rain: 90, name: 'Goa' },
  'as': { aqi: 18, pm25: 20, no2: 15, temperature: 28, rain: 80, name: 'Assam' },
  'ml': { aqi: 10, pm25: 12, no2: 10, temperature: 22, rain: 95, name: 'Meghalaya' },
  'mn': { aqi: 8, pm25: 10, no2: 8,  temperature: 24, rain: 75, name: 'Manipur' },
  'nl': { aqi: 8, pm25: 10, no2: 8,  temperature: 23, rain: 70, name: 'Nagaland' },
  'mz': { aqi: 7, pm25: 8, no2: 7,   temperature: 25, rain: 80, name: 'Mizoram' },
  'tr': { aqi: 9, pm25: 12, no2: 9,  temperature: 27, rain: 85, name: 'Tripura' },
  'ar': { aqi: 5, pm25: 8, no2: 5,   temperature: 20, rain: 60, name: 'Arunachal Pradesh' },
  'sk': { aqi: 4, pm25: 6, no2: 4,   temperature: 18, rain: 50, name: 'Sikkim' },
  'hp': { aqi: 14, pm25: 18, no2: 12, temperature: 22, rain: 40, name: 'Himachal Pradesh' },
  'ut': { aqi: 18, pm25: 22, no2: 15, temperature: 25, rain: 45, name: 'Uttarakhand' },
  'jk': { aqi: 20, pm25: 25, no2: 18, temperature: 15, rain: 30, name: 'Jammu and Kashmir' },
  'la': { aqi: 10, pm25: 12, no2: 8,  temperature: 10, rain: 5,  name: 'Ladakh' },
  'py': { aqi: 15, pm25: 18, no2: 15, temperature: 33, rain: 50, name: 'Puducherry' },
  'ch': { aqi: 45, pm25: 50, no2: 40, temperature: 38, rain: 15, name: 'Chandigarh' },
  'dn': { aqi: 25, pm25: 28, no2: 22, temperature: 34, rain: 60, name: 'Dadra and Nagar Haveli' },
  'dd': { aqi: 25, pm25: 28, no2: 22, temperature: 34, rain: 60, name: 'Daman and Diu' },
  'an': { aqi: 5, pm25: 8, no2: 5,   temperature: 28, rain: 75, name: 'Andaman and Nicobar' },
  'ld': { aqi: 5, pm25: 8, no2: 5,   temperature: 29, rain: 70, name: 'Lakshadweep' }
};
