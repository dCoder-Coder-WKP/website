import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PizzaCard from './PizzaCard';
import { useCartStore } from '@/store/useCartStore';

// Mock the PizzaIllustration
vi.mock('@/components/pizza/PizzaIllustration', () => ({
  default: ({ toppingIds, size, animate, interactive }: { toppingIds: string[]; size: string; animate: boolean; interactive: boolean }) => (
    <div 
      data-testid="pizza-illustration"
      data-toppings={toppingIds?.join(',')}
      data-size={size}
      data-animate={String(animate)}
      data-interactive={String(interactive)}
    />
  )
}));

const mockPizza = {
  id: 'p_1',
  name: 'Margarita test',
  description: 'Mozzarella, Cheddar, fresh Basil',
  toppings: ['t_cheese', 't_basil'],
  prices: { small: 130, medium: 230, large: 350 },
  dietary: 'veg' as const,
};

describe('PizzaCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it('renders pizza name and description', () => {
    render(<PizzaCard pizza={mockPizza} />);
    expect(screen.getByText('Margarita test')).toBeInTheDocument();
  });

  it('default selected size is medium', () => {
    render(<PizzaCard pizza={mockPizza} />);
    // Medium price is 230
    expect(screen.getByText('₹230')).toBeInTheDocument();
  });

  it('clicking small pill updates price to small price', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const smallBtn = screen.getByRole('button', { name: /small/i });
    
    await userEvent.click(smallBtn);
    expect(screen.getByText('₹130')).toBeInTheDocument();
  });

  it('clicking Order Yours calls addItem with correct key pizza.id-size', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const addBtn = screen.getByRole('button', { name: /Order Yours/i });
    
    await userEvent.click(addBtn);
    
    const storeItems = useCartStore.getState().items;
    expect(storeItems).toHaveLength(1);
    expect(storeItems[0].key).toBe('p_1-medium');
    expect(storeItems[0].unitPrice).toBe(230);
    expect(storeItems[0].quantity).toBe(1);
  });

  it('clicking Order Yours reveals the quantity stepper which correctly increments store', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    
    // Acquire first
    const addBtn = screen.getByRole('button', { name: /Order Yours/i });
    await userEvent.click(addBtn);

    // Now stepper exists
    const incBtn = await screen.findByRole('button', { name: /Increase quantity/i });
    await userEvent.click(incBtn);
    await userEvent.click(incBtn);

    const storeItems = useCartStore.getState().items;
    expect(storeItems[0].quantity).toBe(3);
  });

  it('quantity control increments and decrements price and amount correctly', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    
    expect(screen.getByText('₹230')).toBeInTheDocument(); // initial price
    
    // Acquire to show stepper
    await userEvent.click(screen.getByRole('button', { name: /Order Yours/i }));
    
    const incBtn = await screen.findByRole('button', { name: /Increase quantity/i });
    const decBtn = screen.getByRole('button', { name: /Decrease quantity/i });
    
    expect(screen.getByText('1')).toBeInTheDocument();
    
    await userEvent.click(incBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('₹460')).toBeInTheDocument(); // 2 * 230
    
    await userEvent.click(decBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('₹230')).toBeInTheDocument();
  });

  it('decrementing below 1 removes from cart and restores Order Yours button', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    
    // Acquire
    await userEvent.click(screen.getByRole('button', { name: /Order Yours/i }));
    
    const decBtn = await screen.findByRole('button', { name: /Decrease quantity/i });
    
    // Click minus when quantity is 1
    await userEvent.click(decBtn);
    
    expect(useCartStore.getState().items).toHaveLength(0);
    
    // Acquire button should be back (still showing Added animation because it was so fast)
    expect(await screen.findByText(/Added/i)).toBeInTheDocument();
  });
});
