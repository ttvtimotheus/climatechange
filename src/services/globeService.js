// Cities with coordinates and deterministic regional factors
const cities = [
  { label: 'Berlin', lat: 52.5200, lng: 13.4050, regionalFactor: 1.1 },
  { label: 'Paris', lat: 48.8566, lng: 2.3522, regionalFactor: 1.0 },
  { label: 'London', lat: 51.5074, lng: -0.1278, regionalFactor: 0.9 },
  { label: 'New York', lat: 40.7128, lng: -74.0060, regionalFactor: 1.05 },
  { label: 'Tokyo', lat: 35.6762, lng: 139.6503, regionalFactor: 0.95 },
  { label: 'Beijing', lat: 39.9042, lng: 116.4074, regionalFactor: 1.15 },
  { label: 'Moscow', lat: 55.7558, lng: 37.6173, regionalFactor: 1.3 },
  { label: 'Sydney', lat: -33.8688, lng: 151.2093, regionalFactor: 0.85 },
  { label: 'Rio', lat: -22.9068, lng: -43.1729, regionalFactor: 0.9 },
  { label: 'Cape Town', lat: -33.9249, lng: 18.4241, regionalFactor: 0.95 },
  { label: 'Mumbai', lat: 19.0760, lng: 72.8777, regionalFactor: 1.1 },
  { label: 'Dubai', lat: 25.2048, lng: 55.2708, regionalFactor: 1.25 },
  { label: 'Singapore', lat: 1.3521, lng: 103.8198, regionalFactor: 0.8 },
  { label: 'Lagos', lat: 6.5244, lng: 3.3792, regionalFactor: 1.0 },
  { label: 'Buenos Aires', lat: -34.6037, lng: -58.3816, regionalFactor: 0.9 }
];

// Temperature increase per year for different scenarios
const SCENARIO_CONFIGS = {
  optimistic: {
    baseIncrease: 0.02,  // 0.02°C per year = ~1.5°C by 2100
    polarEffect: 1.2     // 20% stronger warming at poles
  },
  moderate: {
    baseIncrease: 0.035, // 0.035°C per year = ~2.6°C by 2100
    polarEffect: 1.5     // 50% stronger warming at poles
  },
  pessimistic: {
    baseIncrease: 0.055, // 0.055°C per year = ~4.1°C by 2100
    polarEffect: 2.0     // 100% stronger warming at poles
  }
};

export const generateGlobeData = (scenario = 'moderate', year) => {
  const config = SCENARIO_CONFIGS[scenario] || SCENARIO_CONFIGS.moderate;
  const yearsSince2025 = year - 2025;
  
  return cities.map(city => {
    // Base temperature increase
    let value = yearsSince2025 * config.baseIncrease;
    
    // Polar effect: stronger warming at higher latitudes
    const latitudeFactor = Math.abs(city.lat) / 90;
    value *= (1 + (latitudeFactor * (config.polarEffect - 1)));
    
    // Apply deterministic regional factor (no random!)
    value *= city.regionalFactor;
    
    return {
      label: city.label,
      lat: city.lat,
      lng: city.lng,
      value: Math.max(0, value)
    };
  });
};
