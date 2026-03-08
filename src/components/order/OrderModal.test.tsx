import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderModal from './OrderModal';
import { useCartStore } from '@/store/useCartStore';

// Mock useGeolocation
const mockTrigger = vi.fn();
let mockGeoState: { status: string; lat?: number; lon?: number; address?: string; mapsLink?: string; message?: string } = { status: 'idle' };

vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: () => [mockGeoState, mockTrigger],
}));

// Mock useDeviceType
let mockDeviceType: 'mobile' | 'desktop' = 'desktop';

vi.mock('@/hooks/useDeviceType', () => ({
  useDeviceType: () => mockDeviceType,
}));

// Mock qrcode.react
vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <svg data-testid="qr-code" data-value={value}>QR</svg>
  ),
}));

// Mock api to prevent Supabase init
vi.mock('@/lib/api', () => ({
  validateOrder: vi.fn().mockResolvedValue({ isValid: true })
}));

// Mock framer-motion to render instantly without animations
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
      p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,
      span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
      nav: (props: React.HTMLAttributes<HTMLElement>) => <nav {...props} />,
    },
  };
});

describe('OrderModal', () => {
  beforeEach(() => {
    mockGeoState = { status: 'idle' };
    mockDeviceType = 'desktop';
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Margherita', unitPrice: 200, quantity: 1, size: 'medium' }
      ]
    });
    vi.clearAllMocks();
  });

  it('modal not rendered when isOpen=false', () => {
    render(<OrderModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/Logistics Foundation/i)).not.toBeInTheDocument();
  });

  it('modal renders when isOpen=true', () => {
    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Logistics Foundation/i)).toBeInTheDocument();
  });

  it('step indicator shows luxury labels', () => {
    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Foundation')).toBeInTheDocument();
    expect(screen.getByText('Acquisition')).toBeInTheDocument();
  });

  it('LocationStep auto-triggers geolocation on mount', () => {
    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    expect(mockTrigger).toHaveBeenCalled();
  });

  it('confirming location transitions to step 2', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://www.google.com/maps?q=12.97,77.59',
    };

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    
    const confirmBtn = screen.getByText(/Confirm Logistics/i);
    await userEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Acquisition Protocol/i)).toBeInTheDocument();
    });
  });

  it('step 2 shows Dispatch button on mobile', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };
    mockDeviceType = 'mobile';

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    await userEvent.click(screen.getByText(/Confirm Logistics/i));

    await waitFor(() => {
      expect(screen.getByText(/Initialize Dispatch/i)).toBeInTheDocument();
    });
  });

  it('step 2 shows QR code on desktop', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };
    mockDeviceType = 'desktop';

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    await userEvent.click(screen.getByText(/Confirm Logistics/i));

    await waitFor(() => {
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
  });

  it('QR code value contains correct wa.me URL', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    await userEvent.click(screen.getByText(/Confirm Logistics/i));

    await waitFor(() => {
      const qr = screen.getByTestId('qr-code');
      expect(qr.getAttribute('data-value')).toContain('wa.me/918484802540');
    });
  });

  it('fallback link exists on desktop', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };
    mockDeviceType = 'desktop';

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    await userEvent.click(screen.getByText(/Confirm Logistics/i));

    await waitFor(() => {
      const link = screen.getByText(/Open direct link on this device/i);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('href')).toContain('wa.me/918484802540');
    });
  });

  it('close button handles onClose', async () => {
    const onClose = vi.fn();
    render(<OrderModal isOpen={true} onClose={onClose} />);
    
    const closeBtn = screen.getByRole('button', { name: /Close modal/i });
    await userEvent.click(closeBtn);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('backdrop click handles onClose', async () => {
    const onClose = vi.fn();
    render(<OrderModal isOpen={true} onClose={onClose} />);
    
    const backdrop = screen.getByTestId('modal-backdrop');
    await userEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalled();
  });
});
