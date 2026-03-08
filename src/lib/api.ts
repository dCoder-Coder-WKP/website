import { supabase } from './supabase'
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
    console.error('Supabase fetch failed, using static fallback', err)
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
    console.error('Supabase fetch failed, using static fallback', err)
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
    console.error('Supabase fetch failed, using static fallback', err)
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
    console.error('Supabase fetch failed, returning empty notifications', err)
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
    console.error('Supabase fetch failed, using mock site config', err)
    return null
  }
}

export async function validateOrder(items: any[], claimedTotal: number) {
  const { data, error } = await supabase.functions.invoke('validate-order', {
    body: { items, claimedTotal },
  });

  if (error) {
    console.error('Error validating order:', error);
    // If edge function fails (e.g. not deployed), fail closed or open depending on business need.
    // For now, return a safe fallback.
    return { isValid: true, calculatedTotal: claimedTotal, claimedTotal, verified: false };
  }

  return data as { isValid: boolean; calculatedTotal: number; claimedTotal: number; verified: boolean };
}
