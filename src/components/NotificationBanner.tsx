'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types';

export default function NotificationBanner({ notifications }: { notifications: Notification[] }) {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    
    // Find first notification that hasn't been dismissed
    const nextUnseen = notifications.find(n => {
      const dismissed = sessionStorage.getItem(`wkp-dismissed-${n.id}`);
      return !dismissed;
    });
    
    if (nextUnseen) {
      setActiveNotification(nextUnseen);
    }
  }, [notifications]);

  const handleDismiss = () => {
    if (!activeNotification) return;
    sessionStorage.setItem(`wkp-dismissed-${activeNotification.id}`, 'true');
    setActiveNotification(null);
  };

  return (
    <AnimatePresence>
      {activeNotification && (
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
           className="fixed bottom-0 left-0 right-0 z-[100] bg-bg-raised border-t border-accent-ember/40 p-4 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {activeNotification.imageUrl && (
                <img 
                  src={activeNotification.imageUrl} 
                  alt={activeNotification.title} 
                  className="w-20 h-20 object-cover rounded shadow-md shrink-0 border border-border-subtle" 
                />
              )}
              <div>
                <h4 className="text-[#F2EDDF] font-serif italic text-lg">{activeNotification.title}</h4>
                {activeNotification.body && (
                  <p className="text-text-muted text-sm max-w-xl">{activeNotification.body}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
               {activeNotification.ctaLabel && (
                  <a href={activeNotification.ctaUrl || '#'} className="bg-accent-ember text-[#F2EDDF] px-6 py-2 rounded-full font-semibold text-sm hover:brightness-110 transition-all text-center">
                    {activeNotification.ctaLabel}
                  </a>
               )}
               <button onClick={handleDismiss} className="text-text-muted hover:text-[#F2EDDF] p-2 text-2xl leading-none transition-colors" aria-label="Dismiss">
                 &times;
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
