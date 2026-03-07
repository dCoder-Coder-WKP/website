import { describe, it, expect } from 'vitest';
import { PIZZAS, EXTRAS, TOPPINGS } from './menuData';

describe('Menu Data', () => {
  it('PIZZAS array is non-empty', () => {
    expect(PIZZAS.length).toBeGreaterThan(0);
  });

  it('every pizza has prices for small, medium, large', () => {
    PIZZAS.forEach(pizza => {
      expect(pizza.prices).toHaveProperty('small');
      expect(pizza.prices).toHaveProperty('medium');
      expect(pizza.prices).toHaveProperty('large');
      expect(typeof pizza.prices.small).toBe('number');
      expect(typeof pizza.prices.medium).toBe('number');
      expect(typeof pizza.prices.large).toBe('number');
    });
  });

  it('every pizza has at least one topping', () => {
    PIZZAS.forEach(pizza => {
      expect(pizza.toppings.length).toBeGreaterThan(0);
    });
  });

  it('EXTRAS contains at least one starter', () => {
    const starters = EXTRAS.filter(e => e.category === 'starter');
    expect(starters.length).toBeGreaterThan(0);
  });

  it('EXTRAS contains at least one dessert', () => {
    const desserts = EXTRAS.filter(e => e.category === 'dessert');
    expect(desserts.length).toBeGreaterThan(0);
  });

  it('all topping IDs in pizzas exist in TOPPINGS array', () => {
    const validToppingIds = new Set(TOPPINGS.map(t => t.id));
    PIZZAS.forEach(pizza => {
      pizza.toppings.forEach(toppingId => {
        expect(validToppingIds.has(toppingId)).toBe(true);
      });
    });
  });
});
