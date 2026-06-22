import type { FeatureCollection, Point } from 'geojson';

// Helper to generate a seeded random number
export const seededRandom = (seed: string) => {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
};

// Generate realistic mock atmospheric data
const generateMockAtmosphere = (seed: string) => {
  const r = seededRandom(seed);
  return {
    aqi: Math.round(50 + r * 300), // 50 to 350
    pm25: Math.round(10 + r * 150),
    no2: Math.round(5 + r * 80),
    temperature: Math.round(15 + r * 25), // 15C to 40C
    humidity: Math.round(30 + r * 60), // 30% to 90%
    windSpeed: Math.round(5 + r * 25), // 5 to 30 km/h
    rain: r > 0.8 ? Math.round(r * 50) : 0, // mostly 0, sometimes up to 50mm
  };
};

export const MOCK_CITIES: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [
    // Level 1: Major Metros (minZoom: 0)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }, properties: { id: 'c1', name: 'Delhi', minZoom: 0, ...generateMockAtmosphere('Delhi') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [72.8777, 19.0760] }, properties: { id: 'c2', name: 'Mumbai', minZoom: 0, ...generateMockAtmosphere('Mumbai') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [88.3639, 22.5726] }, properties: { id: 'c3', name: 'Kolkata', minZoom: 0, ...generateMockAtmosphere('Kolkata') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [80.2707, 13.0827] }, properties: { id: 'c4', name: 'Chennai', minZoom: 0, ...generateMockAtmosphere('Chennai') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }, properties: { id: 'c5', name: 'Bengaluru', minZoom: 0, ...generateMockAtmosphere('Bengaluru') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [78.4867, 17.3850] }, properties: { id: 'c6', name: 'Hyderabad', minZoom: 0, ...generateMockAtmosphere('Hyderabad') } },

    // Level 2: Medium Cities (minZoom: 4)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [73.8567, 18.5204] }, properties: { id: 'c7', name: 'Pune', minZoom: 4, ...generateMockAtmosphere('Pune') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [72.5714, 23.0225] }, properties: { id: 'c8', name: 'Ahmedabad', minZoom: 4, ...generateMockAtmosphere('Ahmedabad') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [80.9462, 26.8467] }, properties: { id: 'c9', name: 'Lucknow', minZoom: 4, ...generateMockAtmosphere('Lucknow') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [85.1376, 25.5941] }, properties: { id: 'c10', name: 'Patna', minZoom: 4, ...generateMockAtmosphere('Patna') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.4126, 23.2599] }, properties: { id: 'c11', name: 'Bhopal', minZoom: 4, ...generateMockAtmosphere('Bhopal') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [75.7873, 26.9124] }, properties: { id: 'c12', name: 'Jaipur', minZoom: 4, ...generateMockAtmosphere('Jaipur') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [79.0882, 21.1458] }, properties: { id: 'c13', name: 'Nagpur', minZoom: 4, ...generateMockAtmosphere('Nagpur') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [72.8311, 21.1702] }, properties: { id: 'c14', name: 'Surat', minZoom: 4, ...generateMockAtmosphere('Surat') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [83.2965, 17.6868] }, properties: { id: 'c15', name: 'Visakhapatnam', minZoom: 4, ...generateMockAtmosphere('Visakhapatnam') } },

    // Level 3: Closer Zoom Cities & Industrial Regions (minZoom: 6)
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.3271, 28.5708] }, properties: { id: 'c16', name: 'Noida', minZoom: 6, ...generateMockAtmosphere('Noida') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.0266, 28.4595] }, properties: { id: 'c17', name: 'Gurugram', minZoom: 6, ...generateMockAtmosphere('Gurugram') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [88.3297, 22.5958] }, properties: { id: 'c18', name: 'Howrah', minZoom: 6, ...generateMockAtmosphere('Howrah') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [87.3165, 23.5204] }, properties: { id: 'c19', name: 'Durgapur', minZoom: 6, ...generateMockAtmosphere('Durgapur') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [80.3319, 26.4499] }, properties: { id: 'c20', name: 'Kanpur', minZoom: 6, ...generateMockAtmosphere('Kanpur') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [78.0081, 27.1767] }, properties: { id: 'c21', name: 'Agra', minZoom: 6, ...generateMockAtmosphere('Agra') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [82.9739, 25.3176] }, properties: { id: 'c22', name: 'Varanasi', minZoom: 6, ...generateMockAtmosphere('Varanasi') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [86.2029, 22.8046] }, properties: { id: 'c23', name: 'Jamshedpur', minZoom: 6, ...generateMockAtmosphere('Jamshedpur') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [75.8577, 22.7196] }, properties: { id: 'c24', name: 'Indore', minZoom: 6, ...generateMockAtmosphere('Indore') } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.7794, 30.7333] }, properties: { id: 'c25', name: 'Chandigarh', minZoom: 6, ...generateMockAtmosphere('Chandigarh') } }
  ]
};

// Generate a dense grid for continuous meteorological rendering
const generateDenseGrid = (): FeatureCollection<Point> => {
  const features: any[] = [];
  
  const minLng = 67;
  const maxLng = 98;
  const minLat = 7;
  const maxLat = 38;
  
  const step = 0.3; // Very dense grid
  
  for (let lng = minLng; lng < maxLng; lng += step) {
    for (let lat = minLat; lat < maxLat; lat += step) {
      // Rough approximation to keep points within Indian subcontinent shape
      if (
        (lat < 20 && lng < 72) || 
        (lat < 15 && lng < 74) ||
        (lat > 30 && lng > 80) ||
        (lat < 20 && lng > 86) ||
        (lat > 28 && lng < 70)
      ) continue;

      // Use a smoothed noise function for natural looking gradients
      // Here we simulate it by combining seeded randoms of nearby large coordinates
      const baseSeed = `grid-${Math.floor(lng/2)}-${Math.floor(lat/2)}`;
      const localSeed = `grid-${lng}-${lat}`;
      const baseTemp = 15 + seededRandom(baseSeed) * 20;
      const localVar = (seededRandom(localSeed) - 0.5) * 5;
      
      const temp = Math.round(baseTemp + localVar);
      
      const baseAqi = 50 + seededRandom(baseSeed + 'aqi') * 200;
      const aqi = Math.round(baseAqi + (seededRandom(localSeed) - 0.5) * 50);

      const baseRain = seededRandom(baseSeed + 'rain') > 0.7 ? 20 + seededRandom(baseSeed) * 30 : 0;
      
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: {
          temperature: temp,
          aqi: aqi,
          pm25: Math.round(aqi * 0.4),
          no2: Math.round(aqi * 0.2),
          rain: baseRain
        }
      });
    }
  }
  
  return {
    type: 'FeatureCollection',
    features
  };
};

export const METEO_GRID = generateDenseGrid();
