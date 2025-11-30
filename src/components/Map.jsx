import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import WorldMap from './WorldMap';
import RegionalStats from './RegionalStats';
import { generateGlobeData } from '../services/globeService';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

const YEAR_MIN = 2025;
const YEAR_MAX = 2100;
const ANIMATION_INTERVAL = 300;

const SCENARIOS = {
  optimistic: { icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50' },
  moderate: { icon: Minus, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50' },
  pessimistic: { icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' }
};

const Map = ({ 
  selectedYear = 2025, 
  selectedScenario = 'moderate',
  onYearChange,
  onScenarioChange 
}) => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const { t } = useLanguage();

  const globeData = useMemo(() => {
    return generateGlobeData(selectedScenario, currentYear);
  }, [selectedScenario, currentYear]);

  useEffect(() => {
    setCurrentYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYear(prev => {
          const next = prev + 1;
          if (next > YEAR_MAX) {
            setIsPlaying(false);
            return YEAR_MIN;
          }
          return next;
        });
      }, ANIMATION_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (onYearChange && currentYear !== selectedYear) {
      onYearChange(currentYear);
    }
  }, [currentYear, onYearChange, selectedYear]);

  const percentage = ((currentYear - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;

  return (
    <div className="relative w-full h-full flex flex-col bg-background">
      {/* Main area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Stats Sidebar */}
        <div className={cn(
          'absolute left-0 top-0 h-full w-72 bg-surface border-r border-border z-50',
          'transition-transform duration-300 overflow-auto',
          isStatsOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        )}>
          <RegionalStats data={globeData} year={currentYear} />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsStatsOpen(!isStatsOpen)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 z-50 p-1.5',
            'bg-surface border border-border rounded-r-lg shadow-lg',
            'hover:bg-surface-hover transition-all duration-300',
            isStatsOpen ? 'left-72' : 'left-0'
          )}
        >
          {isStatsOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Map */}
        <div className="w-full h-full">
          <WorldMap data={globeData} year={currentYear} />

          {/* Scenario Pills */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Object.entries(SCENARIOS).map(([key, { icon: Icon, color, bg, border }]) => (
              <button
                key={key}
                onClick={() => onScenarioChange?.(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                  'border backdrop-blur-md transition-all',
                  selectedScenario === key
                    ? cn(bg, border, color)
                    : 'bg-surface/80 border-border text-text-secondary hover:text-text-primary'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t(`scenarios.${key}.label`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-3 p-3 border-t border-border bg-surface/80 backdrop-blur-sm">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-accent text-background hover:bg-accent-hover transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <span className="text-xs text-text-muted w-10">{YEAR_MIN}</span>

        <div className="flex-1 relative">
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className={cn(
              'w-full h-1.5 appearance-none bg-border rounded-full cursor-pointer',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
              '[&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:cursor-pointer'
            )}
            style={{
              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`
            }}
          />
        </div>

        <span className="text-xs text-text-muted w-10">{YEAR_MAX}</span>

        <div className="px-3 py-1 rounded-lg bg-accent text-background text-sm font-semibold">
          {currentYear}
        </div>
      </div>
    </div>
  );
};

export default Map;
