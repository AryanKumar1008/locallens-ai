import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  readonly children: ReactNode;
  /** Element to render as — defaults to span */
  readonly as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

/**
 * Animated gradient text using background-clip.
 */
export default function GradientText({
  children,
  as: Component = 'span',
  className,
  ...props
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400',
        'bg-clip-text text-transparent',
        'animate-gradient bg-[length:200%_auto]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
