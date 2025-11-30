import { cn } from '../../lib/utils';

export function Slider({ 
  value, 
  min = 0, 
  max = 100, 
  onChange, 
  className,
  showValue = false,
  ...props 
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('relative flex items-center gap-3', className)}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={cn(
          'w-full h-1.5 appearance-none bg-border rounded-full cursor-pointer',
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
          '[&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform',
          '[&::-webkit-slider-thumb]:hover:scale-110',
          '[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.3)]'
        )}
        style={{
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`
        }}
        {...props}
      />
      {showValue && (
        <span className="text-sm font-medium text-text-primary min-w-[3rem] text-right">
          {value}
        </span>
      )}
    </div>
  );
}
