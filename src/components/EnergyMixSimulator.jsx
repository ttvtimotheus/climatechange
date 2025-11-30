import { useState } from 'react';
import { Sun, Wind, Waves, Flame, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const SOURCES = [
  { key: 'solar', label: 'Solar', icon: Sun, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
  { key: 'wind', label: 'Wind', icon: Wind, color: 'bg-sky-400', textColor: 'text-sky-400' },
  { key: 'hydro', label: 'Hydro', icon: Waves, color: 'bg-cyan-400', textColor: 'text-cyan-400' },
  { key: 'nuclear', label: 'Nuclear', icon: Zap, color: 'bg-purple-400', textColor: 'text-purple-400' },
  { key: 'fossil', label: 'Fossil', icon: Flame, color: 'bg-orange-400', textColor: 'text-orange-400' }
];

const EnergyMixSimulator = ({ onEnergyMixChange }) => {
  const [mix, setMix] = useState({ solar: 20, wind: 20, hydro: 10, nuclear: 20, fossil: 30 });

  const handleChange = (source, newValue) => {
    const diff = newValue - mix[source];
    const others = Object.keys(mix).filter(k => k !== source);
    const totalOthers = others.reduce((s, k) => s + mix[k], 0);
    
    const newMix = { ...mix, [source]: newValue };
    others.forEach(k => {
      newMix[k] = Math.max(0, Math.round(mix[k] - (diff * mix[k] / totalOthers)));
    });
    
    setMix(newMix);
    onEnergyMixChange?.(newMix);
  };

  const co2 = Object.entries(mix).reduce((t, [k, v]) => 
    t + v * ({ solar: 0.1, wind: 0.1, hydro: 0.2, nuclear: 0.5, fossil: 10 }[k] || 0), 0);

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold text-accent mb-4">Energy Mix Simulator</h3>
      
      <div className="space-y-4">
        {SOURCES.map(({ key, label, icon: Icon, color, textColor }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn('w-4 h-4', textColor)} />
                <span className="text-xs text-text-secondary">{label}</span>
              </div>
              <span className={cn('text-xs font-medium', textColor)}>{mix[key]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mix[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="w-full h-1.5 appearance-none bg-border rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 rounded-lg bg-surface-hover">
        <p className="text-xs text-text-muted mb-2">CO₂ Impact</p>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-300',
              co2 > 4 ? 'bg-red-400' : co2 > 2 ? 'bg-amber-400' : 'bg-emerald-400'
            )}
            style={{ width: `${Math.min(100, (co2 / 8) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary mt-1">{co2.toFixed(1)} CO₂ equivalent units</p>
      </div>
    </div>
  );
};

export default EnergyMixSimulator;
