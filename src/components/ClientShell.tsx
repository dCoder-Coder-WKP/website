'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import Preloader from '@/components/Preloader';
import dynamic from 'next/dynamic';

const OrderModal = dynamic(() => import('@/components/order/OrderModal'), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const modalOpen = useCartStore((s) => s.modalOpen);
  const closeModal = useCartStore((s) => s.closeModal);

  const [showPreloader, setShowPreloader] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = sessionStorage.getItem('wkp-loaded');
    if (loaded) {
      setReady(true);
    } else {
      setShowPreloader(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('wkp-loaded', 'true');
    setShowPreloader(false);
    setReady(true);
  };

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <Preloader key="preloader" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen bg-bg-base"
        data-testid="shell-content"
      >
        {children}
      </motion.div>

      <OrderModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
