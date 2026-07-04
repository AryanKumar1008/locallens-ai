import Container from '@/components/layout/Container';
import GradientText from '@/components/ui/GradientText';
import Button from '@/components/ui/Button';
import { ArrowRightIcon, ChevronDownIcon } from '@/components/icons';
import { APP_TAGLINE, APP_DESCRIPTION } from '@/lib/constants';

/**
 * Full-viewport hero section with animated gradient orbs and CTA.
 */
export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/8 blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-purple-500/8 blur-3xl animate-pulse-soft [animation-delay:2s]" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-pink-500/6 blur-3xl animate-pulse-soft [animation-delay:4s]" />
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent-soft text-accent border border-accent/15">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Powered by Gemini AI
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in [animation-delay:100ms] opacity-0 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <GradientText as="span">{APP_TAGLINE}</GradientText>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in [animation-delay:200ms] opacity-0 text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-10">
            {APP_DESCRIPTION}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in [animation-delay:300ms] opacity-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRightIcon className="h-4 w-4" />}
            >
              Start Exploring
            </Button>
            <Button size="lg" variant="secondary">
              Learn More
            </Button>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in [animation-delay:600ms] opacity-0">
        <a
          href="#explore"
          className="flex flex-col items-center gap-2 text-muted/50 hover:text-muted transition-colors"
          aria-label="Scroll to explore"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDownIcon className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
