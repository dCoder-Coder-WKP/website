'use client';

import { useEffect, useRef, useState } from 'react';

interface Ingredient {
  name: string;
  origin: string;
  description: string;
  icon: string;
  delay: number;
}

const ingredients: Ingredient[] = [
  {
    name: 'San Marzano Tomatoes',
    origin: 'Naples, Italy',
    description: 'Hand-selected, sweet and tangy perfection',
    icon: '🍅',
    delay: 0,
  },
  {
    name: 'Buffalo Mozzarella',
    origin: 'Campania, Italy',
    description: 'Creamy, delicate, and utterly sublime',
    icon: '🧀',
    delay: 0.1,
  },
  {
    name: '72-Hour Fermented Dough',
    origin: 'Our Kitchen',
    description: 'Complex flavor developed through patience',
    icon: '🌾',
    delay: 0.2,
  },
  {
    name: 'Imported Sea Salt',
    origin: 'Adriatic Coast',
    description: 'Mineral-rich from pristine waters',
    icon: '✨',
    delay: 0.3,
  },
];

export function IngredientShowcase() {
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
      { threshold: 0.2 }
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-secondary py-20 sm:py-32"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          style={{ transform: `translateY(${offsetY * -0.3}px)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="font-serif text-4xl italic sm:text-5xl lg:text-6xl">
            Premium Ingredients,
            <span className="block text-primary">Extraordinary Taste</span>
          </h2>
          <p className="mt-6 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            We source only the finest artisanal ingredients, each selected for purity,
            flavor, and heritage. Every element tells a story of craftsmanship.
          </p>
        </div>

        {/* Ingredient Cards Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.name}
              className={`group relative transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{
                transitionDelay: `${ingredient.delay * 200}ms`,
              }}
            >
              {/* Card */}
              <div className="relative h-full overflow-hidden rounded-lg border border-border/30 bg-background/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:bg-background/60 hover:shadow-2xl hover:shadow-primary/20">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-500 group-hover:from-primary/5 group-hover:to-primary/10" />

                {/* Content */}
                <div className="relative z-20">
                  {/* Icon */}
                  <div className="mb-4 inline-block text-4xl transition-transform duration-500 group-hover:scale-125">
                    {ingredient.icon}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-serif text-lg italic text-foreground">
                    {ingredient.name}
                  </h3>

                  {/* Origin */}
                  <p className="mb-3 text-sm text-primary">
                    ↪ {ingredient.origin}
                  </p>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {ingredient.description}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-4 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          {[
            { value: '15+', label: 'Ingredient Sources' },
            { value: '72', label: 'Hour Fermentation' },
            { value: '1200°C', label: 'Oven Temperature' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{
                transitionDelay: `${(0.3 + idx * 0.1) * 200}ms`,
              }}
            >
              <div className="mb-2 font-serif text-5xl italic text-primary sm:text-6xl">
                {stat.value}
              </div>
              <p className="text-sm tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
