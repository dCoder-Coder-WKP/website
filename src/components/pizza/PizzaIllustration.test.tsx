import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import PizzaIllustration from './PizzaIllustration';

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn().mockReturnValue({ to: vi.fn().mockReturnThis(), fromTo: vi.fn().mockReturnThis() }),
    registerPlugin: vi.fn(),
  },
}));

describe('PizzaIllustration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the pizza SVG element', () => {
    // Note: The previous test might have used data-testid, but the current component 
    // doesn't have it. I'll add it to the component or use container query.
    // For now, I'll update the test to be more robust.
    const { container } = render(<PizzaIllustration size="card" toppingIds={[]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders base layers (crust, dough, sauce, cheese pools)', () => {
    const { container } = render(<PizzaIllustration size="card" toppingIds={[]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // Should have multiple circles in the pizza-base group
    const baseGroup = container.querySelector('.pizza-base');
    expect(baseGroup).toBeTruthy();
    
    const circles = baseGroup?.querySelectorAll('circle');
    expect(circles?.length).toBeGreaterThanOrEqual(3); // crust, dough, sauce
  });

  it('renders topping groups for given toppingIds', () => {
    const { container } = render(
      <PizzaIllustration size="card" toppingIds={['t_basil', 't_onion']} />
    );
    const toppingLayer = container.querySelector('.toppings-layer');
    expect(toppingLayer).toBeTruthy();

    // Each topping type generates a group with data-topping-id
    const toppingGroups = toppingLayer?.querySelectorAll('[data-topping-id]');
    expect(toppingGroups?.length).toBe(2);
  });

  it('topping positions are deterministic for same toppingIds and seed', () => {
    const { container: c1 } = render(
      <PizzaIllustration size="card" toppingIds={['t_basil']} seed={42} />
    );
    const { container: c2 } = render(
      <PizzaIllustration size="card" toppingIds={['t_basil']} seed={42} />
    );

    const group1 = c1.querySelector('[data-topping-id="t_basil"]');
    const group2 = c2.querySelector('[data-topping-id="t_basil"]');

    // Remove UIDs from the HTML before comparing to ensure determinism
    const cleanHTML = (html: string) => html.replace(/url\(#[^)]+\)/g, 'url(#UID)').replace(/id="[^"]+"/g, 'id="UID"');
    
    expect(cleanHTML(group1?.innerHTML || '')).toBe(cleanHTML(group2?.innerHTML || ''));
  });

  it('size="thumb" applies correct dimensions (80px)', () => {
    const { container } = render(<PizzaIllustration size="thumb" toppingIds={[]} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('80px');
    expect(svg?.getAttribute('height')).toBe('80px');
  });

  it('size="hero" applies correct dimensions (100%)', () => {
    const { container } = render(<PizzaIllustration size="hero" toppingIds={[]} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('100%');
    expect(svg?.getAttribute('height')).toBe('100%');
  });

  it('renders different topping types correctly', () => {
    const { container } = render(
      <PizzaIllustration
        size="card"
        toppingIds={['t_pepperoni', 't_onion', 't_basil', 't_mushroom', 't_paneer']}
      />
    );

    // Each topping group should exist
    expect(container.querySelector('[data-topping-id="t_pepperoni"]')).toBeTruthy();
    expect(container.querySelector('[data-topping-id="t_onion"]')).toBeTruthy();
    expect(container.querySelector('[data-topping-id="t_basil"]')).toBeTruthy();
    expect(container.querySelector('[data-topping-id="t_mushroom"]')).toBeTruthy();
    expect(container.querySelector('[data-topping-id="t_paneer"]')).toBeTruthy();
  });

  it('interactive=true does not crash', () => {
    expect(() =>
      render(
        <PizzaIllustration size="card" toppingIds={['t_basil']} interactive={true} />
      )
    ).not.toThrow();
  });

  it('animate=false renders static with no animation issues', () => {
    expect(() =>
      render(<PizzaIllustration size="card" toppingIds={[]} animate={false} />)
    ).not.toThrow();
  });

  it('renders with empty toppingIds array', () => {
    const { container } = render(<PizzaIllustration size="card" toppingIds={[]} />);
    const toppingLayer = container.querySelector('.toppings-layer');
    expect(toppingLayer).toBeTruthy();
    expect(toppingLayer?.children.length).toBe(0);
  });
});
