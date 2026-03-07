import { CartItem } from '@/store/useCartStore';

export interface MessageInput {
  items: CartItem[];
  total: number;
  address: string;
  mapsLink?: string;
}

function escapeName(name: string): string {
  // Escape asterisks that WhatsApp interprets as bold markers
  return name.replace(/\*/g, '\\*');
}

function sizeLabel(size?: string): string {
  if (!size) return '';
  const map: Record<string, string> = { small: 'S', medium: 'M', large: 'L' };
  return map[size] || size;
}

export function composeWhatsAppMessage(input: MessageInput): string {
  const lines: string[] = [];

  lines.push('🍕 *We Knead Pizza — New Order*');
  lines.push('');

  input.items.forEach((item, i) => {
    const sizeTag = item.size ? ` (${sizeLabel(item.size)})` : '';
    lines.push(`${i + 1}. ${escapeName(item.name)}${sizeTag} × ${item.quantity} — ₹${item.unitPrice * item.quantity}`);

    if (item.type === 'custom' && item.toppings && item.toppings.length > 0) {
      lines.push(`   _Toppings: ${item.toppings.join(', ')}_`);
    }
  });

  lines.push('');
  lines.push(`*Total: ₹${input.total}*`);
  lines.push('');
  lines.push(`📮 *Deliver to:* ${input.address}`);

  if (input.mapsLink && input.mapsLink.length > 0) {
    lines.push(`📍 ${input.mapsLink}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppURL(message: string): string {
  return `https://wa.me/918484802540?text=${encodeURIComponent(message)}`;
}
