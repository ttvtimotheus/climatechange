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

export const generateGlobeData = (scenario, year) => {
  // Basis-Temperaturanstieg pro Jahr (°C)
  const baseIncrease = {
    moderate: 0.03,
    optimistic: 0.02,
    pessimistic: 0.04
  }[scenario] || 0.03;

  // Jahre seit 2025
  const yearsSince2025 = year - 2025;
  
  // Generiere Daten für jede Stadt
  return cities.map(city => {
    // Basis-Temperaturanstieg
    let value = yearsSince2025 * baseIncrease;
    
    // Füge etwas Variation basierend auf der Latitude hinzu
    // Höhere Breitengrade erwärmen sich schneller
    const latitudeFactor = Math.abs(city.lat) / 90;
    value *= (1 + latitudeFactor);
    
    // Füge etwas zufällige Variation hinzu
    value *= (0.8 + Math.random() * 0.4);
    
    return {
      ...city,
      value: Math.max(0, value)
    };
  });
};
