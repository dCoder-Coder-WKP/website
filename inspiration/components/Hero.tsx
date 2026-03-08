'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
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
      className="min-h-screen bg-background flex items-center justify-center relative pt-20 overflow-hidden"
    >
      {/* Pizza background image with controlled opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ivan-torres-MQUqbmszGGM-unsplash-5FVKAfyz48Z9nFz8dvq06SP14OKxdj.jpg"
          alt="Artisan pizza background"
          fill
          className="object-cover"
          priority
          loading="eager"
          quality={75}
        />
      </div>

      {/* Dynamic radial glow following mouse - creates interactive depth */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(201, 168, 76, 0.12) 0%, transparent 100%)`
        }}
      ></div>

      {/* Sophisticated multi-layer overlay for text readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-background/50 via-background/75 to-background pointer-events-none"></div>
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-background/60 via-transparent to-background/60 pointer-events-none"></div>
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(13, 11, 8, 0.4) 100%)'
      }}></div>

      {/* Content container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block group">
            {/* Animated decorative frame */}
            <div className="absolute -inset-8 md:-inset-16 pointer-events-none">
              {/* Outer animated ring */}
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-500" 
                style={{ 
                  animation: 'spin 30s linear infinite'
                }}
              ></div>
              
              {/* Pulsing inner glow */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-r from-accent/8 via-accent/12 to-accent/8 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              ></div>
              
              {/* Corner accent brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-r-2 border-t-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-l-2 border-b-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-accent/50 group-hover:border-accent transition-colors duration-300"></div>
            </div>

            {/* Main title with sophisticated styling */}
            <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic font-bold text-foreground mb-6 text-balance leading-tight drop-shadow-2xl">
              We Knead Pizza
            </h1>

            {/* Animated underline */}
            <div className={`h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform transition-all duration-1000 ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
          </div>
        </div>

        {/* Tagline */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg md:text-xl text-foreground/80 mb-12 font-light tracking-wide drop-shadow-lg">
            Artisanal Goan wood-fired pizza crafted with precision and passion
          </p>
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button className="px-8 py-3 bg-accent text-primary font-medium rounded-sm hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 inline-block transform hover:scale-105">
            Explore Our Menu
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-500`}>
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-accent drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Global animation styles */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
