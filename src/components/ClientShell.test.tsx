import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ClientShell from '@/components/ClientShell';
import { useCartStore } from '@/store/useCartStore';

// Mock OrderModal — synchronous, not dynamic
vi.mock('@/components/order/OrderModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="order-modal">Modal</div> : null,
}));

// Mock next/dynamic to return the module synchronously
vi.mock('next/dynamic', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: (_importFn: unknown, _opts?: object) => {
    const MockComponent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
      return isOpen ? <div data-testid="order-modal" onClick={onClose}>Modal</div> : null;
    };
    MockComponent.displayName = 'DynamicMock';
    return MockComponent;
  },
}));

// Mock Preloader
vi.mock('@/components/Preloader', () => ({
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="preloader">
      <button onClick={onComplete}>Finish</button>
    </div>
  ),
}));

describe('ClientShell / Layout', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useCartStore.setState({ items: [], modalOpen: false });
    vi.clearAllMocks();
  });

  it('Preloader renders on first session visit', () => {
    render(
      <ClientShell>
        <div>Page Content</div>
      </ClientShell>
    );
    expect(screen.getByTestId('preloader')).toBeInTheDocument();
  });

  it('Preloader does not render if sessionStorage flag present', () => {
    sessionStorage.setItem('wkp-loaded', '1');
    render(
      <ClientShell>
        <div>Page Content</div>
      </ClientShell>
    );
    expect(screen.queryByTestId('preloader')).not.toBeInTheDocument();
  });

  it('children always rendered in shell', () => {
    sessionStorage.setItem('wkp-loaded', '1');
    render(
      <ClientShell>
        <div data-testid="page-content">Page Content</div>
      </ClientShell>
    );
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('OrderModal renders when modalOpen is true in store', async () => {
    sessionStorage.setItem('wkp-loaded', '1');
    
    render(
      <ClientShell>
        <div>Content</div>
      </ClientShell>
    );

    await act(async () => {
      useCartStore.setState({ modalOpen: true });
    });

    expect(screen.getByTestId('order-modal')).toBeInTheDocument();
  });

  it('OrderModal not rendered when modalOpen is false', async () => {
    sessionStorage.setItem('wkp-preloader-seen', '1');
    useCartStore.setState({ modalOpen: false });

    render(
      <ClientShell>
        <div>Content</div>
      </ClientShell>
    );

    expect(screen.queryByTestId('order-modal')).not.toBeInTheDocument();
  });
});
