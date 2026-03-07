'use client';

import { useState, useEffect } from 'react';

export function useDeviceType(): 'mobile' | 'desktop' {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile'); // SSR default

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      setDevice(isMobile ? 'mobile' : 'desktop');
    }
  }, []);

  return device;
}
