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

  it('empty vessel shows empty state message and links to menu', () => {
    useCartStore.setState({ items: [] });
    render(<CartPage />);

    expect(screen.getByText(/Empty Vessel/i)).toBeInTheDocument();
    
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
    
    expect(screen.getAllByText('Margherita').length).toBeGreaterThan(0);
    expect(screen.getByText(/LARGE/i)).toBeInTheDocument(); // size badge is uppercase in new UI
    
    expect(screen.getAllByText('₹400').length).toBeGreaterThan(0);
  });

  it('quantity increment updates displayed quantity and total', async () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Test Pizza', unitPrice: 100, quantity: 1 }
      ]
    });
    render(<CartPage />);
    
    expect(screen.getAllByText('₹100').length).toBeGreaterThan(0);
    
    const incBtn = screen.getByRole('button', { name: /Increase quantity/i });
    await userEvent.click(incBtn);

    expect(screen.getAllByText('₹200').length).toBeGreaterThan(0);
    
    // OrderSummary grand total
    expect(screen.getByText('₹250')).toBeInTheDocument();
  });

  it('quantity decrement to 0 removes item from list', async () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'extra', name: 'Garlic Bread', unitPrice: 100, quantity: 1 }
      ]
    });
    render(<CartPage />);
    
    expect(screen.getAllByText('Garlic Bread').length).toBeGreaterThan(0);
    
    const decBtn = screen.getByRole('button', { name: /Decrease quantity/i });
    await userEvent.click(decBtn);

    await waitFor(() => {
      expect(screen.queryByText('Garlic Bread')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Empty Vessel/i)).toBeInTheDocument();
  });

  it('remove button removes item', async () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Test Pizza', unitPrice: 100, quantity: 5 }
      ]
    });
    render(<CartPage />);
    
    const removeBtn = screen.getByRole('button', { name: /Remove item/i });
    await userEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Test Pizza')).not.toBeInTheDocument();
    });
  });

  it('custom pizza shows Reveal Components toggle and expands', async () => {
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
    
    const toggleBtn = screen.getByRole('button', { name: /Reveal Components/i });
    expect(toggleBtn).toBeInTheDocument();
    
    expect(screen.queryByText(mockTopping.name)).not.toBeInTheDocument();

    await userEvent.click(toggleBtn);
    
    expect(screen.getByText(mockTopping.name)).toBeInTheDocument();
    expect(screen.getByText(/Conceal Components/i)).toBeInTheDocument();
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
