// Beispiel-Städte mit ihren Koordinaten
const cities = [
  { label: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { label: 'Paris', lat: 48.8566, lng: 2.3522 },
  { label: 'London', lat: 51.5074, lng: -0.1278 },
  { label: 'New York', lat: 40.7128, lng: -74.0060 },
  { label: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { label: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { label: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { label: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { label: 'Rio', lat: -22.9068, lng: -43.1729 },
  { label: 'Cape Town', lat: -33.9249, lng: 18.4241 }
];

// Temperaturanstieg pro Jahr für verschiedene Szenarien
const SCENARIO_CONFIGS = {
  optimistic: {
    baseIncrease: 0.02,  // 0.02°C pro Jahr = ~1.5°C bis 2100
    variability: 0.3,    // ±30% Variation zwischen Regionen
    polarEffect: 1.2     // 20% stärkere Erwärmung an den Polen
  },
  moderate: {
    baseIncrease: 0.035, // 0.035°C pro Jahr = ~2.6°C bis 2100
    variability: 0.4,    // ±40% Variation zwischen Regionen
    polarEffect: 1.5     // 50% stärkere Erwärmung an den Polen
  },
  pessimistic: {
    baseIncrease: 0.055, // 0.055°C pro Jahr = ~4.1°C bis 2100
    variability: 0.5,    // ±50% Variation zwischen Regionen
    polarEffect: 2.0     // 100% stärkere Erwärmung an den Polen
  }
};

export const generateGlobeData = (scenario = 'moderate', year) => {
  const config = SCENARIO_CONFIGS[scenario] || SCENARIO_CONFIGS.moderate;
  const yearsSince2025 = year - 2025;
  
  return cities.map(city => {
    // Basis-Temperaturanstieg
    let value = yearsSince2025 * config.baseIncrease;
    
    // Pol-Effekt: Stärkere Erwärmung in höheren Breitengraden
    const latitudeFactor = Math.abs(city.lat) / 90;
    value *= (1 + (latitudeFactor * (config.polarEffect - 1)));
    
    // Regionale Variation
    const randomFactor = 1 + (Math.random() * 2 - 1) * config.variability;
    value *= randomFactor;
    
    // Sicherstellen, dass der Wert nicht negativ wird
    return {
      ...city,
      value: Math.max(0, value)
    };
  });
};
