'use client';

import React, { useState, useEffect } from 'react';
import { Extra } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

export interface ExtrasSectionProps {
  items: Extra[];
  category: 'starter' | 'dessert';
}

export default function ExtrasSection({ items, category }: ExtrasSectionProps) {
  const ExtraCard = ({ item }: { item: Extra }) => {
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (addedFeedback) {
        timer = setTimeout(() => setAddedFeedback(false), 1500);
      }
      return () => clearTimeout(timer);
    }, [addedFeedback]);

    const handleAdd = () => {
      addItem({
        key: `extra-${item.id}`,
        type: 'extra',
        name: item.name,
        unitPrice: item.price,
        quantity
      });
      setAddedFeedback(true);
    };

    return (
      <div className={`surface-luxury flex items-center justify-between p-6 transition-all duration-medium group ${item.isSoldOut ? 'opacity-60 saturate-50 cursor-not-allowed' : 'hover:border-accent-gold-glow'}`}>
        <div className="flex flex-col gap-1">
          <h4 className="font-serif text-xl text-text-primary group-hover:text-accent-gold transition-colors duration-medium">
            {item.name}
          </h4>
          <span className="font-sans text-sm tracking-widest text-accent-gold/80 font-medium italic">
            ₹{item.price}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Refined Quantity Control */}
          <div className="flex items-center bg-bg-base/50 rounded-full border border-border-refined px-1 h-10">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-20 transition-colors"
              disabled={quantity <= 1}
            >
              <span className="text-sm">−</span>
            </button>
            <span className="w-5 text-center text-xs font-medium text-text-primary tabular-nums">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="text-sm">+</span>
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={item.isSoldOut}
            className={`btn-luxury !px-6 h-10 min-w-[100px] flex items-center justify-center text-xs transition-all duration-medium ${
              addedFeedback ? 'bg-green-800/20 text-green-400 border-green-800/40' : ''
            } ${item.isSoldOut ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
          >
            <AnimatePresence mode="wait">
              {addedFeedback ? (
                <motion.span 
                  key="added"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  Added ✓
                </motion.span>
              ) : (
                <motion.span 
                  key="add"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {item.isSoldOut ? 'Sold Out' : 'Add'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    );
  };

  const title = category === 'starter' ? 'Sides & Starters' : 'Desserts';

  return (
    <section className="mb-32 w-full">
      <header className="mb-12">
        <h2 className="heading-section text-text-primary mb-4 italic">
          {title}
        </h2>
        <div className="w-12 h-[1px] bg-accent-gold" />
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map(item => (
          <ExtraCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
