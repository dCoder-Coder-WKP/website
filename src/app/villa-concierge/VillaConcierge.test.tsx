import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import VillaConciergePage from './page';
import React from 'react';

// Mock framer-motion since it uses motion.div inline
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

// Mock GlassCard
vi.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children }: any) => <div data-testid="glass-card">{children}</div>,
}));

describe('VillaConciergePage', () => {
  it('renders the local delivery landing page', () => {
    render(<VillaConciergePage />);
    
    // Title
    expect(screen.getByText(/Available in Aldona/i)).toBeInTheDocument();
    expect(screen.getByText(/Pizza to Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Door/i)).toBeInTheDocument();

    // Feature blocks
    expect(screen.getByText('Order by WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Fresh Every Day')).toBeInTheDocument();
    expect(screen.getByText('Simple & Hassle-Free')).toBeInTheDocument();

    // CTA
    expect(screen.getByText('Order on WhatsApp')).toBeInTheDocument();
  });
});
