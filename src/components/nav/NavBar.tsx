'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CartBadge from './CartBadge';
import MobileDrawer from './MobileDrawer';

const NAV_LINKS = [
  { href: '/menu', label: 'Menu' },
  { href: '/build', label: 'Build Your Pizza' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Non-homepage routes always show frosted glass
  const alwaysScrolled = pathname !== '/';
  const showFrosted = alwaysScrolled || isScrolled;

  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.85);
    };

    window.addEventListener('scroll', handler, { passive: true });
    // Run once on mount
    handler();

    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: showFrosted ? 'rgba(10,7,5,0.85)' : 'rgba(0,0,0,0)',
          backdropFilter: showFrosted ? 'blur(20px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 lg:px-12 h-[70px]"
        data-testid="navbar"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-lg text-[#F2EDDF] tracking-tight hover:text-[#C9933A] transition-colors"
          aria-label="We Knead Pizza — Home"
        >
          We Knead Pizza
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-[#C9933A]'
                    : 'text-[#8C7E6A] hover:text-[#F2EDDF]'
                }`}
              >
                {label}
              </Link>
            );
          })}

          <CartBadge />
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <CartBadge />

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="p-2 text-[#8C7E6A] hover:text-[#F2EDDF] transition-colors"
            data-testid="hamburger-btn"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </motion.nav>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
