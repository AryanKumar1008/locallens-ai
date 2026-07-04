
/**
 * Retrieves the API key for Google Gen AI from environment variables.
 */
export const getApiKey = (): string | undefined => {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
};

/**
 * Sanitizes input text by stripping HTML tags and trimming.
 * Caps length to defense-in-depth against prompt injection or oversized payloads.
 */
export function sanitizeText(input: string, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim()
    .slice(0, maxLength);
}

/**
 * Server-side sets of valid values for strict type-assertion/validation.
 */
export const VALID_TRAVEL_STYLES: ReadonlySet<string> = new Set([
  'adventure',
  'cultural',
  'relaxation',
  'foodie',
  'budget',
  'luxury',
]);

export const VALID_INTERESTS: ReadonlySet<string> = new Set([
  'history',
  'nature',
  'nightlife',
  'art',
  'food',
  'architecture',
  'shopping',
  'sports',
  'music',
  'photography',
]);
