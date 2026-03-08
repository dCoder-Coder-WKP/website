'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, CartItem as CartItemType } from '@/store/useCartStore';
import PizzaIllustration from '@/components/pizza/PizzaIllustration';
import { TOPPINGS } from '@/lib/menuData';

export interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [expanded, setExpanded] = useState(false);

  const isPizza = item.type === 'pizza' || item.type === 'custom';
  const hasToppings = item.toppings && item.toppings.length > 0;
  
  const toppingNames = (item.toppings || []).map(id => {
    const t = TOPPINGS.find(tp => tp.id === id);
    return t ? t.name : id;
  });

  const handleDecrement = () => {
    if (item.quantity <= 1) {
      removeItem(item.key);
    } else {
      updateQuantity(item.key, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.key, item.quantity + 1);
  };

  return (
    <motion.div
      layout
      className="surface-luxury p-5 flex flex-col gap-5 hover:border-accent-gold-glow transition-all duration-medium group"
    >
      <div className="flex gap-6">
        {/* Thumbnail Visual */}
        <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-bg-base rounded-2xl border border-border-refined overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:border-accent-gold/20 transition-all">
          {isPizza ? (
            <div className="transform scale-110">
              <PizzaIllustration 
                toppingIds={item.toppings || []} 
                size="thumb" 
                animate={false}
                interactive={false}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-accent-gold/40">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 to-transparent pointer-events-none" />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col py-1">
          <header className="flex justify-between items-start mb-1">
            <h3 className="font-serif text-xl lg:text-2xl text-text-primary group-hover:text-accent-gold transition-colors duration-medium">
              {item.name}
            </h3>
            <button
              onClick={() => removeItem(item.key)}
              className="text-text-muted hover:text-red-400 transition-colors p-1"
              aria-label="Remove item"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex flex-wrap gap-2 mb-auto">
            {isPizza && item.size && (
              <span className="font-sans text-[9px] tracking-luxury text-accent-gold uppercase border border-accent-gold/20 px-2 py-0.5 rounded-full">
                {item.size}
              </span>
            )}
            <span className="font-sans text-[9px] tracking-luxury text-text-muted uppercase px-2 py-0.5 border border-border-subtle rounded-full">
              Item Ref: {item.key.split('-')[0]}
            </span>
          </div>

          <footer className="flex items-end justify-between mt-4">
            <div className="flex flex-col">
              <span className="font-sans text-[10px] tracking-widest text-text-muted uppercase mb-0.5">Subtotal</span>
              <p className="font-sans text-lg text-text-primary font-light">₹{(item.unitPrice * item.quantity).toLocaleString()}</p>
            </div>
            
            {/* Quantity Interaction */}
            <div className="flex items-center bg-bg-base rounded-full border border-border-refined px-1 h-9">
              <button
                onClick={handleDecrement}
                className="w-9 h-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors disabled:opacity-20"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center text-xs font-medium text-text-primary tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-9 h-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Auxiliary Information Accordion (Toppings) */}
      {(item.type === 'custom' || item.type === 'pizza') && hasToppings && (
        <div className="pt-4 border-t border-border-refined">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3 text-xs text-accent-gold group/btn transition-colors"
            aria-expanded={expanded}
          >
            <span className="uppercase tracking-[0.2em] font-medium">{expanded ? 'Conceal Components' : 'Reveal Components'}</span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="pt-0.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 py-5 pl-1">
                  {toppingNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                       <div className="w-1 h-1 rounded-full bg-accent-gold/30 group-hover/item:bg-accent-gold transition-colors" />
                       <span className="text-[11px] text-text-secondary font-light tracking-wide">{name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
