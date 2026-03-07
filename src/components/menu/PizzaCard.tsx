'use client';

import React, { useState, useEffect } from 'react';
import { Pizza, Size } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import PizzaIllustration from '@/components/pizza/PizzaIllustration';

export interface PizzaCardProps {
    pizza: Pizza;
}


export default function PizzaCard({ pizza }: PizzaCardProps) {
    const [selectedSize, setSelectedSize] = useState<Size>('medium');
    const [quantity, setQuantity] = useState<number>(1);
    const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (addedFeedback) {
            timeout = setTimeout(() => {
                setAddedFeedback(false);
            }, 1200);
        }
        return () => clearTimeout(timeout);
    }, [addedFeedback]);

    const handleAddToCart = () => {
        addItem({
            key: `${pizza.id}-${selectedSize}`,
            type: 'pizza',
            name: pizza.name,
            pizzaId: pizza.id,
            size: selectedSize,
            unitPrice: pizza.prices[selectedSize],
            quantity
        });
        setAddedFeedback(true);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleIncrement = () => {
        setQuantity(q => q + 1);
    };

    return (
        <div className="flex flex-col rounded-2xl bg-[#111009] border border-[rgba(242,237,223,0.08)] overflow-hidden transition-all hover:border-[rgba(242,237,223,0.15)] hover:-translate-y-1 h-full" style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)', transitionDuration: '300ms' }}>
            {/* Pizza Illustration */}
            <div className="relative w-full h-[220px] lg:h-[260px] bg-[#0A0705] overflow-hidden flex items-center justify-center">
                <div 
                    className="w-full h-full flex items-center justify-center" 
                    style={{ 
                        transform: selectedSize === 'small' ? 'scale(0.92)' : selectedSize === 'large' ? 'scale(1.1)' : 'scale(1.0)',
                        transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)'
                    }}
                >
                    <PizzaIllustration 
                        toppingIds={pizza.toppings} 
                        size="card" 
                        animate={true}
                        interactive={true}
                        className="w-full h-[220px] lg:h-[260px]"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex-1 mb-6">
                    <h3 className="font-serif text-2xl text-[#F2EDDF] mb-2">{pizza.name}</h3>
                    <p className="font-sans text-sm text-[#8C7E6A] leading-relaxed line-clamp-2" title={pizza.description}>
                        {pizza.description}
                    </p>
                </div>

                {/* Controls Area */}
                <div className="flex flex-col gap-4">
                    {/* Size Selector */}
                    <div className="flex bg-[#0A0705] rounded-lg p-1">
                        {(['small', 'medium', 'large'] as Size[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${
                                    selectedSize === size
                                        ? 'bg-[#C9933A] text-black shadow-sm'
                                        : 'text-[#8C7E6A] hover:text-[#F2EDDF]'
                                }`}
                            >
                                {size.charAt(0)}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <span className="font-sans font-medium text-lg text-[#F2EDDF]">
                            ₹{pizza.prices[selectedSize] * quantity}
                        </span>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-[#0A0705] rounded-full border border-[rgba(242,237,223,0.1)]">
                                <button 
                                    onClick={handleDecrement}
                                    className="w-8 h-8 flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF] disabled:opacity-50"
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="w-4 text-center text-sm font-medium text-[#F2EDDF]">{quantity}</span>
                                <button 
                                    onClick={handleIncrement}
                                    className="w-8 h-8 flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF]"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    addedFeedback 
                                    ? 'bg-[#2D8A1F] text-white' 
                                    : 'bg-[#F2EDDF] text-black hover:bg-white hover:scale-105'
                                }`}
                            >
                                {addedFeedback ? 'Added ✓' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
