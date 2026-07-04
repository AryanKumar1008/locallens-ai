import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'success' | 'error';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly children: ReactNode;
  readonly variant?: BadgeVariant;
  /** Whether the badge is in an active/selected state */
  readonly active?: boolean;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-surface text-muted border-border',
  accent: 'bg-accent-soft text-accent border-accent/20',
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-error/10 text-error border-error/20',
};

/**
 * Small pill-shaped badge for tags and labels.
 */
export default function Badge({
  children,
  variant = 'default',
  active = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        'border transition-all duration-200',
        BADGE_VARIANTS[variant],
        active && 'bg-accent text-white border-accent shadow-sm shadow-accent/20',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
