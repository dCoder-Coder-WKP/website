import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { DoughSection } from '@/components/DoughSection';
import { MenuSection } from '@/components/MenuSection';
import { IngredientShowcase } from '@/components/IngredientShowcase';
import { AnimatedStats } from '@/components/AnimatedStats';
import { ReservationSection } from '@/components/ReservationSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <DoughSection />
      <MenuSection />
      <IngredientShowcase />
      <AnimatedStats />
      <ReservationSection />
      <Footer />
    </div>
  );
}
