'use client';

import React, { useRef, useEffect, useMemo, useId } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ToppingID, Size } from '@/types';
import { distributeToppings } from '@/lib/toppingDistribution';
import { TOPPINGS } from '@/lib/menuData';

// ─── Deterministic PRNG ─────────────────────────────────────────
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Irregular circle path generator ────────────────────────────
function irregularCirclePath(
  cx: number,
  cy: number,
  radius: number,
  points: number,
  seed: number,
  variance: number
) {
  const rng = mulberry32(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = radius + (rng() - 0.5) * 2 * variance;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + ' Z';
}

// ─── Topping Renderer ───────────────────────────────────────────
function renderTopping(
  id: ToppingID,
  cx: number,
  cy: number,
  index: number,
  seed: number
) {
  const rng = mulberry32(seed + index * 100);
  const rot = (index * 47 + seed * 13) % 360;
  
  // Apply translation at the group level so inner coords can be 0,0 relative
  const transform = `translate(${cx}, ${cy}) rotate(${rot})`;
  
  if (id.includes('olive')) {
    return (
      <g transform={`translate(${cx}, ${cy})`}>
        <circle r={3.2} fill="#2A1A35" />
        <circle r={1.1} cx={-0.4} cy={-0.4} fill="#5A3A6A" opacity={0.7} />
      </g>
    );
  }

  if (id.includes('capsicum') || id.includes('redpepper') || id.includes('jalapeno')) {
    let fill = '#2D8A1F';
    if (id.includes('redpepper')) fill = '#E53935';
    if (id.includes('jalapeno')) fill = '#4CAF50';
    return (
      <g transform={transform}>
        <path d="M-4,0 Q-1,-3 4,0 Q-1,3 -4,0" fill={fill} stroke="#1A5C10" strokeWidth="0.3" />
      </g>
    );
  }

  if (id.includes('onion')) {
    return (
      <g transform={`translate(${cx}, ${cy})`}>
        <g transform={`rotate(${rot})`}>
          <path d="M-3.5,-1 A4,4 0 0,1 3.5,-1 A2.5,2.5 0 0,0 -3.5,-1" fill="rgba(220,160,190,0.75)" />
        </g>
        <g transform={`rotate(${rot + 40}) translate(1.5, 1.5)`}>
          <path d="M-3.5,-1 A4,4 0 0,1 3.5,-1 A2.5,2.5 0 0,0 -3.5,-1" fill="rgba(220,160,190,0.75)" />
        </g>
      </g>
    );
  }

  if (id.includes('mushroom')) {
    return (
      <g transform={transform}>
        <path d="M-3.5,1 A4,3.5 0 0,1 3.5,1 L2.5,2 L-2.5,2 Z" fill="#9B8572" />
        <rect x={-0.8} y={1} width={1.6} height={1.5} fill="#7A6555" />
        <path d="M-2,0 A3,3 0 0,1 2,0" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" fill="none" />
      </g>
    );
  }

  if (id.includes('corn') || id.includes('sweetcorn')) {
    return (
      <g transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
        <circle cx={0} cy={-1.5} r={1.6} fill="#F4C430" />
        <circle cx={-1.4} cy={1} r={1.6} fill="#E8B820" />
        <circle cx={1.4} cy={1} r={1.6} fill="#F4C430" />
      </g>
    );
  }

  if (id.includes('paneer')) {
    return (
      <g transform={transform}>
        <rect x={-3} y={-2} width={6} height={4} rx={0.8} fill="#F0EAD6" stroke="rgba(180,160,120,0.4)" strokeWidth="0.4" />
        <rect x={-2} y={-1} width={4} height={2.5} rx={0.5} fill="rgba(255,255,255,0.3)" />
      </g>
    );
  }

  if (id.includes('chicken')) {
    return (
      <g transform={transform}>
        <path d="M-4,0 C-4,-3 -1,-4.5 0,-4 C1,-3.5 4,-3 4,0 C4,2.5 1,4 0,3.5 C-1,3 -4,2.5 -4,0" fill="#C8956C" stroke="#A07040" strokeWidth="0.3" />
        <line x1={-2} y1={-2} x2={2} y2={2} stroke="rgba(80,40,10,0.5)" strokeWidth="0.7" />
        <line x1={-2} y1={0} x2={1} y2={3} stroke="rgba(80,40,10,0.4)" strokeWidth="0.5" />
      </g>
    );
  }

  if (id.includes('pepperoni')) {
    const specks = Array.from({ length: 5 }).map((_, i) => {
      const sx = (rng() - 0.5) * 6;
      const sy = (rng() - 0.5) * 6;
      return <circle key={i} cx={sx} cy={sy} r={0.5} fill="rgba(255,255,255,0.5)" />;
    });
    return (
      <g transform={`translate(${cx}, ${cy})`}>
        <circle r={5.5} fill="#8B1A1A" />
        <circle r={4.5} fill="#A82020" />
        {specks}
      </g>
    );
  }

  if (id.includes('tomato')) {
    return (
      <g transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
        <circle r={4.5} fill="#E8220A" />
        <circle r={3.2} fill="#FF4422" opacity={0.7} />
        <line x1={-3.5} y1={0} x2={3.5} y2={0} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        <line x1={0} y1={-3.5} x2={0} y2={3.5} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      </g>
    );
  }

  if (id.includes('basil')) {
    const leafRot = (index * 55) % 360;
    return (
      <g transform={`translate(${cx}, ${cy}) rotate(${leafRot})`}>
        <path d="M0,-5 C3,-3 3,1 0,3 C-3,1 -3,-3 0,-5" fill="#2D5A1B" />
        <line x1={0} y1={-4} x2={0} y2={2.5} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </g>
    );
  }

  // Fallback
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={3} fill="#ccc" />
    </g>
  );
}

// ─── Component Props ────────────────────────────────────────────
export interface PizzaIllustrationProps {
  toppingIds: ToppingID[];
  size: 'thumb' | 'card' | 'builder' | 'hero';
  pizzaSize?: Size; // Drives scale animation S=0.88, M=1.0, L=1.14
  animate?: boolean;
  interactive?: boolean;
  className?: string;
  seed?: number;
}

export default function PizzaIllustration({
  toppingIds,
  size,
  pizzaSize = 'medium',
  animate = false,
  interactive = false,
  className = '',
  seed = 0
}: PizzaIllustrationProps) {
  const uid = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const toppingRefs = useRef<(SVGGElement | null)[]>([]);
  const prevToppingIds = useRef<ToppingID[]>([]);

  // ── Topping data generation ──
  const toppingsData = useMemo(() => {
    return toppingIds.map((id, idx) => {
      const toppingDef = TOPPINGS.find((t) => t.id === id);
      
      // Determine count bounds based on topping type to avoid crowding
      let count = 8;
      if (id.includes('mushroom') || id.includes('chicken')) count = 7;
      if (id.includes('capsicum') || id.includes('corn')) count = 9;
      if (id.includes('basil') || id.includes('paneer') || id.includes('tomato')) count = 6;
      
      const positions = distributeToppings(count, 34, seed + idx);
      return { id, toppingDef, positions };
    });
  }, [toppingIds, seed]);

  // ── Sauce and cheese organic paths ──
  const saucePath = useMemo(() => irregularCirclePath(100, 100, 40, 32, seed ?? 0, 40 * 0.03), [seed]);
  const cheeseEllipses = useMemo(() => {
    const rng = mulberry32((seed ?? 0) + 999);
    return Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2 + rng();
      const rCenter = rng() * 18; // Keep within cheese zone (r=28 max)
      const cx = 100 + rCenter * Math.cos(angle);
      const cy = 100 + rCenter * Math.sin(angle);
      const rx = 12 + rng() * 10;
      const ry = 8 + rng() * 8;
      const opacity = 0.7 + rng() * 0.25;
      const colors = ['#F5E6A3', '#EDD878', '#F0DC82', '#E8CE70'];
      const fill = colors[Math.floor(rng() * colors.length)];
      return { cx, cy, rx, ry, opacity, fill };
    });
  }, [seed]);

  // ── Animations ──
  useEffect(() => {
    if (!animate || !svgRef.current) return;
    
    // Check if this is the very first mount vs an update
    if (prevToppingIds.current.length === 0) {
      // Entry animation
      const tl = gsap.timeline();
      tl.fromTo(
        svgRef.current,
        { scale: 0.88, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'cubic-bezier(0.16,1,0.3,1)' }
      );
      
      // Stagger toppings
      const validRefs = toppingRefs.current.filter(Boolean);
      if (validRefs.length > 0) {
        tl.fromTo(
          validRefs,
          { scale: 0, opacity: 0, transformOrigin: 'center' },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.4)' },
          '-=0.4'
        );
      }
    } else {
      // Add/Remove update animations
      const prev = new Set(prevToppingIds.current);
      const curr = new Set(toppingIds);

      // Added items
      toppingIds.forEach(id => {
        if (!prev.has(id) && svgRef.current) {
          const els = svgRef.current.querySelectorAll(`g[data-topping-id="${id}"]`);
          if (els.length > 0) {
            gsap.fromTo(
              els,
              { scale: 0, opacity: 0, y: -12, transformOrigin: 'center' },
              { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.4)' }
            );
          }
        }
      });

      // Removed items
      prevToppingIds.current.forEach(id => {
        if (!curr.has(id) && svgRef.current) {
          const els = svgRef.current.querySelectorAll(`g[data-topping-id="${id}"]`);
          if (els.length > 0) {
            gsap.to(els, {
              scale: 0, opacity: 0, y: -8, duration: 0.3, ease: 'power2.in'
            });
          }
        }
      });
    }

    prevToppingIds.current = toppingIds;
  }, [toppingIds, animate]);

  // Size change scale animation
  useEffect(() => {
    if (!svgRef.current) return;
    const scales = { small: 0.88, medium: 1.0, large: 1.14 };
    gsap.to(svgRef.current, {
      scale: scales[pizzaSize],
      duration: 0.4,
      ease: 'cubic-bezier(0.16,1,0.3,1)',
      transformOrigin: 'center'
    });
  }, [pizzaSize]);

  // ── Dimensions ──
  const mapSize: Record<typeof size, { w: string; h: string }> = {
    thumb: { w: '72px', h: '72px' },
    card: { w: '100%', h: '100%' }, 
    builder: { w: '100%', h: '100%' }, 
    hero: { w: '100%', h: '100%' },
  };
  const { w, h } = mapSize[size];

  // ── Crust Ticks ──
  const crustTicks = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = (i / 48) * 2 * Math.PI;
      const x1 = 100 + 44 * Math.cos(angle);
      const y1 = 100 + 44 * Math.sin(angle);
      const x2 = 100 + 48 * Math.cos(angle);
      const y2 = 100 + 48 * Math.sin(angle);
      return (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.6"
        />
      );
    });
  }, []);

  const svgEl = (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      width={w}
      height={h}
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="Pizza illustration"
      role="img"
      data-testid="pizza-illustration"
      data-toppings={toppingIds.join(',')}
      data-size={size}
      data-animate={String(animate)}
      data-pizza-size={pizzaSize}
    >
      <defs>
        <radialGradient id={`shadow-${uid}`}>
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        <radialGradient id={`crust-${uid}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#C4843A" />
          <stop offset="50%" stopColor="#8B5E2A" />
          <stop offset="100%" stopColor="#5C3A1E" />
        </radialGradient>

        <radialGradient id={`base-${uid}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#D4A55A" />
          <stop offset="100%" stopColor="#A07840" />
        </radialGradient>

        <filter id={`base-texture-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} seed={seed} result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>

        <radialGradient id={`sauce-${uid}`} cx="45%" cy="40%">
          <stop offset="0%" stopColor="#D42B20" />
          <stop offset="60%" stopColor="#A01A10" />
          <stop offset="100%" stopColor="#6A0D08" />
        </radialGradient>

        <clipPath id={`sauce-clip-${uid}`}>
          <path d={saucePath} />
        </clipPath>

        <filter id={`cheese-blur-${uid}`}>
          <feGaussianBlur stdDeviation="0.8" />
        </filter>

        <radialGradient id={`gloss-${uid}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* LAYER 0: Shadow */}
      <g data-layer="shadow">
        <ellipse cx={100} cy={109} rx={46} ry={9} fill={`url(#shadow-${uid})`} />
      </g>

      {/* LAYER 1: Crust */}
      <g data-layer="crust">
        <circle cx={100} cy={100} r={48} fill={`url(#crust-${uid})`} />
        {crustTicks}
      </g>

      {/* LAYER 2: Base */}
      <g data-layer="base">
        <circle cx={100} cy={100} r={44} fill={`url(#base-${uid})`} filter={`url(#base-texture-${uid})`} />
      </g>

      {/* LAYER 3: Sauce */}
      <g data-layer="sauce">
        <path d={saucePath} fill={`url(#sauce-${uid})`} />
      </g>

      {/* LAYER 4: Cheese */}
      <g data-layer="cheese" clipPath={`url(#sauce-clip-${uid})`}>
        {cheeseEllipses.map((e, i) => (
          <ellipse
            key={i}
            cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
            fill={e.fill} opacity={e.opacity}
            filter={`url(#cheese-blur-${uid})`}
          />
        ))}
        {/* Cheese highlight */}
        <ellipse cx={88} cy={88} rx={8} ry={5} fill="rgba(255,255,240,0.4)" />
      </g>

      {/* LAYER 5: Toppings */}
      <g data-layer="toppings">
        {toppingsData.map(({ id, positions }) => {
          return positions.map(([x, z], i) => {
            const svgX = 100 + x;
            const svgY = 100 + z;
            return (
              <g
                key={`${id}-${i}`}
                data-topping-id={id}
                ref={(el) => {
                  if (el) toppingRefs.current.push(el);
                }}
              >
                {renderTopping(id, svgX, svgY, i, seed)}
              </g>
            );
          });
        })}
      </g>

      {/* LAYER 6: Gloss */}
      <g data-layer="gloss">
        <circle cx={100} cy={100} r={44} fill={`url(#gloss-${uid})`} style={{ pointerEvents: 'none' }} />
      </g>
    </svg>
  );

  if (interactive) {
    return (
      <motion.div
        className={className}
        whileHover={{ rotateY: 8, rotateX: -4, scale: 1.03 }}
        style={{ perspective: 800, transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {svgEl}
      </motion.div>
    );
  }

  return <div className={className}>{svgEl}</div>;
}
