/** Navigation link definition */
export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly id: string;
}

/** Feature card data */
export interface Feature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: FeatureIconName;
}

/** Supported feature icon names */
export type FeatureIconName =
  | 'compass'
  | 'sparkles'
  | 'globe'
  | 'map'
  | 'heart'
  | 'camera';

/** Travel style options */
export type TravelStyle =
  | 'adventure'
  | 'cultural'
  | 'relaxation'
  | 'foodie'
  | 'budget'
  | 'luxury';

/** Interest tag options */
export type Interest =
  | 'history'
  | 'nature'
  | 'nightlife'
  | 'art'
  | 'food'
  | 'architecture'
  | 'shopping'
  | 'sports'
  | 'music'
  | 'photography';

/** Destination form data */
export interface DestinationFormData {
  destination: string;
  budget: string;
  duration: string;
  travelStyle: TravelStyle | '';
  interests: Interest[];
}

/** Form field error state */
export interface FormErrors {
  destination?: string;
  budget?: string;
  duration?: string;
  travelStyle?: string;
  interests?: string;
}

/** Button component variants */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

/** Button component sizes */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface Activity {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  activityName: string;
  description: string;
  location: string;
  costEstimation: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface HiddenGem {
  name: string;
  location: string;
  whySpecial: string;
  howToGetThere: string;
}

export interface FoodRecommendation {
  dishName: string;
  description: string;
  culturalSignificance: string;
  mustTryLocation?: string;
}

export interface EtiquetteItem {
  rule: string;
  type: 'Do' | 'Dont';
  reason: string;
}

export interface ResponsibleTip {
  tip: string;
  impactDescription: string;
}

export interface ItineraryResult {
  destination: string;
  duration: number;
  budget: string;
  travelStyle: string;
  itinerary: DayPlan[];
  hiddenGems: HiddenGem[];
  culturalStorytelling: string;
  localFood: FoodRecommendation[];
  etiquette: EtiquetteItem[];
  responsibleTravel: ResponsibleTip[];
  didYouKnowFact: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}


