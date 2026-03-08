import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderSummary from './OrderSummary';
import { useCartStore } from '@/store/useCartStore';

// Mock the OrderModal to avoid rendering the full modal tree
vi.mock('@/components/order/OrderModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? <div data-testid="mock-order-modal">Modal Open</div> : null
  ),
}));

describe('OrderSummary', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], modalOpen: false });
    vi.clearAllMocks();
  });

  it('renders order summary structure', () => {
    render(<OrderSummary />);
    expect(screen.getByText(/Settlement Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Curation/i)).toBeInTheDocument();
  });

  it('total displays correct sum from cart items', () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'extra', name: 'Item 1', unitPrice: 100, quantity: 2 },
        { key: '2', type: 'pizza', name: 'Pizza 1', unitPrice: 200, quantity: 1 }
      ]
    });

    render(<OrderSummary />);
    expect(screen.getByText(/Your Curation/i)).toBeInTheDocument();
    // In our new UI, the items count might be in a span or different structure, 
    // but the core price should be present.
    expect(screen.getByText('₹400')).toBeInTheDocument();
    
    expect(screen.getByText('₹450')).toBeInTheDocument();
  });

  it('Proceed to Acquisition button is disabled when cart is empty', () => {
    render(<OrderSummary />);
    const btn = screen.getByRole('button', { name: /Proceed to Acquisition/i });
    
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('opacity-20');
  });

  it('Proceed to Acquisition button is enabled when cart has items', () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'extra', name: 'Item 1', unitPrice: 100, quantity: 1 }]
    });

    render(<OrderSummary />);
    const btn = screen.getByRole('button', { name: /Proceed to Acquisition/i });
    
    expect(btn).toBeEnabled();
    expect(btn).not.toHaveClass('opacity-20');
  });

  it('clicking Proceed to Acquisition opens OrderModal', async () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'extra', name: 'Item 1', unitPrice: 100, quantity: 1 }]
    });

    render(<OrderSummary />);
    const btn = screen.getByRole('button', { name: /Proceed to Acquisition/i });
    
    await userEvent.click(btn);
    
    // Check if the store's modal state changed
    expect(useCartStore.getState().modalOpen).toBe(true);
  });

  it('logistics premium is complementary when cart is empty', () => {
    render(<OrderSummary />);
    expect(screen.getByText(/Complimentary/i)).toBeInTheDocument();
  });
});
