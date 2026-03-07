import { Size, ToppingID } from '@/types';
import { TOPPINGS } from '@/lib/menuData';

// ── Builder State ──────────────────────────────────────────────
export interface BuilderState {
  selectedSize: Size;
  selectedToppings: Set<ToppingID>;
  quantity: number;
}

export type BuilderAction =
  | { type: 'SET_SIZE'; size: Size }
  | { type: 'TOGGLE_TOPPING'; id: ToppingID }
  | { type: 'RESET' }
  | { type: 'SET_QUANTITY'; qty: number };

export const initialBuilderState: BuilderState = {
  selectedSize: 'medium',
  selectedToppings: new Set<ToppingID>(),
  quantity: 1,
};

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_SIZE':
      return { ...state, selectedSize: action.size };
    case 'TOGGLE_TOPPING': {
      const next = new Set(state.selectedToppings);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return { ...state, selectedToppings: next };
    }
    case 'RESET':
      return { ...initialBuilderState, selectedToppings: new Set() };
    case 'SET_QUANTITY':
      return { ...state, quantity: Math.max(1, action.qty) };
    default:
      return state;
  }
}

// ── Price Calculation ──────────────────────────────────────────
export const CUSTOM_BASE_PRICE: Record<Size, number> = {
  small: 149,
  medium: 199,
  large: 249,
};

export function calculateTotal(state: BuilderState): number {
  const base = CUSTOM_BASE_PRICE[state.selectedSize];
  const toppingTotal = Array.from(state.selectedToppings).reduce((sum, id) => {
    const t = TOPPINGS.find((tp) => tp.id === id);
    return sum + (t?.prices[state.selectedSize] ?? 0);
  }, 0);
  return base + toppingTotal;
}

// ── Deterministic Hash ─────────────────────────────────────────
export function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // ensure unsigned 32-bit
}

export function buildCartKey(state: BuilderState): string {
  const sorted = Array.from(state.selectedToppings).sort().join(',');
  const input = sorted + state.selectedSize;
  return `custom-${djb2(input)}`;
}
