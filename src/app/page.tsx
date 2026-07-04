import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import DestinationForm from '@/components/home/DestinationForm';

/**
 * Homepage — Hero, Features, and Destination Form.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinationForm />
      <FeaturesSection />
    </>
  );
}
