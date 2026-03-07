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
  
  // Map topping IDs to readable names
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
      className="bg-[#111009] border border-[rgba(242,237,223,0.05)] rounded-xl p-4 flex flex-col gap-4"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        {isPizza ? (
          <PizzaIllustration 
            toppingIds={item.toppings || []} 
            size="thumb" 
            animate={false}
            interactive={false}
            className="w-[72px] h-[72px] flex-shrink-0"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-md bg-[#0A0705] border border-[rgba(242,237,223,0.05)] flex items-center justify-center text-[#C9933A]">
            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        )}

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-lg text-[#F2EDDF] leading-tight">{item.name}</h3>
              <button
                onClick={() => removeItem(item.key)}
                className="text-[#8C7E6A] hover:text-[#E8220A] transition-colors p-1"
                aria-label="Remove item"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {isPizza && item.size && (
              <p className="text-xs text-[#8C7E6A] uppercase tracking-wider mt-1 border border-[rgba(242,237,223,0.1)] inline-block px-2 py-0.5 rounded-sm">
                {item.size}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between mt-3">
            <p className="font-semibold text-[#F2EDDF]">₹{item.unitPrice * item.quantity}</p>
            
            {/* Quantity Control */}
            <div className="flex items-center bg-[#0A0705] rounded-full border border-[rgba(242,237,223,0.1)] h-8">
              <button
                onClick={handleDecrement}
                className="w-8 h-full flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF] transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-5 text-center text-xs font-medium text-[#F2EDDF]">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-8 h-full flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF] transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion for custom toppings */}
      {item.type === 'custom' && hasToppings && (
        <div className="pt-2 border-t border-[rgba(242,237,223,0.05)]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs text-[#C9933A] hover:text-[#e5aa47] transition-colors"
            aria-expanded={expanded}
          >
            <span className="uppercase tracking-widest font-semibold">{expanded ? 'Hide toppings' : 'View toppings'}</span>
            <motion.svg 
              animate={{ rotate: expanded ? 180 : 0 }} 
              className="w-3 h-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <ul className="py-2 text-xs text-[#8C7E6A] space-y-1 pl-1">
                  {toppingNames.map((name, i) => (
                    <li key={i} className="flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-[rgba(242,237,223,0.2)]" />
                      {name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
