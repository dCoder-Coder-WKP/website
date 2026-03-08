"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

export default function VillaConciergePage() {
  return (
    <div className="min-h-screen bg-luxury-aldona-lush p-8 pt-24 font-sans text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl text-center"
      >
        <span className="mb-4 inline-block rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-2 text-sm font-medium tracking-widest text-accent-gold uppercase">
          Exclusive to Aldona residents
        </span>
        <h1 className="mb-6 font-serif text-6xl font-bold leading-tight md:text-8xl">
          Villa-to-Table <br />
          <span className="text-accent-gold italic">Concierge</span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-river-silk">
          The artisanal soul of Carona, delivered with white-glove precision. 
          Private waiter service, custom terroir menus, and silent logistics for your sanctuary.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <GlassCard intensity="high" className="flex flex-col items-center p-12 text-center">
          <div className="mb-6 rounded-full bg-accent-gold/10 p-6 text-accent-gold">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h3 className="mb-4 font-serif text-3xl font-bold">Artisanal White-Glove</h3>
          <p className="text-river-silk">
            Full waiter service at your villa. We don’t just deliver; we plate and serve with cinematic elegance.
          </p>
        </GlassCard>

        <GlassCard intensity="high" className="flex flex-col items-center p-12 text-center">
          <div className="mb-6 rounded-full bg-accent-gold/10 p-6 text-accent-gold">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.883.128-1.735.366-2.54"
              />
            </svg>
          </div>
          <h3 className="mb-4 font-serif text-3xl font-bold">Terroir Selection</h3>
          <p className="text-river-silk">
            Exclusive access to ingredients sourced within 5km of Aldona. Wild mushrooms, village chorizo, and local feni reductions.
          </p>
        </GlassCard>

        <GlassCard intensity="high" className="flex flex-col items-center p-12 text-center">
          <div className="mb-6 rounded-full bg-accent-gold/10 p-6 text-accent-gold">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="mb-4 font-serif text-3xl font-bold">Silent Logistics</h3>
          <p className="text-river-silk">
            Zero noise impact. Our custom e-bikes navigate the lanes of Aldona in perfect silence, preserving the village peace.
          </p>
        </GlassCard>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-auto mt-24 max-w-3xl text-center"
      >
        <button className="group relative overflow-hidden rounded-full border-2 border-accent-gold bg-transparent px-12 py-5 font-serif text-2xl font-bold text-accent-gold transition-all hover:bg-accent-gold hover:text-luxury-aldona-lush">
          <span className="relative z-10 uppercase tracking-widest">Verify My Villa</span>
          <div className="absolute inset-x-0 bottom-0 top-full bg-accent-gold transition-all group-hover:top-0" />
        </button>
        <p className="mt-6 text-sm text-river-silk opacity-60">
          *Access is strictly limited to verified property owners in the Aldona/Carona ward.
        </p>
      </motion.div>
    </div>
  );
}
