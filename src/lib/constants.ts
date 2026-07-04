import type { Feature, NavLink, TravelStyle, Interest } from '@/types';

/** Primary navigation links */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', href: '/', id: 'nav-home' },
  { label: 'Explore', href: '#explore', id: 'nav-explore' },
  { label: 'Features', href: '#features', id: 'nav-features' },
] as const;

/** Feature cards displayed on the homepage */
export const FEATURES: readonly Feature[] = [
  {
    id: 'feature-ai-insights',
    title: 'AI-Powered Insights',
    description:
      'Get personalized travel recommendations powered by Gemini AI that understand your unique preferences and style.',
    icon: 'sparkles',
  },
  {
    id: 'feature-local-culture',
    title: 'Local Culture Guide',
    description:
      'Discover hidden gems, local customs, and authentic experiences that most tourists never find.',
    icon: 'compass',
  },
  {
    id: 'feature-smart-planning',
    title: 'Smart Itineraries',
    description:
      'Generate day-by-day travel plans optimized for your budget, duration, and interests.',
    icon: 'map',
  },
] as const;

/** Travel style options for the destination form */
export const TRAVEL_STYLES: readonly { value: TravelStyle; label: string; emoji: string }[] = [
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { value: 'relaxation', label: 'Relaxation', emoji: '🏖️' },
  { value: 'foodie', label: 'Foodie', emoji: '🍜' },
  { value: 'budget', label: 'Budget', emoji: '💰' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
] as const;

/** Interest tags for the destination form */
export const INTERESTS: readonly { value: Interest; label: string }[] = [
  { value: 'history', label: 'History' },
  { value: 'nature', label: 'Nature' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'art', label: 'Art & Museums' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music & Concerts' },
  { value: 'photography', label: 'Photography' },
] as const;

/** Application metadata */
export const APP_NAME = 'LocalLens AI' as const;
export const APP_DESCRIPTION =
  'Discover destinations and engage with local culture using the power of Generative AI.' as const;
export const APP_TAGLINE = 'See the world through a local lens' as const;
