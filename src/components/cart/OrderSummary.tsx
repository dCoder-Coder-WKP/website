'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function OrderSummary() {
  const total = useCartStore((state) => state.total());
  const itemCount = useCartStore((state) => state.itemCount());
  const openModal = useCartStore((state) => state.openModal);
  const isEmpty = itemCount === 0;

  const deliveryFee = isEmpty ? 0 : 50; 
  const grandTotal = total + deliveryFee;

  return (
    <div className="surface-luxury p-8 sticky top-[120px] shadow-2xl overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 blur-3xl pointer-events-none" />
      
      <header className="mb-10">
        <span className="font-sans text-[10px] tracking-luxury text-accent-gold uppercase mb-3 block">Settlement Summary</span>
        <h2 className="font-serif text-3xl text-text-primary italic">Your Curation</h2>
      </header>

      <div className="space-y-6 text-sm mb-12">
        <div className="flex justify-between items-baseline">
          <span className="font-sans text-text-muted font-light tracking-wide uppercase text-[10px]">Subtotal ({itemCount} {itemCount === 1 ? 'entry' : 'entries'})</span>
          <span className="font-sans text-text-primary text-base">₹{total.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-baseline">
          <span className="font-sans text-text-muted font-light tracking-wide uppercase text-[10px]">Logistics & Delivery</span>
          {deliveryFee === 0 ? (
            <span className="font-sans text-green-500/80 font-medium tracking-widest text-[10px] uppercase">Complimentary</span>
          ) : (
            <span className="font-sans text-text-primary text-base">₹{deliveryFee}</span>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-border-refined mb-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-serif text-lg text-text-primary italic mb-1">Total Investment</span>
            <p className="font-sans text-[9px] text-text-muted uppercase tracking-[0.2em]">Guaranteed inclusive of all duties</p>
          </div>
          <div className="text-right">
            <span className="font-sans text-4xl text-accent-gold font-light tracking-tight">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={openModal}
        disabled={isEmpty}
        className={`btn-luxury w-full !h-16 flex items-center justify-center text-sm font-medium transition-all duration-medium ${
          isEmpty 
            ? 'opacity-20 grayscale cursor-not-allowed' 
            : 'hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        Proceed to Acquisition
      </button>
      
      <p className="mt-8 font-sans text-[9px] text-text-muted text-center leading-relaxed uppercase tracking-widest">
        By proceeding, you acknowledge our commitment <br /> to artisanal quality and craftsmanship.
      </p>
    </div>
  );
}
