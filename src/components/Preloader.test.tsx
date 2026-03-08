import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Preloader from './Preloader';

// Mock GSAP to immediately trigger onComplete and animations
vi.mock('gsap', () => {
    return {
        gsap: {
            timeline: vi.fn().mockImplementation((config) => {
                // immediately trigger onComplete for testing
                if (config && config.onComplete) {
                    setTimeout(config.onComplete, 0); // Need small delay so initial render happens
                }
                return {
                    to: vi.fn().mockReturnThis(),
                    fromTo: vi.fn().mockReturnThis(),
                    add: vi.fn().mockReturnThis(),
                };
            }),
        },
    };
});

describe('Preloader', () => {
    beforeEach(() => {
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it('Preloader shows on first visit (no sessionStorage flag)', () => {
        const onComplete = vi.fn();
        render(<Preloader onComplete={onComplete} />);

        // Should render the text
        expect(screen.getByText('We')).toBeInTheDocument();
        expect(screen.getByText('Knead')).toBeInTheDocument();
        expect(screen.getByText('Pizza')).toBeInTheDocument();
    });

    it('Preloader does not show if sessionStorage wkp-loaded is set', () => {
        sessionStorage.setItem('wkp-loaded', 'true');
        const onComplete = vi.fn();

        const { container } = render(<Preloader onComplete={onComplete} />);

        expect(container.firstChild).toBeNull();
        expect(onComplete).toHaveBeenCalled();
    });

    it('Preloader sets sessionStorage flag on complete', async () => {
        const onComplete = vi.fn();
        render(<Preloader onComplete={onComplete} />);

        // GSAP mock will call onComplete after setTimeout
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(sessionStorage.getItem('wkp-loaded')).toBe('true');
        expect(onComplete).toHaveBeenCalled();
    });
});
