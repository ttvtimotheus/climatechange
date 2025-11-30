import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

const REGIONS = {
  northEurope: ['Berlin', 'London', 'Moscow', 'Paris'],
  northAmerica: ['New York'],
  asia: ['Tokyo', 'Beijing', 'Mumbai', 'Dubai', 'Singapore'],
  africa: ['Lagos', 'Cape Town'],
  southernHemisphere: ['Sydney', 'Rio', 'Buenos Aires']
};

const getTemperatureColor = (value) => {
  if (value >= 4) return 'text-red-400';
  if (value >= 3) return 'text-orange-400';
  if (value >= 2) return 'text-amber-400';
  if (value >= 1) return 'text-lime-400';
  return 'text-emerald-400';
};

const getTemperatureBg = (value) => {
  if (value >= 4) return 'bg-red-400';
  if (value >= 3) return 'bg-orange-400';
  if (value >= 2) return 'bg-amber-400';
  if (value >= 1) return 'bg-lime-400';
  return 'bg-emerald-400';
};

const getRiskLevel = (value) => {
  if (value >= 4) return 'riskLevels.extreme';
  if (value >= 3) return 'riskLevels.veryHigh';
  if (value >= 2) return 'riskLevels.high';
  if (value >= 1) return 'riskLevels.moderate';
  return 'riskLevels.low';
};

const RegionalStats = ({ data = [] }) => {
  const { t } = useLanguage();

  const regionalData = Object.entries(REGIONS).map(([region, cities]) => {
    const citiesData = data.filter(d => cities.includes(d.label));
    const avgTemperature = citiesData.length > 0 
      ? citiesData.reduce((sum, d) => sum + d.value, 0) / citiesData.length 
      : 0;
    
    return {
      region,
      avgTemperature,
      cities: citiesData,
      riskLevel: getRiskLevel(avgTemperature)
    };
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-accent">{t('regions.title')}</h3>
        <p className="text-xs text-text-muted mt-1">{t('regions.subtitle')}</p>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        {regionalData.map(({ region, avgTemperature, cities, riskLevel }) => (
          <div
            key={region}
            className="p-3 rounded-lg bg-surface-hover/50 border border-border hover:border-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t(`regions.${region}`)}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                getTemperatureColor(avgTemperature),
                'bg-current/10'
              )}>
                {t(riskLevel)}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="text-text-muted">{t('regions.average')}:</span>
                <span className={cn('font-semibold', getTemperatureColor(avgTemperature))}>
                  {avgTemperature.toFixed(1)}°C
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div 
                  className={cn('h-full rounded-full transition-all', getTemperatureBg(avgTemperature))}
                  style={{ width: `${Math.min((avgTemperature / 5) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              {cities.map(city => (
                <div
                  key={city.label}
                  className="flex items-center justify-between py-1 px-2 rounded bg-background/50 text-xs"
                >
                  <span className="text-text-secondary">{city.label}</span>
                  <span className={cn('font-medium', getTemperatureColor(city.value))}>
                    {city.value.toFixed(1)}°C
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalStats;
