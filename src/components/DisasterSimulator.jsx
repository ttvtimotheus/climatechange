import { useMemo } from 'react';
import { Flame, Droplets, CloudLightning, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

const DISASTERS = [
  { key: 'heat', title: 'Heat Waves', icon: Flame, color: 'text-red-400', bg: 'bg-red-400', probMult: 20, sevMult: 15 },
  { key: 'flood', title: 'Flooding', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400', probMult: 15, sevMult: 18 },
  { key: 'storm', title: 'Storms', icon: CloudLightning, color: 'text-amber-400', bg: 'bg-amber-400', probMult: 12, sevMult: 16 },
  { key: 'drought', title: 'Droughts', icon: Leaf, color: 'text-orange-700', bg: 'bg-orange-700', probMult: 18, sevMult: 20 }
];

const DisasterSimulator = ({ temperature = 0, year }) => {
  const disasters = useMemo(() => 
    DISASTERS.map(d => ({
      ...d,
      probability: Math.min(100, Math.round(temperature * d.probMult)),
      severity: Math.min(100, Math.round(temperature * d.sevMult))
    })), [temperature]);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-accent">Disaster Forecast</h3>
        <span className="text-xs text-text-muted">for {year}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {disasters.map(({ key, title, icon: Icon, color, bg, probability, severity }) => (
          <div key={key} className="p-3 rounded-lg bg-surface-hover border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={cn('w-5 h-5', color)} />
              <span className="text-sm font-medium">{title}</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Probability</span>
                  <span className={color}>{probability}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', bg)} style={{ width: `${probability}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Severity</span>
                  <span className={color}>{severity}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', bg)} style={{ width: `${severity}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisasterSimulator;
