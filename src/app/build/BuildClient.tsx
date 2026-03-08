'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import PizzaBuilder from '@/components/builder/PizzaBuilder';
import { motion } from 'framer-motion';
import { Topping } from '@/types';

export default function BuildClient({ toppings }: { toppings: Topping[] }) {
  return (
    <main className="min-h-screen bg-bg-base overflow-hidden relative pt-24">
      {/* BACKGROUND NARRATIVE */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=2000&auto=format&fit=crop"
          alt="The Workshop"
          className="w-full h-full object-cover opacity-20 grayscale-[0.4] brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-transparent to-bg-base opacity-90" />
      </div>

      {/* Editorial Workshop Header */}
      <div className="px-6 lg:px-12 py-8 lg:py-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-4 text-text-muted hover:text-accent-gold transition-all duration-medium font-sans text-[10px] uppercase tracking-luxury mb-6"
            >
              <span className="w-8 h-[1px] bg-border-subtle group-hover:w-12 group-hover:bg-accent-gold transition-all duration-medium" />
              Return to Catalog
            </Link>
            <h1 className="heading-hero text-text-primary italic !text-4xl lg:!text-6xl">
              Artisanal <br />Workshop
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <p className="font-sans text-xs text-text-muted uppercase tracking-widest leading-relaxed">
              Precision Configuration Suite v1.0 <br />
              <span className="text-accent-gold/60 mt-2 block">Define your culinary intent with absolute visual fidelity.</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">
        <PizzaBuilder toppings={toppings} />
      </div>
    </main>
  );
}
