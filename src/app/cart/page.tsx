/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import CartList from '@/components/cart/CartList';
import OrderSummary from '@/components/cart/OrderSummary';
import { motion } from 'framer-motion';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-32 pb-24 overflow-x-hidden relative">
      {/* BACKGROUND NARRATIVE */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1548365328-8c6db3220e4c?q=80&w=2000&auto=format&fit=crop"
          alt="The Vault"
          className="w-full h-full object-cover opacity-10 grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-transparent to-bg-base opacity-90" />
      </div>

      {/* Editorial Header */}
      <div className="relative z-10 px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-[10px] tracking-luxury text-accent-gold uppercase mb-3 block">Review Your Selections</span>
            <h1 className="heading-hero text-text-primary italic">Your Curation</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-4 text-text-muted hover:text-accent-gold transition-all duration-medium font-sans text-[10px] uppercase tracking-luxury"
            >
              <span className="w-8 h-[1px] bg-border-subtle group-hover:w-12 group-hover:bg-accent-gold transition-all duration-medium" />
              Return to Menu
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Main List Section */}
          <div className="flex-1 w-full">
            <header className="mb-8 pb-4 border-b border-border-refined">
              <h2 className="font-serif text-lg text-text-muted italic">Individual Selections</h2>
            </header>
            <CartList />
          </div>

          {/* Sidebar Summary */}
          <aside className="w-full lg:w-[450px]">
             <OrderSummary />
             
             {/* Trust / Brand Element */}
             <div className="mt-12 p-8 border border-dashed border-border-refined rounded-2xl">
               <h4 className="font-serif text-sm text-text-primary italic mb-3">Our Quality Guarantee</h4>
               <p className="font-sans text-[11px] text-text-secondary leading-relaxed font-light">
                 Every selection in your curation is prepared with artisanal precision. We use only the finest ingredients, sourced for their integrity and flavor.
               </p>
             </div>
          </aside>
        </div>

        {/* Mobile Back Link (Redundant but helpful for UX) */}
        <div className="mt-20 text-center lg:hidden">
          <Link
            href="/menu"
            className="btn-luxury !px-8 !py-3 text-[10px]"
          >
            Keep Exploring
          </Link>
        </div>
      </div>
    </main>
  );
}
