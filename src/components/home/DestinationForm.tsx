'use client';

import { useState, useCallback, type FormEvent } from 'react';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ItineraryDisplay from '@/components/home/ItineraryDisplay';
import { ArrowRightIcon } from '@/components/icons';
import { TRAVEL_STYLES, INTERESTS } from '@/lib/constants';
import type {
  DestinationFormData,
  FormErrors,
  TravelStyle,
  Interest,
  ItineraryResult,
} from '@/types';

const INITIAL_FORM: DestinationFormData = {
  destination: '',
  budget: '',
  duration: '',
  travelStyle: '',
  interests: [],
};

/**
 * Validates the destination form data and returns field-level errors.
 */
function validateForm(data: DestinationFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.destination.trim()) {
    errors.destination = 'Please enter a destination';
  }

  if (!data.budget.trim()) {
    errors.budget = 'Please enter your budget';
  } else if (isNaN(Number(data.budget)) || Number(data.budget) <= 0) {
    errors.budget = 'Budget must be a positive number';
  }

  if (!data.duration.trim()) {
    errors.duration = 'Please enter travel duration';
  } else if (
    isNaN(Number(data.duration)) ||
    Number(data.duration) < 1 ||
    Number(data.duration) > 90
  ) {
    errors.duration = 'Duration must be between 1 and 90 days';
  }

  if (!data.travelStyle) {
    errors.travelStyle = 'Please select a travel style';
  }

  if (data.interests.length === 0) {
    errors.interests = 'Select at least one interest';
  }

  return errors;
}

/**
 * Multi-field destination form with client-side validation,
 * travel style selection, and interest tag picker.
 */
export default function DestinationForm() {
  const [formData, setFormData] = useState<DestinationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof DestinationFormData>(
      field: K,
      value: DestinationFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setApiError(null);
    },
    [],
  );

  const toggleInterest = useCallback((interest: Interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.interests;
      return next;
    });
    setApiError(null);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setFormData(INITIAL_FORM);
    setApiError(null);
  }, []);

  const generateItinerary = useCallback(async () => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary. Please try again.');
      }

      setResult(data as ItineraryResult);
    } catch (error: unknown) {
      console.error('API call failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please check your connection.';
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await generateItinerary();
    },
    [formData, generateItinerary],
  );

  const handleRegenerate = useCallback(async () => {
    await generateItinerary();
  }, [generateItinerary]);

  const showResultView = result || isSubmitting || apiError;

  return (
    <section
      id="explore"
      className="py-24 sm:py-32"
      aria-labelledby="explore-heading"
    >
      <Container narrow={!showResultView}>
        {/* Section Header */}
        {!showResultView && (
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              Explore
            </p>
            <h2
              id="explore-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            >
              Plan Your Journey
            </h2>
            <p className="text-muted text-base leading-relaxed max-w-lg mx-auto">
              Tell us about your dream trip and let AI craft the perfect itinerary.
            </p>
          </div>
        )}

        {showResultView ? (
          <ItineraryDisplay
            result={result}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            isSubmitting={isSubmitting}
            error={apiError}
          />
        ) : (
          <Card padding="lg" className="animate-fade-in">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6"
              aria-label="Destination search form"
            >
              {/* Destination + Budget Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Destination"
                  placeholder="e.g., Tokyo, Japan"
                  value={formData.destination}
                  onChange={(e) => updateField('destination', e.target.value)}
                  error={errors.destination}
                  autoComplete="off"
                  id="field-destination"
                />
                <Input
                  label="Budget (USD)"
                  placeholder="e.g., 3000"
                  type="number"
                  min="1"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  error={errors.budget}
                  id="field-budget"
                />
              </div>

              {/* Duration */}
              <Input
                label="Travel Duration (days)"
                placeholder="e.g., 7"
                type="number"
                min="1"
                max="90"
                value={formData.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                error={errors.duration}
                id="field-duration"
              />

              {/* Travel Style */}
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground/80 mb-1">
                  Travel Style
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup">
                  {TRAVEL_STYLES.map((style) => {
                    const isSelected = formData.travelStyle === style.value;
                    return (
                      <button
                        key={style.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() =>
                          updateField('travelStyle', style.value as TravelStyle)
                        }
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-sm shadow-accent/20'
                            : 'bg-surface border-border text-muted hover:text-foreground hover:border-accent/30'
                        }`}
                      >
                        <span>{style.emoji}</span>
                        <span>{style.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.travelStyle && (
                  <p className="text-xs text-error" role="alert">
                    {errors.travelStyle}
                  </p>
                )}
              </fieldset>

              {/* Interests */}
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground/80 mb-1">
                  Interests
                </legend>
                <div className="flex flex-wrap gap-2" role="group">
                  {INTERESTS.map((interest) => {
                    const isSelected = formData.interests.includes(
                      interest.value,
                    );
                    return (
                      <button
                        key={interest.value}
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        onClick={() => toggleInterest(interest.value)}
                        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-full"
                      >
                        <Badge active={isSelected}>{interest.label}</Badge>
                      </button>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-xs text-error" role="alert">
                    {errors.interests}
                  </p>
                )}
              </fieldset>

              {/* Submit / API Error */}
              {apiError && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-sm text-error" role="alert">
                  {apiError}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                icon={
                  !isSubmitting ? (
                    <ArrowRightIcon className="h-4 w-4" />
                  ) : undefined
                }
              >
                {isSubmitting ? 'Generating Itinerary…' : 'Generate AI Itinerary'}
              </Button>
            </form>
          </Card>
        )}
      </Container>
    </section>
  );
}



