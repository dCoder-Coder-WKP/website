import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import PizzaIllustration from './PizzaIllustration';

// Mock framer-motion since the component uses it heavily
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('PizzaIllustration', () => {
  it('renders the pizza visual container with dataset info', () => {
    const { getByTestId } = render(<PizzaIllustration size="card" toppingIds={['t_basil']} />);
    const visual = getByTestId('pizza-visual');

    expect(visual).toBeTruthy();
    expect(visual.getAttribute('data-toppings')).toBe('t_basil');
    expect(visual.getAttribute('data-picked-image')).toBeTruthy();
  });

  it('applies size specific utility classes', () => {
    const { getByTestId, rerender } = render(
      <PizzaIllustration size="thumb" toppingIds={[]} animate={false} />
    );

    expect(getByTestId('pizza-visual').className).toContain('h-24');
    expect(getByTestId('pizza-visual').className).toContain('w-24');

    rerender(<PizzaIllustration size="hero" toppingIds={[]} animate={false} />);
    expect(getByTestId('pizza-visual').className).toContain('h-[520px]');
    expect(getByTestId('pizza-visual').className).toContain('w-full');
  });

  it('selects curated photo when toppings include matching keyword', () => {
    const { getByTestId } = render(
      <PizzaIllustration size="card" toppingIds={['t_pepperoni']} seed={1} />
    );

    expect(getByTestId('pizza-visual').getAttribute('data-picked-image')).toBe('woodfire-classic');
  });

  it('falls back to deterministic pick when no toppings are passed', () => {
    const { getByTestId } = render(
      <PizzaIllustration size="card" toppingIds={[]} seed={123}
      />
    );
    const picked = getByTestId('pizza-visual').getAttribute('data-picked-image');
    expect(picked).toBeTruthy();
  });

  it('respects interactive prop without throwing', () => {
    expect(() =>
      render(<PizzaIllustration size="card" toppingIds={['t_onion']} interactive />)
    ).not.toThrow();
  });

  it('renders grain and metadata overlays', () => {
    const { container } = render(<PizzaIllustration size="card" toppingIds={[]} />);
    expect(container.querySelector('img')).toBeTruthy();
    expect(container.querySelector('.absolute.top-4.left-4')).toBeTruthy();
    expect(container.querySelector('.absolute.bottom-4.right-4')).toBeTruthy();
  });
});
