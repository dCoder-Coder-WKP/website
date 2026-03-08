'use client';

import { useEffect, useRef, useState } from 'react';

const pizzas = [
  {
    id: 1,
    name: 'Margherita',
    description: 'San Marzano tomato, buffalo mozzarella, fresh basil, olive oil',
    price: '680'
  },
  {
    id: 2,
    name: 'Prosciutto e Rucola',
    description: 'Tomato, mozzarella, spicy arugula, parmesan, aged balsamic',
    price: '820'
  },
  {
    id: 3,
    name: 'Quattro Formaggi',
    description: 'Mozzarella, gorgonzola, pecorino, taleggio with honey drizzle',
    price: '780'
  }
];

export function MenuSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="menu" ref={sectionRef} className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-accent text-sm font-medium tracking-widest uppercase">Signature Selection</span>
          <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-foreground mt-4 text-balance">
            Curated Pizza Collection
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pizzas.map((pizza, index) => (
            <div
              key={pizza.id}
              className={`bg-card border border-border rounded-lg p-8 hover:border-accent transition-all duration-300 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="text-5xl mb-6">🍕</div>
              <h3 className="text-2xl font-serif italic font-bold text-foreground mb-3">
                {pizza.name}
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                {pizza.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <span className="text-accent font-serif text-xl">₹{pizza.price}</span>
                <button className="text-accent hover:text-accent/80 transition-colors">
                  Add to Order →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
