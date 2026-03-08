import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationBanner from './NotificationBanner';
import '@testing-library/jest-dom';
import { Notification } from '@/types';

describe('NotificationBanner', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const mockNotif: Notification = {
    id: '123',
    title: 'Test Notification',
    body: 'This is a test',
    type: 'notice',
    pinned: false
  };

  it('NotificationBanner renders with title and body', () => {
    render(<NotificationBanner notifications={[mockNotif]} />);
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  it('NotificationBanner dismisses and stores sessionStorage key', async () => {
    render(<NotificationBanner notifications={[mockNotif]} />);
    
    const dismissBtn = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('wkp-dismissed-123')).toBe('true');
      expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
    });
  });

  it('NotificationBanner shows CTA button when cta_label present', () => {
    const notifWithCta = { ...mockNotif, ctaLabel: 'Click Me', ctaUrl: '/test' };
    render(<NotificationBanner notifications={[notifWithCta]} />);
    
    const cta = screen.getByText('Click Me');
    expect(cta).toBeInTheDocument();
    expect(cta.closest('a')).toHaveAttribute('href', '/test');
  });

  it('NotificationBanner shows image thumbnail when imageUrl present', () => {
    const notifWithImg = { ...mockNotif, imageUrl: '/test.jpg' };
    render(<NotificationBanner notifications={[notifWithImg]} />);
    
    const img = screen.getByAltText('Test Notification');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('dismissed notification not shown again in same session', () => {
    sessionStorage.setItem('wkp-dismissed-123', 'true');
    render(<NotificationBanner notifications={[mockNotif]} />);
    
    expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
  });
});
