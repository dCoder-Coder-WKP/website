'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Size, ToppingID } from '@/types';

interface CuratedShot {
  slug: string;
  url: string;
  label: string;
  keywords: string[];
}

const CURATED_SHOTS: CuratedShot[] = [
  {
    slug: 'heritage-margherita',
    url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30520?q=80&w=1600&auto=format&fit=crop',
    label: 'Heritage Margherita',
    keywords: ['t_basil', 't_cheese', 't_tomato'],
  },
  {
    slug: 'ember-tandoor',
    url: 'https://images.unsplash.com/photo-1542826438-82dc4a4523f6?q=80&w=1600&auto=format&fit=crop',
    label: 'Ember Tandoor',
    keywords: ['t_chicken', 't_redpepper', 't_jalapenos'],
  },
  {
    slug: 'garden-market',
    url: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?q=80&w=1600&auto=format&fit=crop',
    label: 'Garden Market',
    keywords: ['t_capsicum', 't_onion', 't_mushroom'],
  },
  {
    slug: 'smoky-parma',
    url: 'https://images.unsplash.com/photo-1548366086-7e45d2f9ea68?q=80&w=1600&auto=format&fit=crop',
    label: 'Smoky Parma',
    keywords: ['t_paneer', 't_cheese'],
  },
  {
    slug: 'woodfire-classic',
    url: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=1600&auto=format&fit=crop',
    label: 'Woodfire Classic',
    keywords: ['t_pepperoni', 't_sweetcorn'],
  },
  {
    slug: 'midnight-chef',
    url: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f4c?q=80&w=1600&auto=format&fit=crop',
    label: 'Midnight Chef',
    keywords: [],
  },
];

const FALLBACK_SHOT = CURATED_SHOTS[CURATED_SHOTS.length - 1];

function hashToppings(toppingIds: ToppingID[] = [], seed = 0) {
  let hash = seed || 0;
  toppingIds.forEach((id) => {
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) % 2147483647;
    }
  });
  return Math.abs(hash);
}

function pickShot(toppingIds: ToppingID[], seed: number): CuratedShot {
  if (toppingIds.length) {
    const lower = toppingIds.map((id) => id.toLowerCase());
    const targeted = CURATED_SHOTS.find((shot) =>
      shot.keywords.some((keyword) => lower.includes(keyword.toLowerCase()))
    );
    if (targeted) return targeted;
  }

  const hash = hashToppings(toppingIds, seed);
  const idx = hash % CURATED_SHOTS.length;
  return CURATED_SHOTS[idx] ?? FALLBACK_SHOT;
}

const SIZE_CLASS_MAP: Record<
  PizzaIllustrationProps['size'],
  string
> = {
  thumb: 'h-24 w-24 rounded-2xl',
  card: 'h-64 w-full rounded-[30px]',
  builder: 'h-[420px] w-full rounded-[36px]',
  hero: 'h-[520px] w-full rounded-[40px]',
};

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
  animate = true,
  interactive = false,
  className = '',
  seed = 42,
}: PizzaIllustrationProps) {
  const shot = useMemo(() => pickShot(toppingIds, seed), [toppingIds, seed]);
  const containerClass = `${SIZE_CLASS_MAP[size]} ${className}`.trim();

  const hoverAnimation = interactive
    ? { rotateX: -2, rotateY: 3, scale: 1.02 }
    : undefined;

  return (
    <motion.div
      data-testid="pizza-visual"
      data-picked-image={shot.slug}
      data-toppings={toppingIds.join(',')}
      className={`relative isolate overflow-hidden bg-bg-base border border-border-refined ${containerClass}`}
      initial={animate ? { opacity: 0, scale: 0.97 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hoverAnimation}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
      <img
        src={shot.url}
        alt={`${shot.label} pizza photograph`}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1800ms] ease-[var(--ease-premium)] hover:scale-105"
      />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

      <div className="absolute top-4 left-4 px-4 py-1 rounded-full bg-black/50 border border-white/10 text-[10px] tracking-luxury uppercase text-white">
        {shot.label}
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.4em] text-white/70">
        Goa · 2026
      </div>
    </motion.div>
  );
}
