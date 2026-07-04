import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { ChatMessage } from '@/types';
import { getApiKey, sanitizeText } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      destination?: unknown;
      messages?: unknown;
    };

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { destination, messages } = body;

    if (
      typeof destination !== 'string' ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return NextResponse.json(
        { error: 'destination and non-empty messages array are required.' },
        { status: 400 }
      );
    }

    // Input sanitization and validation
    const sanitizedDestination = sanitizeText(destination, 100);
    if (!sanitizedDestination) {
      return NextResponse.json(
        { error: 'Invalid destination name.' },
        { status: 400 }
      );
    }

    // Limit conversation history to latest 50 messages to prevent oversized payloads
    const cappedMessages = messages.slice(-50);
    const sanitizedMessages: ChatMessage[] = [];

    for (const m of cappedMessages) {
      if (!m || typeof m !== 'object' || !m.role || typeof m.text !== 'string') {
        return NextResponse.json(
          { error: 'Invalid message structure in conversation history.' },
          { status: 400 }
        );
      }
      sanitizedMessages.push({
        id: String(m.id || ''),
        role: m.role === 'model' ? 'model' : 'user',
        text: sanitizeText(m.text, 2000),
      });
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

    const ai = new GoogleGenAI({ apiKey });

    const contents = sanitizedMessages.map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are a warm, highly knowledgeable local guide from ${sanitizedDestination}.
Answer the traveler's questions with accurate local knowledge, rich cultural context, practical navigation tips, and respectful recommendations.
Keep your responses conversational, welcoming, and under 150 words. Do not use generic answers; be highly specific to ${sanitizedDestination}.`,
        temperature: 0.7,
      },
    });

    const replyText = response.text;
    if (!replyText) {
      throw new Error('Received empty response from Gemini API.');
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: unknown) {
    console.error('Error in Ask a Local chat:', error);
    const errorDetails = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve response from your local guide. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
