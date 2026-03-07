'use client';

import React from 'react';
import Link from 'next/link';
import CartList from '@/components/cart/CartList';
import OrderSummary from '@/components/cart/OrderSummary';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#0A0705]">
      {/* Header */}
      <div className="px-6 lg:px-12 pt-24 pb-8 border-b border-[rgba(242,237,223,0.05)]">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="font-serif text-4xl text-[#F2EDDF] mb-2">Your Cart</h1>
            <p className="text-[#8C7E6A] text-sm">Review your selections before ordering</p>
          </div>
          <Link
            href="/menu"
            className="hidden lg:inline-flex items-center text-[#8C7E6A] hover:text-[#C9933A] transition-colors font-sans text-sm uppercase tracking-widest"
          >
            ← Back to Menu
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Main List */}
          <div className="flex-1">
            <CartList />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[400px]">
             <OrderSummary />
          </div>
        </div>

        {/* Mobile back link */}
        <div className="mt-12 text-center lg:hidden">
          <Link
            href="/menu"
            className="inline-flex py-3 px-6 bg-[#111009] rounded-full items-center text-[#8C7E6A] hover:text-[#C9933A] transition-colors font-sans text-xs uppercase tracking-widest"
          >
            ← Back to Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
