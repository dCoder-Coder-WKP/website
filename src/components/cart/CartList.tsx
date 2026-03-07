'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import CartItem from './CartItem';
import Link from 'next/link';

export default function CartList() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 mb-6 rounded-full bg-[#111009] flex items-center justify-center border border-[rgba(242,237,223,0.05)]">
          <svg className="w-8 h-8 text-[#8C7E6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-[#F2EDDF] mb-2">Your cart is empty</h2>
        <p className="text-[#8C7E6A] text-sm mb-8 max-w-sm">
          Looks like you haven&apos;t added any pizzas yet. Let&apos;s get some dough rolling!
        </p>
        <Link 
          href="/menu"
          className="px-8 py-3 bg-[#C9933A] text-black font-semibold rounded-full hover:bg-[#e5aa47] transition-colors"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <CartItem key={item.key} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}
