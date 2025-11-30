import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-accent text-background hover:bg-accent-hover',
  secondary: 'bg-surface hover:bg-surface-hover text-text-primary border border-border',
  ghost: 'hover:bg-surface-hover text-text-secondary hover:text-text-primary',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-6 text-sm',
  icon: 'h-9 w-9',
};

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className, 
  ...props 
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
