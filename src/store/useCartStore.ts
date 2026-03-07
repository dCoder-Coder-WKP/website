import { Size } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  key: string;
  type: 'pizza' | 'extra' | 'custom';
  name: string;
  pizzaId?: string;
  toppings?: string[];
  size?: Size;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
  // Modal slice — never persisted
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.key === newItem.key);
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
            };
            return { items: updatedItems };
          }
          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }));
      },
      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },
      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      // Modal slice
      modalOpen: false,
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
    }),
    {
      name: 'wkp-cart',
      // Exclude modal state from persistence — always starts closed
      partialize: (state) => ({ items: state.items }),
    }
  )
);
