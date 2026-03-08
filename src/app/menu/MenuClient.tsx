'use client';

import React, { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MenuGrid from '@/components/menu/MenuGrid';
import ExtrasSection from '@/components/menu/ExtrasSection';
import { Pizza, Extra, Topping } from '@/types';

gsap.registerPlugin(ScrollTrigger);

type DietaryFilter = 'any' | 'veg' | 'non-veg';

interface MenuClientProps {
    pizzas: Pizza[];
    extras: Extra[];
    toppings?: Topping[];
}

export default function MenuClient({ pizzas, extras, toppings }: MenuClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<DietaryFilter>('any');

    useGSAP(() => {
        // Animate section labels
        const labels = gsap.utils.toArray('.section-label');
        labels.forEach((label) => {
            gsap.fromTo(label as Element, 
                { opacity: 0, y: 20 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: label as Element,
                        start: 'top 85%',
                    }
                }
            );
        });

        // Animate Pizza Cards
        const pizzaWrappers = gsap.utils.toArray('.pizza-card-wrapper');
        if (pizzaWrappers.length > 0) {
            gsap.fromTo(pizzaWrappers,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.pizza-grid',
                        start: 'top 85%',
                    }
                }
            );
        }

        // Animate Extras Cards
        const extraSections = gsap.utils.toArray('.extras-section');
        extraSections.forEach((section) => {
            const cards = (section as Element).querySelectorAll('.extras-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section as Element,
                            start: 'top 85%',
                        }
                    }
                );
            }
        });

    }, { scope: containerRef, dependencies: [filter, pizzas, extras] });

    // Derive filtered lists
    const filteredPizzas = useMemo(() => 
        pizzas.filter(p => filter === 'any' || p.dietary === filter),
    [filter, pizzas]);
    
    const starters = useMemo(() => 
        extras.filter(e => e.category === 'starter' && (filter === 'any' || e.dietary === filter)),
    [filter, extras]);
    
    const desserts = useMemo(() => 
        extras.filter(e => e.category === 'dessert' && (filter === 'any' || e.dietary === filter)),
    [filter, extras]);

    return (
        <main ref={containerRef} className="min-h-screen bg-bg-base pt-24 pb-20 px-6 lg:px-12 xl:px-20 overflow-x-hidden">
            {/* Header / Navigation Back */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <Link href="/home" className="inline-flex items-center text-text-muted hover:text-accent-gold transition-colors mb-4 font-sans text-sm uppercase tracking-widest">
                        ← Back to Home
                    </Link>
                    <h1 className="heading-hero text-text-primary">
                        Our Menu
                    </h1>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-6">
                    <Link href="/cart" className="hidden sm:flex items-center justify-center bg-accent-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-white transition-colors duration-medium">
                        View Cart
                    </Link>
                    
                    {/* Dietary segmented control */}
                    <div className="flex items-center bg-bg-surface border border-border-refined rounded-full p-1 shadow-inner">
                        <button 
                            onClick={() => setFilter('any')}
                            className={`px-6 py-2 rounded-full font-sans text-xs uppercase tracking-luxury transition-all duration-medium ${filter === 'any' ? 'bg-accent-gold text-black shadow-lg scale-105' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('veg')}
                            className={`px-6 py-2 rounded-full font-sans text-xs uppercase tracking-luxury transition-all duration-medium flex items-center gap-2 ${filter === 'veg' ? 'bg-green-700 text-white shadow-lg scale-105' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400"></span> Veg
                        </button>
                        <button 
                            onClick={() => setFilter('non-veg')}
                            className={`px-6 py-2 rounded-full font-sans text-xs uppercase tracking-luxury transition-all duration-medium flex items-center gap-2 ${filter === 'non-veg' ? 'bg-red-800 text-white shadow-lg scale-105' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500"></span> Non-Veg
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Pizza Grid */}
                <MenuGrid pizzas={filteredPizzas} />

                {/* Starters */}
                {starters.length > 0 && <ExtrasSection items={starters} category="starter" />}

                {/* Desserts */}
                {desserts.length > 0 && <ExtrasSection items={desserts} category="dessert" />}
                
                {filteredPizzas.length === 0 && starters.length === 0 && desserts.length === 0 && (
                    <div className="text-center py-20 text-text-muted font-sans text-lg">
                        No selections found for this dietary preference.
                    </div>
                )}
            </div>

            {/* Mobile Fixed Cart Banner */}
            <div className="fixed sm:hidden bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0705] via-[#0A0705] to-transparent z-50">
                <Link href="/cart" className="flex items-center justify-center w-full bg-accent-gold text-black px-6 py-4 rounded-full font-semibold shadow-2xl">
                    View Cart
                </Link>
            </div>
        </main>
    );
}
