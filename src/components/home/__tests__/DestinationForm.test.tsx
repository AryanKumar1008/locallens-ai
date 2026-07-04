import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DestinationForm from '../DestinationForm';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('DestinationForm', () => {
  it('should validate form and show error messages on empty submit', async () => {
    render(<DestinationForm />);
    
    const submitBtn = screen.getByRole('button', { name: /Generate AI Itinerary/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please enter a destination')).toBeInTheDocument();
    expect(screen.getByText('Please enter your budget')).toBeInTheDocument();
    expect(screen.getByText('Please enter travel duration')).toBeInTheDocument();
    expect(screen.getByText('Please select a travel style')).toBeInTheDocument();
    expect(screen.getByText('Select at least one interest')).toBeInTheDocument();
  });

  it('should validate budget and duration ranges', async () => {
    render(<DestinationForm />);
    const user = userEvent.setup();

    const destinationInput = screen.getByLabelText(/Destination/i);
    await user.type(destinationInput, 'Paris');

    const budgetInput = screen.getByLabelText(/Budget/i);
    await user.type(budgetInput, '-50');

    const durationInput = screen.getByLabelText(/Travel Duration/i);
    await user.type(durationInput, '100');

    const submitBtn = screen.getByRole('button', { name: /Generate AI Itinerary/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Budget must be a positive number')).toBeInTheDocument();
    expect(screen.getByText('Duration must be between 1 and 90 days')).toBeInTheDocument();
  });

  it('should show loading states when submitting', async () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<DestinationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Destination/i), 'Rome');
    await user.type(screen.getByLabelText(/Budget/i), '2000');
    await user.type(screen.getByLabelText(/Travel Duration/i), '5');
    
    const culturalStyle = screen.getByRole('radio', { name: /🏛️ Cultural/i });
    await user.click(culturalStyle);

    const historyInterest = screen.getByRole('checkbox', { name: /History/i });
    await user.click(historyInterest);

    const submitBtn = screen.getByRole('button', { name: /Generate AI Itinerary/i });
    await user.click(submitBtn);

    // Verify it turns into loading/generating state
    expect(screen.getByText(/Generating Itinerary…/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generating Itinerary…/i })).toBeDisabled();
    
    // Verify skeleton loaders are rendered in ItineraryDisplay
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('should render AI response successfully', async () => {
    const mockResult = {
      destination: 'Rome',
      duration: 5,
      budget: '2000',
      travelStyle: 'Cultural',
      didYouKnowFact: 'Rome has a museum dedicated to pasta.',
      culturalStorytelling: 'Rome was founded in 753 BC by Romulus and Remus.',
      localFood: [
        { dishName: 'Carbonara', description: 'Creamy pasta with pecorino and guanciale', culturalSignificance: 'Classic Roman dish' }
      ],
      hiddenGems: [
        { name: 'Appian Way', location: 'Southern Rome', whySpecial: 'Ancient highway', howToGetThere: 'Bus 118' }
      ],
      etiquette: [
        { rule: 'Dress modestly in churches', type: 'Do', reason: 'Respect for holy places' }
      ],
      responsibleTravel: [
        { tip: 'Drink from water fountains', impactDescription: 'Reduces plastic waste' }
      ],
      itinerary: [
        {
          dayNumber: 1,
          theme: 'Ancient Splendors',
          activities: [
            { timeOfDay: 'Morning', activityName: 'Colosseum Tour', description: 'Explore the arena', location: 'Piazza del Colosseo', costEstimation: 'EUR 20' }
          ]
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    render(<DestinationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Destination/i), 'Rome');
    await user.type(screen.getByLabelText(/Budget/i), '2000');
    await user.type(screen.getByLabelText(/Travel Duration/i), '5');
    await user.click(screen.getByRole('radio', { name: /🏛️ Cultural/i }));
    await user.click(screen.getByRole('checkbox', { name: /History/i }));

    await user.click(screen.getByRole('button', { name: /Generate AI Itinerary/i }));

    // Wait for the results to render
    expect(await screen.findByText('Rome')).toBeInTheDocument();
    expect(screen.getByText('Rome has a museum dedicated to pasta.')).toBeInTheDocument();
    expect(screen.getByText('Carbonara')).toBeInTheDocument();
    expect(screen.getByText('Appian Way')).toBeInTheDocument();
    expect(screen.getByText('Dress modestly in churches')).toBeInTheDocument();
    expect(screen.getByText('Drink from water fountains')).toBeInTheDocument();
    expect(screen.getByText('Colosseum Tour')).toBeInTheDocument();
  });

  it('should render API error state properly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Gemini rate limit exceeded' }),
    });

    render(<DestinationForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Destination/i), 'Rome');
    await user.type(screen.getByLabelText(/Budget/i), '2000');
    await user.type(screen.getByLabelText(/Travel Duration/i), '5');
    await user.click(screen.getByRole('radio', { name: /🏛️ Cultural/i }));
    await user.click(screen.getByRole('checkbox', { name: /History/i }));

    await user.click(screen.getByRole('button', { name: /Generate AI Itinerary/i }));

    // Wait for API error banner to render
    expect(await screen.findByText('Generation Failed')).toBeInTheDocument();
    expect(screen.getByText('Gemini rate limit exceeded')).toBeInTheDocument();
  });
});
