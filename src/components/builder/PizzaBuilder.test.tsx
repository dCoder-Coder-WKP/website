import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PizzaBuilder from './PizzaBuilder';
import { useCartStore } from '@/store/useCartStore';
import { CUSTOM_BASE_PRICE } from '@/lib/builderUtils';

// Mock PizzaIllustration
vi.mock('@/components/pizza/PizzaIllustration', () => ({
  default: ({ toppingIds, pizzaSize }: { toppingIds: string[], pizzaSize?: string }) => (
    <div data-testid="pizza-illustration" data-toppings={toppingIds.join(',')} data-pizza-size={pizzaSize}>
      PizzaIllustration
    </div>
  ),
}));

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(),
    fromTo: vi.fn(),
  }
}));

// Helper: find a topping toggle button by its name
function getToppingButton(name: string): HTMLElement {
  const allButtons = screen.queryAllByRole('button');
  const match = allButtons.find(
    btn => btn.getAttribute('aria-pressed') !== null && btn.textContent?.includes(name)
  );
  if (!match) throw new Error(`Topping button "${name}" not found`);
  return match;
}

describe('PizzaBuilder', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    vi.clearAllMocks();
  });

  it('renders size toggle with SMALL MEDIUM LARGE options', () => {
    render(<PizzaBuilder />);
    expect(screen.getAllByText(/SMALL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/MEDIUM/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LARGE/i).length).toBeGreaterThan(0);
  });

  it('clicking topping row toggles selected state', async () => {
    render(<PizzaBuilder />);
    const onionBtn = getToppingButton('Onion');

    // Click to select
    await userEvent.click(onionBtn);
    expect(onionBtn.getAttribute('aria-pressed')).toBe('true');

    // Click to deselect
    await userEvent.click(onionBtn);
    expect(onionBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('price updates when topping is toggled', async () => {
    render(<PizzaBuilder />);
    // Initially only base price (medium = 199)
    expect(screen.getAllByText(`₹${CUSTOM_BASE_PRICE.medium}`).length).toBeGreaterThan(0);

    // Toggle Onion (medium price = 30)
    const onionBtn = getToppingButton('Onion');
    await userEvent.click(onionBtn);

    const expected = CUSTOM_BASE_PRICE.medium + 30;
    expect(screen.getAllByText(`₹${expected}`).length).toBeGreaterThan(0);
  });

  it('price and illustration update when size changes', async () => {
    render(<PizzaBuilder />);

    // Switch to Small
    const smallBtn = screen.getByText(/SMALL/i);
    await userEvent.click(smallBtn);

    expect(screen.getAllByText(`₹${CUSTOM_BASE_PRICE.small}`).length).toBeGreaterThan(0);
    
    // Check illustration receives the updated size state
    const illustration = screen.getByTestId('pizza-illustration');
    expect(illustration.getAttribute('data-pizza-size')).toBe('small');
  });

  it('Reset button clears all selected toppings', async () => {
    render(<PizzaBuilder />);

    // Select a topping
    const onionBtn = getToppingButton('Onion');
    await userEvent.click(onionBtn);
    expect(onionBtn.getAttribute('aria-pressed')).toBe('true');

    // Reset
    const resetBtn = screen.getByText(/Reset Configuration/i);
    await userEvent.click(resetBtn);

    // After reset need to re-query
    const onionBtnAfter = getToppingButton('Onion');
    expect(onionBtnAfter.getAttribute('aria-pressed')).toBe('false');
  });

  it('Acquire button dispatches addItem with correct key and price', async () => {
    render(<PizzaBuilder />);

    // Add a topping (Onion medium = 30)
    const onionBtn = getToppingButton('Onion');
    await userEvent.click(onionBtn);

    // Click Acquire
    const addBtns = screen.getAllByText(/Acquire Craft/i);
    await userEvent.click(addBtns[0]);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('custom');
    expect(items[0].name).toBe('Custom Pizza');
    expect(items[0].unitPrice).toBe(CUSTOM_BASE_PRICE.medium + 30);
    expect(items[0].key).toMatch(/^custom-\d+$/);
  });

  it('Acquire Craft with no toppings adds base pizza only', async () => {
    render(<PizzaBuilder />);

    const addBtns = screen.getAllByText(/Acquire Craft/i);
    await userEvent.click(addBtns[0]);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].unitPrice).toBe(CUSTOM_BASE_PRICE.medium);
  });

  it('illustration receives updated toppingIds when topping toggled', async () => {
    render(<PizzaBuilder />);
    const illustration = screen.getByTestId('pizza-illustration');

    // Initially empty
    expect(illustration.getAttribute('data-toppings')).toBe('');

    // Toggle onion
    const onionBtn = getToppingButton('Onion');
    await userEvent.click(onionBtn);

    expect(illustration.getAttribute('data-toppings')).toBe('t_onion');
  });
});
