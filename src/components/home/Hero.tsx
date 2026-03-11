/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface HeroProps {
  heroBgUrl?: string;
  logoUrl?: string;
}

export default function Hero({ heroBgUrl, logoUrl }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Add a slight delay for the entrance animation to allow the page to mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const element = heroRef.current;
    element?.addEventListener('mousemove', handleMouseMove);
    return () => element?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="min-h-screen bg-bg-base flex items-center justify-center relative pt-20 overflow-hidden"
    >
      {/* Pizza background image with controlled opacity */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ivan-torres-MQUqbmszGGM-unsplash-5FVKAfyz48Z9nFz8dvq06SP14OKxdj.jpg"}
          alt="Artisan pizza background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dynamic radial glow following mouse - creates interactive depth */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.12) 0%, transparent 100%)`
        }}
      />

      {/* Sophisticated multi-layer overlay for text readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-bg-base/50 via-bg-base/75 to-bg-base pointer-events-none" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-bg-base/60 via-transparent to-bg-base/60 pointer-events-none" />
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 5, 0.4) 100%)'
      }} />

      {/* Content container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className={`transition-all duration-ultra ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block group mb-8">
            {/* Animated decorative frame */}
            <div className="absolute -inset-8 md:-inset-16 pointer-events-none">
              {/* Outer animated ring */}
              <div className="absolute inset-0 rounded-full border border-accent-gold/20 group-hover:border-accent-gold/40 transition-colors duration-long animate-spin-slow" />
              
              {/* Pulsing inner glow */}
              <div className="absolute inset-6 rounded-full bg-accent-gold-glow blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-long animate-pulse-slow" />
              
              {/* Corner accent brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-l border-t border-accent-gold/50 group-hover:border-accent-gold transition-colors duration-medium" />
              <div className="absolute -top-4 -right-4 w-12 h-12 border-r border-t border-accent-gold/50 group-hover:border-accent-gold transition-colors duration-medium" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-l border-b border-accent-gold/50 group-hover:border-accent-gold transition-colors duration-medium" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r border-b border-accent-gold/50 group-hover:border-accent-gold transition-colors duration-medium" />
            </div>

            {/* Main title with sophisticated styling */}
            <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-text-primary mb-6 text-balance leading-tight drop-shadow-2xl px-8">
              We Knead Pizza
            </h1>

            {/* Animated underline */}
            <div className={`h-[1px] bg-gradient-to-r from-transparent via-accent-gold to-transparent transform transition-all duration-ultra ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
          </div>
        </div>

        {/* Tagline */}
        <div className={`transition-all duration-ultra delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block mx-auto max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl px-6 py-4 mb-12">
            <p className="text-lg md:text-xl text-gray-100 font-sans font-light tracking-wide leading-relaxed drop-shadow-md">
              Hand-tossed pizza, freshly kneaded and baked daily in <span className="text-accent-gold font-medium">Carona, Goa</span>.<br className="hidden sm:block" /> Generous toppings, honest ingredients, proper good taste.
            </p>
          </div>
        </div>

        {/* Brand lockup */}
        {logoUrl && (
          <div className={`transition-all duration-ultra delay-250 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative mx-auto mb-12 flex max-w-sm items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-gold/30 via-transparent to-transparent opacity-40" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black/60 shadow-inner shadow-black/50 ring-1 ring-white/10">
                <img
                  src={logoUrl}
                  alt="We Knead Pizza crest"
                  className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                />
              </div>
              <div className="relative">
                <p className="text-sm font-serif uppercase tracking-[0.4em] text-accent-gold">We Knead Pizza</p>
                <p className="mt-1 text-xs font-sans text-text-secondary">Carona, Goa · Est. 2014</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className={`transition-all duration-ultra delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/menu" className="btn-luxury max-w-xs mx-auto text-sm px-12 py-4 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-medium inline-block transform hover:scale-105">
            View Our Menu
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-ultra delay-500`}>
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-accent-gold drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
