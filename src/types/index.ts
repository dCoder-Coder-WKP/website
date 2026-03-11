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
  isBestseller?: boolean;
  isSpicy?: boolean;
  highlight?: string;
  region?: string;
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
  [key: string]: string | undefined;
  whatsapp_number?: string;
  phone_number?: string;
  email_address?: string;
  opening_time?: string;
  closing_time?: string;
  min_order_amount?: string;
  is_open?: string;
  delivery_note?: string;
  announcement_bar?: string;
  logo_url?: string;
  hero_bg_url?: string;
  dough_img_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  hero_secondary_cta_text?: string;
  hero_secondary_cta_link?: string;
  about_title?: string;
  about_content?: string;
  about_image_url?: string;
  address_line1?: string;
  address_line2?: string;
  google_maps_link?: string;
  fssai_license?: string;
  meta_description?: string;
  meta_keywords?: string;
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
