'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MenuGrid from '@/components/menu/MenuGrid';
import ExtrasSection from '@/components/menu/ExtrasSection';
import { PIZZAS, EXTRAS } from '@/lib/menuData';

gsap.registerPlugin(ScrollTrigger);

export default function MenuPage() {
    const containerRef = useRef<HTMLDivElement>(null);

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

    }, { scope: containerRef });

    const starters = EXTRAS.filter(e => e.category === 'starter');
    const desserts = EXTRAS.filter(e => e.category === 'dessert');

    return (
        <main ref={containerRef} className="min-h-screen bg-[#0A0705] pt-24 pb-20 px-6 lg:px-12 xl:px-20 overflow-x-hidden">
            {/* Header / Navigation Back */}
            <div className="max-w-7xl mx-auto mb-16 flex items-center justify-between">
                <div>
                    <Link href="/" className="inline-flex items-center text-[#8C7E6A] hover:text-[#C9933A] transition-colors mb-4 font-sans text-sm uppercase tracking-widest">
                        ← Back to Home
                    </Link>
                    <h1 className="font-serif text-[48px] lg:text-[72px] leading-[1.0] text-[#F2EDDF] tracking-[-0.02em]">
                        Our Menu
                    </h1>
                </div>
                
                <Link href="/cart" className="hidden sm:flex items-center justify-center bg-[#C9933A] text-black px-6 py-3 rounded-full font-semibold hover:bg-white transition-colors">
                    View Cart
                </Link>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Pizza Grid */}
                <MenuGrid pizzas={PIZZAS} />

                {/* Starters */}
                {starters.length > 0 && <ExtrasSection items={starters} category="starter" />}

                {/* Desserts */}
                {desserts.length > 0 && <ExtrasSection items={desserts} category="dessert" />}
            </div>

            {/* Mobile Fixed Cart Banner */}
            <div className="fixed sm:hidden bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0705] via-[#0A0705] to-transparent z-50">
                <Link href="/cart" className="flex items-center justify-center w-full bg-[#C9933A] text-black px-6 py-4 rounded-full font-semibold shadow-2xl">
                    View Cart
                </Link>
            </div>
        </main>
    );
}
