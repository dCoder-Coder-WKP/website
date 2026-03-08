'use client';

import React, { useRef, useEffect, useMemo, useId } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ToppingID, Size } from '@/types';
import { distributeToppings } from '@/lib/toppingDistribution';

// ─── Deterministic PRNG ─────────────────────────────────────────
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Topping Renderer (Photorealistic) ─────────────────────────
function renderTopping(
  id: ToppingID,
  cx: number,
  cy: number,
  index: number,
  seed: number,
  uid: string
) {
  const rng = mulberry32(seed + index * 107.4);
  const rot = (index * 137 + seed * 19) % 360;
  const transform = `translate(${cx}, ${cy}) rotate(${rot})`;
  const scale = 0.85 + rng() * 0.3; // Natural variance in size
  
  // Olive: Glossy sphere with shadow and pimento
  if (id.includes('olive')) {
    return (
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        <circle r={3.8} fill="#120D16" />
        <circle r={1.8} cx={-0.8} cy={-0.8} fill="#4A3B56" opacity={0.4} />
        <circle r={0.6} cx={0.8} cy={0.8} fill="#B22222" opacity={0.6} /> {/* Pimento hint */}
        <circle r={0.8} cx={-1.5} cy={-1.5} fill="white" opacity={0.15} filter={`url(#blur-tiny-${uid})`} />
      </g>
    );
  }

  // Capsicum/Peppers: Organic ring sections with highlights
  if (id.includes('capsicum') || id.includes('redpepper') || id.includes('jalapeno')) {
    let baseColor = '#2D8A1F';
    let darkColor = '#1A5C10';
    if (id.includes('redpepper')) { baseColor = '#C11818'; darkColor = '#800000'; }
    if (id.includes('jalapeno')) { baseColor = '#4CAF50'; darkColor = '#2E7D32'; }
    
    return (
      <g transform={`${transform} scale(${scale})`}>
        <path d="M-4.5,-0.5 Q-1,-4 4.5,-0.5 Q-1,3 -4.5,-0.5" fill={baseColor} stroke={darkColor} strokeWidth="0.5" />
        <path d="M-3,-0.5 Q-0.5,-2 3,-0.5" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    );
  }

  // Mushroom: Detailed gills and stem
  if (id.includes('mushroom')) {
    return (
      <g transform={`${transform} scale(${scale})`}>
        <path d="M-4.5,1.5 C-4.5,-3 4.5,-3 4.5,1.5 L3,2.5 L-3,2.5 Z" fill="#9B8572" />
        <rect x={-1} y={1.5} width={2} height={2.5} fill="#7A6555" rx={0.5} />
        <path d="M-3.5,0.5 Q0,-1.5 3.5,0.5" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
        <path d="M-4,1 Q0,-1 4,1" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
      </g>
    );
  }

  // Pepperoni: Marbled texture with oil sheen and curled edge
  if (id.includes('pepperoni')) {
    return (
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        <circle r={6.5} fill="#801515" stroke="#5A0000" strokeWidth="0.5" />
        <circle r={6} fill="url(#pepperoni-texture)" opacity={0.8} />
        <circle r={5.2} fill="white" opacity={0.06} cx={-1} cy={-1} filter={`url(#blur-med-${uid})`} />
      </g>
    );
  }

  // Basil: Veined leaf with organic curves
  if (id.includes('basil')) {
    return (
      <g transform={`${transform} scale(${scale})`}>
        <path d="M0,-6 C4,-4 5,2 0,6 C-5,2 -4,-4 0,-6" fill="#2D5A1B" filter={`url(#leaf-texture-${uid})`} />
        <path d="M0,-5 Q1,0 0,5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" fill="none" />
        <path d="M-1.5,-2 Q0,-1 1.5,-2" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" fill="none" />
      </g>
    );
  }

  // Paneer: Individual toasted cubes
  if (id.includes('paneer')) {
    return (
      <g transform={`${transform} scale(${scale})`}>
        <rect x={-3.5} y={-2.5} width={7} height={5} rx={1} fill="#F8F4E3" stroke="#DACC94" strokeWidth="0.4" />
        <path d="M-2,-1.5 L2,0.5" stroke="rgba(139,94,42,0.2)" strokeWidth="1.2" strokeLinecap="round" />
        <rect x={-2.5} y={-1.5} width={2} height={1.5} fill="rgba(255,255,255,0.8)" opacity={0.4} />
      </g>
    );
  }

  // Chicken: Irregular chunks with char highlights
  if (id.includes('chicken')) {
    return (
      <g transform={`${transform} scale(${scale})`}>
        <path d="M-5,1 C-5,-4 1,-6 5,-2 C6,2 2,6 -1,5 C-4,4 -5,3 -5,1" fill="#C8956C" />
        <path d="M-3,-1 Q1,-3 4,0" stroke="rgba(80,40,10,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <circle r={0.8} cx={2} cy={2} fill="#542810" opacity={0.4} />
      </g>
    );
  }

  // Default fallback for unknown toppings
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={3} fill={`url(#base-texture-${uid})`} />
    </g>
  );
}

export interface PizzaIllustrationProps {
  toppingIds: ToppingID[];
  size: 'thumb' | 'card' | 'builder' | 'hero';
  pizzaSize?: Size;
  animate?: boolean;
  interactive?: boolean;
  className?: string;
  seed?: number;
}

export default function PizzaIllustration({
  toppingIds,
  size,
  animate = false,
  interactive = false,
  className = '',
  seed = 42
}: PizzaIllustrationProps) {
  const uid = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const prevToppingIds = useRef<ToppingID[]>([]);

  const toppingsData = useMemo(() => {
    return toppingIds.map((id, idx) => {
      let count = 9;
      if (id.includes('cheese') || id.includes('basil')) count = 6;
      if (id.includes('olives') || id.includes('corn')) count = 12;
      const positions = distributeToppings(count, 35, (seed || 0) + idx * 10);
      return { id, positions };
    });
  }, [toppingIds, seed]);

  // Handle Updates/Animations
  useEffect(() => {
    if (!animate || !svgRef.current) return;
    
    if (prevToppingIds.current.length === 0) {
      // Entry animation
      gsap.fromTo(svgRef.current, 
        { scale: 0.94, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" }
      );
    } else {
      const prev = new Set(prevToppingIds.current);
      toppingIds.forEach(id => {
        if (!prev.has(id)) {
          const els = svgRef.current?.querySelectorAll(`g[data-topping-id="${id}"]`);
          if (els) gsap.fromTo(els, 
            { scale: 0, opacity: 0, y: -15 }, 
            { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "elastic.out(1, 0.75)" }
          );
        }
      });
      prevToppingIds.current.forEach(id => {
        if (!new Set(toppingIds).has(id)) {
          const els = svgRef.current?.querySelectorAll(`g[data-topping-id="${id}"]`);
          if (els) gsap.to(els, { scale: 0, opacity: 0, y: 10, duration: 0.3 });
        }
      });
    }
    prevToppingIds.current = toppingIds;
  }, [toppingIds, animate]);

  const mapSize: Record<typeof size, { w: string; h: string }> = {
    thumb: { w: '80px', h: '80px' },
    card: { w: '100%', h: '100%' }, 
    builder: { w: '100%', h: '100%' }, 
    hero: { w: '100%', h: '100%' },
  };
  const { w, h } = mapSize[size];

  return (
    <div className={`${className} flex items-center justify-center`}>
      <motion.svg
        ref={svgRef}
        viewBox="0 0 200 200"
        width={w}
        height={h}
        className="overflow-visible drop-shadow-2xl"
        initial={false}
        animate={interactive ? { rotateY: 2, rotateX: -2 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <defs>
          <filter id={`blur-tiny-${uid}`}><feGaussianBlur stdDeviation="0.4" /></filter>
          <filter id={`blur-med-${uid}`}><feGaussianBlur stdDeviation="1.2" /></filter>
          
          <filter id={`noise-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={3} seed={seed} />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>

          <radialGradient id={`crust-grad-${uid}`} cx="45%" cy="40%">
            <stop offset="70%" stopColor="#8B5E2A" />
            <stop offset="85%" stopColor="#6B4116" />
            <stop offset="95%" stopColor="#4A2C0F" />
            <stop offset="100%" stopColor="#301B0A" />
          </radialGradient>

          <radialGradient id={`sauce-grad-${uid}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#C11818" />
            <stop offset="80%" stopColor="#8E0F0F" />
            <stop offset="100%" stopColor="#5E0808" />
          </radialGradient>

          <pattern id="pepperoni-texture" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
             <circle cx="2" cy="2" r="0.6" fill="rgba(255,255,255,0.2)" />
             <circle cx="7" cy="5" r="0.8" fill="rgba(255,255,255,0.1)" />
             <circle cx="4" cy="8" r="0.5" fill="rgba(0,0,0,0.1)" />
          </pattern>

          <filter id={`leaf-texture-${uid}`}>
             <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={seed} result="noise" />
             <feDiffuseLighting in="noise" lightingColor="#2D5A1B" surfaceScale="1">
                <feDistantLight azimuth="45" elevation="60" />
             </feDiffuseLighting>
             <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* --- Pizza Structure --- */}
        <g className="pizza-base">
          {/* Outer Crust with Noise */}
          <circle cx="100" cy="100" r="48" fill={`url(#crust-grad-${uid})`} filter={`url(#noise-${uid})`} />
          
          {/* Inner Dough base */}
          <circle cx="100" cy="100" r="43" fill="#D4A373" opacity={0.6} />
          
          {/* Sauce Layer with viscous texture */}
          <circle cx="100" cy="100" r="40" fill={`url(#sauce-grad-${uid})`} opacity={0.9} />
          
          {/* Melted Cheese Pools (Organic shapes) */}
          <g className="cheese-pools" filter={`url(#blur-med-${uid})`}>
            <circle cx="90" cy="95" r="18" fill="#F4D03F" opacity={0.7} />
            <circle cx="110" cy="105" r="22" fill="#F7DC6F" opacity={0.6} />
            <circle cx="100" cy="90" r="15" fill="#F1C40F" opacity={0.5} />
            <circle cx="85" cy="110" r="12" fill="#F4D03F" opacity={0.4} />
          </g>

          {/* Char marks on crust */}
          <g opacity={0.15}>
             <circle cx="60" cy="70" r="2.5" fill="black" filter={`url(#blur-med-${uid})`} />
             <circle cx="145" cy="115" r="3.5" fill="black" filter={`url(#blur-med-${uid})`} />
             <circle cx="100" cy="148" r="2" fill="black" filter={`url(#blur-med-${uid})`} />
          </g>
        </g>

        {/* --- Topping Groups --- */}
        <g className="toppings-layer">
          {toppingsData.map(({ id, positions }) => (
            <g key={id} data-topping-id={id}>
              {positions.map(([x, y], i) => renderTopping(id, 100 + x, 100 + y, i, seed, uid))}
            </g>
          ))}
        </g>

        {/* --- Finishing Touches --- */}
        <g className="highlights" pointerEvents="none">
           {/* Global Specular Shine */}
           <circle cx="100" cy="100" r="38" fill="url(#gloss-grad)" opacity={0.1} />
        </g>
        
        <defs>
           <radialGradient id="gloss-grad" cx="30%" cy="30%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="transparent" />
           </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
