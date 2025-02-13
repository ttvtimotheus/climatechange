// Sample data points for major cities
const CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { name: 'Rio', lat: -22.9068, lng: -43.1729 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 }
];

export const generateGlobeData = (scenario, year) => {
  // Base temperature increase based on scenario
  const baseIncrease = {
    optimistic: 1.5,
    moderate: 2.5,
    pessimistic: 4.0
  }[scenario] || 2.5;

  // Calculate year factor (2025-2100)
  const yearFactor = (year - 2025) / (2100 - 2025);
  
  return CITIES.map(city => {
    // Generate a unique value for each city based on location and scenario
    const latFactor = Math.abs(city.lat / 90); // 0-1 based on latitude
    const randomFactor = Math.random() * 0.5 + 0.75; // Random variation between cities
    
    const value = baseIncrease * yearFactor * latFactor * randomFactor;
    
    return {
      lat: city.lat,
      lng: city.lng,
      value: value,
      label: city.name
    };
  });
};

export const getTimelapseData = (scenario, startYear = 2025, endYear = 2100, steps = 75) => {
  const years = Array.from({ length: steps }, (_, i) => 
    Math.round(startYear + (i * (endYear - startYear) / (steps - 1)))
  );
  
  return years.map(year => ({
    year,
    data: generateGlobeData(scenario, year)
  }));
};
