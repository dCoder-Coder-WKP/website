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
    useCartStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it('renders order summary structure', () => {
    render(<OrderSummary />);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
  });

  it('total displays correct sum from cart items', () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'extra', name: 'Item 1', unitPrice: 100, quantity: 2 },
        { key: '2', type: 'pizza', name: 'Pizza 1', unitPrice: 200, quantity: 1 }
      ]
    });

    render(<OrderSummary />);
    expect(screen.getByText('Subtotal (3 items)')).toBeInTheDocument();
    expect(screen.getByText('₹400')).toBeInTheDocument();
    
    const grandTotalElement = screen.getByText('Total').nextElementSibling!.querySelector('.font-serif');
    expect(grandTotalElement).toHaveTextContent('₹450');
  });

  it('Place Order button is disabled when cart is empty', () => {
    render(<OrderSummary />);
    const btn = screen.getByRole('button', { name: 'Place Order' });
    
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('cursor-not-allowed', 'opacity-40');
    expect(btn.getAttribute('title')).toBe('Your cart is empty');
  });

  it('Place Order button is enabled when cart has items', () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'extra', name: 'Item 1', unitPrice: 100, quantity: 1 }]
    });

    render(<OrderSummary />);
    const btn = screen.getByRole('button', { name: 'Place Order' });
    
    expect(btn).toBeEnabled();
    expect(btn).not.toHaveClass('cursor-not-allowed', 'opacity-40');
    expect(btn.getAttribute('title')).toBe('Place Order');
  });

  it('clicking Place Order opens OrderModal', async () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'extra', name: 'Item 1', unitPrice: 100, quantity: 1 }]
    });

    render(<OrderSummary />);
    const btn = screen.getByRole('button', { name: 'Place Order' });
    
    expect(screen.queryByTestId('mock-order-modal')).not.toBeInTheDocument();
    
    await userEvent.click(btn);
    
    expect(screen.getByTestId('mock-order-modal')).toBeInTheDocument();
  });

  it('delivery is free when cart is empty', () => {
    render(<OrderSummary />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });
});
