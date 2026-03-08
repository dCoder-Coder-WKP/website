export type Size = 'small' | 'medium' | 'large'
export type ToppingID = string

export interface Topping {
  id: ToppingID;
  name: string;
  category: string;
  prices: Record<Size, number>;
  mesh: 'sphere' | 'disc' | 'sliver' | 'chunk';
  color: string;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppings: ToppingID[];
  prices: Record<Size, number>;
  image?: string;
  dietary: 'veg' | 'non-veg';
}

export interface Extra {
  id: string;
  name: string;
  category: 'starter' | 'dessert';
  price: number;
  image?: string;
  dietary: 'veg' | 'non-veg';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  type: 'offer' | 'notice' | 'event' | 'timing';
  ctaLabel?: string;
  ctaUrl?: string;
  pinned: boolean;
  expiresAt?: string;
}

export interface SiteConfig {
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
  min_order_amount: string;
  is_open: string;
  delivery_note: string;
}
