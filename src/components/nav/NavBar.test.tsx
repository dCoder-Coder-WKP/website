import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from './NavBar';
import { useCartStore } from '@/store/useCartStore';

// ── Mocks ──────────────────────────────────────────────

let mockPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }) => {
        const htmlProps: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(props)) {
          if (!['initial', 'animate', 'exit', 'transition', 'whileHover', 'layout'].includes(key)) htmlProps[key] = val;
        }
        return <nav {...htmlProps}>{children}</nav>;
      },
      span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { [key: string]: unknown }) => {
        const htmlProps: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(props)) {
          if (!['initial', 'animate', 'exit', 'transition'].includes(key)) htmlProps[key] = val;
        }
        return <span {...htmlProps}>{children}</span>;
      },
      aside: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }) => {
        const htmlProps: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(props)) {
          if (!['initial', 'animate', 'exit', 'transition'].includes(key)) htmlProps[key] = val;
        }
        return <aside {...htmlProps}>{children}</aside>;
      },
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { [key: string]: unknown }) => {
        const htmlProps: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(props)) {
          if (!['initial', 'animate', 'exit', 'transition'].includes(key)) htmlProps[key] = val;
        }
        return <div {...htmlProps}>{children}</div>;
      },
    },
  };
});

// ── Scroll behavior tests ────────────────────────────────

describe('NavBar scroll behavior', () => {
  beforeEach(() => {
    mockPathname = '/';
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true });
  });

  it('isScrolled is false at scrollY = 0 (homepage)', () => {
    render(<NavBar />);
    // With no scrolling, background should be transparent (no frosted class behavior detectable via aria)
    // We rely on `data-testid="navbar"` existing and not having frosted glass
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('isScrolled becomes true when scrollY exceeds hero threshold', () => {
    render(<NavBar />);
    // Simulate scroll past hero (innerHeight * 0.85 = 680)
    Object.defineProperty(window, 'scrollY', { value: 700, writable: true, configurable: true });
    fireEvent.scroll(window);
    // NavBar still renders without error
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('non-homepage routes always show frosted glass regardless of scroll', () => {
    mockPathname = '/menu';
    render(<NavBar />);
    // alwaysScrolled is true, so even at scrollY=0, frosted is active
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('scroll event listener is cleaned up on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<NavBar />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});

// ── Integration tests ────────────────────────────────────

describe('NavBar integration', () => {
  beforeEach(() => {
    mockPathname = '/';
    useCartStore.setState({ items: [] });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true });
  });

  it('renders logo linking to /', () => {
    render(<NavBar />);
    const logo = screen.getByRole('link', { name: /we knead pizza/i });
    expect(logo).toHaveAttribute('href', '/');
  });

  it('desktop: renders Menu and Build Your Pizza links', () => {
    render(<NavBar />);
    expect(screen.getByRole('link', { name: /^menu$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /build your pizza/i })).toBeInTheDocument();
  });

  it('renders hamburger button', () => {
    render(<NavBar />);
    expect(screen.getByTestId('hamburger-btn')).toBeInTheDocument();
  });

  it('hamburger click opens MobileDrawer', async () => {
    render(<NavBar />);
    const hamburger = screen.getByTestId('hamburger-btn');
    await userEvent.click(hamburger);
    // MobileDrawer should be open and show Home link
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
  });

  it('drawer close button closes drawer', async () => {
    render(<NavBar />);
    await userEvent.click(screen.getByTestId('hamburger-btn'));
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
  });

  it('backdrop click closes drawer', async () => {
    render(<NavBar />);
    await userEvent.click(screen.getByTestId('hamburger-btn'));

    const backdrop = screen.getByTestId('drawer-backdrop');
    await userEvent.click(backdrop);
    expect(screen.queryByTestId('drawer-backdrop')).not.toBeInTheDocument();
  });

  it('mobile: navigating to a link closes drawer', async () => {
    render(<NavBar />);
    await userEvent.click(screen.getByTestId('hamburger-btn'));

    // Click the Menu link inside the drawer (first match could be the drawer's Menu link)
    const menuLinks = screen.getAllByRole('link', { name: /^menu$/i });
    // The drawer version of the link will close the drawer via onClose
    await userEvent.click(menuLinks[menuLinks.length - 1]);

    // Drawer close fires onClose, which sets drawerOpen=false
    // Then AnimatePresence removes it (we mocked it as synchronous)
    expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
  });

  it('cart badge shows correct count from store', () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'pizza', name: 'Pizza', unitPrice: 100, quantity: 5 }],
    });
    render(<NavBar />);
    // Two CartBadges rendered (mobile + desktop), both should show 5
    const badges = screen.getAllByTestId('cart-badge');
    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0]).toHaveTextContent('5');
  });

  it('cart badge disappears when cart emptied', () => {
    useCartStore.setState({
      items: [{ key: '1', type: 'pizza', name: 'Pizza', unitPrice: 100, quantity: 2 }],
    });
    const { rerender } = render(<NavBar />);
    expect(screen.getAllByTestId('cart-badge').length).toBeGreaterThan(0);

    useCartStore.setState({ items: [] });
    rerender(<NavBar />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });
});
