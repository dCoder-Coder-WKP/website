'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useDeviceType } from '@/hooks/useDeviceType';
import { composeWhatsAppMessage, buildWhatsAppURL } from '@/lib/composeMessage';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { validateOrder } from '@/lib/api';
import toast from 'react-hot-toast';

interface WhatsAppStepProps {
  address: string;
  mapsLink?: string;
}

// Error boundary fallback for QR code failures
function QRFallback({ waURL, message }: { waURL: string; message: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <span className="font-sans text-[10px] tracking-luxury text-text-muted uppercase">Manual Acquisition</span>
        <p className="font-serif text-2xl text-text-primary italic">+91 84848 02540</p>
      </div>

      <textarea
        readOnly
        value={message}
        className="w-full bg-bg-surface/50 border border-border-refined rounded-2xl p-5 text-[11px] text-text-secondary leading-relaxed resize-none h-[160px] focus:outline-none font-light"
      />

      <div className="flex flex-col gap-4">
        <button
          onClick={handleCopy}
          className="btn-luxury w-full !h-12 !text-[11px]"
        >
          {copied ? 'Composition copied' : 'Copy Dispatch Message'}
        </button>
        <a
          href={waURL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[10px] text-accent-gold uppercase tracking-luxury hover:text-white transition-colors"
        >
          Open direct link →
        </a>
      </div>
    </div>
  );
}

// Simple error boundary class component
class ErrorBoundaryWrapper extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function WhatsAppStep({ address, mapsLink }: WhatsAppStepProps) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const deviceType = useDeviceType();
  const [qrError, setQrError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const message = composeWhatsAppMessage({ items, total, address, mapsLink });
  const waURL = buildWhatsAppURL(message);

  const handleDispatch = async () => {
    setIsValidating(true);
    try {
      const result = await validateOrder(items, total);
      if (!result.isValid) {
        toast.error('Price validation failed. Please refresh the page and try again.');
        return;
      }
      // Valid or validation bypassed
      window.open(waURL, '_blank');
    } catch {
      // In case of any unhandled error, fall open to allow the user to order anyway
      window.open(waURL, '_blank');
    } finally {
      setIsValidating(false);
    }
  };

  // ── Mobile: Deep-link button ──
  if (deviceType === 'mobile') {
    return (
      <div className="flex flex-col items-center py-10 space-y-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-green-500/5 animate-ping opacity-20" />
          <svg className="w-10 h-10 text-green-500 relative z-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-text-primary italic">WhatsApp Dispatch</h3>
          <p className="font-sans text-[11px] text-text-secondary leading-relaxed max-w-[240px] mx-auto">
            Review your order composition in WhatsApp before final submission.
          </p>
        </div>

        <button
          onClick={handleDispatch}
          disabled={isValidating}
          className="btn-luxury w-full !h-14 flex items-center justify-center !bg-green-600 !text-white !border-green-500/50 hover:!bg-green-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Verifying Integrity...' : 'Initialize Dispatch'}
        </button>
        
        <p className="font-sans text-[9px] text-text-muted uppercase tracking-luxury">
          Automated pre-filled composition
        </p>

        {/* Order Tracking Visual */}
        <div className="w-full pt-8 border-t border-border-refined text-left mt-8">
          <h4 className="font-sans text-[10px] text-accent-gold uppercase tracking-[0.3em] mb-6">Live Tracking Estimations</h4>
          <div className="relative pl-4 space-y-6">
            <div className="absolute left-0 top-2 bottom-4 w-[1px] bg-border-refined" />
            
            <div className="relative">
              <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              <p className="font-serif text-sm text-text-primary">Composition Initiated</p>
              <p className="font-sans text-[9px] text-text-muted mt-1 uppercase tracking-wider">Awaiting your WhatsApp dispatch</p>
            </div>
            
            <div className="relative opacity-40">
              <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-border-refined" />
              <p className="font-serif text-sm text-text-primary">Artisanal Preparation</p>
              <p className="font-sans text-[9px] text-text-muted mt-1 uppercase tracking-wider">~ 15 minutes</p>
            </div>
            
            <div className="relative opacity-40">
              <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-border-refined" />
              <p className="font-serif text-sm text-text-primary">Precision Baking</p>
              <p className="font-sans text-[9px] text-text-muted mt-1 uppercase tracking-wider">Gas Oven at 300°C</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop: QR Code ──
  if (qrError) {
    return <QRFallback waURL={waURL} message={message} />;
  }

  return (
    <div className="flex flex-col items-center py-6 space-y-10">
      <div className="relative group">
        <div className="absolute -inset-4 bg-accent-gold/5 blur-2xl group-hover:bg-accent-gold/10 transition-all duration-long" />
        <div className="bg-bg-surface/50 border border-border-refined p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 to-transparent opacity-50" />
          <ErrorBoundaryWrapper onError={() => setQrError(true)}>
            <QRCodeSVG
              value={waURL}
              size={200}
              bgColor="transparent"
              fgColor="#F2EDDF"
              level="M"
              includeMargin={false}
            />
          </ErrorBoundaryWrapper>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="font-serif text-lg text-text-primary italic">Scan to Dispatch</h3>
        <p className="font-sans text-[11px] text-text-secondary max-w-[260px] leading-relaxed font-light">
          Use your mobile device to bridge the gap and send your order curated via WhatsApp.
        </p>
      </div>

      <div className="w-full pt-8 border-t border-border-refined flex flex-col gap-4 items-center">
        <a
          href={waURL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[10px] text-accent-gold uppercase tracking-luxury hover:text-white transition-all flex items-center gap-3 group/link"
        >
          <span className="w-6 h-[1px] bg-accent-gold/30 group-hover/link:w-10 group-hover/link:bg-accent-gold transition-all" />
          Open direct link on this device
        </a>
      </div>

      {/* Order Tracking Visual */}
      <div className="w-full pt-8 border-t border-border-refined text-left">
          <h4 className="font-sans text-[10px] text-accent-gold uppercase tracking-[0.3em] mb-6 text-center">Live Tracking Estimations</h4>
          <div className="relative pl-4 space-y-6 max-w-[240px] mx-auto">
            <div className="absolute left-0 top-2 bottom-4 w-[1px] bg-border-refined" />
            
            <div className="relative">
              <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              <p className="font-serif text-sm text-text-primary">Composition Initiated</p>
              <p className="font-sans text-[9px] text-text-muted mt-1 uppercase tracking-wider">Awaiting your WhatsApp dispatch</p>
            </div>
            
            <div className="relative opacity-40">
              <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-border-refined" />
              <p className="font-serif text-sm text-text-primary">Artisanal Preparation</p>
              <p className="font-sans text-[9px] text-text-muted mt-1 uppercase tracking-wider">~ 15 minutes</p>
            </div>
            
            <div className="relative opacity-40">
              <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-border-refined" />
              <p className="font-serif text-sm text-text-primary">Out for Delivery</p>
              <p className="font-sans text-[9px] text-text-muted mt-1 uppercase tracking-wider">Assigned to Fleet</p>
            </div>
          </div>
        </div>
    </div>
  );
}
