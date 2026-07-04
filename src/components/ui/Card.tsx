import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content inside the card */
  readonly children?: ReactNode;
  /** Enable hover lift animation */
  readonly hoverable?: boolean;
  /** Custom padding override */
  readonly padding?: 'sm' | 'md' | 'lg';
}

const PADDING_CLASSES = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

/**
 * Glassmorphism card with optional hover lift effect.
 */
export default function Card({
  children,
  hoverable = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl glass',
        PADDING_CLASSES[padding],
        hoverable &&
          'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
