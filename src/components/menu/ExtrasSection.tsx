'use client';

import React, { useState, useEffect } from 'react';
import { Extra } from '@/types';
import { useCartStore } from '@/store/useCartStore';

export interface ExtrasSectionProps {
    items: Extra[];
    category: 'starter' | 'dessert';
}

export default function ExtrasSection({ items, category }: ExtrasSectionProps) {
    // Component to handle individual item state
    const ExtraCard = ({ item }: { item: Extra }) => {
        const [quantity, setQuantity] = useState(1);
        const [addedFeedback, setAddedFeedback] = useState(false);
        const addItem = useCartStore(state => state.addItem);

        useEffect(() => {
            let timer: NodeJS.Timeout;
            if (addedFeedback) {
                timer = setTimeout(() => setAddedFeedback(false), 1200);
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
            <div className="flex items-center justify-between p-4 bg-[#111009] border border-[rgba(242,237,223,0.05)] rounded-xl hover:border-[rgba(242,237,223,0.1)] transition-colors extras-card">
                <div>
                    <h4 className="font-serif text-lg text-[#F2EDDF] mb-1">{item.name}</h4>
                    <span className="font-sans text-sm text-[#C9933A]">₹{item.price}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#0A0705] rounded-full border border-[rgba(242,237,223,0.1)]">
                        <button 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="w-8 h-8 flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF] disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className="w-4 text-center text-sm font-medium text-[#F2EDDF]">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(q => q + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#8C7E6A] hover:text-[#F2EDDF]"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleAdd}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 w-24 ${
                            addedFeedback 
                            ? 'bg-[#2D8A1F] text-white' 
                            : 'bg-[#F2EDDF] text-black hover:bg-white'
                        }`}
                    >
                        {addedFeedback ? 'Added ✓' : 'Add'}
                    </button>
                </div>
            </div>
        );
    };

    const title = category === 'starter' ? 'Sides & Starters' : 'Desserts';

    return (
        <section className="mb-20 extras-section w-full">
            <h2 className="font-serif text-3xl text-[#F2EDDF] mb-8 section-label">{title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map(item => (
                    <ExtraCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
