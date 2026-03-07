'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PizzaIllustration from '@/components/pizza/PizzaIllustration';

gsap.registerPlugin(ScrollTrigger);

export interface HeroVisualProps {
  active?: boolean;
}

const HERO_TOPPING_IDS = ['t_basil', 't_tomato', 't_olive', 't_mushroom', 't_pepperoni'];

export default function HeroVisual({ active = false }: HeroVisualProps) {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pizzaWrapRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<SVGSVGElement>(null);
  const flecksRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  // Steam wisp paths
  const steamPaths = [
    "M80,80 C75,65 85,55 80,45 C75,35 85,25 80,15",
    "M90,80 C88,68 93,60 89,50 C85,40 91,32 88,22",
    "M100,80 C105,65 95,50 102,40 C108,30 95,20 100,10",
    "M110,80 C113,68 105,58 111,48 C117,38 105,28 110,18",
    "M120,80 C125,65 115,55 122,45 C128,35 115,25 120,15",
    "M95,80 C90,68 100,55 94,45 C88,35 100,25 96,15"
  ];

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

        // Step 1: Draw on
        tl.fromTo(path,
          { strokeDasharray: len, strokeDashoffset: len, opacity: 1, y: 0 },
          { strokeDashoffset: 0, duration: 1.8, ease: "power1.inOut" }
        )
        // Step 2: Float and fade
        .to(path,
          { y: -30, opacity: 0, duration: 1.2, ease: "power1.in" },
          "-=0.6" // Overlap slightly with drawing
        );
      };

      gsap.delayedCall(i * 0.4, animateWisp);
    });
  }, []);

  const startFleckAnimations = useCallback(() => {
    if (!flecksRef.current) return;
    const flecks = Array.from(flecksRef.current.children);
    
    flecks.forEach(fleck => {
      gsap.to(fleck, {
        y: "random(-12, 12)",
        x: "random(-8, 8)",
        rotation: "random(-15, 15)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: "random(0, 3)"
      });
    });
  }, []);

  // Entry Timeline
  useEffect(() => {
    if (!active) return;
    
    // Set initial before animate
    gsap.set(textRef.current, { opacity: 0, y: 40 });
    
    const tl = gsap.timeline();

    tl.to(pizzaWrapRef.current, {
      opacity: 1, scale: 1, duration: 1.0, ease: "cubic-bezier(0.16,1,0.3,1)"
    })
    .fromTo(pizzaWrapRef.current, 
      { scale: 0.92 }, 
      { scale: 1, duration: 1.0, ease: "cubic-bezier(0.16,1,0.3,1)" }, 
      "<"
    )
    .to(glowRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0.3)
    .to(textRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "cubic-bezier(0.16,1,0.3,1)" }, 0.5)
    .call(() => {
      gsap.to(steamRef.current, { opacity: 1, duration: 0.5 });
      startSteamAnimations();
    }, [], 1.2)
    .call(startFleckAnimations, [], 1.5)
    .fromTo(scrollLineRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.8, ease: "cubic-bezier(0.16,1,0.3,1)" },
      1.8
    )
    .call(() => {
      gsap.to(glowRef.current, {
        opacity: 0.7, scale: 1.08, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
    }, [], 1.5);

    return () => {
      tl.kill();
      gsap.killTweensOf(steamRef.current?.querySelectorAll('path') || []);
      gsap.killTweensOf(flecksRef.current?.children || []);
    };
  }, [active, startSteamAnimations, startFleckAnimations]);

  // Scroll Parallax
  useEffect(() => {
    if (!heroSectionRef.current) return;
    
    // Create ScrollTriggers separately so we can kill them easily
    const ctx = gsap.context(() => {
      gsap.to(pizzaWrapRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(glowRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "20% top",
          end: "80% top",
          scrub: 1
        }
      });

      gsap.to(textRef.current, {
        y: -50, opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "10% top",
          end: "60% top",
          scrub: 1
        }
      });

      gsap.to(steamRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "5% top",
          end: "40% top",
          scrub: 1
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroSectionRef} className="relative w-full h-screen overflow-hidden bg-[#0A0705]">
      {/* GLOW HALO */}
      <div 
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 72% 52%, rgba(232,84,10,0.14) 0%, rgba(201,147,58,0.06) 40%, transparent 70%)",
          opacity: 0
        }}
      />

      {/* PIZZA ILLUSTRATION AND STEAM */}
      <div 
        ref={pizzaWrapRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-auto lg:right-[-4%] lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 w-[90vw] max-w-[520px] lg:w-[58vw] lg:max-w-[740px]"
        style={{ opacity: 0 }}
      >
        <PizzaIllustration
          toppingIds={HERO_TOPPING_IDS}
          size="hero"
          animate={false}
          interactive={false}
        />
        
        {/* STEAM WISPS */}
        <svg 
          ref={steamRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 200 200"
          style={{ opacity: 0 }}
        >
          {steamPaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </svg>
      </div>

      {/* FLOATING INGREDIENT FLECKS */}
      <div ref={flecksRef} className="absolute inset-0 pointer-events-none">
        {/* Top-right: tiny basil leaf SVG, 14px, opacity 0.2, rotate 23deg */}
        <svg viewBox="-5 -5 10 10" className="absolute top-[15%] right-[20%] w-[14px] h-[14px] opacity-20" style={{ transform: 'rotate(23deg)' }}>
          <path d="M0,-5 C3,-3 3,1 0,3 C-3,1 -3,-3 0,-5" fill="#2D5A1B" />
        </svg>
        
        {/* Top-left area: 3-dot corn cluster, 10px, opacity 0.18 */}
        <svg viewBox="-3 -3 6 6" className="absolute top-[25%] left-[25%] lg:left-[45%] w-[10px] h-[10px] opacity-[0.18]">
          <circle cx={0} cy={-1.5} r={1.6} fill="#F4C430" />
          <circle cx={-1.4} cy={1} r={1.6} fill="#E8B820" />
          <circle cx={1.4} cy={1} r={1.6} fill="#F4C430" />
        </svg>
        
        {/* Bottom-right corner: small olive circle, 8px, opacity 0.15 */}
        <svg viewBox="-4 -4 8 8" className="absolute bottom-[20%] right-[10%] lg:right-[30%] w-[8px] h-[8px] opacity-15">
          <circle r={3.2} fill="#2A1A35" />
          <circle r={1.1} cx={-0.4} cy={-0.4} fill="#5A3A6A" opacity={0.7} />
        </svg>
        
        {/* Mid-right: capsicum sliver, 12px, opacity 0.2, rotate -45deg */}
        <svg viewBox="-5 -5 10 10" className="absolute top-[50%] right-[5%] w-[12px] h-[12px] opacity-20" style={{ transform: 'rotate(-45deg)' }}>
          <path d="M-4,0 Q-1,-3 4,0 Q-1,3 -4,0" fill="#2D8A1F" stroke="#1A5C10" strokeWidth="0.3" />
        </svg>
        
        {/* Top-center-right: tiny pepper disc, 6px, opacity 0.15 */}
        <svg viewBox="-6 -6 12 12" className="absolute top-[10%] right-[40%] w-[6px] h-[6px] opacity-15">
          <circle r={5.5} fill="#8B1A1A" />
        </svg>
        
        {/* Bottom-left: mushroom shape, 10px, opacity 0.18 */}
        <svg viewBox="-5 -5 10 10" className="absolute bottom-[30%] left-[10%] lg:left-[35%] w-[10px] h-[10px] opacity-[0.18]">
          <path d="M-3.5,1 A4,3.5 0 0,1 3.5,1 L2.5,2 L-2.5,2 Z" fill="#9B8572" />
          <rect x={-0.8} y={1} width={1.6} height={1.5} fill="#7A6555" />
        </svg>
        
        {/* Upper-left: herb dot, 5px circle, opacity 0.12 */}
        <svg viewBox="-3 -3 6 6" className="absolute top-[40%] left-[15%] w-[5px] h-[5px] opacity-12">
          <circle r={2.5} fill="#5A3A6A" />
        </svg>
        
        {/* Right-middle-low: tiny paneer square, 7px, opacity 0.15 */}
        <svg viewBox="-4 -4 8 8" className="absolute bottom-[40%] right-[15%] w-[7px] h-[7px] opacity-15">
          <rect x={-3} y={-2} width={6} height={4} rx={0.8} fill="#F0EAD6" />
        </svg>
      </div>

      {/* RADIAL SCORE LINES (Desktop only) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04] hidden lg:block" style={{ stroke: "#C9933A", strokeWidth: 1 }}>
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((angle, i) => {
          // Center matches halo approx 72% w, 52% h
          const cx = '72%';
          const cy = '52%';
          return <line key={i} x1={cx} y1={cy} x2="150%" y2={cy} style={{ transformOrigin: `${cx} ${cy}`, transform: `rotate(${angle}deg)` }} />;
        })}
      </svg>

      {/* HERO TEXT */}
      <div 
        ref={textRef}
        className="absolute z-10 bottom-24 left-6 lg:top-1/2 lg:-translate-y-1/2 lg:left-20 lg:bottom-auto"
        style={{ opacity: 0 }}
      >
        <h1 className="font-serif text-[52px] lg:text-[96px] leading-[1.0] tracking-[-0.03em] text-[#F2EDDF]">
          We Knead<br/>Pizza
        </h1>
        <p className="mt-4 font-sans text-base lg:text-xl text-[#8C7E6A]">
          Crafted with obsession.
        </p>
        <a 
          href="/menu"
          className="mt-6 inline-block px-7 py-3 border border-[rgba(242,237,223,0.3)] text-[#F2EDDF] font-sans text-sm tracking-wide hover:border-[#C9933A] hover:text-[#C9933A] transition-colors duration-300"
        >
          Explore the Menu
        </a>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <span className="block font-sans text-[10px] tracking-[0.2em] text-[#8C7E6A] mb-2 text-center">SCROLL</span>
        <div 
          ref={scrollLineRef}
          className="w-px h-12 bg-[rgba(242,237,223,0.2)] mx-auto"
          style={{ transformOrigin: "top", transform: "scaleY(0)" }}
        />
      </div>
    </div>
  );
}
