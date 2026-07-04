'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  readonly label: string;
  /** Error message — displays below input in red */
  readonly error?: string;
  /** Helper text displayed below input */
  readonly helperText?: string;
}

/**
 * Accessible form input with auto-generated label association,
 * error states, and smooth focus transitions.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground/80"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl px-4 py-3 text-sm',
            'bg-surface border border-border text-foreground',
            'placeholder:text-muted/60',
            'transition-all duration-200 ease-out',
            'hover:border-accent/30',
            'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60',
            error && 'border-error/60 focus:ring-error/30 focus:border-error',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
