'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: '/', label: 'Foundation' },
  { href: '/menu', label: 'The Collection' },
  { href: '/build', label: 'Configurator' },
  { href: '/cart', label: 'Acquisitions' },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            data-testid="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-bg-surface border-l border-border-refined z-[70] flex flex-col pt-24 pb-12 px-10 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="absolute top-8 right-8 text-text-secondary hover:text-accent-gold transition-colors p-2"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Brand mark */}
            <div className="mb-16">
              <p className="font-serif text-2xl text-text-primary tracking-tighter">
                We Knead <span className="italic">Pizza</span>
              </p>
              <div className="w-8 h-[1px] bg-accent-gold mt-2" />
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-8">
              {NAV_LINKS.map(({ href, label }, idx) => {
                const isActive = pathname === href;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`text-2xl font-serif transition-colors ${
                        isActive
                          ? 'text-accent-gold italic underline underline-offset-8 decoration-border-subtle'
                          : 'text-text-primary hover:text-accent-gold'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer mark */}
            <div className="mt-auto">
              <p className="font-sans text-[10px] tracking-luxury text-text-muted uppercase">
                Artisanal Perfection
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
