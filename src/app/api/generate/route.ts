import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import type { DestinationFormData } from '@/types';
import { getApiKey, sanitizeText, VALID_TRAVEL_STYLES, VALID_INTERESTS } from '@/lib/api-utils';

// Define the response schema structure matching our ItineraryResult interface
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    duration: { type: Type.INTEGER },
    budget: { type: Type.STRING },
    travelStyle: { type: Type.STRING },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeOfDay: {
                  type: Type.STRING,
                  enum: ['Morning', 'Afternoon', 'Evening'],
                },
                activityName: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                costEstimation: { type: Type.STRING },
              },
              required: [
                'timeOfDay',
                'activityName',
                'description',
                'location',
                'costEstimation',
              ],
            },
          },
        },
        required: ['dayNumber', 'theme', 'activities'],
      },
    },
    hiddenGems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          whySpecial: { type: Type.STRING },
          howToGetThere: { type: Type.STRING },
        },
        required: ['name', 'location', 'whySpecial', 'howToGetThere'],
      },
    },
    culturalStorytelling: { type: Type.STRING },
    localFood: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          description: { type: Type.STRING },
          culturalSignificance: { type: Type.STRING },
          mustTryLocation: { type: Type.STRING },
        },
        required: ['dishName', 'description', 'culturalSignificance'],
      },
    },
    etiquette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rule: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Do', 'Dont'] },
          reason: { type: Type.STRING },
        },
        required: ['rule', 'type', 'reason'],
      },
    },
    responsibleTravel: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tip: { type: Type.STRING },
          impactDescription: { type: Type.STRING },
        },
        required: ['tip', 'impactDescription'],
      },
    },
    didYouKnowFact: { type: Type.STRING },
  },
  required: [
    'destination',
    'duration',
    'budget',
    'travelStyle',
    'itinerary',
    'hiddenGems',
    'culturalStorytelling',
    'localFood',
    'etiquette',
    'responsibleTravel',
    'didYouKnowFact',
  ],
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DestinationFormData>;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { destination, budget, duration, travelStyle, interests } = body;

    // Validate presence and types
    if (
      typeof destination !== 'string' ||
      typeof budget !== 'string' ||
      typeof duration !== 'string' ||
      typeof travelStyle !== 'string' ||
      !Array.isArray(interests) ||
      interests.length === 0
    ) {
      return NextResponse.json(
        { error: 'All fields (destination, budget, duration, travelStyle, interests) are required with valid formats.' },
        { status: 400 }
      );
    }

    // Input sanitization
    const sanitizedDestination = sanitizeText(destination, 100);
    const sanitizedBudget = sanitizeText(budget, 20);
    const sanitizedDuration = sanitizeText(duration, 10);
    const sanitizedTravelStyle = sanitizeText(travelStyle, 50);

    // Deep server-side validation
    const numBudget = Number(sanitizedBudget);
    const numDuration = Number(sanitizedDuration);

    if (isNaN(numBudget) || numBudget <= 0 || numBudget > 1000000) {
      return NextResponse.json(
        { error: 'Budget must be a positive number up to 1,000,000.' },
        { status: 400 }
      );
    }

    if (isNaN(numDuration) || numDuration < 1 || numDuration > 90) {
      return NextResponse.json(
        { error: 'Duration must be a number between 1 and 90 days.' },
        { status: 400 }
      );
    }

    if (!VALID_TRAVEL_STYLES.has(sanitizedTravelStyle)) {
      return NextResponse.json(
        { error: 'Invalid travel style selected.' },
        { status: 400 }
      );
    }

    const validatedInterests: string[] = [];
    for (const interest of interests) {
      if (typeof interest !== 'string') {
        return NextResponse.json(
          { error: 'Invalid interest format.' },
          { status: 400 }
        );
      }
      const sanitizedInterest = sanitizeText(interest, 50);
      if (!VALID_INTERESTS.has(sanitizedInterest)) {
        return NextResponse.json(
          { error: `Invalid interest selected: ${sanitizedInterest}` },
          { status: 400 }
        );
      }
      validatedInterests.push(sanitizedInterest);
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      console.error('API Error: GEMINI_API_KEY is not defined in environment variables.');
      return NextResponse.json(
        {
          error: 'API key is missing. Please configure GEMINI_API_KEY in your environment.',
        },
        { status: 500 }
      );
    }

    // Initialize the Google Gen AI client
    const ai = new GoogleGenAI({ apiKey });

    // Build the prompt using a reusable template
    const prompt = `You are a local cultural ambassador and expert travel planner.
Generate a structured travel guide and personalized itinerary for the following parameters:
- Destination: ${sanitizedDestination}
- Duration: ${numDuration} Days
- Budget: USD ${numBudget} (total budget)
- Travel Style: ${sanitizedTravelStyle}
- Traveler Interests: ${validatedInterests.join(', ')}

Please provide:
1. A day-by-day itinerary (${numDuration} days) reflecting the travel style and interests. Each day must include Morning, Afternoon, and Evening activities.
2. Curated hidden gems (off-the-beaten-path locations, local secrets).
3. Cultural storytelling (rich context, history, or folklore about the destination).
4. Local food recommendations (must-try dishes, significance, and suggested spots).
5. Cultural etiquette (important Do's and Don'ts).
6. Responsible and sustainable travel tips.
7. A didYouKnowFact (fascinating local trivia or cultural detail).

The response must be in structured JSON conforming strictly to the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Received empty response from Gemini API.');
    }

    const parsedResult = JSON.parse(resultText);
    return NextResponse.json(parsedResult);
  } catch (error: unknown) {
    console.error('Error generating itinerary:', error);
    const errorDetails = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Failed to generate itinerary. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
