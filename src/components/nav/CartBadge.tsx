'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function CartBadge() {
  const itemCount = useCartStore((state) => state.itemCount());
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount !== prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      prevCount.current = itemCount;
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[rgba(242,237,223,0.05)] transition-colors"
      aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
    >
      {/* Cart icon */}
      <svg className="w-5 h-5 text-[#F2EDDF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0 }}
            animate={{ scale: pulse ? [1, 1.3, 1] : 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
            data-testid="cart-badge"
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#C9933A] text-black text-[10px] font-bold rounded-full leading-none"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
