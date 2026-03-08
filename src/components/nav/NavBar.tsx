/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CartBadge from './CartBadge';
import MobileDrawer from './MobileDrawer';

const NAV_LINKS = [
  { href: '/menu', label: 'The Collection' },
  { href: '/build', label: 'Configurator' },
  { href: '/villa-concierge', label: 'Villa Concierge' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const showFrosted = pathname !== '/' || isScrolled;

  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();

    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: showFrosted ? 'rgba(8,6,4,0.8)' : 'rgba(0,0,0,0)',
          backdropFilter: showFrosted ? 'blur(20px)' : 'blur(0px)',
          borderBottomColor: showFrosted ? 'var(--border-subtle)' : 'transparent',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-[80px] border-b"
        data-testid="navbar"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-medium hover:scale-105"
          aria-label="We Knead Pizza — Home"
        >
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-53SOzTlL8Xd7PWYcK0fpgSVmD7tP41.png" 
            alt="We Knead Pizza Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-12">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-xs uppercase tracking-luxury transition-colors duration-medium font-medium ${
                  isActive
                    ? 'text-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </Link>
            );
          })}

          <CartBadge />
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-4">
          <CartBadge />

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            data-testid="hamburger-btn"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </motion.nav>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
