'use client';

import React from 'react';
import { Pizza } from '@/types';
import PizzaCard from './PizzaCard';

export interface MenuGridProps {
    pizzas: Pizza[];
}

export default function MenuGrid({ pizzas }: MenuGridProps) {
    return (
        <section className="mb-24 w-full">
            <h2 className="font-serif text-3xl text-[#F2EDDF] mb-8 section-label">Classic & Premium Pizzas</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pizza-grid">
                {pizzas.map((pizza) => (
                    <div key={pizza.id} className="pizza-card-wrapper">
                        <PizzaCard pizza={pizza} />
                    </div>
                ))}
            </div>
        </section>
    );
}
