import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPizzas, fetchToppings, fetchNotifications, fetchSiteConfig } from './api';
import { supabase } from './supabase';
import { PIZZAS } from './menuData';

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPizzas', () => {
    it('fetchPizzas returns array with correct shape', async () => {
      const mockData = [
        {
          slug: 'margarita',
          name: 'Margarita',
          description: 'Classic',
          price_small: 100,
          price_medium: 200,
          price_large: 300,
          pizza_toppings: [
             { toppings: { slug: 'cheese', is_veg: true } }
          ]
        }
      ];
      
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const orderMock = vi.fn().mockResolvedValue({ data: mockData, error: null });

      (supabase.from as any).mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock
      });

      const result = await fetchPizzas();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('margarita');
      expect(result[0].prices.small).toBe(100);
      expect(result[0].dietary).toBe('veg');
    });

    it('fetchPizzas falls back to static data on Supabase error', async () => {
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const orderMock = vi.fn().mockRejectedValue(new Error('Network error'));

      (supabase.from as any).mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock
      });

      const result = await fetchPizzas();
      expect(result).toEqual(PIZZAS);
    });
  });

  describe('fetchToppings', () => {
    it('fetchToppings maps DB rows to Topping type correctly', async () => {
      const mockData = [
        {
          slug: 'mushroom',
          name: 'Mushroom',
          category: 'Vegetables',
          mesh_type: 'chunk',
          color_hex: '#ddd',
          price_small: 10,
          price_medium: 20,
          price_large: 30
        }
      ];
      
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockResolvedValue({ data: mockData, error: null });

      (supabase.from as any).mockReturnValue({
        select: selectMock,
        eq: eqMock
      });

      const result = await fetchToppings();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('mushroom');
      expect(result[0].prices.medium).toBe(20);
    });
  });

  describe('fetchNotifications', () => {
    it('fetchNotifications filters expired notifications', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const mockData = [
        { id: '1', title: 'Active', expires_at: futureDate.toISOString() },
        { id: '2', title: 'Expired', expires_at: pastDate.toISOString() },
        { id: '3', title: 'No Expiry', expires_at: null }
      ];

      (supabase.from as any).mockReturnValue({
        select: () => ({
          eq: () => ({
            order: () => ({
              order: () => Promise.resolve({ data: mockData, error: null })
            })
          })
        })
      });

      const result = await fetchNotifications();
      expect(result.length).toBe(2);
      expect(result.map((r: any) => r.id)).toContain('1');
      expect(result.map((r: any) => r.id)).toContain('3');
      expect(result.map((r: any) => r.id)).not.toContain('2');
    });
  });

  describe('fetchSiteConfig', () => {
    it('fetchSiteConfig returns key-value record', async () => {
      const mockData = [
        { key: 'is_open', value: 'true' },
        { key: 'min_order', value: '200' }
      ];

      (supabase.from as any).mockReturnValue({
         select: () => Promise.resolve({ data: mockData, error: null })
      });

      const result = await fetchSiteConfig();
      expect(result).toEqual({ is_open: 'true', min_order: '200' });
    });
  });
});
