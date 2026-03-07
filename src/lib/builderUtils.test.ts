import { describe, it, expect } from 'vitest';
import {
  builderReducer,
  initialBuilderState,
  calculateTotal,
  djb2,
  buildCartKey,
  CUSTOM_BASE_PRICE,
  BuilderState,
} from './builderUtils';

// ── Reducer Tests ──────────────────────────────────────────────

describe('builderReducer', () => {
  it('SET_SIZE changes selectedSize', () => {
    const state = builderReducer(initialBuilderState, { type: 'SET_SIZE', size: 'large' });
    expect(state.selectedSize).toBe('large');
  });

  it('TOGGLE_TOPPING adds topping to empty set', () => {
    const state = builderReducer(initialBuilderState, { type: 'TOGGLE_TOPPING', id: 't_cheese' });
    expect(state.selectedToppings.has('t_cheese')).toBe(true);
    expect(state.selectedToppings.size).toBe(1);
  });

  it('TOGGLE_TOPPING removes topping if already selected', () => {
    const withCheese: BuilderState = {
      ...initialBuilderState,
      selectedToppings: new Set(['t_cheese']),
    };
    const state = builderReducer(withCheese, { type: 'TOGGLE_TOPPING', id: 't_cheese' });
    expect(state.selectedToppings.has('t_cheese')).toBe(false);
    expect(state.selectedToppings.size).toBe(0);
  });

  it('RESET clears all selected toppings and resets quantity to 1', () => {
    const modified: BuilderState = {
      selectedSize: 'large',
      selectedToppings: new Set(['t_cheese', 't_onion']),
      quantity: 5,
    };
    const state = builderReducer(modified, { type: 'RESET' });
    expect(state.selectedToppings.size).toBe(0);
    expect(state.quantity).toBe(1);
    expect(state.selectedSize).toBe('medium'); // resets to default
  });

  it('SET_QUANTITY updates quantity', () => {
    const state = builderReducer(initialBuilderState, { type: 'SET_QUANTITY', qty: 3 });
    expect(state.quantity).toBe(3);
  });

  it('SET_QUANTITY clamps to minimum of 1', () => {
    const state = builderReducer(initialBuilderState, { type: 'SET_QUANTITY', qty: 0 });
    expect(state.quantity).toBe(1);
  });

  it('returns same state for unknown action', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = builderReducer(initialBuilderState, { type: 'UNKNOWN' } as any);
    expect(state).toEqual(initialBuilderState);
  });
});

// ── Price Calculation Tests ────────────────────────────────────

describe('calculateTotal', () => {
  it('base price matches size: small returns small base', () => {
    const state: BuilderState = { ...initialBuilderState, selectedSize: 'small' };
    expect(calculateTotal(state)).toBe(CUSTOM_BASE_PRICE.small);
  });

  it('no toppings selected returns base price only', () => {
    expect(calculateTotal(initialBuilderState)).toBe(CUSTOM_BASE_PRICE.medium);
  });

  it('total increases correctly when topping added', () => {
    const state: BuilderState = {
      selectedSize: 'medium',
      selectedToppings: new Set(['t_cheese']), // t_cheese medium = 60
      quantity: 1,
    };
    expect(calculateTotal(state)).toBe(CUSTOM_BASE_PRICE.medium + 60);
  });

  it('total decreases correctly when topping removed', () => {
    const withTwo: BuilderState = {
      selectedSize: 'medium',
      selectedToppings: new Set(['t_cheese', 't_onion']), // 60 + 30 = 90
      quantity: 1,
    };
    expect(calculateTotal(withTwo)).toBe(CUSTOM_BASE_PRICE.medium + 90);

    const withOne: BuilderState = {
      ...withTwo,
      selectedToppings: new Set(['t_cheese']),
    };
    expect(calculateTotal(withOne)).toBe(CUSTOM_BASE_PRICE.medium + 60);
  });

  it('total recalculates when size changes', () => {
    const state: BuilderState = {
      selectedSize: 'small',
      selectedToppings: new Set(['t_cheese']), // t_cheese small = 40
      quantity: 1,
    };
    expect(calculateTotal(state)).toBe(CUSTOM_BASE_PRICE.small + 40);

    const largeSt: BuilderState = { ...state, selectedSize: 'large' }; // t_cheese large = 80
    expect(calculateTotal(largeSt)).toBe(CUSTOM_BASE_PRICE.large + 80);
  });
});

// ── Hash / Cart Key Tests ──────────────────────────────────────

describe('djb2', () => {
  it('is deterministic for same input', () => {
    expect(djb2('hello')).toBe(djb2('hello'));
  });

  it('different inputs produce different hashes', () => {
    expect(djb2('hello')).not.toBe(djb2('world'));
  });

  it('returns an unsigned 32-bit integer', () => {
    const h = djb2('test');
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xFFFFFFFF);
  });
});

describe('buildCartKey', () => {
  it('different topping order produces same key (sort applied)', () => {
    const a: BuilderState = { ...initialBuilderState, selectedToppings: new Set(['t_cheese', 't_onion']) };
    const b: BuilderState = { ...initialBuilderState, selectedToppings: new Set(['t_onion', 't_cheese']) };
    expect(buildCartKey(a)).toBe(buildCartKey(b));
  });

  it('different size produces different key', () => {
    const a: BuilderState = { ...initialBuilderState, selectedSize: 'small', selectedToppings: new Set(['t_cheese']) };
    const b: BuilderState = { ...initialBuilderState, selectedSize: 'large', selectedToppings: new Set(['t_cheese']) };
    expect(buildCartKey(a)).not.toBe(buildCartKey(b));
  });

  it('different toppings produce different key', () => {
    const a: BuilderState = { ...initialBuilderState, selectedToppings: new Set(['t_cheese']) };
    const b: BuilderState = { ...initialBuilderState, selectedToppings: new Set(['t_onion']) };
    expect(buildCartKey(a)).not.toBe(buildCartKey(b));
  });

  it('key starts with custom- prefix', () => {
    const key = buildCartKey(initialBuilderState);
    expect(key).toMatch(/^custom-\d+$/);
  });
});
