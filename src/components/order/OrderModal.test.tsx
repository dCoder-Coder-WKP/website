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

// Mock framer-motion to render instantly without animations
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { [key: string]: unknown }) => {
        // Filter out framer-motion specific props
        const htmlProps: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(props)) {
          if (!['initial', 'animate', 'exit', 'transition', 'layout', 'layoutId', 'whileHover', 'whileTap', 'variants'].includes(key)) {
            htmlProps[key] = val;
          }
        }
        return <div {...htmlProps}>{children}</div>;
      },
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
    expect(screen.queryByText('Delivery Location')).not.toBeInTheDocument();
  });

  it('modal renders when isOpen=true', () => {
    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Delivery Location')).toBeInTheDocument();
  });

  it('step 1 shows Location header', () => {
    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Delivery Location')).toBeInTheDocument();
  });

  it('step indicator shows step 1 active on open', () => {
    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Order')).toBeInTheDocument();
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
    
    const confirmBtn = screen.getByText('Confirm Address');
    await userEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Send Order')).toBeInTheDocument();
    });
  });

  it('step 2 shows WhatsApp button on mobile user agent', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };
    mockDeviceType = 'mobile';

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    
    await userEvent.click(screen.getByText('Confirm Address'));

    await waitFor(() => {
      expect(screen.getByText('Send Order on WhatsApp')).toBeInTheDocument();
    });
  });

  it('step 2 shows QR code on desktop user agent', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };
    mockDeviceType = 'desktop';

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    
    await userEvent.click(screen.getByText('Confirm Address'));

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
    
    await userEvent.click(screen.getByText('Confirm Address'));

    await waitFor(() => {
      const qr = screen.getByTestId('qr-code');
      expect(qr.getAttribute('data-value')).toContain('wa.me/918484802540');
    });
  });

  it('QR code value contains encoded order message', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    
    await userEvent.click(screen.getByText('Confirm Address'));

    await waitFor(() => {
      const qr = screen.getByTestId('qr-code');
      const value = qr.getAttribute('data-value') || '';
      const decoded = decodeURIComponent(value.split('text=')[1] || '');
      expect(decoded).toContain('Margherita');
    });
  });

  it('fallback link opens wa.me URL in new tab', async () => {
    mockGeoState = {
      status: 'success',
      lat: 12.97,
      lon: 77.59,
      address: '123 Test Road',
      mapsLink: 'https://maps.test',
    };
    mockDeviceType = 'desktop';

    render(<OrderModal isOpen={true} onClose={vi.fn()} />);
    
    await userEvent.click(screen.getByText('Confirm Address'));

    await waitFor(() => {
      const link = screen.getByText('Open WhatsApp on this device →');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('href')).toContain('wa.me/918484802540');
    });
  });

  it('closing modal preserves cart state', async () => {
    const onClose = vi.fn();
    render(<OrderModal isOpen={true} onClose={onClose} />);
    
    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    await userEvent.click(closeBtn);
    
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(onClose).toHaveBeenCalled();
  });

  it('close button calls onClose', async () => {
    const onClose = vi.fn();
    render(<OrderModal isOpen={true} onClose={onClose} />);
    
    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    await userEvent.click(closeBtn);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('backdrop click calls onClose', async () => {
    const onClose = vi.fn();
    render(<OrderModal isOpen={true} onClose={onClose} />);
    
    const backdrop = screen.getByTestId('modal-backdrop');
    await userEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
