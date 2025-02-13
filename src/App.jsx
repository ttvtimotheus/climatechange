import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Tab, Tabs, Paper } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme';
import Layout from './components/Layout';
import Map from './components/Map';
import ClimateControls from './components/ClimateControls';
import DataVisualization from './components/DataVisualization';
import EconomicImpact from './components/EconomicImpact';
import EnergyMixSimulator from './components/EnergyMixSimulator';
import DisasterSimulator from './components/DisasterSimulator';
import GreenhouseEffect from './components/GreenhouseEffect';
import { calculateClimateData, calculateRiskLevels } from './services/climateService';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const customTheme = React.useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: isDarkMode ? 'dark' : 'light',
        },
      }),
    [isDarkMode]
  );

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
    const factor = (year - 2025) / (2100 - 2025);
    setRiskLevels({
      drought: Math.min(100, Math.round(30 + factor * 50)),
      flooding: Math.min(100, Math.round(45 + factor * 40)),
      fires: Math.min(100, Math.round(60 + factor * 30)),
      storms: Math.min(100, Math.round(40 + factor * 45))
    });
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

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <CssBaseline />
        <Layout onToggleTheme={handleToggleTheme} isDarkMode={isDarkMode}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { xs: '1', md: '2' } }}>
              <Paper 
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                elevation={2}
                sx={{ overflow: 'hidden', height: '100%' }}
              >
                <Map
                  climateData={climateData}
                  selectedYear={selectedYear}
                  riskLevels={riskLevels}
                  onYearChange={handleYearChange}
                />
              </Paper>
            </Box>
            <Box sx={{ flex: '1' }}>
              <Paper 
                component={motion.div}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                elevation={2}
                sx={{ p: 3 }}
              >
                <ClimateControls
                  onScenarioChange={handleScenarioChange}
                  onYearChange={handleYearChange}
                  onEnergyMixChange={handleEnergyMixChange}
                  riskLevels={riskLevels}
                />
              </Paper>
            </Box>
          </Box>
          
          <Paper 
            elevation={2} 
            sx={{ mt: 3, overflow: 'hidden' }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  px: 2,
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="Climate Data" />
                <Tab label="Greenhouse Effect" />
                <Tab label="Economic Impact" />
                <Tab label="Energy Mix" />
                <Tab label="Natural Disasters" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 0 && <DataVisualization data={climateData} />}
                  {activeTab === 1 && (
                    <GreenhouseEffect 
                      climateData={climateData}
                      onWindowSizeChange={setMovingAverageWindow}
                    />
                  )}
                  {activeTab === 2 && <EconomicImpact data={economicData} />}
                  {activeTab === 3 && (
                    <EnergyMixSimulator onEnergyMixChange={handleDetailedEnergyMixChange} />
                  )}
                  {activeTab === 4 && (
                    <DisasterSimulator 
                      temperature={climateData?.temperature[climateData.years.indexOf(selectedYear)] || 0}
                      year={selectedYear}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Paper>
        </Layout>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
