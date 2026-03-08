import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from './GlassCard';
import React from 'react';

// Mock gsap animations
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(),
  }
}));

// Mock framer-motion components
vi.mock('framer-motion', async () => {
  const React = await import('react');
  return {
    motion: {
      div: React.forwardRef(({ children, className, initial, animate, whileHover, transition, ...props }: any, ref: any) => (
        <div data-testid="motion-div" className={className} ref={ref} {...props}>
          {children}
        </div>
      )),
    },
  };
});

describe('GlassCard Component', () => {
  it('renders children with glassmorphism classes', () => {
    render(
      <GlassCard intensity="high">
        <span>Luxury Content</span>
      </GlassCard>
    );
    
    expect(screen.getByText('Luxury Content')).toBeInTheDocument();
    // Check if the high intensity classes are applied
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv.className).toContain('backdrop-blur-xl');
  });

  it('renders with low intensity classes', () => {
    render(
      <GlassCard intensity="low">
        <span>Subtle Content</span>
      </GlassCard>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv.className).toContain('backdrop-blur-sm');
  });
});
