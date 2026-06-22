import { seededRandom } from './mockGeoData';

export type LayerType = 'temperature' | 'aqi' | 'pm25' | 'no2' | 'rain';

// Map values to colors
const interpolateColor = (val: number, stops: {val: number, color: [number, number, number]}[]) => {
  if (val <= stops[0].val) return stops[0].color;
  if (val >= stops[stops.length - 1].val) return stops[stops.length - 1].color;
  
  for (let i = 0; i < stops.length - 1; i++) {
    if (val >= stops[i].val && val <= stops[i+1].val) {
      const t = (val - stops[i].val) / (stops[i+1].val - stops[i].val);
      const c1 = stops[i].color;
      const c2 = stops[i+1].color;
      return [
        Math.round(c1[0] + t * (c2[0] - c1[0])),
        Math.round(c1[1] + t * (c2[1] - c1[1])),
        Math.round(c1[2] + t * (c2[2] - c1[2]))
      ] as [number, number, number];
    }
  }
  return stops[0].color;
};

const getColor = (value: number, layer: LayerType): [number, number, number] => {
  if (layer === 'temperature') {
    return interpolateColor(value, [
      { val: -30, color: [130, 80, 190] },
      { val: -20, color: [80, 80, 220] },
      { val: -10, color: [80, 150, 220] },
      { val: 0, color: [80, 200, 200] },
      { val: 10, color: [120, 200, 80] },
      { val: 20, color: [255, 220, 50] },
      { val: 30, color: [255, 100, 0] },
      { val: 40, color: [200, 0, 0] },
      { val: 50, color: [100, 0, 0] }
    ]);
  }

  if (layer === 'aqi') {
    if (value <= 50) return [0, 230, 118];
    if (value <= 150) return [255, 235, 59];
    if (value <= 250) return [255, 82, 82];
    return [213, 0, 0];
  }

  if (layer === 'rain') {
    if (value <= 5) return [0, 0, 0]; // Transparent/dark
    if (value <= 20) return [2, 136, 209];
    if (value <= 40) return [77, 238, 234];
    return [255, 235, 59];
  }

  // Fallback
  return [100, 100, 100];
};

export const generateRasterOverlay = (layer: LayerType, timeOffset: number = 0): string => {
  const canvas = document.createElement('canvas');
  const width = 180;
  const height = 90;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imageData = ctx.createImageData(width, height);

  // Bounding box: [-180, 80] (NW) to [180, -80] (SE)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const lng = -180 + (x / width) * 360;
      const lat = 80 - (y / height) * 160; // Y is inverted

      const baseSeed = `grid-${Math.floor(lng / 15)}-${Math.floor(lat / 15)}`;
      const localSeed = `grid-${Math.floor(lng / 3)}-${Math.floor(lat / 3)}`;
      
      let val = 0;
      if (layer === 'temperature') {
        // Base latitude temperature: ~25C at equator, -20C at poles
        const latBase = Math.cos(lat * Math.PI / 180) * 45 - 20; 
        
        // Add macro "weather fronts" using sine waves across longitude and latitude
        const macroNoise = Math.sin(lng * Math.PI / 45) * Math.cos(lat * Math.PI / 30) * 8;
        
        // Medium scale random variations
        const mediumSeed = `grid-${Math.floor(lng / 10)}-${Math.floor(lat / 10)}`;
        const mediumNoise = (seededRandom(mediumSeed) - 0.5) * 12;
        
        // Small scale random variations
        const localSeed = `grid-${Math.floor(lng / 3)}-${Math.floor(lat / 3)}`;
        const localNoise = (seededRandom(localSeed) - 0.5) * 6;
        
        // Time of day effect (hottest at 12:00, coolest at 00:00/24:00)
        // timeOffset is 0, 6, 12, 18, 24.
        // At 12, cos(pi) = -1. We want max temp at 12, so -cos((timeOffset/12)*PI) * 6 -> +6 at noon, -6 at midnight
        const diurnalShift = -Math.cos((timeOffset / 12) * Math.PI) * 6;
        
        val = latBase + macroNoise + mediumNoise + localNoise + diurnalShift;
      } else if (layer === 'aqi') {
        const baseAqi = 50 + seededRandom(baseSeed + 'aqi') * 200;
        // AQI often spikes in morning/evening due to inversions and traffic. Let's add a simple multiplier
        const timeMultiplier = (timeOffset === 6 || timeOffset === 18) ? 1.3 : 1.0;
        val = (baseAqi + (seededRandom(localSeed) - 0.5) * 50) * timeMultiplier;
      } else if (layer === 'pm25' || layer === 'no2') {
        // Dummy data for other layers to also react
        const baseAqi = 20 + seededRandom(baseSeed + layer) * 100;
        const timeMultiplier = (timeOffset === 6 || timeOffset === 18) ? 1.4 : 1.0;
        val = (baseAqi + (seededRandom(localSeed) - 0.5) * 30) * timeMultiplier;
      } else if (layer === 'rain') {
        val = seededRandom(baseSeed + 'rain') > 0.6 ? seededRandom(localSeed) * 50 : 0;
      }

      const [r, g, b] = getColor(val, layer);
      
      const idx = (y * width + x) * 4;
      imageData.data[idx] = r;
      imageData.data[idx + 1] = g;
      imageData.data[idx + 2] = b;
      
      if (layer === 'temperature') {
        imageData.data[idx + 3] = 160; // Slightly transparent to show terrain
      } else if (layer === 'rain' && val <= 5) {
        imageData.data[idx + 3] = 0;
      } else {
        imageData.data[idx + 3] = 160;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Smooth it out by scaling it up with a blur effect using another canvas
  const smoothCanvas = document.createElement('canvas');
  smoothCanvas.width = 512;
  smoothCanvas.height = 512;
  const sCtx = smoothCanvas.getContext('2d');
  if (sCtx) {
    sCtx.filter = 'blur(16px)';
    sCtx.drawImage(canvas, 0, 0, 512, 512);
    return smoothCanvas.toDataURL('image/png');
  }

  return canvas.toDataURL('image/png');
};
