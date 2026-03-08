'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="w-12 h-12 relative flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-53SOzTlL8Xd7PWYcK0fpgSVmD7tP41.png"
            alt="We Knead Pizza Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#menu" className="text-foreground/70 hover:text-accent transition-colors duration-300">
            Menu
          </a>
          <a href="#dough" className="text-foreground/70 hover:text-accent transition-colors duration-300">
            Craft
          </a>
          <a href="#reserve" className="text-foreground/70 hover:text-accent transition-colors duration-300">
            Reserve
          </a>
        </div>

        <button className="px-6 py-2 bg-accent text-primary rounded-sm text-sm font-medium hover:bg-accent/90 transition-colors duration-300">
          Book Table
        </button>
      </div>
    </nav>
  );
}
