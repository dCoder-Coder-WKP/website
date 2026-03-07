'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationStep from './LocationStep';
import WhatsAppStep from './WhatsAppStep';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ['Location', 'Order'];

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [addressData, setAddressData] = useState<{ address: string; mapsLink?: string } | null>(null);

  const handleLocationConfirm = (address: string, mapsLink?: string) => {
    setAddressData({ address, mapsLink });
    setStep(2);
  };

  const handleClose = () => {
    // Reset step for next open, but preserve cart
    setStep(1);
    setAddressData(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
            data-testid="modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-[#0F0D09] border border-[rgba(242,237,223,0.08)] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#0F0D09] z-10 px-6 pt-6 pb-4 border-b border-[rgba(242,237,223,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl text-[#F2EDDF]">
                    {step === 1 ? 'Delivery Location' : 'Send Order'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-[#8C7E6A] hover:text-[#F2EDDF] transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex gap-2">
                  {STEPS.map((label, i) => (
                    <div key={label} className="flex-1">
                      <motion.div
                        className="h-1 rounded-full"
                        animate={{
                          backgroundColor: i < step ? '#C9933A' : 'rgba(242,237,223,0.1)',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <p className={`text-[10px] mt-1.5 uppercase tracking-widest ${
                        i < step ? 'text-[#C9933A]' : 'text-[#8C7E6A]'
                      }`}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LocationStep onConfirm={handleLocationConfirm} />
                    </motion.div>
                  )}
                  {step === 2 && addressData && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <WhatsAppStep address={addressData.address} mapsLink={addressData.mapsLink} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
