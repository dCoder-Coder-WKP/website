'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationStepProps {
  onConfirm: (address: string, mapsLink?: string) => void;
}

export default function LocationStep({ onConfirm }: LocationStepProps) {
  const [geo, trigger] = useGeolocation();
  const [showEdit, setShowEdit] = useState(false);
  const [localAddress, setLocalAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  // Auto-trigger on mount
  useEffect(() => {
    trigger();
  }, [trigger]);

  // Sync address once geolocation succeeds
  useEffect(() => {
    if (geo.status === 'success') {
      setLocalAddress(geo.address);
    }
  }, [geo]);

  // ── Loading / Idle ──
  if (geo.status === 'idle' || geo.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          className="w-4 h-4 rounded-full bg-[#C9933A] mb-6"
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <p className="text-[#F2EDDF] font-medium" data-testid="locating-text">Locating you...</p>
        <p className="text-[#8C7E6A] text-xs mt-1">This may take a few seconds</p>
      </div>
    );
  }

  // ── Error → Manual Input ──
  if (geo.status === 'error') {
    return (
      <div className="space-y-6">
        <div className="bg-[rgba(232,34,10,0.08)] border border-[rgba(232,34,10,0.2)] rounded-xl p-4">
          <p className="text-sm text-[#E8220A]">
            Could not detect your location. Please enter your delivery address manually.
          </p>
        </div>

        <div>
          <label htmlFor="manual-address" className="block text-xs text-[#8C7E6A] uppercase tracking-widest mb-2">
            Delivery Address
          </label>
          <textarea
            id="manual-address"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="123 Main Street, Apartment 4B, City..."
            rows={3}
            className="w-full bg-[#0A0705] border border-[rgba(242,237,223,0.1)] rounded-lg px-4 py-3 text-sm text-[#F2EDDF] placeholder-[#8C7E6A] focus:outline-none focus:border-[#C9933A] resize-none transition-colors"
          />
        </div>

        <button
          onClick={() => onConfirm(manualAddress)}
          disabled={manualAddress.trim().length === 0}
          className="w-full py-3 rounded-full font-semibold transition-all bg-[#F2EDDF] text-black hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirm Address
        </button>
      </div>
    );
  }

  // ── Success ──
  return (
    <div className="space-y-6">
      <div className="bg-[#1A1712] border border-[rgba(242,237,223,0.08)] rounded-xl p-5">
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs text-[#8C7E6A] uppercase tracking-widest">Detected Address</p>
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="text-[10px] text-[#C9933A] uppercase tracking-widest hover:text-[#e5aa47] transition-colors"
          >
            {showEdit ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {showEdit ? (
          <textarea
            value={localAddress}
            onChange={(e) => setLocalAddress(e.target.value)}
            rows={3}
            className="w-full bg-[#0A0705] border border-[rgba(242,237,223,0.1)] rounded-lg px-4 py-3 text-sm text-[#F2EDDF] focus:outline-none focus:border-[#C9933A] resize-none mt-2 transition-colors"
          />
        ) : (
          <p className="text-sm text-[#F2EDDF] leading-relaxed mt-1">{localAddress}</p>
        )}

        {geo.mapsLink && (
          <a
            href={geo.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#C9933A] mt-3 hover:underline"
          >
            📍 View on Maps →
          </a>
        )}
      </div>

      <button
        onClick={() => onConfirm(localAddress, geo.mapsLink)}
        disabled={localAddress.trim().length === 0}
        className="w-full py-3 rounded-full font-semibold transition-all bg-[#F2EDDF] text-black hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirm Address
      </button>
    </div>
  );
}
