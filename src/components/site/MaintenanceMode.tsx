'use client';

import { useEffect, useState } from 'react';
import { checkSiteStatus } from '@/lib/api';

interface SiteStatus {
  isOpen: boolean;
  isMaintenanceMode: boolean;
}

export default function MaintenanceMode() {
  const [siteStatus, setSiteStatus] = useState<SiteStatus>({ isOpen: true, isMaintenanceMode: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await checkSiteStatus();
        setSiteStatus(status);
      } catch (error) {
        console.error('Failed to fetch site status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  // Show maintenance mode overlay
  if (siteStatus.isMaintenanceMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
          <p className="text-gray-600 mb-6">
            We&apos;re currently making improvements to serve you better. Please check back soon.
          </p>
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>We&apos;ll be back shortly</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call us for urgent orders</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show site closed banner
  if (!siteStatus.isOpen) {
    return (
      <div className="bg-red-600 text-white py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">We&apos;re currently closed for orders</span>
        </div>
        <p className="text-sm mt-1 opacity-90">
          Please check our opening hours or call us for more information
        </p>
      </div>
    );
  }

  return null;
}
