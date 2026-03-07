'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { builderReducer, initialBuilderState, calculateTotal, buildCartKey } from '@/lib/builderUtils';
import { useCartStore } from '@/store/useCartStore';
import ToppingPanel from './ToppingPanel';
import PizzaIllustration from '@/components/pizza/PizzaIllustration';


export default function PizzaBuilder() {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (addedFeedback) {
      const t = setTimeout(() => setAddedFeedback(false), 1500);
      return () => clearTimeout(t);
    }
  }, [addedFeedback]);

  const handleAddToCart = () => {
    const total = calculateTotal(state);
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

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-60px)]">
      {/* Pizza Illustration — sticky on mobile, fixed-width on desktop */}
      <div className="sticky top-[60px] z-10 h-[45svh] lg:h-auto lg:sticky lg:top-[60px] lg:w-1/2 lg:self-start bg-[#0A0705] flex items-center justify-center">
        <PizzaIllustration
          toppingIds={toppingIds}
          size="builder"
          pizzaSize={state.selectedSize}
          animate={true}
          interactive={false}
          seed={42}
          className="w-full h-[300px] lg:h-[480px]"
        />
      </div>

      {/* Topping Panel — scrolls independently */}
      <div className="flex-1 lg:w-1/2 px-6 py-8 lg:px-10 lg:py-10 pb-[100px] lg:pb-10 overflow-y-auto">
        <h2 className="font-serif text-3xl lg:text-4xl text-[#F2EDDF] mb-2">Build Your Pizza</h2>
        <p className="text-sm text-[#8C7E6A] mb-8">Choose your size and toppings</p>

        <ToppingPanel state={state} dispatch={dispatch} onAddToCart={handleAddToCart} />
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed lg:hidden bottom-0 left-0 right-0 z-20 bg-[#111009] border-t border-[rgba(242,237,223,0.08)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8C7E6A]">Total</p>
            <p className="font-serif text-xl text-[#F2EDDF]">₹{calculateTotal(state) * state.quantity}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
              addedFeedback
                ? 'bg-[#2D8A1F] text-white'
                : 'bg-[#F2EDDF] text-black hover:bg-white'
            }`}
          >
            {addedFeedback ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
