import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-accent/10 text-accent border-accent/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  secondary: 'bg-surface text-text-secondary border-border',
};

export function Badge({ 
  children, 
  variant = 'default', 
  className,
  onClick,
  ...props 
}) {
  const Component = onClick ? 'button' : 'span';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        'transition-colors',
        onClick && 'cursor-pointer hover:opacity-80',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
