'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check sessionStorage to skip for return visits
    const hasLoaded = sessionStorage.getItem('wkp-loaded');
    if (hasLoaded) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('wkp-loaded', 'true');
        setIsVisible(false);
        onComplete();
      },
    });

    const chars = textGroupRef.current?.querySelectorAll('.preloader-word');
    
    // 1. Reveal cinematic words
    if (chars) {
      tl.fromTo(chars, 
        { opacity: 0, y: 30, skewY: 4 },
        { 
          opacity: 1, 
          y: 0, 
          skewY: 0, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: "power4.out" 
        }, 0.3
      );
    }

    // 2. Horizontal thin gold line reveal
    tl.to(progressLineRef.current, {
      scaleX: 1,
      duration: 1.8,
      ease: "power2.inOut"
    }, 0.8);

    // 3. Shimmer effect during fill
    tl.to(shimmerRef.current, {
      x: '100%',
      duration: 1.8,
      ease: "none"
    }, 0.8);

    // 4. Luxury exit (fade and scale)
    tl.to(textGroupRef.current, {
      letterSpacing: '0.2em',
      opacity: 0,
      scale: 1.05,
      duration: 1,
      ease: "power2.inOut"
    }, 2.4);

    tl.to(progressLineRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, 2.6);

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 3.0);

  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-bg-base flex flex-col items-center justify-center text-text-primary"
    >
      {/* Editorial Branding Section */}
      <div 
        ref={textGroupRef}
        className="flex gap-4 lg:gap-8 font-serif text-[40px] md:text-[64px] lg:text-[88px] leading-tight tracking-tight px-6"
      >
        <span className="preloader-word block">We</span>
        <span className="preloader-word block">Knead</span>
        <span className="preloader-word block text-accent-gold italic">Pizza</span>
      </div>

      {/* Minimal Luxury Horizontal Loader */}
      <div className="absolute top-[65%] w-full max-w-[280px] h-[1px] bg-border-subtle overflow-hidden mx-6">
        <div
          ref={progressLineRef}
          className="w-full h-full bg-accent-gold origin-left scale-x-0 relative overflow-hidden"
        >
          {/* Shimmer Highlight */}
          <div 
            ref={shimmerRef}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
          />
        </div>
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
