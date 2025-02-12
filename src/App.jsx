import React, { useState, useEffect } from 'react';
import { Container, Grid, ThemeProvider, createTheme, CssBaseline, Box, Tab, Tabs } from '@mui/material';
import Map from './components/Map';
import ClimateControls from './components/ClimateControls';
import DataVisualization from './components/DataVisualization';
import EconomicImpact from './components/EconomicImpact';
import EnergyMixSimulator from './components/EnergyMixSimulator';
import DisasterSimulator from './components/DisasterSimulator';
import GreenhouseEffect from './components/GreenhouseEffect';
import { calculateClimateData, calculateRiskLevels } from './services/climateService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#0288d1',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedEnergyMix, setSelectedEnergyMix] = useState('mixed');
  const [climateData, setClimateData] = useState(null);
  const [riskLevels, setRiskLevels] = useState({
    drought: 0,
    flooding: 0,
    fires: 0,
    storms: 0,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [economicData, setEconomicData] = useState({
    economicGrowth: 0,
    populationAffected: 0,
    gdpImpact: 0,
    agriculturalLoss: 0,
    waterScarcity: 0,
    disasterRisk: 0
  });
  const [movingAverageWindow, setMovingAverageWindow] = useState(20);

  useEffect(() => {
    const data = calculateClimateData(selectedScenario, selectedEnergyMix, 2025, 2100);
    setClimateData(data);
    
    const yearIndex = data.years.indexOf(selectedYear);
    const currentTemp = data.temperature[yearIndex];
    const risks = calculateRiskLevels(currentTemp);
    setRiskLevels(risks);

    setEconomicData({
      economicGrowth: Math.min(100, Math.round(currentTemp * 15)),
      populationAffected: Math.min(100, Math.round(currentTemp * 20)),
      gdpImpact: Math.min(100, Math.round(currentTemp * 18)),
      agriculturalLoss: Math.min(100, Math.round(currentTemp * 25)),
      waterScarcity: Math.min(100, Math.round(currentTemp * 22)),
      disasterRisk: Math.min(100, Math.round(currentTemp * 20))
    });
  }, [selectedScenario, selectedEnergyMix, selectedYear]);

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleEnergyMixChange = (mix) => {
    setSelectedEnergyMix(mix);
  };

  const handleDetailedEnergyMixChange = (mixData) => {
    const renewable = mixData.solar + mixData.wind + mixData.hydro;
    const fossil = mixData.fossil;
    
    if (renewable > 70) {
      setSelectedEnergyMix('renewable');
    } else if (fossil > 50) {
      setSelectedEnergyMix('fossil');
    } else {
      setSelectedEnergyMix('mixed');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        py: 4,
        backgroundColor: 'background.default'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Map
                climateData={climateData}
                selectedYear={selectedYear}
                riskLevels={riskLevels}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ClimateControls
                onScenarioChange={handleScenarioChange}
                onYearChange={handleYearChange}
                onEnergyMixChange={handleEnergyMixChange}
                riskLevels={riskLevels}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Klimadaten" />
                  <Tab label="Treibhauseffekt" />
                  <Tab label="Wirtschaftliche Auswirkungen" />
                  <Tab label="Energiemix-Simulator" />
                  <Tab label="Naturkatastrophen" />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <DataVisualization data={climateData} />
              )}

              {activeTab === 1 && (
                <GreenhouseEffect 
                  climateData={climateData}
                  onWindowSizeChange={setMovingAverageWindow}
                />
              )}
              
              {activeTab === 2 && (
                <EconomicImpact data={economicData} />
              )}
              
              {activeTab === 3 && (
                <EnergyMixSimulator onEnergyMixChange={handleDetailedEnergyMixChange} />
              )}
              
              {activeTab === 4 && (
                <DisasterSimulator 
                  temperature={climateData && climateData.temperature[climateData.years.indexOf(selectedYear)]}
                  year={selectedYear}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
