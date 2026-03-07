'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Preloader from '@/components/Preloader';
import dynamic from 'next/dynamic';

// Load OrderModal client-side only (uses framer-motion / no SSR needed)
const OrderModal = dynamic(() => import('@/components/order/OrderModal'), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const modalOpen = useCartStore((s) => s.modalOpen);
  const closeModal = useCartStore((s) => s.closeModal);

  // Session-once Preloader
  const [showPreloader, setShowPreloader] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('wkp-preloader-seen');
    if (!seen) {
      setShowPreloader(true);
    } else {
      setReady(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('wkp-preloader-seen', '1');
    setShowPreloader(false);
    setReady(true);
  };

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <div
        className={ready ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}
        data-testid="shell-content"
      >
        {children}
      </div>

      <OrderModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
