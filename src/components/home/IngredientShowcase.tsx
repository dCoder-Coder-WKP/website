'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Ingredient {
  name: string;
  origin: string;
  description: string;
  icon: string;
  delay: number;
}

const ingredients: Ingredient[] = [
  {
    name: 'Healthy Toppings',
    origin: 'Local Farms',
    description: 'Crisp, vibrant, and ethically sourced for amazing taste',
    icon: '🍅',
    delay: 0,
  },
  {
    name: 'Generational Spices',
    origin: 'Carona, Goa',
    description: 'Secret blends passed down by Willie Fernandes',
    icon: '✨',
    delay: 0.1,
  },
  {
    name: 'Fresh Daily Dough',
    origin: 'Our Kitchen',
    description: 'Kneaded every morning for the perfect bake',
    icon: '🌾',
    delay: 0.2,
  },
  {
    name: 'Premium Cheeses',
    origin: 'Select Dairies',
    description: 'Creamy, delicate, and utterly sublime',
    icon: '🧀',
    delay: 0.3,
  },
];

export default function IngredientShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const distance = (elementCenter - windowCenter) * 0.5;
        setOffsetY(distance);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-bg-base py-20 sm:py-32"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent-gold/5 blur-[120px]"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-gold/5 blur-[120px]"
          style={{ transform: `translateY(${offsetY * -0.3}px)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-16 lg:mb-24 text-center transition-all duration-ultra ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="text-accent-gold text-[10px] tracking-luxury uppercase font-sans block mb-4">Our Promise</span>
          <h2 className="font-serif text-4xl italic sm:text-5xl lg:text-5xl text-text-primary">
            Healthy Toppings,
            <span className="block text-accent-gold mt-2">Amazing Taste.</span>
          </h2>
          <p className="mt-8 text-balance text-sm font-light leading-relaxed text-text-secondary max-w-2xl mx-auto">
            We source only the finest components, each selected for absolute purity,
            health benefits, and flavor density. Every element on our pizzas represents Willie&apos;s commitment to quality.
          </p>
        </div>

        {/* Ingredient Cards Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className={`group relative transition-all duration-ultra ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{
                transitionDelay: `${ingredient.delay * 400}ms`,
              }}
            >
              {/* Card */}
              <div className="relative h-full overflow-hidden rounded-xl border border-border-refined bg-bg-base/40 p-8 backdrop-blur-sm transition-all duration-long hover:border-accent-gold/40 hover:bg-black/60 hover:shadow-[0_10px_40px_rgba(212,175,55,0.05)]">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/0 to-accent-gold/0 transition-all duration-long group-hover:from-accent-gold/5 group-hover:to-accent-gold/10" />

                {/* Content */}
                <div className="relative z-20">
                  {/* Icon */}
                  <div className="mb-6 text-3xl opacity-80 transition-transform duration-long group-hover:scale-125 group-hover:opacity-100 grayscale group-hover:grayscale-0">
                    {ingredient.icon}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-serif text-xl italic text-text-primary tracking-tight">
                    {ingredient.name}
                  </h3>

                  {/* Origin */}
                  <p className="mb-4 text-[10px] uppercase font-sans tracking-luxury text-accent-gold">
                    ↪ {ingredient.origin}
                  </p>

                  {/* Description */}
                  <p className="text-sm font-light leading-relaxed text-text-muted">
                    {ingredient.description}
                  </p>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-gold transition-all duration-long group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
