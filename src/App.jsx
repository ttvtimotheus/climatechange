import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Thermometer, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from './components/ui';
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
import { cn } from './lib/utils';

const SCENARIOS = {
  optimistic: { icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  moderate: { icon: Minus, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  pessimistic: { icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
};

const TABS = [
  { value: 0, key: 'climateData' },
  { value: 1, key: 'greenhouseEffect' },
  { value: 2, key: 'economicImpact' },
  { value: 3, key: 'energyMix' },
  { value: 4, key: 'naturalDisasters' }
];

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

  useEffect(() => {
    const data = calculateClimateData(selectedScenario, energyMix);
    setClimateData(data);
    const risks = calculateRiskLevels(data, selectedYear);
    setRiskLevels(risks);
  }, [selectedScenario, selectedYear, energyMix]);

  const handleEnergyMixChange = (mix) => {
    const presets = {
      renewable: { renewable: 80, fossil: 10, nuclear: 10 },
      mixed: { renewable: 40, fossil: 40, nuclear: 20 },
      fossil: { renewable: 20, fossil: 70, nuclear: 10 }
    };
    if (presets[mix]) setEnergyMix(presets[mix]);
  };

  const currentTemp = climateData?.temperature?.[climateData.years.indexOf(selectedYear)] || 0;
  const ScenarioIcon = SCENARIOS[selectedScenario].icon;

  const economicData = {
    economicGrowth: Math.min(100, Math.round(currentTemp * 15)),
    populationAffected: Math.min(100, Math.round(currentTemp * 12)),
    gdpImpact: Math.min(100, Math.round(currentTemp * 18)),
    agriculturalLoss: Math.min(100, Math.round(currentTemp * 20)),
    waterScarcity: Math.min(100, Math.round(currentTemp * 16)),
    disasterRisk: Math.min(100, Math.round(currentTemp * 22))
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Globe className="w-7 h-7 text-accent" />
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{t('app.title')}</h1>
            <p className="text-xs text-text-muted">{t('app.subtitle')}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
            SCENARIOS[selectedScenario].bg,
            SCENARIOS[selectedScenario].border,
            SCENARIOS[selectedScenario].color
          )}>
            <ScenarioIcon className="w-4 h-4" />
            {t(`scenarios.${selectedScenario}.label`)}
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            <Thermometer className="w-4 h-4" />
            +{currentTemp.toFixed(1)}°C
          </div>
          
          <span className="text-text-muted text-sm font-mono">{selectedYear}</span>
        </div>

        <LanguageSelector />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Map */}
        <div className="flex-[2] min-h-[300px] lg:min-h-0 lg:border-r border-border">
          <Map
            selectedYear={selectedYear}
            selectedScenario={selectedScenario}
            onYearChange={setSelectedYear}
            onScenarioChange={setSelectedScenario}
          />
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 flex-shrink-0 border-b lg:border-b-0 border-border overflow-auto">
          <ClimateControls
            selectedScenario={selectedScenario}
            selectedYear={selectedYear}
            onScenarioChange={setSelectedScenario}
            onYearChange={setSelectedYear}
            onEnergyMixChange={handleEnergyMixChange}
            riskLevels={riskLevels}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="h-80 lg:h-96 flex-shrink-0 border-t border-border flex flex-col">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                activeTab === tab.value
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              )}
            >
              {t(`tabs.${tab.key}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 0 && <DataVisualization data={climateData} />}
              {activeTab === 1 && <GreenhouseEffect climateData={climateData} />}
              {activeTab === 2 && <EconomicImpact data={economicData} />}
              {activeTab === 3 && <EnergyMixSimulator onEnergyMixChange={setEnergyMix} />}
              {activeTab === 4 && <DisasterSimulator temperature={currentTemp} year={selectedYear} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
