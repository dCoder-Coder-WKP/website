export type Size = 'small' | 'medium' | 'large'
export type ToppingID = string

export interface Topping {
  id: ToppingID;
  name: string;
  category: string;
  prices: Record<Size, number>;
  mesh: 'sphere' | 'disc' | 'sliver' | 'chunk';
  color: string;
  veg?: boolean;
  isSoldOut?: boolean;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppings: ToppingID[];
  prices: Record<Size, number>;
  image?: string;
  image_url?: string;
  dietary: 'veg' | 'non-veg';
  spicy?: boolean;
  isSoldOut?: boolean;
}

export interface Extra {
  id: string;
  name: string;
  category: 'starter' | 'dessert';
  price: number;
  image?: string;
  image_url?: string;
  dietary: 'veg' | 'non-veg';
  description?: string;
  isSoldOut?: boolean;
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
  announcement_bar?: string;
}

export type OrderStatus = 'pending' | 'baking' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: number;
  status: OrderStatus;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: 'cod' | 'online';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  item_type: 'pizza' | 'extra';
  pizza_id?: string;
  extra_id?: string;
  size?: Size;
  quantity: number;
  price: number;
  customization_json: any;
}
