import { TrendingUp, Users, DollarSign, Wheat, Droplets, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

const INDICATORS = [
  { key: 'economicGrowth', label: 'Economic Growth Impact', icon: TrendingUp, color: 'bg-blue-400' },
  { key: 'populationAffected', label: 'Population Affected', icon: Users, color: 'bg-purple-400' },
  { key: 'gdpImpact', label: 'GDP Impact', icon: DollarSign, color: 'bg-emerald-400' },
  { key: 'agriculturalLoss', label: 'Agricultural Loss', icon: Wheat, color: 'bg-amber-400' },
  { key: 'waterScarcity', label: 'Water Scarcity', icon: Droplets, color: 'bg-cyan-400' },
  { key: 'disasterRisk', label: 'Disaster Risk', icon: AlertTriangle, color: 'bg-red-400' }
];

const EconomicImpact = ({ data = {} }) => {
  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold text-accent mb-4">Economic & Social Impact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDICATORS.map(({ key, label, icon: Icon, color }) => {
          const value = data[key] || 0;
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={cn('w-4 h-4', color.replace('bg-', 'text-'))} />
                <span className="text-xs text-text-secondary">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className={cn('h-full rounded-full transition-all duration-500', color)}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-primary w-10 text-right">{value}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EconomicImpact;
