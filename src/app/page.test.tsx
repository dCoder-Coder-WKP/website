/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from './page';

// ------------------------------------------------------------------
// Mocks
// ------------------------------------------------------------------

vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn().mockImplementation((config: any) => {
      if (config && config.onComplete) {
        setTimeout(config.onComplete as () => void, 0);
      }
      return { to: vi.fn().mockReturnThis(), fromTo: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis() };
    }),
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    context: vi.fn().mockReturnValue({ revert: vi.fn() }),
  },
  gsap: {
    timeline: vi.fn().mockImplementation((config: any) => {
      if (config && config.onComplete) {
        setTimeout(config.onComplete as () => void, 0);
      }
      return { to: vi.fn().mockReturnThis(), fromTo: vi.fn().mockReturnThis(), add: vi.fn().mockReturnThis() };
    }),
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    context: vi.fn().mockReturnValue({ revert: vi.fn() }),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn() },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

// Mock HeroVisual
vi.mock('@/components/hero/HeroVisual', () => ({
  default: ({ active }: { active: boolean }) => (
    <div data-testid="hero-visual-mock" data-active={String(active)}>
      <h1>We Knead Pizza</h1>
    </div>
  ),
}));

// Mock PizzaIllustration
vi.mock('@/components/pizza/PizzaIllustration', () => ({
  default: () => <div data-testid="pizza-illustration">PizzaIllustration</div>,
}));

// Mock ResizeObserver for Framer Motion and GSAP
global.ResizeObserver = class {
  observe() { /* noop */ }
  unobserve() { /* noop */ }
  disconnect() { /* noop */ }
};

describe('Homepage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();

    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 1,
    });
  });

  // ========== Unit Tests ==========

  it('Category cards render with correct href links', () => {
    sessionStorage.setItem('wkp-loaded', 'true');
    render(<Page />);
    const menuLink = screen.getByRole('link', { name: /Our Menu/i });
    const buildLink = screen.getByRole('link', { name: /Pizza Builder/i });
    const cartLink = screen.getByRole('link', { name: /Your Order/i });

    expect(menuLink).toHaveAttribute('href', '/menu');
    expect(buildLink).toHaveAttribute('href', '/build');
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('Hero text renders We Knead Pizza heading', async () => {
    sessionStorage.setItem('wkp-loaded', 'true');
    render(<Page />);
    const heading = await screen.findByRole('heading', { level: 1, name: /We Knead Pizza/i });
    expect(heading).toBeInTheDocument();
  });

  // ========== Integration Tests ==========

  it('After preloader onComplete, hero text becomes visible', async () => {
    render(<Page />);
    const heading = await screen.findByRole('heading', { level: 1, name: /We Knead Pizza/i });
    expect(heading).toBeInTheDocument();
  });

  it('Category card hover applies correct Tailwind transition classes', () => {
    sessionStorage.setItem('wkp-loaded', 'true');
    render(<Page />);
    const menuLink = screen.getByRole('link', { name: /Our Menu/i });

    expect(menuLink).toHaveClass('group');
    expect(menuLink).toHaveClass('transition-colors');
    expect(menuLink).toHaveClass('hover:border-[#C9933A]');
  });

  it('HeroVisual renders in the page', () => {
    sessionStorage.setItem('wkp-loaded', 'true');
    render(<Page />);
    expect(screen.getByTestId('hero-visual-mock')).toBeInTheDocument();
  });

  it('Page does not crash when window.devicePixelRatio is undefined (SSR guard)', () => {
    sessionStorage.setItem('wkp-loaded', 'true');

    const originalDevicePixelRatio = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: undefined,
    });

    expect(() => render(<Page />)).not.toThrow();

    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: originalDevicePixelRatio,
    });
  });
});
