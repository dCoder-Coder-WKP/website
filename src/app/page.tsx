'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Preloader from '@/components/Preloader';
import HeroVisual from '@/components/hero/HeroVisual';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [heroActive, setHeroActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroActive) return;

    // Section 2: Brand Statement
    gsap.fromTo(
      brandRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: brandRef.current,
          start: 'top 80%',
        },
      }
    );

    // Section 3: Category Cards
    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, { scope: containerRef, dependencies: [heroActive] });

  return (
    <main ref={containerRef} className="bg-[#0A0705] text-[#F2EDDF] min-h-screen overflow-x-hidden">
      <Preloader onComplete={() => setHeroActive(true)} />

      {/* Section 1 - Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <HeroVisual active={heroActive} />
      </section>

      {/* Section 2 - Brand Statement */}
      <section className="py-32 px-6 lg:px-20 min-h-[50vh] flex items-center justify-center pointer-events-none">
        <div ref={brandRef} className="max-w-4xl text-center">
          <h2 className="font-serif text-[40px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] mb-8">
            The perfect slice, crafted to order.
          </h2>
          <p className="font-sans text-lg lg:text-xl text-[#8C7E6A] max-w-2xl mx-auto leading-[1.5]">
            Every ingredient is placed with intent. Build your custom pizza, explore our curated menu, and order in seconds — designed for those who appreciate the finer details.
          </p>
        </div>
      </section>

      {/* Section 3 - Category Cards */}
      <section className="py-20 px-6 lg:px-20 pb-40">
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Menu Card */}
          <Link href="/menu" className="group block h-[400px] rounded-2xl bg-[#111009] border border-[rgba(242,237,223,0.08)] p-8 relative overflow-hidden transition-colors hover:border-[#C9933A]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] to-transparent z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end">
              <h3 className="font-serif text-[32px] leading-[1.1] mb-2 group-hover:text-[#C9933A] transition-colors">Our Menu</h3>
              <p className="font-sans text-[#8C7E6A] text-sm">Explore our hand-tossed classic and premium pizzas.</p>
            </div>
          </Link>

          {/* Builder Card */}
          <Link href="/build" className="group block h-[400px] rounded-2xl bg-[#111009] border border-[rgba(242,237,223,0.08)] p-8 relative overflow-hidden transition-colors hover:border-[#E8540A]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] to-transparent z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end">
              <h3 className="font-serif text-[32px] leading-[1.1] mb-2 group-hover:text-[#E8540A] transition-colors">Pizza Builder</h3>
              <p className="font-sans text-[#8C7E6A] text-sm">Compose your custom pizza with live visual feedback.</p>
            </div>
          </Link>

          {/* Cart Card */}
          <Link href="/cart" className="group block h-[400px] rounded-2xl bg-[#111009] border border-[rgba(242,237,223,0.08)] p-8 relative overflow-hidden transition-colors hover:border-[#F2EDDF]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] to-transparent z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end">
              <h3 className="font-serif text-[32px] leading-[1.1] mb-2 group-hover:text-white transition-colors">Your Order</h3>
              <p className="font-sans text-[#8C7E6A] text-sm">Review your cart and checkout via WhatsApp.</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
