/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PizzaIllustration from '@/components/pizza/PizzaIllustration';

gsap.registerPlugin(ScrollTrigger);

export interface HeroVisualProps {
  active?: boolean;
}

const HERO_TOPPING_IDS = ['t_cheese', 't_chicken', 't_redpepper', 't_basil', 't_olives'];

export default function HeroVisual({ active = false }: HeroVisualProps) {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const pizzaWrapRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<SVGSVGElement>(null);
  const bokehRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const startSteamAnimations = useCallback(() => {
    if (!steamRef.current) return;
    const paths = Array.from(steamRef.current.querySelectorAll('path'));
    
    paths.forEach((path, i) => {
      const len = path.getTotalLength();
      
      const animateWisp = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.delayedCall(0.5 + Math.random(), animateWisp);
          }
        });

        tl.fromTo(path,
          { strokeDasharray: len, strokeDashoffset: len, opacity: 0.8, y: 0 },
          { strokeDashoffset: 0, duration: 2.5, ease: "power1.inOut" }
        )
        .to(path,
          { y: -50, opacity: 0, duration: 1.5, ease: "power1.in" },
          "-=1.0"
        );
      };

      gsap.delayedCall(i * 0.8, animateWisp);
    });
  }, []);

  const startBokehAnimations = useCallback(() => {
    if (!bokehRef.current) return;
    const particles = Array.from(bokehRef.current.children);
    
    particles.forEach((p, i) => {
      gsap.to(p, {
        y: "random(-60, 60)",
        x: "random(-40, 40)",
        scale: "random(0.8, 1.2)",
        opacity: "random(0.1, 0.3)",
        duration: "random(6, 12)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2
      });
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    
    gsap.set(textRef.current, { opacity: 0, y: 30 });
    
    const tl = gsap.timeline();

    tl.to(pizzaWrapRef.current, {
      opacity: 1, scale: 1, duration: 1.5, ease: "premium"
    })
    .to(bloomRef.current, { opacity: 0.4, duration: 2, ease: "power2.out" }, 0.2)
    .to(textRef.current, { opacity: 1, y: 0, duration: 1, ease: "premium" }, 0.4)
    .call(() => {
      gsap.to(steamRef.current, { opacity: 0.3, duration: 1 });
      startSteamAnimations();
    }, [], 1.0)
    .call(startBokehAnimations, [], 1.2)
    .fromTo(scrollIndicatorRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 1.2, ease: "premium" },
      1.5
    )
    .call(() => {
      gsap.to(bloomRef.current, {
        opacity: 0.5, scale: 1.1, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
    }, [], 1.5);

    const currentSteam = steamRef.current;
    const currentBokeh = bokehRef.current;

    return () => {
      tl.kill();
      if (currentSteam) {
        gsap.killTweensOf(currentSteam.querySelectorAll('path'));
      }
      if (currentBokeh) {
        gsap.killTweensOf(currentBokeh.children);
      }
    };
  }, [active, startSteamAnimations, startBokehAnimations]);

  useEffect(() => {
    if (!heroSectionRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(pizzaWrapRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(bloomRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "10% top",
          end: "70% top",
          scrub: true
        }
      });

      gsap.to(textRef.current, {
        y: -100, opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "5% top",
          end: "50% top",
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const bokehParticles = Array.from({ length: 15 }).map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${Math.random() * 10 + 4}px`,
        height: `${Math.random() * 10 + 4}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)',
        opacity: 0.15,
        filter: 'blur(2px)'
      }}
    />
  ));

  return (
    <div ref={heroSectionRef} className="relative w-full h-screen overflow-hidden bg-bg-base">
      {/* CINEMATIC HERO PHOTOGRAPHY */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=2000&auto=format&fit=crop"
          alt="Artisanal Service"
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale-[0.3] brightness-[0.7]"
        />
        {/* Deep Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-transparent to-bg-base opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-bg-base opacity-80" />
      </div>

      {/* CINEMATIC BLOOM */}

      {/* PIZZA VISUAL & STEAM */}
      <div 
        ref={pizzaWrapRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-auto lg:right-[0%] lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 w-[90vw] max-w-[500px] lg:w-[55vw] lg:max-w-[800px]"
        style={{ opacity: 0, scale: 0.95 }}
      >
        <div className="relative group">
          <div className="absolute -inset-20 bg-accent-gold/20 blur-[120px] opacity-0 group-hover:opacity-30 transition-opacity duration-long" />
          <PizzaIllustration
            toppingIds={HERO_TOPPING_IDS}
            size="hero"
            animate
            interactive
            seed={123}
          />
        </div>
        
        <svg 
          ref={steamRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 200 200"
          style={{ opacity: 0 }}
        >
          {[
            "M80,80 C75,65 85,55 80,45 C75,35 85,25 80,15",
            "M100,80 C105,65 95,50 102,40 C108,30 95,20 100,10",
            "M120,80 C125,65 115,55 122,45 C128,35 115,25 120,15"
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" />
          ))}
        </svg>
      </div>

      {/* BOKEH PARTICLES */}
      <div ref={bokehRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {bokehParticles}
      </div>

      {/* EDITORIAL RADIAL ACCENTS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] hidden lg:block" style={{ stroke: "var(--accent-gold)", strokeWidth: 0.5 }}>
        {[0, 45, 90, 135].map((angle) => (
          <line 
            key={angle} 
            x1="75%" y1="50%" x2="150%" y2="50%" 
            style={{ transformOrigin: "75% 50%", transform: `rotate(${angle}deg)` }} 
          />
        ))}
        <circle cx="75%" cy="50%" r="20%" fill="none" />
        <circle cx="75%" cy="50%" r="30%" fill="none" strokeDasharray="4 8" />
      </svg>

      {/* HERO COPY */}
      <div 
        ref={textRef}
        className="absolute z-10 bottom-24 px-6 lg:top-1/2 lg:-translate-y-1/2 lg:left-24 lg:bottom-auto max-w-2xl"
        style={{ opacity: 0 }}
      >
        <h1 className="heading-hero text-text-primary mb-6">
          Artisanal<br/>Perfection
        </h1>
        <p className="font-sans text-text-secondary text-lg lg:text-2xl mb-12 tracking-wide font-light leading-relaxed">
          Crafted with obsession. Designed for those who<br className="hidden lg:block" /> appreciate the finer details of the craft.
        </p>
        <div className="flex flex-wrap gap-6">
          <a href="/menu" className="btn-luxury">
            Explore the Menu
          </a>
          <a href="/build" className="btn-luxury-outline">
            Craft Yours
          </a>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <span className="font-sans text-[10px] tracking-luxury text-text-muted uppercase">Scroll</span>
        <div 
          ref={scrollIndicatorRef}
          className="w-[1px] h-16 bg-border-refined origin-top"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
