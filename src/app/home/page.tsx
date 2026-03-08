import React from 'react';
import Hero from '@/components/home/Hero';
import DoughSection from '@/components/home/DoughSection';
import MenuSection from '@/components/home/MenuSection';
import IngredientShowcase from '@/components/home/IngredientShowcase';
import AnimatedStats from '@/components/home/AnimatedStats';
import ReservationSection from '@/components/home/ReservationSection';

export const metadata = {
  title: 'We Knead Pizza | Freshly Baked Pizza in Carona, Goa',
  description: 'Freshly kneaded, hand-tossed pizza baked daily in Carona, Goa. Generous toppings, honest ingredients. Dine-in, takeaway & delivery.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-base w-full overflow-hidden">
      <Hero />
      <DoughSection />
      <MenuSection />
      <IngredientShowcase />
      <AnimatedStats />
      <ReservationSection />
    </main>
  );
}
