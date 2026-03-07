'use client';

import React from 'react';
import { TOPPINGS } from '@/lib/menuData';
import { BuilderState, BuilderAction, calculateTotal, CUSTOM_BASE_PRICE } from '@/lib/builderUtils';
import { Size } from '@/types';

export interface ToppingPanelProps {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  onAddToCart: () => void;
}

export default function ToppingPanel({ state, dispatch, onAddToCart }: ToppingPanelProps) {
  const total = calculateTotal(state);

  // Group toppings by category
  const categories = new Map<string, typeof TOPPINGS>();
  TOPPINGS.forEach((t) => {
    const list = categories.get(t.category) || [];
    list.push(t);
    categories.set(t.category, list);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Size Selector */}
      <div className="mb-6">
        <h3 className="font-serif text-lg text-[#F2EDDF] mb-3">Size</h3>
        <div className="flex bg-[#0A0705] rounded-lg p-1 gap-1">
          {(['small', 'medium', 'large'] as Size[]).map((size) => (
            <button
              key={size}
              onClick={() => dispatch({ type: 'SET_SIZE', size })}
              className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${
                state.selectedSize === size
                  ? 'bg-[#C9933A] text-black shadow-sm'
                  : 'text-[#8C7E6A] hover:text-[#F2EDDF]'
              }`}
            >
              {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
              <span className="block text-xs mt-1 opacity-70">₹{CUSTOM_BASE_PRICE[size]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topping Categories */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {Array.from(categories.entries()).map(([category, toppings]) => (
          <div key={category}>
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#8C7E6A] mb-3">{category}</h4>
            <div className="space-y-2">
              {toppings.map((topping) => {
                const isSelected = state.selectedToppings.has(topping.id);
                const price = topping.prices[state.selectedSize];
                return (
                  <button
                    key={topping.id}
                    onClick={() => dispatch({ type: 'TOGGLE_TOPPING', id: topping.id })}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border ${
                      isSelected
                        ? 'bg-[#C9933A]/10 border-[#C9933A]/40 text-[#F2EDDF]'
                        : 'bg-[#111009] border-[rgba(242,237,223,0.05)] text-[#8C7E6A] hover:border-[rgba(242,237,223,0.12)]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-[#C9933A] bg-[#C9933A]' : 'border-[#8C7E6A]'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{topping.name}</span>
                    </div>
                    <span className={`text-xs font-semibold ${price === 0 ? 'text-green-500' : ''}`}>
                      {price === 0 ? 'FREE' : `+₹${price}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="mt-6 pt-6 border-t border-[rgba(242,237,223,0.08)]">
        {/* Reset */}
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="w-full py-2 mb-4 text-xs uppercase tracking-widest text-[#8C7E6A] hover:text-[#F2EDDF] transition-colors"
        >
          Reset All
        </button>

        {/* Quantity */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#8C7E6A]">Quantity</span>
          <div className="flex items-center bg-[#0A0705] rounded-full border border-[rgba(242,237,223,0.1)]">
            <button
              onClick={() => dispatch({ type: 'SET_QUANTITY', qty: state.quantity - 1 })}
              className="w-10 h-10 flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF] disabled:opacity-50"
              disabled={state.quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium text-[#F2EDDF]">{state.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'SET_QUANTITY', qty: state.quantity + 1 })}
              className="w-10 h-10 flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Total + Add */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8C7E6A] uppercase tracking-wider">Total</p>
            <p className="font-serif text-2xl text-[#F2EDDF]">₹{total * state.quantity}</p>
          </div>
          <button
            onClick={onAddToCart}
            className="px-8 py-3 rounded-full bg-[#F2EDDF] text-black font-semibold text-sm hover:bg-white hover:scale-105 transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
