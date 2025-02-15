import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Paper, Tab, Tabs, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme';
import Map from './components/Map';
import ClimateControls from './components/ClimateControls';
import DataVisualization from './components/DataVisualization';
import EconomicImpact from './components/EconomicImpact';
import EnergyMixSimulator from './components/EnergyMixSimulator';
import DisasterSimulator from './components/DisasterSimulator';
import GreenhouseEffect from './components/GreenhouseEffect';
import { calculateClimateData, calculateRiskLevels } from './services/climateService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [climateData, setClimateData] = useState(null);
  const [economicData, setEconomicData] = useState(null);
  const [riskLevels, setRiskLevels] = useState({
    drought: 0,
    flooding: 0,
    fires: 0,
    storms: 0
  });
  const [energyMix, setEnergyMix] = useState({
    renewable: 30,
    fossil: 60,
    nuclear: 10
  });
  const { t } = useLanguage();

  useEffect(() => {
    const data = calculateClimateData(selectedScenario, energyMix);
    setClimateData(data);
    
    const risks = calculateRiskLevels(data, selectedYear);
    setRiskLevels(risks);

    setEconomicData({
      gdpImpact: -2.5,
      jobsAffected: 150000,
      adaptationCost: 5000000000
    });
  }, [selectedScenario, selectedYear, energyMix]);

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleEnergyMixChange = (mix) => {
    switch (mix) {
      case 'renewable':
        setEnergyMix({ renewable: 80, fossil: 10, nuclear: 10 });
        break;
      case 'mixed':
        setEnergyMix({ renewable: 40, fossil: 40, nuclear: 20 });
        break;
      case 'fossil':
        setEnergyMix({ renewable: 20, fossil: 70, nuclear: 10 });
        break;
      default:
        break;
    }
  };

  const handleDetailedEnergyMixChange = (newMix) => {
    setEnergyMix(newMix);
  };

  return (
    <Box sx={{ p: 3, height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3,
        height: '50%',
        mb: 3
      }}>
        <Box sx={{ flex: { xs: '1', md: '2' }, minHeight: 400 }}>
          <Paper 
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            elevation={2}
            sx={{ height: '100%', overflow: 'hidden' }}
          >
            <Map
              climateData={climateData}
              selectedYear={selectedYear}
              riskLevels={riskLevels}
              onYearChange={handleYearChange}
            />
          </Paper>
        </Box>
        <Box sx={{ flex: '1', minHeight: 400 }}>
          <Paper 
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            elevation={2}
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
        sx={{ 
          height: 'calc(50% - 24px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
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
            <Tab label={t('tabs.climateData')} />
            <Tab label={t('tabs.greenhouseEffect')} />
            <Tab label={t('tabs.economicImpact')} />
            <Tab label={t('tabs.energyMix')} />
            <Tab label={t('tabs.naturalDisasters')} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
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
      <LanguageSelector />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <SnackbarProvider>
          <CssBaseline />
          <AppContent />
        </SnackbarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
