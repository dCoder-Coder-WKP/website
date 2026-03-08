'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import CartItem from './CartItem';
import Link from 'next/link';
import SmartUpsell from './SmartUpsell';

export default function CartList() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-24 h-24 mb-10 rounded-full bg-bg-surface/50 flex items-center justify-center border border-border-refined relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent-gold/5 blur-xl group-hover:h-full transition-all duration-long" />
          <svg className="w-10 h-10 text-accent-gold relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        
        <h2 className="heading-section text-text-primary mb-4 italic">Empty Vessel</h2>
        <p className="font-sans text-text-secondary text-lg font-light mb-12 max-w-sm leading-relaxed">
          The dough is resting. Your curated selection of artisanal crafts has not yet begun.
        </p>
        
        <Link 
          href="/menu"
          className="btn-luxury !px-12 !py-4"
        >
          Explore the Menu
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.key}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <CartItem item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <SmartUpsell />
    </div>
  );
}
