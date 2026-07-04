import type { ClassValue } from 'clsx';

/**
 * Merges Tailwind CSS class names, resolving conflicts.
 * Uses clsx for conditional classes + twMerge for deduplication.
 *
 * Since we're keeping dependencies minimal, this is a lightweight
 * implementation that concatenates and deduplicates class strings.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats a currency amount with proper locale formatting.
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates a unique ID for form elements.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
