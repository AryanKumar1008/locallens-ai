'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { ItineraryResult } from '@/types';
import AskLocalChat from './AskLocalChat';

export interface ItineraryDisplayProps {
  readonly result: ItineraryResult | null;
  readonly onReset: () => void;
  readonly onRegenerate: () => void;
  readonly isSubmitting: boolean;
  readonly error: string | null;
}

export default function ItineraryDisplay({
  result,
  onReset,
  onRegenerate,
  isSubmitting,
  error,
}: ItineraryDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  // ─── 1. LOADING / SUBMITTING STATE (Skeleton Cards) ───
  if (isSubmitting) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-pulse" role="status" aria-busy="true">
        {/* Header Skeleton */}
        <Card padding="lg" className="border-accent/15 bg-accent-soft/10">
          <div className="h-4 w-24 bg-muted/20 rounded-md mb-2" />
          <div className="h-8 w-64 bg-muted/30 rounded-lg mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-muted/20 rounded-full" />
            <div className="h-6 w-16 bg-muted/20 rounded-full" />
            <div className="h-6 w-24 bg-muted/20 rounded-full" />
          </div>
        </Card>

        {/* Content Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-48 skeleton" />
          <Card className="h-48 skeleton" />
          <Card className="h-64 skeleton md:col-span-2" />
        </div>
      </div>
    );
  }

  // ─── 2. ERROR STATE ───
  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6 animate-fade-in text-center py-12">
        <Card padding="lg" className="border-error/20 bg-error/5 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error text-2xl">
            ⚠️
          </div>
          <h3 className="text-xl font-bold text-foreground">Generation Failed</h3>
          <p className="text-sm text-muted leading-relaxed max-w-md">
            {error}
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onRegenerate}
              className="px-5 py-2.5 text-sm font-semibold bg-accent text-white hover:bg-accent-hover rounded-xl shadow-lg shadow-accent/25 transition-all cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={onReset}
              className="px-5 py-2.5 text-sm font-semibold bg-surface hover:bg-surface-hover text-muted hover:text-foreground border border-border rounded-xl transition-all cursor-pointer"
            >
              Reset Form
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── 3. EMPTY STATE ───
  if (!result) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-16 animate-fade-in">
        <Card padding="lg" className="border-border bg-surface/5 flex flex-col items-center gap-4">
          <div className="text-4xl">🔭</div>
          <h3 className="text-lg font-bold text-foreground">No Itinerary Generated</h3>
          <p className="text-xs text-muted leading-relaxed">
            Fill out the discovery form above and submit to generate your personalized local lens itinerary.
          </p>
        </Card>
      </div>
    );
  }

  // ─── 4. SUCCESS STATE (Main Dashboard Cards) ───
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in">
      
      {/* PLACE CARD (Banner Header) */}
      <Card padding="lg" className="relative overflow-hidden border-accent/20 bg-accent-soft/20">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-soft via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Destination Place</span>
            <h2 className="text-3xl font-bold text-foreground mt-1 mb-2">{result.destination}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="accent">{result.travelStyle}</Badge>
              <Badge variant="default">{result.duration} Days</Badge>
              <Badge variant="success">Budget: {result.budget}</Badge>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onRegenerate}
              className="px-4 py-2 text-sm font-semibold bg-accent text-white hover:bg-accent-hover rounded-xl shadow-md transition-all cursor-pointer"
            >
              🔄 Regenerate
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-semibold bg-surface hover:bg-surface-hover text-muted hover:text-foreground border border-border rounded-xl transition-all cursor-pointer"
            >
              Plan Another
            </button>
          </div>
        </div>

        {/* DID YOU KNOW? FACT CARD */}
        <div className="relative z-10 mt-6 p-4 rounded-xl bg-surface/50 border border-border/50 text-sm">
          <span className="font-bold text-accent">💡 Did you know? </span>
          <span className="text-foreground/80">{result.didYouKnowFact}</span>
        </div>
      </Card>

      {/* Grid Layout of Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* STORY CARD */}
        <Card padding="md" className="flex flex-col gap-3 h-full">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>🏛️</span> Cultural Storytelling
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed overflow-y-auto max-h-[220px] pr-2">
            {result.culturalStorytelling}
          </p>
        </Card>

        {/* LOCAL FOOD CARD */}
        <Card padding="md" className="flex flex-col gap-3 h-full">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>🍜</span> Local Food Recommendations
          </h3>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-2">
            {result.localFood.map((food, idx) => (
              <div key={idx} className="border-b border-border/55 last:border-b-0 pb-2 last:pb-0">
                <h4 className="font-bold text-sm text-foreground">{food.dishName}</h4>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{food.description}</p>
                <p className="text-xs text-accent italic mt-1 font-medium">
                  Significance: {food.culturalSignificance}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* HIDDEN GEM CARD */}
        <Card padding="md" className="flex flex-col gap-3 h-full">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>💎</span> Hidden Gems
          </h3>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-2">
            {result.hiddenGems.map((gem, idx) => (
              <div key={idx} className="border-b border-border/55 last:border-b-0 pb-2 last:pb-0">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-bold text-sm text-foreground">{gem.name}</h4>
                  <span className="text-[10px] text-muted font-medium shrink-0">📍 {gem.location}</span>
                </div>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{gem.whySpecial}</p>
                <p className="text-[11px] text-accent mt-1">
                  <span className="font-semibold">Access:</span> {gem.howToGetThere}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* ETIQUETTE CARD */}
        <Card padding="md" className="flex flex-col gap-3 h-full">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>🤝</span> Cultural Etiquette
          </h3>
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[220px] pr-2">
            {result.etiquette.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs leading-normal ${
                  item.type === 'Do'
                    ? 'border-success/20 bg-success/5 text-foreground'
                    : 'border-error/20 bg-error/5 text-foreground'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <span className={item.type === 'Do' ? 'text-success' : 'text-error'}>
                    {item.type === 'Do' ? '✓' : '✗'}
                  </span>
                  <span>{item.rule}</span>
                </div>
                <p className="text-[11px] text-muted">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* TRAVEL TIP CARD */}
        <Card padding="md" className="md:col-span-2 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>🌱</span> Responsible Travel Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.responsibleTravel.map((tip, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-surface/30 border border-border/40 text-xs">
                <h4 className="font-bold text-foreground">🌿 {tip.tip}</h4>
                <p className="text-muted mt-1 leading-normal">{tip.impactDescription}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* PLACE ITINERARY CARD (Timeline view) */}
        <Card padding="md" className="md:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
            <span>📅</span> Personalized Day-by-Day Itinerary
          </h3>
          
          <div className="flex flex-col gap-3">
            {result.itinerary.map((day) => {
              const isExpanded = expandedDay === day.dayNumber;
              return (
                <div
                  key={day.dayNumber}
                  className="border border-border rounded-xl overflow-hidden bg-surface/10"
                >
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-surface/20 transition-colors cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        Day {day.dayNumber}
                      </span>
                      <h4 className="text-sm font-bold text-foreground mt-0.5">{day.theme}</h4>
                    </div>
                    <span className="text-xs text-muted transform transition-transform duration-200">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-border/40 flex flex-col gap-4 bg-surface/5 animate-fade-in">
                      {day.activities.map((activity, idx) => (
                        <div key={idx} className="relative pl-5 border-l-2 border-accent/25 last:border-l-0">
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
                          <div className="flex flex-wrap items-baseline gap-2 mb-0.5 text-[11px] text-muted">
                            <span className="font-bold text-accent uppercase">{activity.timeOfDay}</span>
                            <span>•</span>
                            <span>📍 {activity.location}</span>
                            {activity.costEstimation && (
                              <>
                                <span>•</span>
                                <span className="text-success font-semibold">Est: {activity.costEstimation}</span>
                              </>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-foreground">{activity.activityName}</h5>
                          <p className="text-xs text-muted mt-0.5 leading-relaxed">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

      </div>
      <AskLocalChat destination={result.destination} />
    </div>
  );
}
