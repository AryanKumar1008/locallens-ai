import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Use narrow max-width for content-focused layouts */
  readonly narrow?: boolean;
}

/**
 * Centered max-width container with responsive horizontal padding.
 */
export default function Container({
  children,
  className,
  narrow = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-6xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
