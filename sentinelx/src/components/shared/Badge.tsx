'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'active';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  critical: 'bg-critical-bg text-critical-text border-critical-border',
  high: 'bg-high-bg text-high-text border-high-border',
  medium: 'bg-medium-bg text-medium-text border-medium-border',
  low: 'bg-low-bg text-low-text border-low-border',
  info: 'bg-info-bg text-info-text border-info-border',
  active: 'bg-active-bg text-active-text border-active-border',
};

const dotColors: Record<BadgeVariant, string> = {
  critical: 'bg-critical-text',
  high: 'bg-high-text',
  medium: 'bg-medium-text',
  low: 'bg-low-text',
  info: 'bg-info-text',
  active: 'bg-active-text',
};

export default function Badge({ variant, children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
