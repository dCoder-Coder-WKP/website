'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

const stats: StatItem[] = [
  { label: 'Generations of Recipes', value: 3, suffix: 'rd' },
  { label: 'Fresh Dough Daily', value: 100, suffix: '%' },
  { label: 'Gas Oven Precision', value: 300, suffix: '°C' },
];

function CounterNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let current = 0;
    const increment = Math.max(target / 80, 1);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div
      ref={ref}
      className="font-serif text-5xl italic text-text-primary sm:text-6xl lg:text-7xl group-hover:text-accent-gold transition-colors duration-long"
    >
      {count}
      <span className="text-accent-gold">{suffix}</span>
    </div>
  );
}

export default function AnimatedStats() {
  return (
    <section className="relative overflow-hidden bg-bg-base py-24 sm:py-32 border-b border-border-subtle">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute h-full w-[200%] md:w-full stroke-accent-gold/5"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="100" x2="1200" y2="100" strokeWidth="1" />
          <line x1="0" y1="200" x2="1200" y2="200" strokeWidth="1" />
          <line x1="0" y1="300" x2="1200" y2="300" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <span className="text-accent-gold text-[10px] tracking-luxury uppercase font-sans block mb-4">The Secret Sauce</span>
          <h2 className="font-serif text-4xl italic sm:text-5xl lg:text-5xl text-text-primary">
            By The Numbers
          </h2>
          <p className="mt-6 text-sm font-light text-text-secondary">
            Willie Fernandes&apos; dedication to family recipes and modern precision.
          </p>
        </motion.div>

        <div className="grid gap-16 sm:gap-12 md:grid-cols-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col items-center justify-center space-y-6 transition-transform hover:scale-105 duration-ultra cursor-default"
            >
              <CounterNumber target={stat.value} suffix={stat.suffix} />
              <p className="text-center text-[10px] tracking-luxury text-text-muted uppercase font-sans">
                {stat.label}
              </p>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-accent-gold to-transparent group-hover:w-24 transition-all duration-long" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
