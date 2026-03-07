import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

// Save original navigator
const originalNavigator = { ...navigator };

function mockGeolocation(overrides: Partial<Geolocation> = {}) {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
      ...overrides,
    },
    writable: true,
    configurable: true,
  });
}

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: originalNavigator.geolocation,
      writable: true,
      configurable: true,
    });
  });

  it('initial status is idle', () => {
    mockGeolocation();
    const { result } = renderHook(() => useGeolocation());
    expect(result.current[0].status).toBe('idle');
  });

  it('trigger sets status to loading', () => {
    mockGeolocation({
      getCurrentPosition: vi.fn(), // never calls callbacks
    });
    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current[1](); // trigger
    });
    
    expect(result.current[0].status).toBe('loading');
  });

  it('successful geolocation sets status to success with lat/lon/address/mapsLink', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ display_name: '123 Test Road' }),
    });
    global.fetch = mockFetch;

    mockGeolocation({
      getCurrentPosition: vi.fn((onSuccess) => {
        onSuccess({
          coords: { latitude: 12.9716, longitude: 77.5946 },
        } as GeolocationPosition);
      }),
    });

    const { result } = renderHook(() => useGeolocation());
    
    await act(async () => {
      result.current[1](); // trigger
    });

    const state = result.current[0];
    expect(state.status).toBe('success');
    if (state.status === 'success') {
      expect(state.lat).toBe(12.9716);
      expect(state.lon).toBe(77.5946);
      expect(state.address).toBe('123 Test Road');
      expect(state.mapsLink).toBe('https://www.google.com/maps?q=12.9716,77.5946');
    }
  });

  it('PERMISSION_DENIED (code 1) sets status to error', () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_onSuccess, onError) => {
        onError!({ code: 1, message: 'User denied' } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current[1]();
    });

    expect(result.current[0].status).toBe('error');
  });

  it('POSITION_UNAVAILABLE (code 2) sets status to error', () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_onSuccess, onError) => {
        onError!({ code: 2, message: 'Unavailable' } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current[1]();
    });

    expect(result.current[0].status).toBe('error');
  });

  it('TIMEOUT (code 3) sets status to error', () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_onSuccess, onError) => {
        onError!({ code: 3, message: 'Timeout' } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current[1]();
    });

    expect(result.current[0].status).toBe('error');
  });

  it('Nominatim 429 falls through gracefully to raw coords', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 429 });
    global.fetch = mockFetch;

    mockGeolocation({
      getCurrentPosition: vi.fn((onSuccess) => {
        onSuccess({
          coords: { latitude: 1.234, longitude: 5.678 },
        } as GeolocationPosition);
      }),
    });

    const { result } = renderHook(() => useGeolocation());
    
    await act(async () => {
      result.current[1]();
    });

    const state = result.current[0];
    expect(state.status).toBe('success');
    if (state.status === 'success') {
      expect(state.address).toBe('1.2340, 5.6780');
    }
  });

  it('Nominatim network failure falls through to raw coords', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    mockGeolocation({
      getCurrentPosition: vi.fn((onSuccess) => {
        onSuccess({
          coords: { latitude: 10, longitude: 20 },
        } as GeolocationPosition);
      }),
    });

    const { result } = renderHook(() => useGeolocation());
    
    await act(async () => {
      result.current[1]();
    });

    const state = result.current[0];
    expect(state.status).toBe('success');
    if (state.status === 'success') {
      expect(state.address).toBe('10.0000, 20.0000');
    }
  });

  it('navigator.geolocation undefined sets error immediately', () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current[1]();
    });

    expect(result.current[0].status).toBe('error');
  });
});
