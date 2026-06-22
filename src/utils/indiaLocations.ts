import type { LocationState } from '../types';

/**
 * Hierarchical India location data
 * Structure: State → City → Region
 * Designed for future expansion to District → Town
 */
export const INDIA_LOCATIONS: LocationState[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    capital: 'New Delhi',
    cities: [
      {
        id: 'delhi-new-delhi',
        name: 'New Delhi',
        lat: 28.6139, lng: 77.2090,
        regions: [
          { id: 'delhi-nd-connaught', name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
          { id: 'delhi-nd-lutyen', name: "Lutyens' Delhi", lat: 28.5987, lng: 77.2056 },
          { id: 'delhi-nd-rajpath', name: 'Rajpath / India Gate', lat: 28.6129, lng: 77.2295 },
        ],
      },
      {
        id: 'delhi-north',
        name: 'North Delhi',
        lat: 28.7041, lng: 77.1025,
        regions: [
          { id: 'delhi-north-rohini', name: 'Rohini', lat: 28.7495, lng: 77.0684 },
          { id: 'delhi-north-pitampura', name: 'Pitampura', lat: 28.7026, lng: 77.1318 },
          { id: 'delhi-north-model-town', name: 'Model Town', lat: 28.7174, lng: 77.1904 },
        ],
      },
      {
        id: 'delhi-south',
        name: 'South Delhi',
        lat: 28.5245, lng: 77.1855,
        regions: [
          { id: 'delhi-south-hauz-khas', name: 'Hauz Khas', lat: 28.5494, lng: 77.2001 },
          { id: 'delhi-south-saket', name: 'Saket', lat: 28.5244, lng: 77.2066 },
          { id: 'delhi-south-dwarka', name: 'Dwarka', lat: 28.5921, lng: 77.0460 },
        ],
      },
      {
        id: 'delhi-east',
        name: 'East Delhi',
        lat: 28.6500, lng: 77.3100,
        regions: [
          { id: 'delhi-east-laxmi-nagar', name: 'Laxmi Nagar', lat: 28.6306, lng: 77.2766 },
          { id: 'delhi-east-preet-vihar', name: 'Preet Vihar', lat: 28.6419, lng: 77.2971 },
          { id: 'delhi-east-mayur-vihar', name: 'Mayur Vihar', lat: 28.6077, lng: 77.2964 },
        ],
      },
    ],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai',
    cities: [
      {
        id: 'mh-mumbai',
        name: 'Mumbai',
        lat: 19.0760, lng: 72.8777,
        regions: [
          { id: 'mh-mumbai-bandra', name: 'Bandra', lat: 19.0596, lng: 72.8295 },
          { id: 'mh-mumbai-andheri', name: 'Andheri', lat: 19.1136, lng: 72.8697 },
          { id: 'mh-mumbai-colaba', name: 'Colaba', lat: 18.9067, lng: 72.8147 },
          { id: 'mh-mumbai-dadar', name: 'Dadar', lat: 19.0183, lng: 72.8430 },
        ],
      },
      {
        id: 'mh-pune',
        name: 'Pune',
        lat: 18.5204, lng: 73.8567,
        regions: [
          { id: 'mh-pune-koregaon', name: 'Koregaon Park', lat: 18.5362, lng: 73.8938 },
          { id: 'mh-pune-hinjewadi', name: 'Hinjewadi', lat: 18.5912, lng: 73.7380 },
          { id: 'mh-pune-shivajinagar', name: 'Shivajinagar', lat: 18.5308, lng: 73.8475 },
        ],
      },
      {
        id: 'mh-nagpur',
        name: 'Nagpur',
        lat: 21.1458, lng: 79.0882,
        regions: [
          { id: 'mh-nagpur-civil-lines', name: 'Civil Lines', lat: 21.1497, lng: 79.0828 },
          { id: 'mh-nagpur-dharampeth', name: 'Dharampeth', lat: 21.1338, lng: 79.0599 },
        ],
      },
      {
        id: 'mh-nashik',
        name: 'Nashik',
        lat: 19.9975, lng: 73.7898,
        regions: [
          { id: 'mh-nashik-panchavati', name: 'Panchavati', lat: 19.9975, lng: 73.7898 },
          { id: 'mh-nashik-satpur', name: 'Satpur MIDC', lat: 20.0079, lng: 73.7498 },
        ],
      },
    ],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru',
    cities: [
      {
        id: 'ka-bengaluru',
        name: 'Bengaluru',
        lat: 12.9716, lng: 77.5946,
        regions: [
          { id: 'ka-blr-whitefield', name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
          { id: 'ka-blr-koramangala', name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
          { id: 'ka-blr-indiranagar', name: 'Indiranagar', lat: 12.9783, lng: 77.6408 },
          { id: 'ka-blr-jp-nagar', name: 'JP Nagar', lat: 12.8967, lng: 77.5783 },
        ],
      },
      {
        id: 'ka-mysuru',
        name: 'Mysuru',
        lat: 12.2958, lng: 76.6394,
        regions: [
          { id: 'ka-mys-vijayanagar', name: 'Vijayanagar', lat: 12.3215, lng: 76.6146 },
          { id: 'ka-mys-chamundi', name: 'Chamundi Hill', lat: 12.2726, lng: 76.6715 },
        ],
      },
      {
        id: 'ka-mangaluru',
        name: 'Mangaluru',
        lat: 12.9141, lng: 74.8560,
        regions: [
          { id: 'ka-mng-hampankatta', name: 'Hampankatta', lat: 12.8698, lng: 74.8435 },
          { id: 'ka-mng-kankanady', name: 'Kankanady', lat: 12.9014, lng: 74.8537 },
        ],
      },
    ],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    cities: [
      {
        id: 'tn-chennai',
        name: 'Chennai',
        lat: 13.0827, lng: 80.2707,
        regions: [
          { id: 'tn-che-anna-nagar', name: 'Anna Nagar', lat: 13.0857, lng: 80.2100 },
          { id: 'tn-che-t-nagar', name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
          { id: 'tn-che-adyar', name: 'Adyar', lat: 13.0012, lng: 80.2565 },
          { id: 'tn-che-velachery', name: 'Velachery', lat: 12.9815, lng: 80.2180 },
        ],
      },
      {
        id: 'tn-coimbatore',
        name: 'Coimbatore',
        lat: 11.0168, lng: 76.9558,
        regions: [
          { id: 'tn-cbe-rs-puram', name: 'RS Puram', lat: 11.0064, lng: 76.9559 },
          { id: 'tn-cbe-peelamedu', name: 'Peelamedu', lat: 11.0230, lng: 77.0126 },
        ],
      },
      {
        id: 'tn-madurai',
        name: 'Madurai',
        lat: 9.9252, lng: 78.1198,
        regions: [
          { id: 'tn-mad-anna-nagar', name: 'Anna Nagar', lat: 9.9480, lng: 78.1135 },
          { id: 'tn-mad-kochadai', name: 'Kochadai', lat: 9.9580, lng: 78.1294 },
        ],
      },
    ],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    cities: [
      {
        id: 'up-lucknow',
        name: 'Lucknow',
        lat: 26.8467, lng: 80.9462,
        regions: [
          { id: 'up-lko-gomtinagar', name: 'Gomti Nagar', lat: 26.8686, lng: 81.0043 },
          { id: 'up-lko-hazratganj', name: 'Hazratganj', lat: 26.8482, lng: 80.9478 },
          { id: 'up-lko-aliganj', name: 'Aliganj', lat: 26.8837, lng: 80.9432 },
        ],
      },
      {
        id: 'up-kanpur',
        name: 'Kanpur',
        lat: 26.4499, lng: 80.3319,
        regions: [
          { id: 'up-knp-swaroop-nagar', name: 'Swaroop Nagar', lat: 26.4668, lng: 80.3282 },
          { id: 'up-knp-kidwai-nagar', name: 'Kidwai Nagar', lat: 26.4468, lng: 80.3613 },
        ],
      },
      {
        id: 'up-varanasi',
        name: 'Varanasi',
        lat: 25.3176, lng: 82.9739,
        regions: [
          { id: 'up-var-ghats', name: 'Ganga Ghats', lat: 25.3124, lng: 83.0052 },
          { id: 'up-var-bhu', name: 'BHU Area', lat: 25.2677, lng: 82.9913 },
        ],
      },
      {
        id: 'up-agra',
        name: 'Agra',
        lat: 27.1767, lng: 78.0081,
        regions: [
          { id: 'up-agr-tajganj', name: 'Tajganj', lat: 27.1724, lng: 78.0421 },
          { id: 'up-agr-bodla', name: 'Bodla', lat: 27.1862, lng: 77.9879 },
        ],
      },
    ],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    capital: 'Kolkata',
    cities: [
      {
        id: 'wb-kolkata',
        name: 'Kolkata',
        lat: 22.5726, lng: 88.3639,
        regions: [
          { id: 'wb-kol-salt-lake', name: 'Salt Lake', lat: 22.5798, lng: 88.4138 },
          { id: 'wb-kol-park-street', name: 'Park Street', lat: 22.5535, lng: 88.3514 },
          { id: 'wb-kol-howrah', name: 'Howrah', lat: 22.5958, lng: 88.2636 },
          { id: 'wb-kol-new-town', name: 'New Town', lat: 22.5958, lng: 88.4869 },
        ],
      },
      {
        id: 'wb-siliguri',
        name: 'Siliguri',
        lat: 26.7271, lng: 88.3953,
        regions: [
          { id: 'wb-slg-matigara', name: 'Matigara', lat: 26.7563, lng: 88.4237 },
          { id: 'wb-slg-pradhan-nagar', name: 'Pradhan Nagar', lat: 26.7153, lng: 88.3898 },
        ],
      },
    ],
  },
  {
    id: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad',
    cities: [
      {
        id: 'tg-hyderabad',
        name: 'Hyderabad',
        lat: 17.3850, lng: 78.4867,
        regions: [
          { id: 'tg-hyd-hitech-city', name: 'HITEC City', lat: 17.4435, lng: 78.3772 },
          { id: 'tg-hyd-banjara-hills', name: 'Banjara Hills', lat: 17.4150, lng: 78.4347 },
          { id: 'tg-hyd-secunderabad', name: 'Secunderabad', lat: 17.4401, lng: 78.4983 },
          { id: 'tg-hyd-kukatpally', name: 'Kukatpally', lat: 17.4849, lng: 78.3992 },
        ],
      },
      {
        id: 'tg-warangal',
        name: 'Warangal',
        lat: 17.9784, lng: 79.5941,
        regions: [
          { id: 'tg-wngl-hanamkonda', name: 'Hanamkonda', lat: 18.0088, lng: 79.5591 },
          { id: 'tg-wngl-kazipet', name: 'Kazipet', lat: 17.9568, lng: 79.5971 },
        ],
      },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    capital: 'Jaipur',
    cities: [
      {
        id: 'rj-jaipur',
        name: 'Jaipur',
        lat: 26.9124, lng: 75.7873,
        regions: [
          { id: 'rj-jp-malviya-nagar', name: 'Malviya Nagar', lat: 26.8648, lng: 75.8147 },
          { id: 'rj-jp-vaishali-nagar', name: 'Vaishali Nagar', lat: 26.9171, lng: 75.7381 },
          { id: 'rj-jp-c-scheme', name: 'C-Scheme', lat: 26.9076, lng: 75.8000 },
        ],
      },
      {
        id: 'rj-jodhpur',
        name: 'Jodhpur',
        lat: 26.2389, lng: 73.0243,
        regions: [
          { id: 'rj-jod-sardarpura', name: 'Sardarpura', lat: 26.2877, lng: 73.0217 },
          { id: 'rj-jod-shastri-nagar', name: 'Shastri Nagar', lat: 26.2717, lng: 73.0122 },
        ],
      },
      {
        id: 'rj-udaipur',
        name: 'Udaipur',
        lat: 24.5854, lng: 73.7125,
        regions: [
          { id: 'rj-udp-city-palace', name: 'City Palace Area', lat: 24.5765, lng: 73.6831 },
          { id: 'rj-udp-hiran-magri', name: 'Hiran Magri', lat: 24.6032, lng: 73.6942 },
        ],
      },
    ],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    cities: [
      {
        id: 'gj-ahmedabad',
        name: 'Ahmedabad',
        lat: 23.0225, lng: 72.5714,
        regions: [
          { id: 'gj-ahm-sg-highway', name: 'SG Highway', lat: 23.0375, lng: 72.5078 },
          { id: 'gj-ahm-navrangpura', name: 'Navrangpura', lat: 23.0380, lng: 72.5593 },
          { id: 'gj-ahm-satellite', name: 'Satellite', lat: 23.0269, lng: 72.5103 },
        ],
      },
      {
        id: 'gj-surat',
        name: 'Surat',
        lat: 21.1702, lng: 72.8311,
        regions: [
          { id: 'gj-srt-adajan', name: 'Adajan', lat: 21.2055, lng: 72.7969 },
          { id: 'gj-srt-vesu', name: 'Vesu', lat: 21.1477, lng: 72.7771 },
        ],
      },
      {
        id: 'gj-gandhinagar',
        name: 'Gandhinagar',
        lat: 23.2156, lng: 72.6369,
        regions: [
          { id: 'gj-gng-sector-21', name: 'Sector 21', lat: 23.2236, lng: 72.6472 },
          { id: 'gj-gng-infocity', name: 'GIFT City', lat: 23.1587, lng: 72.6829 },
        ],
      },
    ],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    capital: 'Chandigarh',
    cities: [
      {
        id: 'pb-chandigarh',
        name: 'Chandigarh',
        lat: 30.7333, lng: 76.7794,
        regions: [
          { id: 'pb-chd-sector-17', name: 'Sector 17', lat: 30.7426, lng: 76.7777 },
          { id: 'pb-chd-sector-35', name: 'Sector 35', lat: 30.7254, lng: 76.7672 },
        ],
      },
      {
        id: 'pb-ludhiana',
        name: 'Ludhiana',
        lat: 30.9010, lng: 75.8573,
        regions: [
          { id: 'pb-ldh-model-town', name: 'Model Town', lat: 30.9148, lng: 75.8509 },
          { id: 'pb-ldh-brs-nagar', name: 'BRS Nagar', lat: 30.8934, lng: 75.8233 },
        ],
      },
      {
        id: 'pb-amritsar',
        name: 'Amritsar',
        lat: 31.6340, lng: 74.8723,
        regions: [
          { id: 'pb-asr-golden-temple', name: 'Golden Temple Area', lat: 31.6200, lng: 74.8765 },
          { id: 'pb-asr-ranjit-avenue', name: 'Ranjit Avenue', lat: 31.6390, lng: 74.8583 },
        ],
      },
    ],
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    cities: [
      {
        id: 'mp-bhopal',
        name: 'Bhopal',
        lat: 23.2599, lng: 77.4126,
        regions: [
          { id: 'mp-bpl-mp-nagar', name: 'MP Nagar', lat: 23.2316, lng: 77.4327 },
          { id: 'mp-bpl-new-market', name: 'New Market', lat: 23.2366, lng: 77.4024 },
        ],
      },
      {
        id: 'mp-indore',
        name: 'Indore',
        lat: 22.7196, lng: 75.8577,
        regions: [
          { id: 'mp-ind-vijay-nagar', name: 'Vijay Nagar', lat: 22.7535, lng: 75.8791 },
          { id: 'mp-ind-palasia', name: 'Palasia', lat: 22.7244, lng: 75.8838 },
        ],
      },
      {
        id: 'mp-gwalior',
        name: 'Gwalior',
        lat: 26.2183, lng: 78.1828,
        regions: [
          { id: 'mp-gwl-city-centre', name: 'City Centre', lat: 26.2127, lng: 78.1773 },
          { id: 'mp-gwl-morar', name: 'Morar', lat: 26.2430, lng: 78.2128 },
        ],
      },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    cities: [
      {
        id: 'kl-thiruvananthapuram',
        name: 'Thiruvananthapuram',
        lat: 8.5241, lng: 76.9366,
        regions: [
          { id: 'kl-tvm-kowdiar', name: 'Kowdiar', lat: 8.5222, lng: 76.9446 },
          { id: 'kl-tvm-pattom', name: 'Pattom', lat: 8.5298, lng: 76.9505 },
        ],
      },
      {
        id: 'kl-kochi',
        name: 'Kochi',
        lat: 9.9312, lng: 76.2673,
        regions: [
          { id: 'kl-koc-marine-drive', name: 'Marine Drive', lat: 9.9840, lng: 76.2752 },
          { id: 'kl-koc-kakkanad', name: 'Kakkanad', lat: 10.0107, lng: 76.3505 },
          { id: 'kl-koc-fort-kochi', name: 'Fort Kochi', lat: 9.9656, lng: 76.2426 },
        ],
      },
      {
        id: 'kl-kozhikode',
        name: 'Kozhikode',
        lat: 11.2588, lng: 75.7804,
        regions: [
          { id: 'kl-kzd-calicut-beach', name: 'Calicut Beach', lat: 11.2534, lng: 75.7742 },
          { id: 'kl-kzd-chevayur', name: 'Chevayur', lat: 11.2876, lng: 75.8053 },
        ],
      },
    ],
  },
  {
    id: 'haryana',
    name: 'Haryana',
    capital: 'Chandigarh',
    cities: [
      {
        id: 'hr-gurugram',
        name: 'Gurugram',
        lat: 28.4595, lng: 77.0266,
        regions: [
          { id: 'hr-ggn-cyber-city', name: 'Cyber City', lat: 28.4949, lng: 77.0887 },
          { id: 'hr-ggn-sohna-road', name: 'Sohna Road', lat: 28.4162, lng: 77.0458 },
          { id: 'hr-ggn-golf-course', name: 'Golf Course Road', lat: 28.4648, lng: 77.1022 },
        ],
      },
      {
        id: 'hr-faridabad',
        name: 'Faridabad',
        lat: 28.4089, lng: 77.3178,
        regions: [
          { id: 'hr-fbd-nhpc-chowk', name: 'NHPC Chowk', lat: 28.4042, lng: 77.3183 },
          { id: 'hr-fbd-nit', name: 'NIT', lat: 28.3710, lng: 77.3249 },
        ],
      },
    ],
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    cities: [
      {
        id: 'ap-visakhapatnam',
        name: 'Visakhapatnam',
        lat: 17.6868, lng: 83.2185,
        regions: [
          { id: 'ap-vsk-rushikonda', name: 'Rushikonda', lat: 17.7732, lng: 83.3705 },
          { id: 'ap-vsk-mvp-colony', name: 'MVP Colony', lat: 17.7382, lng: 83.2923 },
        ],
      },
      {
        id: 'ap-vijayawada',
        name: 'Vijayawada',
        lat: 16.5062, lng: 80.6480,
        regions: [
          { id: 'ap-vjw-mg-road', name: 'MG Road', lat: 16.5062, lng: 80.6330 },
          { id: 'ap-vjw-benz-circle', name: 'Benz Circle', lat: 16.5226, lng: 80.6347 },
        ],
      },
    ],
  },
  {
    id: 'odisha',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    cities: [
      {
        id: 'od-bhubaneswar',
        name: 'Bhubaneswar',
        lat: 20.2961, lng: 85.8245,
        regions: [
          { id: 'od-bbsr-infocity', name: 'Infocity', lat: 20.3473, lng: 85.8153 },
          { id: 'od-bbsr-saheed-nagar', name: 'Saheed Nagar', lat: 20.2961, lng: 85.8467 },
        ],
      },
      {
        id: 'od-cuttack',
        name: 'Cuttack',
        lat: 20.4625, lng: 85.8828,
        regions: [
          { id: 'od-ctk-badambadi', name: 'Badambadi', lat: 20.4625, lng: 85.8828 },
          { id: 'od-ctk-link-road', name: 'Link Road', lat: 20.4695, lng: 85.8901 },
        ],
      },
    ],
  },
];

// Flat helper: get all states as { id, name }
export const getAllStates = () =>
  INDIA_LOCATIONS.map(({ id, name }) => ({ id, name }));

// Get cities for a state
export const getCitiesForState = (stateId: string) =>
  INDIA_LOCATIONS.find((s) => s.id === stateId)?.cities.map(({ id, name }) => ({ id, name })) ?? [];

// Get regions for a city
export const getRegionsForCity = (stateId: string, cityId: string) =>
  INDIA_LOCATIONS
    .find((s) => s.id === stateId)
    ?.cities.find((c) => c.id === cityId)
    ?.regions.map(({ id, name }) => ({ id, name })) ?? [];

// Get coordinates for any level
export const getNodeCoords = (stateId: string, cityId?: string, regionId?: string) => {
  const state = INDIA_LOCATIONS.find((s) => s.id === stateId);
  if (!state) return { lat: 20.5937, lng: 78.9629 }; // centre of India
  if (!cityId) return state.cities[0] ? { lat: state.cities[0].lat, lng: state.cities[0].lng } : { lat: 20.5937, lng: 78.9629 };
  const city = state.cities.find((c) => c.id === cityId);
  if (!city) return { lat: state.cities[0].lat, lng: state.cities[0].lng };
  if (!regionId) return { lat: city.lat, lng: city.lng };
  const region = city.regions.find((r) => r.id === regionId);
  return region ? { lat: region.lat, lng: region.lng } : { lat: city.lat, lng: city.lng };
};

// Build a display label for current selection
export const buildLocationLabel = (stateId: string, cityId?: string, regionId?: string): string => {
  const state = INDIA_LOCATIONS.find((s) => s.id === stateId);
  if (!state) return 'India';
  const city = cityId ? state.cities.find((c) => c.id === cityId) : null;
  const region = city && regionId ? city.regions.find((r) => r.id === regionId) : null;
  if (region && city) return `${region.name}, ${city.name}`;
  if (city) return `${city.name}, ${state.name}`;
  return state.name;
};
