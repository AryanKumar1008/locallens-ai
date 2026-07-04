'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from '@/types';

/** Style maps for button variants and sizes */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20 hover:shadow-accent/30',
  secondary:
    'bg-surface text-foreground hover:bg-surface-hover border border-border',
  ghost:
    'bg-transparent text-foreground hover:bg-surface',
  outline:
    'bg-transparent text-accent border border-accent/40 hover:bg-accent-soft hover:border-accent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  readonly variant?: ButtonVariant;
  /** Size preset */
  readonly size?: ButtonSize;
  /** Loading state — disables button and shows spinner */
  readonly isLoading?: boolean;
  /** Optional icon to render before children */
  readonly icon?: ReactNode;
  /** Full-width button */
  readonly fullWidth?: boolean;
  /** Content */
  readonly children: ReactNode;
}

/**
 * Reusable button component with variant/size system, loading state, and accessibility.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-xl',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'cursor-pointer select-none',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 pointer-events-none',
          className,
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="opacity-70">{children}</span>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
