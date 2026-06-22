import React, { useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import type { HeatmapLayer } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockCities, mockHotspots } from '../../utils/mockData';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface PollutionMapProps {
  layerType?: 'aqi' | 'pm25' | 'no2';
}

const PollutionMap: React.FC<PollutionMapProps> = ({ layerType = 'aqi' }) => {
  // Combine all mock data for heatmap
  const geojsonData = useMemo(() => {
    const features = [...mockCities, ...mockHotspots].map((point) => {
      let weight = 0;
      if (layerType === 'aqi') {
        weight = point.aqi;
      } else if ('pollutants' in point) {
        weight = (point.pollutants as any)[layerType] || point.aqi;
      } else {
        weight = point.aqi;
      }

      return {
        type: 'Feature' as const,
        properties: { weight },
        geometry: {
          type: 'Point' as const,
          coordinates: [point.lng, point.lat],
        },
      };
    });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [layerType]);

  const heatmapLayer: HeatmapLayer = {
    id: 'pollution-heatmap',
    type: 'heatmap',
    source: 'pollution',
    maxzoom: 9,
    paint: {
      // Increase weight as AQI increases
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'weight'],
        0, 0,
        500, 1
      ],
      // Color ramp: Blue/Black -> Green -> Yellow -> Orange -> Red
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0, 0, 0, 0)',
        0.2, 'rgba(0, 230, 118, 0.5)',   // Good - Green
        0.4, 'rgba(255, 213, 79, 0.7)',  // Moderate - Amber
        0.6, 'rgba(255, 112, 67, 0.8)',  // Unhealthy - Coral
        0.8, 'rgba(213, 0, 0, 0.9)',     // Hazardous - Red
        1, 'rgba(153, 0, 0, 1)'          // Extreme - Dark Red
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 15,
        9, 45
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        6, 0.8,
        9, 0.3
      ]
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#070D1E] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 text-center">
        <p className="text-[#8B9CC8] text-sm mb-2">Mapbox Token Required</p>
        <p className="text-[#3D4F70] text-xs max-w-sm">
          Please add <code className="text-[#E8F0FF]">VITE_MAPBOX_TOKEN</code> to your .env file to view the satellite intelligence map.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
      <Map
        initialViewState={{
          longitude: 80,
          latitude: 22,
          zoom: 3.5,
          pitch: 20,
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={false} // Cinamatic view
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <Source key="pollution" id="pollution" type="geojson" data={geojsonData}>
          <Layer {...heatmapLayer} />
        </Source>
        
        {/* Cinematic dark overlay over the satellite imagery to make the heatmap pop */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(4, 8, 22, 0.4)' }} />
      </Map>
    </div>
  );
};

export default PollutionMap;
