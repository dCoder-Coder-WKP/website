import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ items: [] });
    window.localStorage.clear();
  });

  const mockPizzaItem = {
    key: 'p_1-medium',
    type: 'pizza' as const,
    name: 'Margarita',
    pizzaId: 'p_1',
    size: 'medium' as const,
    unitPrice: 200,
    quantity: 1,
  };

  const mockExtraItem = {
    key: 'extra-e_1',
    type: 'extra' as const,
    name: 'Garlic Bread',
    unitPrice: 100,
    quantity: 2,
  };

  it('addItem adds a new item to empty cart', () => {
    useCartStore.getState().addItem(mockPizzaItem);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockPizzaItem);
  });

  it('addItem increments quantity for existing key', () => {
    useCartStore.getState().addItem(mockPizzaItem);
    useCartStore.getState().addItem({ ...mockPizzaItem, quantity: 2 });
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('removeItem removes item by key', () => {
    useCartStore.getState().addItem(mockPizzaItem);
    useCartStore.getState().addItem(mockExtraItem);
    
    useCartStore.getState().removeItem(mockPizzaItem.key);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].key).toBe(mockExtraItem.key);
  });

  it('updateQuantity changes quantity correctly', () => {
    useCartStore.getState().addItem(mockPizzaItem);
    useCartStore.getState().updateQuantity(mockPizzaItem.key, 5);
    
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
  });

  it('updateQuantity(key, 0) removes item', () => {
    useCartStore.getState().addItem(mockPizzaItem);
    useCartStore.getState().updateQuantity(mockPizzaItem.key, 0);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('total() returns correct sum', () => {
    useCartStore.getState().addItem(mockPizzaItem); // 1 * 200 = 200
    useCartStore.getState().addItem(mockExtraItem); // 2 * 100 = 200
    
    expect(useCartStore.getState().total()).toBe(400);
  });

  it('itemCount() returns correct total quantity', () => {
    useCartStore.getState().addItem(mockPizzaItem); // q: 1
    useCartStore.getState().addItem(mockExtraItem); // q: 2
    
    expect(useCartStore.getState().itemCount()).toBe(3);
  });

  it('clearCart empties items array', () => {
    useCartStore.getState().addItem(mockPizzaItem);
    useCartStore.getState().clearCart();
    
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('cart persists to localStorage on change', async () => {
    useCartStore.getState().addItem(mockPizzaItem);
    
    // Zustand persist is synchronous in its updates to localStorage for the default storage
    const stored = window.localStorage.getItem('wkp-cart');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.state.items).toHaveLength(1);
    expect(parsed.state.items[0].key).toBe(mockPizzaItem.key);
  });

  it('cart rehydrates from localStorage on init', () => {
    window.localStorage.setItem('wkp-cart', JSON.stringify({
      state: { items: [mockExtraItem] },
      version: 0
    }));
    
    // We can manually trigger rehydration or just rely on the persist middleware API
    useCartStore.persist.rehydrate();
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].key).toBe(mockExtraItem.key);
  });
});
