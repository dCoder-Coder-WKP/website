'use client';

import React from 'react';
import { BuilderState, BuilderAction, CUSTOM_BASE_PRICE } from '@/lib/builderUtils';
import { Size, Topping } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToppingPanelProps {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  onAddToCart: () => void;
  toppings: Topping[];
}

export default function ToppingPanel({ state, dispatch, toppings }: ToppingPanelProps) {
  // Group toppings by category
  const categories = new Map<string, Topping[]>();
  toppings.forEach((t) => {
    const list = categories.get(t.category) || [];
    list.push(t);
    categories.set(t.category, list);
  });

  return (
    <div className="flex flex-col gap-16">
      {/* Size Palette (Refined minimalist toggle) */}
      <section>
        <header className="flex justify-between items-end mb-6">
          <h3 className="font-serif text-xl text-text-primary italic">Foundation Size</h3>
          <span className="font-sans text-[10px] tracking-luxury text-text-muted uppercase">Base included</span>
        </header>
        <div className="grid grid-cols-3 bg-bg-base rounded-full border border-border-refined p-1.5 overflow-hidden">
          {(['small', 'medium', 'large'] as Size[]).map((size) => (
            <button
              key={size}
              onClick={() => dispatch({ type: 'SET_SIZE', size })}
              className={`py-3 px-4 text-[10px] uppercase tracking-luxury rounded-full transition-all duration-medium font-medium ${
                state.selectedSize === size
                  ? 'bg-accent-gold text-black shadow-lg shadow-accent-gold/20'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <span className="block mb-0.5">{size}</span>
              <span className="text-[9px] opacity-60 font-light">₹{CUSTOM_BASE_PRICE[size]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Ingredient Curation Categories */}
      <div className="space-y-16">
        {Array.from(categories.entries()).map(([category, toppings], catIdx) => (
          <motion.section 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1, duration: 0.6 }}
          >
            <header className="flex items-center gap-4 mb-8">
              <h4 className="font-serif text-lg text-text-primary lowercase tracking-tight italic">
                {category}s
              </h4>
              <div className="flex-1 h-[1px] bg-border-subtle" />
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toppings.map((topping) => {
                const isSelected = state.selectedToppings.has(topping.id);
                const price = topping.prices[state.selectedSize];
                return (
                  <button
                    key={topping.id}
                    onClick={() => dispatch({ type: 'TOGGLE_TOPPING', id: topping.id })}
                    disabled={topping.isSoldOut}
                    className={`group w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-medium border border-border-refined ${
                      isSelected
                        ? 'bg-accent-gold-glow/10 border-accent-gold/40'
                        : topping.isSoldOut
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-bg-surface/50 hover:border-accent-gold/20'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-4">
                      {/* Premium Custom Radio/Checkbox */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-medium ${
                          isSelected ? 'bg-accent-gold border-accent-gold scale-110' : 'border-border-refined'
                        }`}
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              exit={{ scale: 0 }}
                              className="w-1.5 h-1.5 bg-black rounded-full" 
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span className={`text-sm tracking-wide font-light transition-colors ${isSelected ? 'text-text-primary font-medium' : 'text-text-secondary'} ${topping.isSoldOut ? 'line-through' : ''}`}>
                        {topping.name}
                      </span>
                    </div>
                    {topping.isSoldOut ? (
                      <span className="font-sans text-[10px] tracking-widest text-red-400">SOLD OUT</span>
                    ) : (
                      <span className={`font-sans text-[10px] tracking-widest ${price === 0 ? 'text-green-500/80' : 'text-text-muted'}`}>
                        {price === 0 ? 'EST.' : `+₹${price}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Global Reset (Minimal luxury) */}
      <footer className="pt-12 border-t border-border-refined">
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="font-sans text-[10px] tracking-[0.3em] text-text-muted hover:text-accent-gold transition-colors duration-medium uppercase mx-auto block"
        >
          Reset Configuration
        </button>
        
        {/* Quantity Selection (Premium) */}
        <div className="flex items-center justify-center gap-8 mt-12 bg-bg-base/30 rounded-2xl p-6 border border-dashed border-border-refined">
           <span className="font-serif text-sm text-text-muted italic">Batch Quantity</span>
           <div className="flex items-center bg-bg-base/50 rounded-full border border-border-refined px-1 h-10">
            <button
              onClick={() => dispatch({ type: 'SET_QUANTITY', qty: state.quantity - 1 })}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-20 transition-colors"
              disabled={state.quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-medium text-text-primary tabular-nums">{state.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'SET_QUANTITY', qty: state.quantity + 1 })}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
