export interface RadarNode {
  id: string;
  label: string;
  detail: string;
  angle: number; // degrees
  distance: number; // percentage from center (0-100)
  color: string;
  status: 'Critical' | 'Warning' | 'Monitor';
}

export const RADAR_DATA_BY_REGION: Record<string, RadarNode[]> = {
  'Delhi NCR': [
    { id: 'dl-pm25', label: 'PM2.5 Accumulation', detail: 'Dense particulate matter clustering detected. Trajectory stagnant.', angle: 45, distance: 20, color: '#FF1744', status: 'Critical' },
    { id: 'dl-wind', label: 'Wind Suppression', detail: 'Surface winds below 2m/s. Dispersion inhibited.', angle: 150, distance: 40, color: '#FFB74D', status: 'Warning' },
    { id: 'dl-stubble', label: 'Agricultural Fires', detail: 'Thermal signatures from upwind corridor.', angle: 330, distance: 30, color: '#D50000', status: 'Critical' },
    { id: 'dl-inversion', label: 'Temperature Inversion', detail: 'Boundary layer collapse at 350m altitude.', angle: 260, distance: 55, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Mumbai': [
    { id: 'mh-pm10', label: 'Construction Dust (PM10)', detail: 'Extensive infrastructural activity kicking up coarse particulates.', angle: 90, distance: 25, color: '#FF9100', status: 'Critical' },
    { id: 'mh-industrial', label: 'Coastal Industrial Output', detail: 'Refinery emissions mixing with sea breeze.', angle: 200, distance: 45, color: '#FF5252', status: 'Warning' },
    { id: 'mh-traffic', label: 'Congestion Exhaust', detail: 'Peak hour NO2 buildup along arterial expressways.', angle: 320, distance: 60, color: '#4DEEEA', status: 'Monitor' }
  ],
  'Bengaluru': [
    { id: 'ka-traffic', label: 'Vehicle Density (NO2)', detail: 'Heavy traffic volume leading to nitrogen dioxide spikes.', angle: 120, distance: 30, color: '#FF1744', status: 'Critical' },
    { id: 'ka-dust', label: 'Resuspended Dust', detail: 'Dry weather causing previously settled dust to become airborne.', angle: 30, distance: 50, color: '#FFB74D', status: 'Warning' },
    { id: 'ka-wind', label: 'Stagnant Air Mass', detail: 'Low wind speeds preventing horizontal dispersion.', angle: 250, distance: 75, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Kolkata': [
    { id: 'wb-coal', label: 'Coal Combustion', detail: 'High SO2 and particulate signatures from regional power plants.', angle: 15, distance: 25, color: '#D50000', status: 'Critical' },
    { id: 'wb-humidity', label: 'Aerosol Trapping', detail: 'High relative humidity swelling hygroscopic particles.', angle: 160, distance: 45, color: '#4DEEEA', status: 'Warning' },
    { id: 'wb-traffic', label: 'Diesel Exhaust', detail: 'Heavy commercial vehicle movement in port areas.', angle: 280, distance: 55, color: '#FF9100', status: 'Warning' }
  ],
  'Chennai': [
    { id: 'tn-industrial', label: 'Manufacturing Hub Emissions', detail: 'VOC and NO2 spikes from suburban industrial zones.', angle: 70, distance: 35, color: '#FF5252', status: 'Warning' },
    { id: 'tn-humidity', label: 'Coastal Humidity', detail: 'Marine boundary layer affecting dispersion rates.', angle: 190, distance: 60, color: '#4DEEEA', status: 'Monitor' },
    { id: 'tn-traffic', label: 'Urban Congestion', detail: 'Elevated localized NO2 around transport hubs.', angle: 310, distance: 65, color: '#FFB74D', status: 'Monitor' }
  ],
  'Hyderabad': [
    { id: 'tg-traffic', label: 'IT Corridor Congestion', detail: 'Concentrated vehicular emissions during peak hours.', angle: 110, distance: 30, color: '#FF1744', status: 'Critical' },
    { id: 'tg-construction', label: 'Urban Expansion', detail: 'Dust plumes from suburban development projects.', angle: 45, distance: 50, color: '#FF9100', status: 'Warning' },
    { id: 'tg-inversion', label: 'Micro-inversion', detail: 'Localized trapping of pollutants post-sunset.', angle: 270, distance: 70, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Ahmedabad': [
    { id: 'gj-industrial', label: 'Textile/Chemical Hubs', detail: 'High industrial exhaust output in eastern corridors.', angle: 60, distance: 25, color: '#D50000', status: 'Critical' },
    { id: 'gj-dust', label: 'Arid Dust', detail: 'Wind-blown dust from surrounding arid regions.', angle: 210, distance: 40, color: '#FFB74D', status: 'Warning' },
    { id: 'gj-traffic', label: 'Commercial Traffic', detail: 'Heavy goods vehicle movement increasing PM2.5.', angle: 330, distance: 60, color: '#FF5252', status: 'Monitor' }
  ],
  'Pune': [
    { id: 'mh-pu-traffic', label: 'Two-Wheeler Density', detail: 'High concentration of unburned hydrocarbons and CO.', angle: 140, distance: 35, color: '#FF1744', status: 'Warning' },
    { id: 'mh-pu-industrial', label: 'Auto-manufacturing Zone', detail: 'Industrial emissions from suburban belts.', angle: 20, distance: 50, color: '#FF9100', status: 'Warning' },
    { id: 'mh-pu-wind', label: 'Valley Topography', detail: 'Geographic basin restricting natural wind dispersion.', angle: 250, distance: 65, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Surat': [
    { id: 'gj-su-industrial', label: 'Textile Processing', detail: 'High particulate and chemical vapor emissions.', angle: 80, distance: 20, color: '#D50000', status: 'Critical' },
    { id: 'gj-su-traffic', label: 'Diamond Hub Transit', detail: 'Localized commercial traffic spikes.', angle: 320, distance: 55, color: '#FFB74D', status: 'Monitor' },
    { id: 'gj-su-wind', label: 'Coastal Breezes', detail: 'Onshore winds pushing pollutants inland.', angle: 180, distance: 70, color: '#4DEEEA', status: 'Monitor' }
  ],
  'Jaipur': [
    { id: 'rj-dust', label: 'Desert Dust Plumes', detail: 'Natural particulate matter from surrounding Thar desert.', angle: 200, distance: 25, color: '#FFB74D', status: 'Critical' },
    { id: 'rj-tourist', label: 'Tourism Traffic', detail: 'Congestion in heritage corridors increasing NO2.', angle: 60, distance: 50, color: '#FF5252', status: 'Warning' },
    { id: 'rj-temp', label: 'High Solar Radiation', detail: 'Accelerated secondary ozone formation.', angle: 300, distance: 75, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Lucknow': [
    { id: 'up-lu-pm25', label: 'Trapped Particulates', detail: 'Indo-Gangetic plain meteorology causing severe stagnation.', angle: 10, distance: 15, color: '#D50000', status: 'Critical' },
    { id: 'up-lu-biomass', label: 'Domestic Biomass', detail: 'Winter heating emissions accumulating in lower atmosphere.', angle: 120, distance: 35, color: '#FF9100', status: 'Warning' },
    { id: 'up-lu-traffic', label: 'Urban Congestion', detail: 'Slow-moving traffic compounding local hotspots.', angle: 240, distance: 60, color: '#FF5252', status: 'Warning' }
  ],
  'Kanpur': [
    { id: 'up-ka-industrial', label: 'Tannery/Coal Emissions', detail: 'Heavy industrial exhaust and coal burning signatures.', angle: 50, distance: 18, color: '#D50000', status: 'Critical' },
    { id: 'up-ka-pm10', label: 'Resuspended Dust', detail: 'Degraded road infrastructure elevating PM10.', angle: 160, distance: 40, color: '#FFB74D', status: 'Warning' },
    { id: 'up-ka-wind', label: 'Zero-Wind Trapping', detail: 'Absolute atmospheric stillness preventing any clearance.', angle: 280, distance: 65, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Nagpur': [
    { id: 'mh-na-coal', label: 'Thermal Power Vicinity', detail: 'Fly ash and SO2 drifting from regional power stations.', angle: 30, distance: 30, color: '#FF1744', status: 'Critical' },
    { id: 'mh-na-traffic', label: 'Logistics Hub', detail: 'Central India transit route causing diesel exhaust spikes.', angle: 210, distance: 50, color: '#FF9100', status: 'Warning' },
    { id: 'mh-na-heat', label: 'Dry Heat Index', detail: 'Elevated temperatures catalyzing ground-level ozone.', angle: 320, distance: 75, color: '#8A7CFF', status: 'Monitor' }
  ],
  'Indore': [
    { id: 'mp-in-traffic', label: 'Commercial Corridors', detail: 'High density market area emissions.', angle: 90, distance: 40, color: '#FF5252', status: 'Warning' },
    { id: 'mp-in-industrial', label: 'Pithampur Wind Drift', detail: 'Industrial zone emissions carried by prevailing winds.', angle: 250, distance: 55, color: '#FFB74D', status: 'Warning' },
    { id: 'mp-in-dust', label: 'Seasonal Dryness', detail: 'Background particulate matter from dry soil.', angle: 350, distance: 80, color: '#4DEEEA', status: 'Monitor' }
  ],
  'Patna': [
    { id: 'br-pa-geography', label: 'Valley Trapping', detail: 'Topographical basin locking in regional pollutants.', angle: 15, distance: 20, color: '#D50000', status: 'Critical' },
    { id: 'br-pa-silt', label: 'Riverbed Silt (PM10)', detail: 'Dry Ganges riverbed dust resuspended by winds.', angle: 130, distance: 45, color: '#FF9100', status: 'Warning' },
    { id: 'br-pa-biomass', label: 'Rural Drift', detail: 'Upwind agricultural/domestic burning carrying into city.', angle: 260, distance: 60, color: '#FF5252', status: 'Warning' }
  ]
};
