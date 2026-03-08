'use client';

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

const stats: StatItem[] = [
  { label: 'Pizzas Crafted', value: 5000, suffix: '+' },
  { label: 'Satisfied Guests', value: 12000, suffix: '+' },
  { label: 'Years of Craft', value: 8, suffix: '' },
];

function CounterNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div
      ref={ref}
      className="font-serif text-5xl italic text-primary sm:text-6xl lg:text-7xl"
    >
      {count}
      {suffix}
    </div>
  );
}

export function AnimatedStats() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="100"
            x2="1200"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary/10 opacity-50"
          />
          <line
            x1="0"
            y1="200"
            x2="1200"
            y2="200"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary/10 opacity-50"
          />
          <line
            x1="0"
            y1="300"
            x2="1200"
            y2="300"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary/10 opacity-50"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl italic sm:text-5xl lg:text-6xl">
            By The Numbers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our impact through passion and perfection
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center space-y-4 transition-transform hover:scale-105"
            >
              <CounterNumber target={stat.value} suffix={stat.suffix} />
              <p className="text-center text-sm tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
