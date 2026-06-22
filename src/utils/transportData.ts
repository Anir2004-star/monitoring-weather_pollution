export type SeasonMode = 'Current' | 'Summer' | 'Monsoon' | 'Winter';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface TransportSource {
  id: string;
  name: string;
  type: string;
  contribution: number;
  pollutantType: string;
  lng: number;
  lat: number;
}

export interface TransportDestination {
  id: string;
  name: string;
  aqi: number;
  status: string;
  lng: number;
  lat: number;
  contributors: { name: string; value: number }[];
  forecast: {
    trend: string;
    peakWindow: string;
    expectedAqi: number;
    confidence: number;
    stability: string;
  };
  insight: string;
}

export interface TransportRoute {
  id: string;
  sourceId: string;
  destinationId: string;
  severity: SeverityLevel;
  distance: number;
  confidence: number;
  activeSeasons: SeasonMode[];
  controlPoints: { lng: number; lat: number }[];
}

export const TRANSPORT_SOURCES: TransportSource[] = [
  { id: 's_punjab', name: 'Punjab Agricultural Zone', type: 'Crop Burning', contribution: 34, pollutantType: 'PM2.5', lng: 75.85, lat: 30.90 },
  { id: 's_haryana', name: 'Haryana Industrial Belt', type: 'Industrial', contribution: 22, pollutantType: 'PM2.5, NO2', lng: 76.50, lat: 29.50 },
  { id: 's_dhanbad', name: 'Dhanbad Coal Corridor', type: 'Thermal Power', contribution: 45, pollutantType: 'SO2, PM10', lng: 86.43, lat: 23.79 },
  { id: 's_mumbai_ind', name: 'Mumbai Industrial Belt', type: 'Emissions', contribution: 28, pollutantType: 'NO2', lng: 72.87, lat: 19.07 },
  { id: 's_odisha', name: 'Odisha Mining Zone', type: 'Dust & Heavy Metals', contribution: 38, pollutantType: 'PM10', lng: 85.82, lat: 20.29 },
  { id: 's_thar', name: 'Thar Desert', type: 'Natural Dust', contribution: 18, pollutantType: 'PM10', lng: 71.50, lat: 27.50 },
  { id: 's_arabian', name: 'Arabian Sea Moisture', type: 'Marine Aerosols', contribution: 12, pollutantType: 'Sea Salt, Sulfate', lng: 68.00, lat: 15.00 },
];

export const TRANSPORT_DESTINATIONS: TransportDestination[] = [
  { 
    id: 'd_delhi', name: 'Delhi NCR', aqi: 208, status: 'UNHEALTHY', lng: 77.20, lat: 28.61,
    contributors: [
      { name: 'PM2.5 Accumulation', value: 78 },
      { name: 'Wind Stagnation', value: 65 },
      { name: 'Industrial Emissions', value: 52 },
      { name: 'Construction Dust', value: 43 },
      { name: 'Vehicle Density', value: 31 }
    ],
    forecast: { trend: 'Deteriorating', peakWindow: '6 PM – 10 PM', expectedAqi: 229, confidence: 94, stability: 'High Inversion' },
    insight: 'Northwestern transport combined with weak atmospheric dispersion is causing elevated PM2.5 accumulation over Delhi NCR. Conditions are expected to worsen during evening hours.'
  },
  {
    id: 'd_pune', name: 'Pune', aqi: 145, status: 'POOR', lng: 73.85, lat: 18.52,
    contributors: [
      { name: 'Industrial Emissions', value: 68 },
      { name: 'Traffic Corridors', value: 55 },
      { name: 'Valley Stagnation', value: 42 }
    ],
    forecast: { trend: 'Stable', peakWindow: '8 AM – 11 AM', expectedAqi: 150, confidence: 88, stability: 'Moderate' },
    insight: 'Coastal industrial emissions from Mumbai are funneling through the western ghats, settling into the Pune valley due to low morning wind speeds.'
  },
  {
    id: 'd_kolkata', name: 'Kolkata', aqi: 285, status: 'SEVERE', lng: 88.36, lat: 22.57,
    contributors: [
      { name: 'Thermal Power Plant Drift', value: 82 },
      { name: 'Heavy Diesel Traffic', value: 60 },
      { name: 'Local Biomass', value: 35 }
    ],
    forecast: { trend: 'Improving', peakWindow: '2 PM – 5 PM', expectedAqi: 240, confidence: 91, stability: 'Low' },
    insight: 'Eastern thermal corridors are continuously injecting SO2 and PM10 into the regional wind flow, converging over the dense urban canopy of Kolkata.'
  },
  {
    id: 'd_lucknow', name: 'Lucknow', aqi: 180, status: 'POOR', lng: 80.94, lat: 26.84,
    contributors: [
      { name: 'Agricultural Smoke', value: 65 },
      { name: 'Dust Resuspension', value: 40 },
      { name: 'Industrial Mix', value: 30 }
    ],
    forecast: { trend: 'Deteriorating', peakWindow: '8 PM – 2 AM', expectedAqi: 210, confidence: 85, stability: 'High Inversion' },
    insight: 'North-westerly winds are carrying residual agricultural smoke into the central plains, where nighttime thermal inversion traps it close to the surface.'
  }
];

export const TRANSPORT_ROUTES: TransportRoute[] = [
  // Winter / Current Routes (Northwest flowing)
  { id: 'r_punjab_delhi', sourceId: 's_punjab', destinationId: 'd_delhi', severity: 'Critical', distance: 247, confidence: 92, activeSeasons: ['Current', 'Winter'], controlPoints: [{ lng: 76.5, lat: 29.8 }] },
  { id: 'r_haryana_delhi', sourceId: 's_haryana', destinationId: 'd_delhi', severity: 'High', distance: 110, confidence: 95, activeSeasons: ['Current', 'Winter', 'Summer'], controlPoints: [{ lng: 76.8, lat: 29.0 }] },
  { id: 'r_dhanbad_kolkata', sourceId: 's_dhanbad', destinationId: 'd_kolkata', severity: 'Critical', distance: 260, confidence: 89, activeSeasons: ['Current', 'Winter', 'Summer'], controlPoints: [{ lng: 87.5, lat: 23.2 }] },
  { id: 'r_mumbai_pune', sourceId: 's_mumbai_ind', destinationId: 'd_pune', severity: 'Moderate', distance: 120, confidence: 80, activeSeasons: ['Current', 'Winter', 'Summer', 'Monsoon'], controlPoints: [{ lng: 73.3, lat: 18.8 }] },
  
  // Summer Routes (Dust driven)
  { id: 'r_thar_delhi', sourceId: 's_thar', destinationId: 'd_delhi', severity: 'High', distance: 450, confidence: 75, activeSeasons: ['Summer'], controlPoints: [{ lng: 74.0, lat: 28.0 }, { lng: 75.5, lat: 28.3 }] },
  { id: 'r_thar_lucknow', sourceId: 's_thar', destinationId: 'd_lucknow', severity: 'Moderate', distance: 750, confidence: 60, activeSeasons: ['Summer'], controlPoints: [{ lng: 75.0, lat: 26.5 }, { lng: 78.0, lat: 26.0 }] },
  
  // Monsoon Routes (Ocean driven)
  { id: 'r_arabian_mumbai', sourceId: 's_arabian', destinationId: 'd_pune', severity: 'Low', distance: 350, confidence: 85, activeSeasons: ['Monsoon'], controlPoints: [{ lng: 70.0, lat: 17.0 }, { lng: 72.0, lat: 18.0 }] },
  { id: 'r_odisha_kolkata', sourceId: 's_odisha', destinationId: 'd_kolkata', severity: 'Moderate', distance: 300, confidence: 70, activeSeasons: ['Monsoon'], controlPoints: [{ lng: 87.0, lat: 21.0 }] }
];
