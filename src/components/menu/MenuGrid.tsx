'use client';

import React from 'react';
import { Pizza } from '@/types';
import PizzaCard from './PizzaCard';
import { motion } from 'framer-motion';

export interface MenuGridProps {
  pizzas: Pizza[];
}

export default function MenuGrid({ pizzas }: MenuGridProps) {
  return (
    <section className="mb-32 w-full">
      <header className="mb-16 max-w-2xl px-4 md:px-0">
        <span className="font-sans text-[10px] tracking-luxury text-accent-gold uppercase mb-3 block">
          Willie&apos;s Signatures
        </span>
        <h2 className="heading-section text-text-primary mb-6">
          <span className="italic">Goan Baked</span> Legacy Pizzas
        </h2>
        <p className="font-sans text-text-secondary text-lg font-light leading-relaxed">
          Passed down for generations, our gas oven baked pizzas feature fresh daily dough and incredibly healthy toppings with an unmatched, amazing taste.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-14">
        {pizzas.map((pizza, idx) => (
          <motion.div 
            key={pizza.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <PizzaCard pizza={pizza} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
