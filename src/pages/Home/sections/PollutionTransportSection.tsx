import React, { useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { TRANSPORT_SOURCES, TRANSPORT_DESTINATIONS, TRANSPORT_ROUTES } from '../../../utils/transportData';
import type { SeasonMode, TransportDestination } from '../../../utils/transportData';
import { generateRasterOverlay } from '../../../utils/rasterGenerator';
import type { LayerType } from '../../../utils/rasterGenerator';
import { MOCK_CITIES } from '../../../utils/mockGeoData';
import WindFlowLayer from '../../../components/map/WindFlowLayer';
import PollutionTransportLayer from '../../../components/map/PollutionTransportLayer';
import TransportCommandCenter from '../../../components/transport/TransportCommandCenter';
import { SectionLabel } from '../../../components/common';

const SEASONS: SeasonMode[] = ['Current', 'Summer', 'Monsoon', 'Winter'];
const LAYERS = ['Transport', 'AQI', 'PM2.5', 'NO₂', 'Temperature', 'Rain', 'Wind'];

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

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

const rasterLayerStyle: any = {
  id: 'meteo-raster',
  type: 'raster',
  paint: {
    'raster-opacity': 0.75,
    'raster-resampling': 'linear'
  }
};

const PollutionTransportSection: React.FC = () => {
  const [seasonMode, setSeasonMode] = useState<SeasonMode>('Current');
  const [activeLayer, setActiveLayer] = useState<string>('Transport');
  const [hoveredSourceId, setHoveredSourceId] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] = useState<TransportDestination | null>(null);
  const [mapStyle, setMapStyle] = useState<any>(null);

  const timeOffset = useSelector((state: RootState) => state.ui.timeOffset);

  React.useEffect(() => {
    fetch(MAP_STYLE)
      .then(r => r.json())
      .then(style => {
        style.layers = style.layers.filter((l: any) => 
          !l.id.includes('boundary_country') && 
          !l.id.includes('boundary_state') && 
          !l.id.includes('admin')
        );
        setMapStyle(style);
      })
      .catch(err => {
        console.error('Failed to load map style', err);
        setMapStyle(MAP_STYLE);
      });
  }, []);

  const rasterUrl = React.useMemo(() => {
    if (activeLayer === 'Transport' || activeLayer === 'Wind') return null;
    let mappedLayer: LayerType = 'temperature';
    if (activeLayer === 'AQI') mappedLayer = 'aqi';
    if (activeLayer === 'PM2.5') mappedLayer = 'pm25';
    if (activeLayer === 'NO₂') mappedLayer = 'no2';
    if (activeLayer === 'Rain') mappedLayer = 'rain';
    return generateRasterOverlay(mappedLayer, timeOffset);
  }, [activeLayer, timeOffset]);

  const rasterCoords: [[number, number], [number, number], [number, number], [number, number]] = [
    [-180, 80], [180, 80], [180, -80], [-180, -80]
  ];

  // Map interaction
  const onMouseMove = (e: any) => {
    // Basic hit detection based on screen coordinates since we don't have Mapbox layers
    // We compute this inside the canvas usually, but for React state, we do a simple bounding box
    const point = e.point;
    let foundSource = null;
    let foundDest = null;
    
    // We assume the map object is available to project, but e.target is the map
    const map = e.target;
    
    for (const s of TRANSPORT_SOURCES) {
      const p = map.project([s.lng, s.lat]);
      if (Math.hypot(point.x - p.x, point.y - p.y) < 20) {
        foundSource = s.id;
        break;
      }
    }
    
    for (const d of TRANSPORT_DESTINATIONS) {
      const p = map.project([d.lng, d.lat]);
      if (Math.hypot(point.x - p.x, point.y - p.y) < 25) {
        foundDest = d;
        break;
      }
    }

    setHoveredSourceId(foundSource);
    if (foundDest && foundDest.id !== activeDestination?.id) {
      setActiveDestination(foundDest);
    }
    
    if (foundSource || foundDest) {
      map.getCanvas().style.cursor = 'pointer';
    } else {
      map.getCanvas().style.cursor = 'grab';
    }
  };

  const incomingRoutes = activeDestination 
    ? TRANSPORT_ROUTES.filter(r => r.destinationId === activeDestination.id && r.activeSeasons.includes(seasonMode))
    : [];

  return (
    <section id="pollution-transport" className="relative py-16 px-6 bg-[#020510] border-t border-[rgba(255,255,255,0.03)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <SectionLabel text="Atmospheric Flow" />
            <h2 className="text-[32px] md:text-[40px] font-black text-[#E8F0FF] tracking-tight leading-none mt-2 mb-2">
              POLLUTION TRANSPORT <span className="text-[#4DEEEA]">SIMULATION</span>
            </h2>
            <p className="text-[#8B9CC8] text-[14px] md:text-[16px] max-w-[600px] leading-relaxed">
              Real-time atmospheric transport intelligence across India. Visualize how pollution, dust, and emissions travel through regional wind systems.
            </p>
          </div>
          
          {/* Season Toggle */}
          <div className="flex bg-[#070D1E] p-1 rounded-lg border border-[rgba(255,255,255,0.06)] self-start md:self-auto">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => setSeasonMode(season)}
                className={`px-4 py-2 text-[12px] font-bold rounded uppercase tracking-widest transition-all ${
                  seasonMode === season
                    ? 'bg-[#15234B] text-[#4DEEEA] shadow-sm'
                    : 'text-[#3D4F70] hover:text-[#8B9CC8]'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* 70/30 Main Layout */}
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#040816] h-[750px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Left: Map (70%) */}
          <div className="relative w-full lg:w-[70%] h-[400px] lg:h-full">
            
            {/* Map Controls / Layers Overlay */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {LAYERS.map(layer => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all ${
                    activeLayer === layer 
                    ? 'bg-[#4DEEEA] text-[#020510]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#8B9CC8] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>

            {/* Maplibre Engine */}
            {mapStyle && (
              <Map
                initialViewState={{
                  longitude: 79,
                  latitude: 22,
                  zoom: 4
                }}
                mapStyle={mapStyle}
                onMouseMove={onMouseMove}
                interactiveLayerIds={['city-labels']}
              >
                {/* Raster Overlays for AQI, Temp, etc. */}
                {rasterUrl && (
                  <Source key="meteo-image" id="meteo-image" type="image" url={rasterUrl} coordinates={rasterCoords}>
                    <Layer {...rasterLayerStyle} />
                  </Source>
                )}

                {/* State/Country Boundaries Overlay */}
                <Source key="india-official-boundary" id="india-official-boundary" type="geojson" data="https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson">
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

                {/* Cities Source */}
                <Source key="cities" id="cities" type="geojson" data={MOCK_CITIES}>
                  <Layer {...cityLabelLayer} />
                </Source>

                {activeLayer === 'Wind' && <WindFlowLayer />}

                {activeLayer === 'Transport' && (
                  <PollutionTransportLayer 
                    sources={TRANSPORT_SOURCES}
                    destinations={TRANSPORT_DESTINATIONS}
                    routes={TRANSPORT_ROUTES}
                    seasonMode={seasonMode}
                    hoveredSourceId={hoveredSourceId}
                  />
                )}
              </Map>
            )}

            {/* Source Hover Popup Overlay */}
            {hoveredSourceId && (
              <div className="absolute bottom-6 left-6 z-20 bg-[rgba(4,8,22,0.95)] backdrop-blur-xl border border-[#FF1744] rounded-xl p-4 shadow-[0_0_30px_rgba(255,23,68,0.2)] min-w-[220px] pointer-events-none">
                {(() => {
                  const source = TRANSPORT_SOURCES.find(s => s.id === hoveredSourceId);
                  if (!source) return null;
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF1744]" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1744]" />
                        </span>
                        <span className="text-[10px] tracking-wider uppercase text-[#8B9CC8]">Emission Source</span>
                      </div>
                      <div className="text-[14px] font-bold text-[#E8F0FF] mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                        {source.name}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#8B9CC8]">Contribution</span>
                          <span className="text-[#FF1744] font-bold">{source.contribution}%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#8B9CC8]">Primary Pollutant</span>
                          <span className="text-[#E8F0FF] font-medium">{source.pollutantType}</span>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
            
          </div>

          {/* Right: Command Center (30%) */}
          <div className="w-full lg:w-[30%] h-[350px] lg:h-full relative z-30 shadow-[-20px_0_30px_rgba(0,0,0,0.5)]">
            <TransportCommandCenter 
              destination={activeDestination}
              incomingRoutes={incomingRoutes}
              allSources={TRANSPORT_SOURCES}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default PollutionTransportSection;
