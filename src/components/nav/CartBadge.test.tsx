import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartBadge from './CartBadge';
import { useCartStore } from '@/store/useCartStore';

// Mock framer-motion to avoid jsdom animation issues
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { [key: string]: unknown }) => {
        const htmlProps: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(props)) {
          if (!['initial', 'animate', 'exit', 'transition'].includes(key)) htmlProps[key] = val;
        }
        return <span {...htmlProps}>{children}</span>;
      },
    },
  };
});

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('CartBadge', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('renders no badge when cart is empty (itemCount = 0)', () => {
    render(<CartBadge />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  it('renders badge with correct count when itemCount > 0', () => {
    useCartStore.setState({
      items: [
        { key: '1', type: 'pizza', name: 'Pizza', unitPrice: 100, quantity: 3 },
      ],
    });
    render(<CartBadge />);
    const badge = screen.getByTestId('cart-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('3');
  });

  it('badge disappears when cart is emptied', () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'pizza', name: 'Pizza', unitPrice: 100, quantity: 1 }],
    });
    const { rerender } = render(<CartBadge />);
    expect(screen.getByTestId('cart-badge')).toBeInTheDocument();

    useCartStore.setState({ items: [] });
    rerender(<CartBadge />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  it('badge shows count capped at 99+ for large quantities', () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'pizza', name: 'Pizza', unitPrice: 100, quantity: 150 }],
    });
    render(<CartBadge />);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('99+');
  });
});
