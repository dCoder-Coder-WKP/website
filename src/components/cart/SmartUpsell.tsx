'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Extra } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartUpsell() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const [suggestion, setSuggestion] = useState<Extra | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Simulated AI/Smart logic to suggest an item based on cart
  useEffect(() => {
    // If cart has items but no drinks/desserts, suggest a premium pairing
    if (items.length > 0) {
      const hasDessert = items.some(i => i.type === 'extra' && (i.name.includes('Mousse') || i.name.includes('Bebinca')));
      const hasStarter = items.some(i => i.type === 'extra' && (i.name.includes('Garlic') || i.name.includes('Wings')));
      
      if (!hasDessert) {
        setSuggestion({
          id: 'upsell-dessert',
          name: 'Serradura Gold',
          category: 'dessert',
          price: 250,
          isSoldOut: false,
          dietary: 'veg'
        });
      } else if (!hasStarter) {
        setSuggestion({
          id: 'upsell-starter',
          name: 'Truffle Garlic Bread',
          category: 'starter',
          price: 190,
          isSoldOut: false,
          dietary: 'veg'
        });
      } else {
        setSuggestion({
          id: 'upsell-drink',
          name: 'Artisanal Kombucha',
          category: 'starter', // treating drinks as sides for schema simplicity right now
          price: 150,
          isSoldOut: false,
          dietary: 'veg'
        });
      }
    } else {
      setSuggestion(null);
    }
  }, [items]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (addedFeedback) {
      timer = setTimeout(() => setAddedFeedback(false), 1500);
    }
    return () => clearTimeout(timer);
  }, [addedFeedback]);

  const handleAdd = () => {
    if (!suggestion) return;
    addItem({
      key: `extra-${suggestion.id}`,
      type: 'extra',
      name: suggestion.name,
      unitPrice: suggestion.price,
      quantity: 1
    });
    setAddedFeedback(true);
  };

  if (!suggestion || items.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-luxury p-6 mt-6 border border-accent-gold/20 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-accent-gold mb-1 block">
            Curated Pairing
          </span>
          <h4 className="font-serif text-lg text-text-primary mb-1">
            {suggestion.name}
          </h4>
          <span className="font-sans text-xs text-text-muted">
            +₹{suggestion.price}
          </span>
        </div>
        
        <button
          onClick={handleAdd}
          className={`btn-luxury !px-4 !py-2 text-xs transition-all duration-medium min-w-[80px] ${
            addedFeedback ? 'bg-green-800/20 text-green-400 border-green-800/40' : ''
          }`}
        >
          <AnimatePresence mode="wait">
            {addedFeedback ? (
              <motion.span 
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Added ✓
              </motion.span>
            ) : (
              <motion.span 
                key="add"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Add
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
