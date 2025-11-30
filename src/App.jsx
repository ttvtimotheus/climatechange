import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Paper, 
  Tab, 
  Tabs, 
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Chip,
  alpha,
  useMediaQuery
} from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Public as GlobeIcon,
  Thermostat as TempIcon,
  TrendingUp,
  TrendingDown,
  Timeline
} from '@mui/icons-material';
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

const SCENARIO_ICONS = {
  optimistic: <TrendingDown sx={{ fontSize: 16 }} />,
  moderate: <Timeline sx={{ fontSize: 16 }} />,
  pessimistic: <TrendingUp sx={{ fontSize: 16 }} />
};

const SCENARIO_COLORS = {
  optimistic: '#10B981',
  moderate: '#F59E0B', 
  pessimistic: '#EF4444'
};

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [climateData, setClimateData] = useState(null);
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const data = calculateClimateData(selectedScenario, energyMix);
    setClimateData(data);
    
    const risks = calculateRiskLevels(data, selectedYear);
    setRiskLevels(risks);
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

  // Calculate current temperature for display
  const currentTemp = climateData?.temperature?.[climateData.years.indexOf(selectedYear)] || 0;

  // Calculate economic impact based on climate data
  const economicData = {
    economicGrowth: Math.min(100, Math.round(currentTemp * 15)),
    populationAffected: Math.min(100, Math.round(currentTemp * 12)),
    gdpImpact: Math.min(100, Math.round(currentTemp * 18)),
    agriculturalLoss: Math.min(100, Math.round(currentTemp * 20)),
    waterScarcity: Math.min(100, Math.round(currentTemp * 16)),
    disasterRisk: Math.min(100, Math.round(currentTemp * 22))
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Modern Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <GlobeIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
              {t('app.title')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('app.subtitle')}
            </Typography>
          </Box>
          
          {/* Current Stats */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Chip
              icon={SCENARIO_ICONS[selectedScenario]}
              label={t(`scenarios.${selectedScenario}.label`)}
              sx={{ 
                bgcolor: alpha(SCENARIO_COLORS[selectedScenario], 0.15),
                color: SCENARIO_COLORS[selectedScenario],
                fontWeight: 600
              }}
            />
            <Chip
              icon={<TempIcon />}
              label={`+${currentTemp.toFixed(1)}°C`}
              sx={{ 
                bgcolor: alpha(theme.palette.error.main, 0.15),
                color: theme.palette.error.main,
                fontWeight: 600
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {selectedYear}
            </Typography>
          </Box>
          
          <LanguageSelector />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Section: Map + Controls */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          flex: 1,
          minHeight: 0
        }}>
          {/* Map Area */}
          <Box sx={{ 
            flex: { xs: '1', lg: '2' }, 
            minHeight: { xs: 350, lg: 'auto' },
            position: 'relative'
          }}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              elevation={0}
              sx={{ 
                height: '100%', 
                overflow: 'hidden',
                borderRadius: 0,
                borderRight: { lg: 1 },
                borderBottom: { xs: 1, lg: 0 },
                borderColor: 'divider'
              }}
            >
              <Map
                climateData={climateData}
                selectedYear={selectedYear}
                selectedScenario={selectedScenario}
                riskLevels={riskLevels}
                onYearChange={handleYearChange}
                onScenarioChange={handleScenarioChange}
              />
            </Paper>
          </Box>
          
          {/* Controls Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', lg: 350 },
            flexShrink: 0,
            overflow: 'auto',
            maxHeight: { xs: 300, lg: 'none' }
          }}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 0
              }}
            >
              <ClimateControls
                selectedScenario={selectedScenario}
                selectedYear={selectedYear}
                onScenarioChange={handleScenarioChange}
                onYearChange={handleYearChange}
                onEnergyMixChange={handleEnergyMixChange}
                riskLevels={riskLevels}
              />
            </Paper>
          </Box>
        </Box>

        {/* Bottom Section: Tabs */}
        <Paper 
          elevation={0} 
          sx={{ 
            height: { xs: 350, md: 400 },
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderTop: 1,
            borderColor: 'divider',
            borderRadius: 0
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'none'
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

          <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                {activeTab === 0 && <DataVisualization data={climateData} />}
                {activeTab === 1 && (
                  <GreenhouseEffect 
                    climateData={climateData}
                  />
                )}
                {activeTab === 2 && <EconomicImpact data={economicData} />}
                {activeTab === 3 && (
                  <EnergyMixSimulator onEnergyMixChange={handleDetailedEnergyMixChange} />
                )}
                {activeTab === 4 && (
                  <DisasterSimulator 
                    temperature={currentTemp}
                    year={selectedYear}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Paper>
      </Box>
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
