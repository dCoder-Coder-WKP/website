'use client';

import React from 'react';
import Link from 'next/link';
import PizzaBuilder from '@/components/builder/PizzaBuilder';

export default function BuildPage() {
  return (
    <main className="min-h-screen bg-[#0A0705] overflow-x-hidden">
      {/* Header */}
      <div className="px-6 lg:px-12 pt-20 pb-4">
        <Link
          href="/menu"
          className="inline-flex items-center text-[#8C7E6A] hover:text-[#C9933A] transition-colors font-sans text-sm uppercase tracking-widest"
        >
          ← Back to Menu
        </Link>
      </div>

      <PizzaBuilder />
    </main>
  );
}
