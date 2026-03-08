'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { builderReducer, initialBuilderState, calculateTotal, buildCartKey } from '@/lib/builderUtils';
import { useCartStore } from '@/store/useCartStore';
import { Topping } from '@/types';
import { TOPPINGS } from '@/lib/menuData';
import ToppingPanel from './ToppingPanel';import PizzaIllustration from '@/components/pizza/PizzaIllustration';
import { motion, AnimatePresence } from 'framer-motion';

export default function PizzaBuilder({ toppings = TOPPINGS as Topping[] }: { toppings?: Topping[] } = {}) {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (addedFeedback) {
      const t = setTimeout(() => setAddedFeedback(false), 2000);
      return () => clearTimeout(t);
    }
  }, [addedFeedback]);

  const handleAddToCart = () => {
    const total = calculateTotal(state, toppings);
    const key = buildCartKey(state);
    addItem({
      key,
      type: 'custom',
      name: 'Custom Pizza',
      toppings: Array.from(state.selectedToppings),
      size: state.selectedSize,
      unitPrice: total,
      quantity: state.quantity,
    });
    setAddedFeedback(true);
  };

  const toppingIds = Array.from(state.selectedToppings);
  const totalAmount = calculateTotal(state, toppings) * state.quantity;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-bg-base">
      {/* Cinematic Visual Anchor (Fixed/Sticky) */}
      <div className="sticky top-0 z-10 h-[50svh] lg:h-screen lg:w-1/2 lg:sticky lg:top-0 bg-bg-base flex items-center justify-center p-8 lg:p-20 border-b lg:border-b-0 lg:border-r border-border-refined overflow-hidden">
        {/* Ambient Glow behind the pizza */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square w-[80%] bg-accent-gold-glow opacity-30 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          className="relative z-10 w-full h-full flex items-center justify-center"
          animate={{ scale: state.selectedSize === 'small' ? 0.85 : state.selectedSize === 'large' ? 1.15 : 1.0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <PizzaIllustration
            toppingIds={toppingIds}
            size="builder"
            pizzaSize={state.selectedSize}
            animate={true}
            interactive={true}
            seed={42}
            className="drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
          />
        </motion.div>

        {/* Brand Accent */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <p className="font-serif text-[10px] tracking-luxury text-text-muted uppercase">Configurator v1.0</p>
        </div>
      </div>

      {/* Configuration Suite */}
      <div className="flex-1 lg:w-1/2 px-6 py-12 lg:px-16 lg:py-24 pb-[120px] lg:pb-32 overflow-y-visible">
        <header className="mb-12">
          <span className="font-sans text-[10px] tracking-luxury text-accent-gold uppercase mb-3 block">Bespoke Creation</span>
          <h2 className="heading-hero text-text-primary mb-4 italic">Craft Your Pizza</h2>
          <p className="font-sans text-text-secondary text-lg font-light leading-relaxed max-w-md">
            The ultimate expression of culinary freedom. Select each ingredient with intentionality to create your masterpiece.
          </p>
        </header>

        <ToppingPanel state={state} dispatch={dispatch} onAddToCart={handleAddToCart} toppings={toppings} />
      </div>

      {/* Floating Global Summary Bar (Desktop & Mobile Refined) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:left-1/2 lg:right-0 bg-bg-surface/90 backdrop-blur-xl border-t border-border-refined px-6 py-5 lg:px-12 shadow-2xl"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <div>
              <p className="font-sans text-[10px] tracking-luxury text-text-muted uppercase mb-1">Total Investment</p>
              <p className="font-sans text-2xl text-text-primary font-light">₹{totalAmount.toLocaleString()}</p>
            </div>
            
            <div className="hidden md:block h-8 w-[1px] bg-border-subtle" />
            
            <div className="hidden md:block">
              <p className="font-sans text-[10px] tracking-luxury text-text-muted uppercase mb-1">Selection</p>
              <p className="font-sans text-xs text-text-secondary font-medium uppercase tracking-widest leading-none">
                {state.selectedSize} • {toppingIds.length} Toppings
              </p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`btn-luxury !px-12 h-12 flex items-center justify-center min-w-[160px] transition-all duration-medium ${
              addedFeedback ? 'bg-green-800/20 text-green-400 border-green-800/40' : ''
            }`}
          >
            <AnimatePresence mode="wait">
              {addedFeedback ? (
                <motion.span 
                  key="added" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  Added <span className="text-[10px] mb-0.5">✓</span>
                </motion.span>
              ) : (
                <motion.span 
                  key="add" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
                  Acquire Craft
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
