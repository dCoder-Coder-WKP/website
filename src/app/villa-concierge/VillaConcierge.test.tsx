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
  it('renders the luxury concierge landing page', () => {
    render(<VillaConciergePage />);
    
    // Title
    expect(screen.getByText('Exclusive to Aldona residents')).toBeInTheDocument();
    expect(screen.getByText(/Villa-to-Table/i)).toBeInTheDocument();
    expect(screen.getByText(/Concierge/i)).toBeInTheDocument();

    // Feature blocks
    expect(screen.getByText('Artisanal White-Glove')).toBeInTheDocument();
    expect(screen.getByText('Terroir Selection')).toBeInTheDocument();
    expect(screen.getByText('Silent Logistics')).toBeInTheDocument();

    // CTA
    expect(screen.getByText('Verify My Villa')).toBeInTheDocument();
  });
});
