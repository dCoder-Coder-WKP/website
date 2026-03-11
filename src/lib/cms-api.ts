// =====================================================
// We Knead Pizza: CMS API Functions
// =====================================================
// This file provides API functions to fetch data from
// the new CMS-driven Supabase schema.
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =====================================================
// Types
// =====================================================

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Topping {
  id: string;
  name: string;
  description?: string;
  price: number;
  dietary: 'veg' | 'non-veg';
  sort_order: number;
  is_active: boolean;
  image_url?: string;
}

export interface Size {
  id: string;
  name: string;
  description?: string;
  diameter_cm: number;
  slices: number;
  sort_order: number;
  is_active: boolean;
}

export interface Pizza {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  dietary: 'veg' | 'non-veg';
  is_sold_out: boolean;
  is_bestseller: boolean;
  is_spicy: boolean;
  highlight?: string;
  region?: string;
  sort_order: number;
  is_active: boolean;
  image_url?: string;
}

export interface PizzaPrice {
  id: string;
  pizza_id: string;
  size_id: string;
  price: number;
  is_active: boolean;
}

export interface Extra {
  id: string;
  name: string;
  description?: string;
  price: number;
  dietary: 'veg' | 'non-veg';
  category_id?: string;
  is_sold_out: boolean;
  is_bestseller: boolean;
  sort_order: number;
  is_active: boolean;
  image_url?: string;
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'image' | 'url' | 'time' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  content: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  sort_order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
}

// =====================================================
// Site Configuration
// =====================================================

export async function fetchSiteConfig(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')
      .eq('is_public', true);

    if (error) throw error;

    const config: Record<string, string> = {};
    data?.forEach(item => {
      config[item.key] = item.value;
    });

    return config;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return {};
  }
}

export async function fetchSiteStatus(): Promise<{
  isOpen: boolean;
  isMaintenanceMode: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')
      .in('key', ['is_open', 'site_maintenance_mode']);

    if (error) throw error;

    const config = data?.reduce((acc, item) => {
      acc[item.key] = item.value === 'true';
      return acc;
    }, {} as Record<string, boolean>) || {};

    return {
      isOpen: config.is_open ?? true,
      isMaintenanceMode: config.site_maintenance_mode ?? false
    };
  } catch (error) {
    console.error('Error fetching site status:', error);
    return { isOpen: true, isMaintenanceMode: false };
  }
}

// =====================================================
// Menu Data
// =====================================================

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchSizes(): Promise<Size[]> {
  try {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

export async function fetchToppings(): Promise<Topping[]> {
  try {
    const { data, error } = await supabase
      .from('toppings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching toppings:', error);
    return [];
  }
}

export async function fetchPizzas(): Promise<Pizza[]> {
  try {
    const { data, error } = await supabase
      .from('pizzas')
      .select(`
        *,
        category:categories(name),
        pizza_prices(
          size_id,
          price,
          size:sizes(name, sort_order)
        )
      `)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pizzas:', error);
    return [];
  }
}

export async function fetchExtras(): Promise<Extra[]> {
  try {
    const { data, error } = await supabase
      .from('extras')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching extras:', error);
    return [];
  }
}

// =====================================================
// Content Data
// =====================================================

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export async function fetchPromotionalBanners(): Promise<PromotionalBanner[]> {
  try {
    const { data, error } = await supabase
      .from('promotional_banners')
      .select('*')
      .eq('is_active', true)
      .or('start_date.is.null,start_date.lte.now()')
      .or('end_date.is.null,end_date.gte.now()')
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching promotional banners:', error);
    return [];
  }
}

export async function fetchFAQ(): Promise<FAQ[]> {
  try {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return [];
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// =====================================================
// Helper Functions
// =====================================================

export function getPizzaPrice(pizza: any, sizeId: string): number {
  if (!pizza.pizza_prices) return 0;
  const price = pizza.pizza_prices.find((p: any) => p.size_id === sizeId);
  return price?.price || 0;
}

export function getPizzaPrices(pizza: any): Record<string, number> {
  if (!pizza.pizza_prices) return {};
  return pizza.pizza_prices.reduce((acc: Record<string, number>, price: any) => {
    acc[price.size_id] = price.price;
    return acc;
  }, {});
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(price);
}

export function getDietaryIcon(dietary: 'veg' | 'non-veg'): string {
  return dietary === 'veg' ? '🟢' : '🔴';
}

export function getDietaryLabel(dietary: 'veg' | 'non-veg'): string {
  return dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian';
}

// =====================================================
// Legacy Compatibility
// =====================================================

// Convert new CMS data to legacy format for existing components
export function convertToLegacyFormat(
  pizzas: Pizza[],
  toppings: Topping[],
  extras: Extra[],
  sizes: Size[],
  categories: Category[]
) {
  const legacyPizzas = pizzas.map(pizza => ({
    id: pizza.id,
    name: pizza.name,
    description: pizza.description || '',
    category: categories.find(c => c.id === pizza.category_id)?.name || 'Pizza',
    dietary: pizza.dietary,
    prices: getPizzaPrices(pizza),
    image: pizza.image_url,
    isSoldOut: pizza.is_sold_out,
    isBestseller: pizza.is_bestseller,
    isSpicy: pizza.is_spicy,
    highlight: pizza.highlight,
    region: pizza.region,
    toppings: [] // Will be populated separately if needed
  }));

  const legacyToppings = toppings.map(topping => ({
    id: topping.id,
    name: topping.name,
    description: topping.description || '',
    price: topping.price,
    category: 'toppings',
    dietary: topping.dietary,
    image: topping.image_url,
    prices: { small: topping.price, medium: topping.price, large: topping.price },
    mesh: 'sphere' as const,
    color: topping.dietary === 'veg' ? '#4CAF50' : '#F44336',
    isSoldOut: !topping.is_active
  }));

  const legacyExtras = extras.map(extra => ({
    id: extra.id,
    name: extra.name,
    description: extra.description || '',
    price: extra.price,
    category: (categories.find(c => c.id === extra.category_id)?.name?.toLowerCase() === 'starter' ? 'starter' : 'dessert') as 'starter' | 'dessert',
    dietary: extra.dietary,
    image: extra.image_url,
    isSoldOut: extra.is_sold_out,
    isBestseller: extra.is_bestseller
  }));

  const legacySizes = sizes.map(size => ({
    id: size.id,
    name: size.name,
    description: size.description || '',
    diameter_cm: size.diameter_cm,
    slices: size.slices
  }));

  return {
    pizzas: legacyPizzas,
    toppings: legacyToppings,
    extras: legacyExtras,
    sizes: legacySizes
  };
}
