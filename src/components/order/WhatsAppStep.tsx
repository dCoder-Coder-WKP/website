'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useDeviceType } from '@/hooks/useDeviceType';
import { composeWhatsAppMessage, buildWhatsAppURL } from '@/lib/composeMessage';
import { QRCodeSVG } from 'qrcode.react';

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
      // Fallback for older browsers
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
    <div className="text-center space-y-4">
      <p className="font-serif text-2xl text-[#F2EDDF]">+91 84848 02540</p>
      <textarea
        readOnly
        value={message}
        className="w-full bg-[#0A0705] border border-[rgba(242,237,223,0.1)] rounded-lg p-3 text-xs text-[#8C7E6A] resize-none h-[120px] focus:outline-none"
      />
      <button
        onClick={handleCopy}
        className="px-6 py-2 bg-[#C9933A] text-black text-sm font-semibold rounded-full hover:bg-[#e5aa47] transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Message'}
      </button>
      <a
        href={waURL}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[13px] text-[#C9933A] hover:underline mt-2"
      >
        Open WhatsApp on this device →
      </a>
    </div>
  );
}

export default function WhatsAppStep({ address, mapsLink }: WhatsAppStepProps) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const deviceType = useDeviceType();
  const [qrError, setQrError] = useState(false);

  const message = composeWhatsAppMessage({ items, total, address, mapsLink });
  const waURL = buildWhatsAppURL(message);

  // ── Mobile: deep-link button ──
  if (deviceType === 'mobile') {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <a
          href={waURL}
          className="w-full py-4 bg-[#25D366] text-white text-center font-semibold rounded-full hover:bg-[#22c55e] transition-colors block"
        >
          Send Order on WhatsApp
        </a>
        <p className="text-[11px] text-[#8C7E6A] mt-4 text-center">
          You&apos;ll be redirected to WhatsApp with your order details pre-filled
        </p>
      </div>
    );
  }

  // ── Desktop: QR code ──
  if (qrError) {
    return <QRFallback waURL={waURL} message={message} />;
  }

  return (
    <div className="flex flex-col items-center py-6">
      <div className="bg-[#1A1712] border border-[rgba(242,237,223,0.1)] p-8 rounded-md mb-4">
        <ErrorBoundaryWrapper onError={() => setQrError(true)}>
          <QRCodeSVG
            value={waURL}
            size={220}
            bgColor="#111009"
            fgColor="#F2EDDF"
            level="M"
          />
        </ErrorBoundaryWrapper>
      </div>
      <p className="text-[14px] text-[#8C7E6A] text-center max-w-[260px] leading-relaxed">
        Scan with your phone to send your order on WhatsApp
      </p>
      <a
        href={waURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] text-[#C9933A] hover:underline mt-4"
      >
        Open WhatsApp on this device →
      </a>
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
