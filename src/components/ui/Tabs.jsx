import { cn } from '../../lib/utils';

export function Tabs({ value, onChange, tabs, className }) {
  return (
    <div className={cn('flex gap-1 p-1 bg-surface rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange?.(tab.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            value === tab.value
              ? 'bg-accent text-background'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
