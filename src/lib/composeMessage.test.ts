import { describe, it, expect } from 'vitest';
import {
  composeWhatsAppMessage,
  buildWhatsAppURL,
  MessageInput,
} from './composeMessage';

// Helper to create a minimal MessageInput
function makeInput(overrides: Partial<MessageInput> = {}): MessageInput {
  return {
    items: [
      { key: '1', type: 'pizza', name: 'Margherita', unitPrice: 200, quantity: 2, size: 'medium' },
    ],
    total: 400,
    address: '123 Main St',
    ...overrides,
  };
}

describe('composeWhatsAppMessage', () => {
  it('message starts with We Knead Pizza header', () => {
    const msg = composeWhatsAppMessage(makeInput());
    expect(msg).toContain('🍕 *We Knead Pizza — New Order*');
  });

  it('includes all cart items in message', () => {
    const input = makeInput({
      items: [
        { key: '1', type: 'pizza', name: 'Margherita', unitPrice: 200, quantity: 1 },
        { key: '2', type: 'extra', name: 'Garlic Bread', unitPrice: 100, quantity: 2 },
      ],
      total: 400,
    });
    const msg = composeWhatsAppMessage(input);
    expect(msg).toContain('Margherita');
    expect(msg).toContain('Garlic Bread');
  });

  it('includes size and quantity for each item', () => {
    const msg = composeWhatsAppMessage(makeInput());
    expect(msg).toContain('(M)');
    expect(msg).toContain('× 2');
  });

  it('custom pizza shows topping list', () => {
    const input = makeInput({
      items: [
        { key: 'c', type: 'custom', name: 'Custom Pizza', unitPrice: 300, quantity: 1, toppings: ['Cheese', 'Onion'] },
      ],
    });
    const msg = composeWhatsAppMessage(input);
    expect(msg).toContain('_Toppings: Cheese, Onion_');
  });

  it('non-custom pizza does not show topping list', () => {
    const msg = composeWhatsAppMessage(makeInput());
    expect(msg).not.toContain('Toppings:');
  });

  it('includes mapsLink when provided', () => {
    const input = makeInput({ mapsLink: 'https://www.google.com/maps?q=1,2' });
    const msg = composeWhatsAppMessage(input);
    expect(msg).toContain('📍 https://www.google.com/maps?q=1,2');
  });

  it('omits maps link line when mapsLink undefined', () => {
    const input = makeInput({ mapsLink: undefined });
    const msg = composeWhatsAppMessage(input);
    expect(msg).not.toContain('📍');
  });

  it('omits maps link line when mapsLink empty string', () => {
    const input = makeInput({ mapsLink: '' });
    const msg = composeWhatsAppMessage(input);
    expect(msg).not.toContain('📍');
  });

  it('total is correctly formatted with rupee symbol', () => {
    const msg = composeWhatsAppMessage(makeInput({ total: 1250 }));
    expect(msg).toContain('*Total: ₹1250*');
  });

  it('escapes asterisks in pizza names', () => {
    const input = makeInput({
      items: [
        { key: '1', type: 'pizza', name: 'Super*Star', unitPrice: 100, quantity: 1 },
      ],
    });
    const msg = composeWhatsAppMessage(input);
    expect(msg).toContain('Super\\*Star');
  });
});

describe('buildWhatsAppURL', () => {
  it('encodes message correctly', () => {
    const url = buildWhatsAppURL('Hello World');
    expect(url).toContain(encodeURIComponent('Hello World'));
    expect(url).toContain('https://wa.me/');
  });

  it('uses correct phone number 918484802540', () => {
    const url = buildWhatsAppURL('test');
    expect(url).toContain('918484802540');
  });
});
