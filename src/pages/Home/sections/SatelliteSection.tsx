import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Source, Layer, useMap } from 'react-map-gl/maplibre';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { fadeUp, DEFAULT_VIEWPORT } from '../../../motion/variants';
import WindFlowLayer from '../../../components/map/WindFlowLayer';
import { MOCK_CITIES } from '../../../utils/mockGeoData';
import { generateRasterOverlay } from '../../../utils/rasterGenerator';
import type { LayerType } from '../../../utils/rasterGenerator';

type AppLayer = 'aqi' | 'pm25' | 'no2' | 'temperature' | 'rain' | 'wind_flow';
type LegendItem = { label: string; color: string; };

const LAYER_CONFIG: Record<AppLayer, { label: string; unit: string; legend: LegendItem[] }> = {
  aqi:  { label: 'Pollution Density', unit: '%', legend: [
    { label: '> 300 (Severe)', color: '#D50000' },
    { label: '200 - 300 (Poor)', color: '#FF1744' },
    { label: '100 - 200 (Moderate)', color: '#FF5252' },
    { label: '< 100 (Good)', color: '#00E676' }
  ]},
  pm25: { label: 'PM2.5 Density', unit: 'µg/m³', legend: [
    { label: '> 150', color: '#D50000' },
    { label: '100 - 150', color: '#FF1744' },
    { label: '50 - 100', color: '#FF5252' },
    { label: '< 50', color: '#00E676' }
  ]},
  no2:  { label: 'NO₂ Hotspots', unit: 'ppb', legend: [
    { label: 'High Emission', color: '#D50000' },
    { label: 'Moderate', color: '#FFB74D' },
    { label: 'Low', color: '#FFEB3B' },
    { label: 'Safe', color: '#00E676' }
  ]},
  temperature: { label: 'Temperature', unit: '°C', legend: [
    { label: '-30', color: 'rgb(130, 80, 190)' },
    { label: '-20', color: 'rgb(80, 80, 220)' },
    { label: '-10', color: 'rgb(80, 150, 220)' },
    { label: '0', color: 'rgb(80, 200, 200)' },
    { label: '10', color: 'rgb(120, 200, 80)' },
    { label: '20', color: 'rgb(255, 220, 50)' },
    { label: '30', color: 'rgb(255, 100, 0)' },
    { label: '40', color: 'rgb(200, 0, 0)' }
  ]},
  rain: { label: 'Precipitation', unit: 'mm', legend: [
    { label: '> 40mm', color: '#D50000' },
    { label: '20 - 40mm', color: '#FFEB3B' },
    { label: '10 - 20mm', color: '#4DEEEA' },
    { label: '< 10mm', color: '#0288D1' }
  ]},
  wind_flow: { label: 'Wind Flow', unit: ' km/h', legend: [
    { label: '30+ km/h (Very Strong)', color: '#00FFFF' },
    { label: '20–30 km/h (Strong)', color: '#4DEEEA' },
    { label: '10–20 km/h (Moderate)', color: '#8B9CC8' },
    { label: '0–10 km/h (Weak)', color: '#3D4F70' }
  ]}
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Dynamic City Labels
const cityLabelLayer: any = {
  id: 'city-labels',
  type: 'symbol',
  source: 'cities',
  filter: ['>=', ['zoom'], ['get', 'minZoom']],
  layout: {
    'text-field': ['get', 'name'],
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 8, 16],
    'text-anchor': 'bottom',
    'text-offset': [0, -0.5]
  },
  paint: {
    'text-color': '#FFFFFF',
    'text-halo-color': 'rgba(0, 0, 0, 0.8)',
    'text-halo-width': 1.5
  }
};

const citySubLabelLayer: any = {
  id: 'city-sublabels',
  type: 'symbol',
  source: 'cities',
  filter: ['>=', ['zoom'], ['get', 'minZoom']],
  layout: {
    'text-field': ['concat', ['get', 'temperature'], '°C'],
    'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9, 8, 13],
    'text-anchor': 'top',
    'text-offset': [0, 0]
  },
  paint: {
    'text-color': '#8B9CC8',
    'text-halo-color': 'rgba(0, 0, 0, 0.8)',
    'text-halo-width': 1
  }
};

const rasterLayerStyle: any = {
  id: 'meteo-raster',
  type: 'raster',
  paint: {
    'raster-opacity': 0.75,
    'raster-resampling': 'linear'
  }
};

const hillshadeStyle: any = {
  id: 'hillshade',
  type: 'hillshade',
  source: 'terrain',
  paint: {
    'hillshade-shadow-color': '#000000',
    'hillshade-highlight-color': '#FFFFFF',
    'hillshade-exaggeration': 0.8
  }
};

const SatelliteSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<AppLayer>('temperature');
  const [hoveredCity, setHoveredCity] = useState<any | null>(null);
  const [mapStyle, setMapStyle] = useState<any>(null);
  const [activeView, setActiveView] = useState<'India' | 'Asia' | 'Global'>('India');
  
  const timeOffset = useSelector((state: RootState) => state.ui.timeOffset);

  // Fetch and modify the CartoDB style to remove international boundaries that conflict with India's official maps
  useEffect(() => {
    fetch(MAP_STYLE)
      .then(r => r.json())
      .then(style => {
        // Remove international boundaries (admin-0) to prevent showing disputed lines
        style.layers = style.layers.filter((l: any) => 
          !l.id.includes('boundary_country') && 
          !l.id.includes('boundary_state') && 
          !l.id.includes('admin')
        );
        setMapStyle(style);
      })
      .catch(err => {
        console.error('Failed to load map style', err);
        setMapStyle(MAP_STYLE); // fallback
      });
  }, []);

  const layerCfg = LAYER_CONFIG[activeLayer];

  const onHover = (e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      if (feature.layer.id === 'city-labels' || feature.layer.id === 'city-sublabels') {
        setHoveredCity({
          x: e.point.x,
          y: e.point.y,
          ...feature.properties
        });
        return;
      }
    }
    setHoveredCity(null);
  };

  // Generate raster URL only when the active layer or time changes
  const rasterUrl = useMemo(() => {
    if (activeLayer === 'wind_flow') return null;
    return generateRasterOverlay(activeLayer as LayerType, timeOffset);
  }, [activeLayer, timeOffset]);

  // Coordinates mapping exactly to the bounds generated in rasterGenerator.ts
  const rasterCoords: [[number, number], [number, number], [number, number], [number, number]] = [
    [-180, 80], // NW [lng, lat]
    [180, 80], // NE
    [180, -80], // SE
    [-180, -80]  // SW
  ];

  return (
    <section id="map" className="relative bg-[#020510] py-14 border-t border-[rgba(255,255,255,0.03)]">

      {/* ── Section Header ──────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={DEFAULT_VIEWPORT}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#8B9CC8] mb-1"
            style={{ fontFamily: 'ui-monospace, monospace' }}
          >
            SATELLITE INTELLIGENCE · LIVE LAYER
          </div>
          <h2 className="text-[22px] font-bold text-[#E8F0FF] tracking-tight">
            Geospatial Atmospheric Platform
          </h2>
        </motion.div>

        {/* Layer Toggles */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={DEFAULT_VIEWPORT}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex bg-[#070D1E] p-1 rounded-lg border border-[rgba(255,255,255,0.06)] overflow-x-auto"
        >
          {/* View Toggle */}
          <div className="flex bg-[#070D1E] p-1 rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden mr-4">
            {(['India', 'Asia', 'Global'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeView === view
                    ? 'bg-[#15234B] text-[#E8F0FF] shadow-sm'
                    : 'text-[#3D4F70] hover:text-[#8B9CC8]'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {(['temperature', 'aqi', 'pm25', 'no2', 'rain', 'wind_flow'] as AppLayer[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-4 py-1.5 text-[11px] font-semibold rounded-md uppercase tracking-widest transition-all whitespace-nowrap ${
                activeLayer === layer
                  ? 'bg-[#15234B] text-[#E8F0FF] shadow-sm'
                  : 'text-[#3D4F70] hover:text-[#8B9CC8]'
              }`}
            >
              {layer}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Intelligence Map Container ───────────────────────────────── */}
      <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden" style={{ height: '75vh', minHeight: 650, background: '#010814' }}>
        
        {mapStyle && (
          <Map
            id="main-map"
            initialViewState={{
              longitude: 78.9629,
              latitude: 20.5937,
              zoom: 3.8
            }}
            mapStyle={mapStyle}
            interactiveLayerIds={['city-labels', 'city-sublabels']}
            onMouseMove={onHover}
            onMouseLeave={() => setHoveredCity(null)}
            cursor={hoveredCity ? 'pointer' : 'grab'}
          >
            <MapController view={activeView} />
            {/* Smooth Continuous Raster Image Field */}
            {rasterUrl && (
              <Source id="meteo-image" type="image" url={rasterUrl} coordinates={rasterCoords}>
                <Layer {...rasterLayerStyle} />
              </Source>
            )}

            {/* 3D Terrain Hillshading (like MS Weather) */}
            <Source id="terrain" type="raster-dem" url="https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png" tileSize={256} />
            <Layer {...hillshadeStyle} />

            {/* Official Survey of India Boundary Overlay */}
            <Source id="india-official-boundary" type="geojson" data="https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson">
              <Layer 
                id="india-border-line" 
                type="line" 
                paint={{
                  'line-color': '#FFFFFF',
                  'line-width': 1.5,
                  'line-opacity': 0.7
                }} 
              />
            </Source>

            {/* Sparse Cities for Labels & Hover */}
            <Source id="cities" type="geojson" data={MOCK_CITIES}>
              <Layer {...cityLabelLayer} />
              <Layer {...citySubLabelLayer} />
            </Source>

            {activeLayer === 'wind_flow' && (
              <WindFlowLayer />
            )}
          </Map>
        )}

        {/* ── Interactive Tooltip (Hover) ── */}
        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-30 pointer-events-none"
              style={{
                left: hoveredCity.x,
                top: hoveredCity.y - 15,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="bg-[rgba(4,8,22,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-4 shadow-2xl min-w-[200px]">
                <div className="text-[16px] font-bold text-[#E8F0FF] mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                  {hoveredCity.name}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8B9CC8]">Temperature</span>
                    <span className="text-[#E8F0FF] font-medium">{Math.round(hoveredCity.temperature + (-Math.cos((timeOffset / 12) * Math.PI) * 6))}°C</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8B9CC8]">AQI</span>
                    <span className="text-[#FF1744] font-bold">{Math.round(hoveredCity.aqi * ((timeOffset === 6 || timeOffset === 18) ? 1.3 : 1.0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8B9CC8]">Humidity</span>
                    <span className="text-[#4FC3F7]">{hoveredCity.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8B9CC8]">Wind</span>
                    <span className="text-[#4DEEEA]">{hoveredCity.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Legend ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={DEFAULT_VIEWPORT}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-none z-20"
          style={{
            background: 'rgba(7, 13, 30, 0.70)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            padding: '12px 16px',
            minWidth: 160
          }}
        >
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.05em', color: '#8B9CC8', textTransform: 'uppercase' }}>
            {layerCfg.label} Scale
          </div>
          
          <div className="flex flex-row mt-2 rounded overflow-hidden shadow-lg border border-[rgba(255,255,255,0.1)]">
            {layerCfg.legend.map((item, idx) => (
              <div key={idx} className="flex flex-col flex-1" style={{ minWidth: 28 }}>
                <div className="h-4 w-full" style={{ background: item.color }} />
                <div className="flex items-center justify-center py-1 bg-[rgba(0,0,0,0.5)]">
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, color: '#E8F0FF', whiteSpace: 'nowrap' }}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Live Analytics Panel for Wind Flow ───────────────── */}
        {activeLayer === 'wind_flow' && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="absolute bottom-6 left-6 pointer-events-none z-20"
            style={{
              background: 'rgba(7, 13, 30, 0.88)',
              border: '1px solid rgba(77,238,234,0.3)',
              backdropFilter: 'blur(12px)',
              borderRadius: 10,
              padding: '16px 20px',
              minWidth: 280,
              boxShadow: '0 0 20px rgba(77,238,234,0.05)'
            }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#4DEEEA]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4DEEEA]" />
              </span>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.1em', color: '#4DEEEA', textTransform: 'uppercase' }}>
                LIVE ANALYTICS
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div style={{ fontSize: 10, color: '#8B9CC8', textTransform: 'uppercase', marginBottom: 2 }}>National Avg Wind</div>
                <div className="text-[15px] font-bold text-[#E8F0FF] mono-data">18 km/h</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#8B9CC8', textTransform: 'uppercase', marginBottom: 2 }}>Dominant Direction</div>
                <div className="text-[15px] font-bold text-[#E8F0FF] mono-data">NW <span className="text-[#4DEEEA]">↘</span></div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

// Component to handle map camera flying
const MapController: React.FC<{ view: 'India' | 'Asia' | 'Global' }> = ({ view }) => {
  const { current: map } = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    if (view === 'India') {
      map.flyTo({ center: [78.9629, 20.5937], zoom: 3.8, duration: 2000 });
    } else if (view === 'Asia') {
      map.flyTo({ center: [95, 30], zoom: 2.2, duration: 2000 });
    } else if (view === 'Global') {
      map.flyTo({ center: [10, 20], zoom: 1.0, duration: 2000 });
    }
  }, [view, map]);

  return null;
};

export default SatelliteSection;
