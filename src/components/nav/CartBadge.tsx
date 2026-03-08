'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function CartBadge() {
  const itemCount = useCartStore((state) => state.itemCount());
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(itemCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && itemCount !== prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 400);
      prevCount.current = itemCount;
      return () => clearTimeout(timer);
    }
  }, [itemCount, mounted]);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-bg-surface transition-all duration-medium group"
      aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
    >
      {/* Cart icon (Minimal luxury) */}
      <svg className="w-[22px] h-[22px] text-text-primary group-hover:text-accent-gold transition-colors duration-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" 
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" 
        />
      </svg>

      {/* Badge */}
      <AnimatePresence mode="popLayout">
        {mounted && itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: pulse ? [1, 1.25, 1] : 1,
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            data-testid="cart-badge"
            className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-accent-gold text-black text-[9px] font-bold rounded-full leading-none shadow-[0_0_0_2px_var(--bg-base)]"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
