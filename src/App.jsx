import React, { useState, useEffect } from 'react';
import { Container, Grid, ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Map from './components/Map';
import ClimateControls from './components/ClimateControls';
import DataVisualization from './components/DataVisualization';
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

  useEffect(() => {
    const data = calculateClimateData(selectedScenario, selectedEnergyMix, 2025, 2100);
    setClimateData(data);
    
    // Berechne Risiko-Level basierend auf der Temperatur für das ausgewählte Jahr
    const yearIndex = data.years.indexOf(selectedYear);
    const currentTemp = data.temperature[yearIndex];
    const risks = calculateRiskLevels(currentTemp);
    setRiskLevels(risks);
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
              <DataVisualization data={climateData} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
