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

export const calculateClimateData = (scenario, energyMix) => {
  const years = [];
  const temperature = [];
  const co2 = [];
  
  // Generate years from 2025 to 2100 in 5-year steps
  for (let year = 2025; year <= 2100; year += 5) {
    years.push(year);
    
    // Calculate progress (0 to 1)
    const progress = (year - 2025) / (2100 - 2025);
    
    // Base CO2 values
    let baseCo2 = 420; // Starting point in 2025
    
    // Calculate CO2 based on scenario and energy mix
    switch (scenario) {
      case 'optimistic':
        baseCo2 += progress * 30;
        break;
      case 'moderate':
        baseCo2 += progress * 80;
        break;
      case 'pessimistic':
        baseCo2 += progress * 150;
        break;
      default:
        baseCo2 += progress * 80;
    }
    
    // Adjust CO2 based on energy mix
    const renewableImpact = (energyMix.renewable / 100) * -50;
    const fossilImpact = (energyMix.fossil / 100) * 50;
    const finalCo2 = baseCo2 + renewableImpact + fossilImpact;
    
    co2.push(Math.round(finalCo2));
    
    // Calculate temperature change based on CO2
    const baseTemp = (finalCo2 - 420) / 100;
    let tempIncrease;
    
    switch (scenario) {
      case 'optimistic':
        tempIncrease = baseTemp * 0.8;
        break;
      case 'moderate':
        tempIncrease = baseTemp * 1.2;
        break;
      case 'pessimistic':
        tempIncrease = baseTemp * 1.5;
        break;
      default:
        tempIncrease = baseTemp * 1.2;
    }
    
    temperature.push(Number(tempIncrease.toFixed(2)));
  }
  
  return {
    years,
    temperature,
    co2
  };
};

export const calculateRiskLevels = (data, selectedYear) => {
  if (!data || !data.temperature || !data.years) {
    return {
      drought: 0,
      flooding: 0,
      fires: 0,
      storms: 0
    };
  }

  const yearIndex = data.years.indexOf(selectedYear);
  if (yearIndex === -1) return { drought: 0, flooding: 0, fires: 0, storms: 0 };

  const temp = data.temperature[yearIndex];
  const co2 = data.co2[yearIndex];

  // Calculate risk levels based on temperature and CO2
  const baseRisk = (temp / 5) * 100; // 5°C = 100% risk
  const co2Factor = (co2 - 420) / 200; // Additional risk based on CO2 increase

  return {
    drought: Math.min(100, Math.round(baseRisk * 1.2 + co2Factor * 20)),
    flooding: Math.min(100, Math.round(baseRisk * 1.1 + co2Factor * 15)),
    fires: Math.min(100, Math.round(baseRisk * 1.3 + co2Factor * 25)),
    storms: Math.min(100, Math.round(baseRisk * 1.15 + co2Factor * 18))
  };
};
