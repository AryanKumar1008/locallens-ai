import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import { FeatureIcon } from '@/components/icons';
import { FEATURES } from '@/lib/constants';

/**
 * Feature grid section showcasing AI capabilities.
 */
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 sm:py-32"
      aria-labelledby="features-heading"
    >
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
            Features
          </p>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Your AI Travel Companion
          </h2>
          <p className="text-muted text-base leading-relaxed">
            LocalLens AI combines generative AI with local expertise to create
            travel experiences tailored just for you.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.id}
              hoverable
              padding="lg"
              className={`animate-fade-in opacity-0 stagger-${index + 1}`}
            >
              <div className="flex flex-col gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center">
                  <FeatureIcon
                    name={feature.icon}
                    className="h-6 w-6 text-accent"
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
