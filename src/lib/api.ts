import { supabase } from './supabase'
import { logger } from './logger'
import { Pizza, Topping, Extra, Notification, SiteConfig, ToppingID, Size } from '../types'
import { PIZZAS, TOPPINGS, EXTRAS } from './menuData'

export async function fetchPizzas(): Promise<Pizza[]> {
  try {
    const { data, error } = await supabase
      .from('pizzas')
      .select(`
        id, slug, name, description, is_bestseller, is_spicy, price_small, price_medium, price_large, image_url, is_sold_out,
        pizza_toppings (
          toppings ( slug, is_active, is_veg, is_sold_out )
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return data.map((row: any) => {
      const isVeg = row.pizza_toppings.every((pt: any) => pt.toppings.is_veg)
      return {
        id: row.slug,
        name: row.name,
        description: row.description,
        toppings: row.pizza_toppings
           .map((pt: any) => pt.toppings.slug) as ToppingID[],
        prices: {
          small: row.price_small,
          medium: row.price_medium,
          large: row.price_large
        },
        dietary: isVeg ? 'veg' : 'non-veg',
        image: row.image_url || undefined,
        image_url: row.image_url,
        isSoldOut: row.is_sold_out
      }
    })
  } catch (err) {
    logger.warn('Supabase fetchPizzas failed, using static fallback', err, 'api')
    return PIZZAS as Pizza[]
  }
}

export async function fetchToppings(): Promise<Topping[]> {
  try {
    const { data, error } = await supabase
      .from('toppings')
      .select('*')
      .eq('is_active', true)

    if (error) throw error

    return data.map((row: any) => ({
      id: row.slug,
      name: row.name,
      category: row.category,
      prices: {
        small: row.price_small,
        medium: row.price_medium,
        large: row.price_large
      },
      mesh: row.mesh_type,
      color: row.color_hex,
      isSoldOut: row.is_sold_out
    }))
  } catch (err) {
    logger.warn('Supabase fetchToppings failed, using static fallback', err, 'api')
    return TOPPINGS as Topping[]
  }
}

export async function fetchExtras(): Promise<Extra[]> {
  try {
    const { data, error } = await supabase
      .from('extras')
      .select('*, categories(slug)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return data.map((row: any) => ({
      id: row.slug,
      name: row.name,
      category: row.categories?.slug === 'starter' ? 'starter' : 'dessert',
      price: row.price,
      dietary: row.is_veg ? 'veg' : 'non-veg',
      image: row.image_url || undefined,
      image_url: row.image_url,
      isSoldOut: row.is_sold_out
    }))
  } catch (err) {
    logger.warn('Supabase fetchExtras failed, using static fallback', err, 'api')
    return EXTRAS as Extra[]
  }
}

export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    const now = new Date()
    return data
      .filter((row: any) => !row.expires_at || new Date(row.expires_at) > now)
      .map((row: any) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        imageUrl: row.image_url,
        type: row.type,
        ctaLabel: row.cta_label,
        ctaUrl: row.cta_url,
        pinned: row.pinned,
        expiresAt: row.expires_at
      }))
  } catch (err) {
    logger.warn('Supabase fetchNotifications failed', err, 'api')
    return []
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')

    if (error) throw error

    const config: any = {}
    data.forEach((row: any) => {
      config[row.key] = row.value
    })
    return config as SiteConfig
  } catch (err) {
    logger.warn('Supabase fetchSiteConfig failed', err, 'api')
    return null
  }
}

/**
 * Validates an order against server-side prices via the Supabase Edge Function.
 * Fails CLOSED: if the edge function is unreachable, the order is rejected.
 * This prevents price manipulation by treating an unavailable validator as invalid.
 */
export async function validateOrder(items: any[], claimedTotal: number) {
  try {
    const { data, error } = await supabase.functions.invoke('validate-order', {
      body: { items, claimedTotal },
    });

    if (error) {
      logger.error('Edge function validate-order failed', error, 'api')
      // Fail CLOSED: reject the order when the validator is down
      return { isValid: false, calculatedTotal: 0, claimedTotal, verified: false };
    }

    return data as { isValid: boolean; calculatedTotal: number; claimedTotal: number; verified: boolean };
  } catch (err) {
    logger.error('Unexpected error calling validate-order', err, 'api')
    return { isValid: false, calculatedTotal: 0, claimedTotal, verified: false };
  }
}
