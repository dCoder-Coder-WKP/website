/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from './page';

// ------------------------------------------------------------------
// Mocks
// ------------------------------------------------------------------

vi.mock('@/components/home/Hero', () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock('@/components/home/DoughSection', () => ({
  default: () => <div data-testid="dough-section">Dough Section</div>,
}));

vi.mock('@/components/home/MenuSection', () => ({
  default: () => <div data-testid="menu-section">Menu Section</div>,
}));

vi.mock('@/components/home/IngredientShowcase', () => ({
  default: () => <div data-testid="ingredient-showcase">Ingredient Showcase</div>,
}));

vi.mock('@/components/home/AnimatedStats', () => ({
  default: () => <div data-testid="animated-stats">Animated Stats</div>,
}));

vi.mock('@/components/home/ReservationSection', () => ({
  default: () => <div data-testid="reservation-section">Reservation Section</div>,
}));

// Mock IntersectionObserver for components that might not be mocked in full
global.IntersectionObserver = class {
  observe() { /* noop */ }
  unobserve() { /* noop */ }
  disconnect() { /* noop */ }
} as any;

describe('Homepage (Inspiration Redesign)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all inspiration sections', () => {
    render(<Page />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('dough-section')).toBeInTheDocument();
    expect(screen.getByTestId('menu-section')).toBeInTheDocument();
    expect(screen.getByTestId('ingredient-showcase')).toBeInTheDocument();
    expect(screen.getByTestId('animated-stats')).toBeInTheDocument();
    expect(screen.getByTestId('reservation-section')).toBeInTheDocument();
  });
});
