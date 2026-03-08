/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function DoughSection() {
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
    <section id="dough" ref={sectionRef} className="py-24 lg:py-32 bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <div className={`transition-all duration-ultra ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <span className="text-accent-gold text-[10px] tracking-luxury uppercase font-sans block mb-4">Our Craft</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-text-primary mb-8 text-balance">
              A Family Legacy in Carona
            </h2>
            <p className="text-text-secondary font-sans text-sm leading-relaxed mb-6 font-light">
              Every pizza begins with recipes passed down for generations by owner Willie Fernandes. We handcraft our signature fresh dough daily, blending traditional Goan baking techniques with contemporary culinary precision to ensure amazing taste in every bite.
            </p>
            <p className="text-text-secondary font-sans text-sm leading-relaxed mb-10 font-light">
              Hand-tossed and carefully baked in our specialized gas ovens, each composition achieves the perfect harmony of authentic Goan flavor, utilizing only the finest healthy toppings for a superior experience.
            </p>
            <ul className="space-y-4 text-text-muted font-sans text-sm font-light tracking-wide">
              <li className="flex items-start gap-3">
                <span className="text-accent-gold/60 mt-0.5">✦</span>
                <span>Generational recipes by Willie Fernandes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold/60 mt-0.5">✦</span>
                <span>Freshly kneaded daily dough</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold/60 mt-0.5">✦</span>
                <span>Precision gas-oven baked to perfection</span>
              </li>
            </ul>
          </div>

          {/* Right visual */}
          <div className={`transition-all duration-ultra delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-border-refined group">
              <img 
                src="https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=1500&auto=format&fit=crop"
                alt="Artisanal Dough"
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-75 group-hover:scale-105 transition-transform duration-ultra"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bg-base/80 via-transparent to-accent-gold/10 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-long">
                <p className="text-accent-gold font-serif italic text-2xl tracking-wide">Traditional Technique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
