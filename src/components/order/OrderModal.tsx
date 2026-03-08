'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationStep from './LocationStep';
import WhatsAppStep from './WhatsAppStep';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ['Foundation', 'Acquisition'];

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [addressData, setAddressData] = useState<{ address: string; mapsLink?: string } | null>(null);

  const handleLocationConfirm = (address: string, mapsLink?: string) => {
    setAddressData({ address, mapsLink });
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setAddressData(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          {/* Elite Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={handleClose}
            data-testid="modal-backdrop"
          />

          {/* Luxury Modal Container */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.02, opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-bg-base/95 backdrop-blur-2xl border border-border-refined rounded-3xl overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Brand Bar */}
            <div className="px-8 pt-8 pb-6 border-b border-border-refined bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-sans text-[10px] tracking-[0.3em] text-accent-gold uppercase mb-1.5 block">Step {step} of 2</span>
                  <h2 className="font-serif text-2xl text-text-primary italic">
                    {step === 1 ? 'Logistics Foundation' : 'Acquisition Protocol'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-all group"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 transition-transform duration-medium group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Minimal Luxury Step Indicator */}
              <div className="flex gap-4">
                {STEPS.map((label, i) => {
                  const isActive = i + 1 === step;
                  const isCompleted = i + 1 < step;
                  return (
                    <div key={label} className="flex-1">
                      <div className="h-[2px] w-full bg-border-subtle relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-accent-gold"
                          initial={{ x: '-100%' }}
                          animate={{ x: isCompleted ? '0%' : isActive ? '-50%' : '-100%' }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <p className={`text-[9px] mt-2 uppercase tracking-[0.2em] font-medium transition-colors duration-medium ${
                        isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'
                      }`}>
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Chamber */}
            <div className="px-8 py-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <LocationStep onConfirm={handleLocationConfirm} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <WhatsAppStep address={addressData?.address || ''} mapsLink={addressData?.mapsLink} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer / Trust Mark */}
            <div className="px-8 py-6 bg-white/[0.01] border-t border-border-refined text-center">
               <p className="font-sans text-[9px] text-text-muted uppercase tracking-[0.3em]">
                 Artisanal Quality since 2012 — We Knead Pizza
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
