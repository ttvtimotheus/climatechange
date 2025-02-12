// Basis-Szenarien für verschiedene Klimaentwicklungen
const scenarios = {
  optimistic: {
    temperatureIncrease: 0.2, // °C pro Jahrzehnt
    co2Increase: 10, // ppm pro Jahrzehnt
    seaLevelRise: 0.3, // Meter pro Jahrhundert
  },
  moderate: {
    temperatureIncrease: 0.3,
    co2Increase: 20,
    seaLevelRise: 0.5,
  },
  pessimistic: {
    temperatureIncrease: 0.4,
    co2Increase: 30,
    seaLevelRise: 1.0,
  }
};

// Energiemix-Faktoren
const energyMixFactors = {
  renewable: 0.7, // Reduziert die Auswirkungen
  mixed: 1.0, // Baseline
  fossil: 1.3, // Verstärkt die Auswirkungen
};

export const calculateClimateData = (scenario, energyMix, startYear, endYear) => {
  const scenarioData = scenarios[scenario];
  const mixFactor = energyMixFactors[energyMix];
  const years = [];
  const temperature = [];
  const co2 = [];
  const seaLevel = [];

  const baseTemp = 1.1; // Temperaturanstieg seit vorindustrieller Zeit
  const baseCO2 = 420; // ppm in 2025
  
  for (let year = startYear; year <= endYear; year += 5) {
    const yearsSince2025 = year - 2025;
    years.push(year);
    
    // Berechne Temperaturanstieg
    const tempIncrease = (baseTemp + (scenarioData.temperatureIncrease * yearsSince2025 / 10) * mixFactor);
    temperature.push(Number(tempIncrease.toFixed(1)));
    
    // Berechne CO2-Konzentration
    const co2Increase = baseCO2 + (scenarioData.co2Increase * yearsSince2025 / 10) * mixFactor;
    co2.push(Math.round(co2Increase));
    
    // Berechne Meeresspiegelanstieg
    const seaLevelIncrease = (scenarioData.seaLevelRise * yearsSince2025 / 75) * mixFactor;
    seaLevel.push(Number(seaLevelIncrease.toFixed(2)));
  }

  return {
    years,
    temperature,
    co2,
    seaLevel,
  };
};

// Berechnet Risiko-Level für verschiedene Klimaereignisse
export const calculateRiskLevels = (temperature) => {
  return {
    drought: Math.min(100, Math.round(temperature * 25)),
    flooding: Math.min(100, Math.round(temperature * 20)),
    storms: Math.min(100, Math.round(temperature * 15)),
    fires: Math.min(100, Math.round(temperature * 30)),
  };
};
