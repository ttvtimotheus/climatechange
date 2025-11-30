import { Flame, Droplets, CloudLightning, Sun } from 'lucide-react';
import { Select, Slider } from './ui';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

const RISKS = [
  { key: 'drought', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400' },
  { key: 'flooding', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400' },
  { key: 'wildfires', icon: Flame, color: 'text-red-400', bg: 'bg-red-400' },
  { key: 'storms', icon: CloudLightning, color: 'text-purple-400', bg: 'bg-purple-400' }
];

const ClimateControls = ({ 
  selectedScenario = 'moderate',
  selectedYear = 2025,
  onScenarioChange,
  onYearChange,
  onEnergyMixChange,
  riskLevels = { drought: 0, flooding: 0, fires: 0, storms: 0 }
}) => {
  const { t } = useLanguage();

  const scenarioOptions = [
    { value: 'optimistic', label: t('scenarios.optimistic.label') },
    { value: 'moderate', label: t('scenarios.moderate.label') },
    { value: 'pessimistic', label: t('scenarios.pessimistic.label') }
  ];

  const energyOptions = [
    { value: 'renewable', label: t('ui.renewable') },
    { value: 'mixed', label: t('ui.mixed') },
    { value: 'fossil', label: t('ui.fossil') }
  ];

  return (
    <div className="p-4 h-full space-y-5">
      {/* Scenario */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-2">
          {t('scenarios.title')}
        </label>
        <Select
          value={selectedScenario}
          onChange={onScenarioChange}
          options={scenarioOptions}
        />
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-2">
          {t('ui.timePeriod')}
        </label>
        <Slider
          value={selectedYear}
          min={2025}
          max={2100}
          onChange={onYearChange}
          showValue
        />
      </div>

      {/* Energy Mix */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-2">
          {t('ui.energyMix')}
        </label>
        <Select
          value="mixed"
          onChange={onEnergyMixChange}
          options={energyOptions}
        />
      </div>

      {/* Risks */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-3">
          {t('ui.currentRisks')}
        </label>
        <div className="space-y-2.5">
          {RISKS.map(({ key, icon: Icon, color, bg }) => {
            const value = riskLevels[key === 'wildfires' ? 'fires' : key] || 0;
            return (
              <div key={key} className="flex items-center gap-2">
                <Icon className={cn('w-4 h-4', color)} />
                <span className="text-xs text-text-secondary flex-1">
                  {t(`ui.${key}`)}
                </span>
                <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                  <div 
                    className={cn('h-full rounded-full transition-all duration-300', bg)}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className={cn('text-xs font-medium w-8 text-right', color)}>
                  {value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClimateControls;
