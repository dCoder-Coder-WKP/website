import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateOrder } from './api';
import { supabase } from './supabase';

vi.mock('./supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('api.ts validateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isValid true when edge function validates successfully', async () => {
    const mockResponse = { data: { isValid: true, calculatedTotal: 500, claimedTotal: 500, verified: true }, error: null };
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

    const items = [{ name: 'Margherita', quantity: 1, type: 'pizza', subTotal: 450 }];
    const claimedTotal = 500; // incl 50 logistic

    const result = await validateOrder(items, claimedTotal);
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith('validate-order', {
      body: { items, claimedTotal }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should fail CLOSED when edge function is unavailable (security default)', async () => {
    const mockError = { error: { message: 'Network error' } };
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError as any);

    const items = [{ name: 'Margherita', quantity: 1, type: 'pizza', subTotal: 450 }];
    const claimedTotal = 500;

    const result = await validateOrder(items, claimedTotal);
    
    // Fail CLOSED: when validator is down, reject the order rather than accepting it.
    // This prevents price manipulation via a downed validation service.
    expect(result.isValid).toBe(false);
    expect(result.verified).toBe(false);
  });

  it('should return isValid false when price tampering is detected', async () => {
    const mockResponse = { data: { isValid: false, calculatedTotal: 600, claimedTotal: 10, verified: true }, error: null };
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse as any);

    const items = [{ name: 'Truffle Pizza', quantity: 1, type: 'pizza', subTotal: 9 }];
    const claimedTotal = 10;

    const result = await validateOrder(items, claimedTotal);
    
    expect(result.isValid).toBe(false);
  });
});
