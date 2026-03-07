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
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/build', label: 'Build Your Pizza' },
  { href: '/cart', label: 'Cart' },
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-72 bg-[#0F0D09] border-l border-[rgba(242,237,223,0.06)] z-50 flex flex-col pt-20 pb-10 px-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="absolute top-5 right-5 text-[#8C7E6A] hover:text-[#F2EDDF] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Brand mark */}
            <p className="font-serif text-xs text-[#8C7E6A] uppercase tracking-[0.3em] mb-10">
              We Knead Pizza
            </p>

            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center py-3 pl-4 text-base transition-colors border-l-2 ${
                      isActive
                        ? 'border-[#E8540A] text-[#F2EDDF] font-medium'
                        : 'border-transparent text-[#8C7E6A] hover:text-[#F2EDDF] hover:border-[rgba(232,84,10,0.4)]'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
