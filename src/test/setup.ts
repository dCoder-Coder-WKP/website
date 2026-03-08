import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
class IntersectionObserverMock {
    root = null;
    rootMargin = "";
    thresholds = [];
    disconnect = vi.fn();
    observe = vi.fn();
    takeRecords = vi.fn();
    unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
});

Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
});
