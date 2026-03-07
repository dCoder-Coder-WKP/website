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
};

describe('PizzaCard', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it('renders pizza name and description', () => {
    render(<PizzaCard pizza={mockPizza} />);
    expect(screen.getByText('Margarita test')).toBeInTheDocument();
    expect(screen.getByText('Mozzarella, Cheddar, fresh Basil')).toBeInTheDocument();
  });

  it('default selected size is medium', () => {
    render(<PizzaCard pizza={mockPizza} />);
    // Medium price is 230
    expect(screen.getByText('₹230')).toBeInTheDocument();
  });

  it('clicking S pill updates price to small price', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const smallBtn = screen.getByRole('button', { name: 's' });
    
    await userEvent.click(smallBtn);
    expect(screen.getByText('₹130')).toBeInTheDocument();
  });

  it('clicking Add to Cart calls addItem with correct key pizza.id-size', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const addBtn = screen.getByRole('button', { name: 'Add' });
    
    await userEvent.click(addBtn);
    
    const storeItems = useCartStore.getState().items;
    expect(storeItems).toHaveLength(1);
    expect(storeItems[0].key).toBe('p_1-medium');
    expect(storeItems[0].unitPrice).toBe(230);
    expect(storeItems[0].quantity).toBe(1);
  });

  it('clicking Add to Cart increments cart badge by quantity', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    
    // Increment quantity to 3
    const incBtn = screen.getByRole('button', { name: 'Increase quantity' });
    await userEvent.click(incBtn);
    await userEvent.click(incBtn);

    const addBtn = screen.getByRole('button', { name: 'Add' });
    await userEvent.click(addBtn);

    const storeItems = useCartStore.getState().items;
    expect(storeItems).toHaveLength(1);
    expect(storeItems[0].quantity).toBe(3);
  });

  it('button shows Added checkmark feedback after click', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const addBtn = screen.getByRole('button', { name: 'Add' });
    
    await userEvent.click(addBtn);
    expect(screen.getByRole('button', { name: 'Added ✓' })).toBeInTheDocument();
  });

  it('quantity control increments and decrements correctly', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const incBtn = screen.getByRole('button', { name: 'Increase quantity' });
    const decBtn = screen.getByRole('button', { name: 'Decrease quantity' });
    
    expect(screen.getByText('1')).toBeInTheDocument(); // initial
    expect(screen.getByText('₹230')).toBeInTheDocument(); // initial price
    
    await userEvent.click(incBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('₹460')).toBeInTheDocument(); // 2 * 230
    
    await userEvent.click(decBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('₹230')).toBeInTheDocument();
  });

  it('quantity cannot go below 1 in card (distinct from cart where 0 removes)', async () => {
    render(<PizzaCard pizza={mockPizza} />);
    const decBtn = screen.getByRole('button', { name: 'Decrease quantity' });
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(decBtn).toBeDisabled();
    
    // clicking shouldn't change
    await userEvent.click(decBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
