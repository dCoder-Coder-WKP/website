/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PIZZAS } from '@/lib/menuData';

// Select 3 best sellers for the homepage showcase
const showcasePizzas = [
  PIZZAS.find(p => p.name.includes('Mushroom Garlic Twist')),
  PIZZAS.find(p => p.name.includes('Paneer Makhani')),
  PIZZAS.find(p => p.name.includes('Tandoori Chicken'))
].filter(Boolean) as typeof PIZZAS;

export default function MenuSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="menu" ref={sectionRef} className="py-24 lg:py-32 bg-bg-base/50 relative border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`text-center mb-16 lg:mb-24 transition-all duration-ultra ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="text-accent-gold text-[10px] tracking-luxury uppercase font-sans block mb-4">Carona&apos;s Favorites</span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-text-primary mt-4 text-balance">
            Fresh From The Oven
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {showcasePizzas.map((pizza, index) => (
            <div
              key={pizza.id}
              className={`surface-luxury p-8 lg:p-10 hover:border-accent-gold/40 transition-all duration-medium group ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <div className="relative w-full aspect-square mb-8 overflow-hidden rounded-xl border border-border-refined bg-black/20">
                {pizza.image ? (
                  <img 
                    src={pizza.image} 
                    alt={pizza.name} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-75 group-hover:scale-110 group-hover:brightness-100 transition-all duration-ultra"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">🍕</div>
                )}
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-80" />
              </div>

              <h3 className="font-serif text-2xl tracking-tighter text-text-primary mb-3 group-hover:text-accent-gold transition-colors duration-medium">
                {pizza.name}
              </h3>
              <p className="font-sans text-sm text-text-muted leading-relaxed font-light mb-8 line-clamp-2">
                {pizza.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-border-refined">
                <span className="font-sans text-lg text-text-primary font-light">₹{pizza.prices.medium}</span>
                <Link href="/menu" className="text-[10px] uppercase font-sans tracking-luxury text-accent-gold hover:text-white transition-colors duration-medium flex items-center gap-2">
                  Order Yours <span className="text-[14px]">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-20 text-center transition-all duration-ultra delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/menu" className="inline-block border-b border-accent-gold pb-1 text-xs uppercase tracking-luxury text-text-primary hover:text-accent-gold transition-colors duration-medium">
            View the full menu
          </Link>
        </div>
      </div>
    </section>
  );
}
