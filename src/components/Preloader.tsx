'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const weRef = useRef<HTMLSpanElement>(null);
    const kneadRef = useRef<HTMLSpanElement>(null);
    const pizzaRef = useRef<HTMLSpanElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check sessionStorage
        const hasLoaded = sessionStorage.getItem('wkp-loaded');
        if (hasLoaded) {
            setIsVisible(false);
            onComplete();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                sessionStorage.setItem('wkp-loaded', 'true');
                setIsVisible(false);
                onComplete();
            },
        });

        // 0ms: black screen (initial CSS state)
        // 200ms: "We" fades in
        tl.to(weRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
        }, 0.2);

        // 400ms: "Knead" fades in
        tl.to(kneadRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
        }, 0.2 + 0.08);

        // 600ms: "Pizza" fades in
        tl.to(pizzaRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
        }, 0.2 + 0.16);

        // 800ms: thin horizontal progress bar fills
        tl.to(progressLineRef.current, {
            scaleX: 1,
            duration: 1.2,
            ease: 'power2.inOut',
        }, 0.8);

        // 2000ms: all elements scale up and fade out
        tl.to([weRef.current, kneadRef.current, pizzaRef.current, progressLineRef.current], {
            scale: 1.08,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
        }, 2.0);

        // 2400ms: overlay fades out (handled by container fade out or unmount)
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
        }, 2.4);

    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-[#0A0705] flex flex-col items-center justify-center text-[#F2EDDF]"
        >
            <div className="flex gap-4 font-serif text-[48px] lg:text-[80px] leading-tight overflow-hidden">
                <span ref={weRef} className="opacity-0 translate-y-5 block">We</span>
                <span ref={kneadRef} className="opacity-0 translate-y-5 block">Knead</span>
                <span ref={pizzaRef} className="opacity-0 translate-y-5 block">Pizza</span>
            </div>

            <div className="absolute top-[60%] w-[200px] h-[1px] bg-[rgba(242,237,223,0.15)] overflow-hidden">
                <div
                    ref={progressLineRef}
                    className="w-full h-full bg-[#C9933A] origin-left scale-x-0"
                />
            </div>
        </div>
    );
}
