'use client';

import { useEffect, useRef, useState } from 'react';

export function DoughSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="dough" ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <span className="text-accent text-sm font-medium tracking-widest uppercase">Our Craft</span>
            <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-foreground mt-4 mb-6 text-balance">
              The Art of the Dough
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed mb-6">
              Every pizza begins with our signature 72-hour fermented dough. We combine imported Italian flour with filtered water, allowing time to develop complex flavors and an irresistible crust texture.
            </p>
            <p className="text-foreground/60 text-lg leading-relaxed mb-8">
              Stretched by hand and baked in our wood-fired oven at 900°F, each pizza achieves the perfect balance of charred crust and soft interior.
            </p>
            <ul className="space-y-4 text-foreground/70">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">{'›'}</span>
                <span>72-hour natural fermentation process</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">{'›'}</span>
                <span>Hand-stretched to precise thickness</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">{'›'}</span>
                <span>Wood-fired at 900°F for optimal results</span>
              </li>
            </ul>
          </div>

          {/* Right visual */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/10 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">🍞</div>
                  <p className="text-foreground/40 font-serif italic text-lg">Traditional Pizza Dough</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
