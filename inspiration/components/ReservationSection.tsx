'use client';

import { useRef, useEffect, useState } from 'react';

export function ReservationSection() {
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
    <section id="reserve" ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-card border border-border rounded-lg p-12 text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <span className="text-accent text-sm font-medium tracking-widest uppercase">Experience the Craft</span>
          <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-foreground mt-4 mb-6 text-balance">
            Reserve Your Table
          </h2>
          <p className="text-foreground/60 text-lg mb-10 max-w-2xl mx-auto">
            Join us for an unforgettable evening of exquisite pizza and premium wines. Limited seating ensures an intimate experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-accent text-primary font-medium rounded-sm hover:bg-accent/90 transition-all duration-300">
              Book a Table
            </button>
            <button className="px-8 py-4 border border-accent text-accent font-medium rounded-sm hover:bg-accent/10 transition-all duration-300">
              View Hours & Location
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
            <div>
              <div className="text-2xl font-serif italic font-bold text-accent mb-2">45+</div>
              <p className="text-foreground/60 text-sm">Pizza Varieties</p>
            </div>
            <div>
              <div className="text-2xl font-serif italic font-bold text-accent mb-2">120</div>
              <p className="text-foreground/60 text-sm">Seating Capacity</p>
            </div>
            <div>
              <div className="text-2xl font-serif italic font-bold text-accent mb-2">Award-Winning</div>
              <p className="text-foreground/60 text-sm">Pizzeria</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
