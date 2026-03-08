'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationStepProps {
  onConfirm: (address: string, mapsLink?: string) => void;
}

export default function LocationStep({ onConfirm }: LocationStepProps) {
  const [geo, trigger] = useGeolocation();
  const [showEdit, setShowEdit] = useState(false);
  const [localAddress, setLocalAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    if (geo.status === 'success') {
      setLocalAddress(geo.address);
    }
  }, [geo]);

  // ── Loading / Idle ──
  if (geo.status === 'idle' || geo.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative w-16 h-16 mb-8">
           <motion.div
             className="absolute inset-0 rounded-full border-2 border-accent-gold/20"
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
           />
           <motion.div
             className="absolute inset-4 rounded-full bg-accent-gold"
             animate={{ scale: [0.8, 1.2, 0.8] }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
           />
        </div>
        <h3 className="font-serif text-xl text-text-primary italic mb-2">Establishing Coordinates</h3>
        <p className="font-sans text-[10px] tracking-luxury text-text-muted uppercase">Precision logistics in progress</p>
      </div>
    );
  }

  // ── Error → Manual Input ──
  if (geo.status === 'error') {
    return (
      <div className="space-y-8">
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
          <p className="font-sans text-[11px] text-red-400 font-light leading-relaxed">
            Logistics detection unavailable. Please provide your delivery coordinates manually for our artisans.
          </p>
        </div>

        <div className="space-y-3">
          <label htmlFor="manual-address" className="block font-sans text-[10px] text-text-muted uppercase tracking-luxury pl-1">
            Delivery Destination
          </label>
          <textarea
            id="manual-address"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Structure, Street, Suite..."
            rows={4}
            className="w-full bg-bg-surface/50 border border-border-refined rounded-2xl px-5 py-4 text-sm text-text-primary placeholder-text-muted/30 focus:outline-none focus:border-accent-gold/40 resize-none transition-all duration-medium font-light"
          />
        </div>

        <button
          onClick={() => onConfirm(manualAddress)}
          disabled={manualAddress.trim().length === 0}
          className={`btn-luxury w-full !h-14 transition-all duration-medium ${
            manualAddress.trim().length === 0 ? 'opacity-20 grayscale cursor-not-allowed' : ''
          }`}
        >
          Confirm Coordinates
        </button>
      </div>
    );
  }

  // ── Success ──
  return (
    <div className="space-y-8">
      <div className="bg-bg-surface/50 border border-border-refined rounded-2xl p-6 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
        
        <div className="flex items-start justify-between mb-6 relative z-10">
          <span className="font-sans text-[10px] text-text-muted uppercase tracking-luxury">Detected Destination</span>
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="font-sans text-[10px] text-accent-gold uppercase tracking-luxury hover:text-white transition-colors"
          >
            {showEdit ? 'Cancel' : 'Modify'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showEdit ? (
            <motion.div
              key="edit-area"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <textarea
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                rows={4}
                className="w-full bg-bg-base/50 border border-border-refined rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/40 resize-none transition-all font-light"
              />
            </motion.div>
          ) : (
            <motion.p 
              key="display-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base text-text-primary font-light leading-relaxed relative z-10"
            >
              {localAddress}
            </motion.p>
          )}
        </AnimatePresence>

        {geo.mapsLink && !showEdit && (
          <a
            href={geo.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-sans text-[10px] text-accent-gold mt-6 hover:text-white transition-all group/link"
          >
            <span className="w-6 h-[1px] bg-accent-gold/30 group-hover/link:w-10 group-hover/link:bg-accent-gold transition-all" />
            Precise Location on Maps
          </a>
        )}
      </div>

      <button
        onClick={() => onConfirm(localAddress, geo.mapsLink)}
        disabled={localAddress.trim().length === 0}
        className={`btn-luxury w-full !h-14 transition-all duration-medium ${
          localAddress.trim().length === 0 ? 'opacity-20 grayscale cursor-not-allowed' : ''
        }`}
      >
        Confirm Logistics
      </button>
    </div>
  );
}
