'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Pizza, Size } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import PizzaIllustration from '@/components/pizza/PizzaIllustration';
import { motion, AnimatePresence } from 'framer-motion';

export interface PizzaCardProps {
  pizza: Pizza;
}

export default function PizzaCard({ pizza }: PizzaCardProps) {
  const [selectedSize, setSelectedSize] = useState<Size>('medium');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
  const [ghostActive, setGhostActive] = useState(false);
  
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const cartKey = `${pizza.id}-${selectedSize}`;
  const currentItem = cartItems.find(i => i.key === cartKey);
  const cartQuantity = currentItem?.quantity || 0;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (addedFeedback) {
      timeout = setTimeout(() => {
        setAddedFeedback(false);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [addedFeedback]);

  useEffect(() => {
    if (!ghostActive) return;
    const timer = setTimeout(() => setGhostActive(false), 1200);
    return () => clearTimeout(timer);
  }, [ghostActive]);

  const handleAddToCart = () => {
    addItem({
      key: cartKey,
      type: 'pizza',
      name: pizza.name,
      pizzaId: pizza.id,
      size: selectedSize,
      unitPrice: pizza.prices[selectedSize],
      quantity: 1
    });
    setAddedFeedback(true);
  };

  const handleDecrement = () => {
    if (cartQuantity > 1) {
      updateQuantity(cartKey, cartQuantity - 1);
    } else {
      updateQuantity(cartKey, 0);
    }
  };

  const handleIncrement = () => {
    updateQuantity(cartKey, cartQuantity + 1);
  };

  const handleVisualPress = () => {
    if (isSoldOut) return;
    setGhostActive(true);
  };

  const currentPrice = pizza.prices[selectedSize] * Math.max(cartQuantity, 1);
  const isSoldOut = pizza.isSoldOut;

  const illustrationVisibility = pizza.image
    ? ghostActive
      ? 'opacity-100'
      : 'opacity-0 group-hover:opacity-80'
    : 'opacity-100';

  return (
    <div className={`surface-luxury group flex flex-col h-full overflow-hidden transition-all duration-medium ${isSoldOut ? 'opacity-60 saturate-50 cursor-not-allowed' : 'hover:border-accent-gold-glow'}`}>
      {/* Visual Showcase */}
      <div
        className="relative aspect-[4/3] bg-bg-base overflow-hidden flex items-center justify-center border-b border-border-refined group-hover:border-accent-gold/20 transition-colors cursor-pointer"
        role="button"
        tabIndex={0}
        aria-pressed={ghostActive}
        aria-label={`Reveal artisan illustration for ${pizza.name}`}
        onClick={handleVisualPress}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleVisualPress();
          }
        }}
      >
        {/* Background Narrative Image */}
        {pizza.image && (
          <>
            <img 
              src={pizza.image} 
              alt={pizza.name}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] brightness-[0.8] group-hover:scale-110 group-hover:brightness-100 transition-all duration-ultra ease-out"
            />
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-bg-base/20 mix-blend-multiply" />
          </>
        )}

        {/* Fallback or Interactive Illustration */}
        <motion.div 
          className={`w-full h-full p-6 flex items-center justify-center transform-gpu z-10 transition-opacity duration-700 ${illustrationVisibility}`}
          animate={{ 
            scale: selectedSize === 'small' ? 0.85 : selectedSize === 'large' ? 1.1 : 1.0,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <PizzaIllustration 
            toppingIds={pizza.toppings} 
            size="card" 
            animate 
            interactive
            className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
        
        {/* Glossy Edge Highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Product Content */}
      <div className="p-8 flex flex-col flex-1">
        <header className="mb-6 flex-1">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="font-serif text-2xl lg:text-3xl text-text-primary tracking-tight group-hover:text-accent-gold transition-colors duration-medium leading-none">
              {pizza.name}
            </h3>
            <span className="font-sans text-sm tracking-widest text-text-muted uppercase pt-1">
              Ref. {pizza.id.slice(-4)}
            </span>
          </div>
          <p className="font-sans text-sm text-text-secondary leading-relaxed font-light line-clamp-2">
            {pizza.description}
          </p>
        </header>

        {/* Configuration Palette */}
        <div className="space-y-8 mt-auto">
          {/* Size Palette (Minimalist Toggle) */}
          <div className="flex items-center justify-center p-1 bg-bg-base rounded-full border border-border-refined">
            {(['small', 'medium', 'large'] as Size[]).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-1.5 px-3 text-[10px] uppercase tracking-luxury rounded-full transition-all duration-medium font-medium ${
                  selectedSize === size
                    ? 'bg-accent-gold text-black'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Acquisition Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-border-subtle h-[72px]">
            <div className="flex flex-col">
              <span className="font-sans text-[10px] tracking-luxury text-text-muted uppercase mb-1">Total investment</span>
              <span className="font-sans text-2xl text-text-primary font-light">
                ₹{currentPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-4 h-11">
              {cartQuantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`btn-luxury !px-8 h-full flex items-center justify-center min-w-[140px] transition-all duration-medium bg-gradient-to-r from-[#FCE39D] via-[#F7C46D] to-[#E6812F] text-neutral-900 ring-1 ring-white/15 shadow-[0_15px_45px_rgba(0,0,0,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 ${
                    addedFeedback ? 'bg-green-800/20 text-green-400 border-green-800/40' : ''
                  } ${isSoldOut ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
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
                        {isSoldOut ? 'Sold Out' : 'Order Yours'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <div className="flex items-center bg-bg-base/50 backdrop-blur-md rounded-full border border-accent-gold/40 px-1 shadow-[0_0_15px_rgba(212,175,55,0.1)] h-full overflow-hidden">
                  <button 
                    onClick={handleDecrement}
                    className="w-10 h-full flex items-center justify-center text-text-primary hover:text-accent-gold transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <span className="text-[16px] mb-[2px]">−</span>
                  </button>
                  <span className="w-8 flex items-center justify-center text-sm font-medium text-accent-gold tabular-nums h-full">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={cartQuantity}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {cartQuantity}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <button 
                    onClick={handleIncrement}
                    className="w-10 h-full flex items-center justify-center text-text-primary hover:text-accent-gold transition-colors"
                    aria-label="Increase quantity"
                  >
                    <span className="text-[16px] mb-[2px]">+</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
