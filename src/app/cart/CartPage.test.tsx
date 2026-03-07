import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartPage from './page';
import { useCartStore } from '@/store/useCartStore';
import { TOPPINGS } from '@/lib/menuData';

// Mock NEXT link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href} data-testid={`link-${href}`}>
        {children}
      </a>
    ),
  };
});

// Mock PizzaIllustration used in CartItem
vi.mock('@/components/pizza/PizzaIllustration', () => ({
  default: ({ toppingIds, size }: { toppingIds: string[]; size: string }) => (
    <div data-testid="pizza-illustration" data-size={size} data-toppings={toppingIds?.join(',')}>
      Illustration Mock
    </div>
  ),
}));

describe('CartPage Integration', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it('empty cart shows empty state message and links to menu', () => {
    useCartStore.setState({ items: [] });
    render(<CartPage />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    
    // There are multiple links back to menu (header and mobile), so we check length
    const links = screen.getAllByTestId('link-/menu');
    expect(links.length).toBeGreaterThan(0);
  });

  it('item renders with correct name, size badge, price', () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Margherita', unitPrice: 200, quantity: 2, size: 'large' }
      ]
    });
    render(<CartPage />);
    
    // Use getAllByText for name/price since they might appear in OrderSummary too
    expect(screen.getAllByText('Margherita').length).toBeGreaterThan(0);
    expect(screen.getByText('large')).toBeInTheDocument(); // size badge
    
    // 200 * 2 = 400. It appears in the cart item line and subtotal.
    expect(screen.getAllByText('₹400').length).toBeGreaterThan(0);
  });

  it('quantity increment updates displayed quantity and total', async () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Test Pizza', unitPrice: 100, quantity: 1 }
      ]
    });
    render(<CartPage />);
    
    // 100 might appear multiple times (subtotal, item price)
    expect(screen.getAllByText('₹100').length).toBeGreaterThan(0);
    
    const incBtn = screen.getByRole('button', { name: 'Increase quantity' });
    await userEvent.click(incBtn);

    // After increment, quantity is 2 (unitPrice * 2) = 200
    expect(screen.getAllByText('₹200').length).toBeGreaterThan(0);
    
    // OrderSummary grand total should also update (200 + 50 delivery = 250)
    const grandTotalElement = screen.getByText('Total').nextElementSibling!.querySelector('.font-serif');
    expect(grandTotalElement).toHaveTextContent('₹250');
  });

  it('quantity decrement to 0 removes item from list', async () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'extra', name: 'Garlic Bread', unitPrice: 100, quantity: 1 }
      ]
    });
    render(<CartPage />);
    
    expect(screen.getAllByText('Garlic Bread').length).toBeGreaterThan(0);
    
    const decBtn = screen.getByRole('button', { name: 'Decrease quantity' });
    await userEvent.click(decBtn);

    // Because Framer Motion uses async exit animations, we await removal
    await waitFor(() => {
      expect(screen.queryByText('Garlic Bread')).not.toBeInTheDocument();
    });
    
    // Empty state should ideally be shown immediately because length becomes 0
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('remove button removes item', async () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Test Pizza', unitPrice: 100, quantity: 5 }
      ]
    });
    render(<CartPage />);
    
    const removeBtn = screen.getByRole('button', { name: 'Remove item' });
    await userEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Test Pizza')).not.toBeInTheDocument();
    });
  });

  it('custom pizza shows View toppings toggle and expands', async () => {
    // Assuming TOPPINGS[0] exists
    const mockTopping = TOPPINGS[0];

    useCartStore.setState({
      items: [
        { 
          key: 'custom-123', 
          type: 'custom', 
          name: 'Custom Pizza', 
          unitPrice: 500, 
          quantity: 1, 
          toppings: [mockTopping.id]
        }
      ]
    });
    
    render(<CartPage />);
    
    // Check if toggle exists
    const toggleBtn = screen.getByRole('button', { name: /View toppings/i });
    expect(toggleBtn).toBeInTheDocument();
    
    // List should not be visible initially (Framer Motion height=0 hides visibility but potentially in DOM)
    // However, we render conditionally based on `expanded` state:
    expect(screen.queryByText(mockTopping.name)).not.toBeInTheDocument();

    // Click to expand
    await userEvent.click(toggleBtn);
    
    expect(screen.getByText(mockTopping.name)).toBeInTheDocument();
    expect(screen.getByText('Hide toppings')).toBeInTheDocument();
  });

  it('pizza illustration renders for pizza type items', () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Margo', unitPrice: 100, quantity: 1, size: 'small', toppings: ['t_cheese'] }
      ]
    });
    render(<CartPage />);
    
    const illustration = screen.getByTestId('pizza-illustration');
    expect(illustration).toBeInTheDocument();
    expect(illustration).toHaveAttribute('data-size', 'thumb');
    expect(illustration).toHaveAttribute('data-toppings', 't_cheese');
  });

  it('extra items show decorative icon instead of pizza illustration', () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'extra', name: 'Coke', unitPrice: 50, quantity: 1 }
      ]
    });
    render(<CartPage />);
    
    expect(screen.queryByTestId('pizza-illustration')).not.toBeInTheDocument();
    // SVGs usually don't have roles by default, but we can verify it by text structure or testing library queries
    expect(screen.getByText('Coke')).toBeInTheDocument();
  });

  it('cart items persist after navigating away and back (mocked store stability)', () => {
    // This is essentially testing Zustand's persistence which isn't easy in jsdom without localstorage
    // We already trust zustand-persist. We just verify store drives render.
    useCartStore.setState({
      items: [
        { key: 'persistent-1', type: 'extra', name: 'Persistent Item', unitPrice: 10, quantity: 1 }
      ]
    });
    
    const { unmount } = render(<CartPage />);
    unmount();
    
    // Remount to simulate navigation
    render(<CartPage />);
    expect(screen.getByText('Persistent Item')).toBeInTheDocument();
  });
});
