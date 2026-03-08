'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReservationSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="reserve" ref={sectionRef} className="py-24 lg:py-32 bg-bg-base/50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className={`surface-luxury rounded-2xl p-8 lg:p-16 text-center transition-all duration-ultra ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <span className="text-accent-gold text-[10px] tracking-luxury uppercase font-sans block mb-4">Join the Family</span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-text-primary mt-4 mb-8 text-balance">
            Craving a Slice?
          </h2>
          <p className="text-text-secondary font-sans font-light text-sm leading-relaxed mb-12 max-w-2xl mx-auto">
            Takeout, delivery, and exclusive dine-in experiences available daily from 5 PM to 9 PM. Proudly serving the community from our home in Carona, Goa under the guidance of our owner, Willie Fernandes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/menu" className="btn-luxury px-10 py-4 text-xs">
              Explore Menu
            </Link>
            <a 
              href="https://wa.me/918484802540" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-4 border border-border-refined text-text-primary font-sans text-xs tracking-luxury uppercase hover:border-accent-gold hover:text-accent-gold transition-all duration-medium bg-black/20"
            >
              Contact via WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-border-refined">
            <div>
              <div className="text-xl font-serif italic text-text-primary mb-2">Location</div>
              <p className="text-text-muted font-sans text-xs font-light tracking-wide uppercase">Carona, Goa</p>
            </div>
            <div>
              <div className="text-xl font-serif italic text-text-primary mb-2">Hours</div>
              <p className="text-text-muted font-sans text-xs font-light tracking-wide uppercase">5 PM — 9 PM Daily</p>
            </div>
            <div>
              <div className="text-xl font-serif italic text-text-primary mb-2">FSSAI Registration</div>
              <p className="text-text-muted font-sans text-xs font-light tracking-wide uppercase">20621001001228</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
