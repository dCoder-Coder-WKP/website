import { createClient } from '@supabase/supabase-js';
import { PIZZAS, TOPPINGS, EXTRAS } from '../src/lib/menuData';

const supabaseUrl = 'https://lrrrapitaqfvrxqkcoac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycnJhcGl0YXFmdnJ4cWtjb2FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk1NTU2OSwiZXhwIjoyMDg4NTMxNTY5fQ.w9eUDdHVddkBI32mbwOxpUT9mVBFVkDtk4NxyayJPXQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching categories to resolve IDs...');
  const { data: categories, error: catErr } = await supabase.from('categories').select('id, slug');
  if (catErr) throw new Error(catErr.message);

  const vegPizzaCat = categories.find(c => c.slug === 'veg-pizza')?.id;
  const nonVegPizzaCat = categories.find(c => c.slug === 'chicken-pizza')?.id;
  const starterCat = categories.find(c => c.slug === 'starter')?.id;
  const dessertCat = categories.find(c => c.slug === 'dessert')?.id;
  
  if (!vegPizzaCat || !starterCat || !dessertCat) {
      throw new Error('Categories not found! Make sure you ran the SQL schema first.');
  }

  console.log('Upserting toppings...');
  for (const t of TOPPINGS) {
    const { error } = await supabase.from('toppings').upsert({
      slug: t.id,
      name: t.name,
      category: t.category,
      mesh_type: t.mesh,
      color_hex: t.color,
      price_small: t.prices.small,
      price_medium: t.prices.medium,
      price_large: t.prices.large,
      is_veg: t.veg ?? true
    }, { onConflict: 'slug' });
    if (error) console.error('Error on topping', t.id, error.message);
  }

  console.log('Upserting pizzas...');
  for (const pizza of PIZZAS) {
    const catId = pizza.id.includes('chicken') ? nonVegPizzaCat : vegPizzaCat;
    const { error } = await supabase.from('pizzas').upsert({
      slug: pizza.id,
      name: pizza.name,
      description: pizza.description,
      category_id: catId,
      price_small: pizza.prices.small,
      price_medium: pizza.prices.medium,
      price_large: pizza.prices.large,
      is_bestseller: false,
      is_spicy: pizza.spicy ?? false
    }, { onConflict: 'slug' });
    if (error) console.error('Error on pizza', pizza.id, error.message);
  }

  console.log('Upserting pizza_toppings (clearing first)...');
  await supabase.from('pizza_toppings').delete().neq('pizza_id', '00000000-0000-0000-0000-000000000000'); // delete all
  
  for (const pizza of PIZZAS) {
    // Get pizza internal ID
    const { data: pRows } = await supabase.from('pizzas').select('id').eq('slug', pizza.id);
    if (!pRows || pRows.length === 0) continue;
    const pizzaId = pRows[0].id;
    
    for (const toppingSlug of pizza.toppings) {
      const { data: tRows } = await supabase.from('toppings').select('id').eq('slug', toppingSlug);
      if (!tRows || tRows.length === 0) continue;
      const toppingId = tRows[0].id;
      
      const { error } = await supabase.from('pizza_toppings').upsert({
        pizza_id: pizzaId,
        topping_id: toppingId
      });
      if (error) console.error('Error on pizza_topping', pizza.id, toppingSlug, error.message);
    }
  }

  console.log('Upserting extras...');
  for (const extra of EXTRAS) {
    const catId = extra.id.includes('brownie') ? dessertCat : starterCat;
    const { error } = await supabase.from('extras').upsert({
      slug: extra.id,
      name: extra.name,
      description: extra.description,
      category_id: catId,
      price: extra.price,
      is_veg: extra.veg ?? true
    }, { onConflict: 'slug' });
    if (error) console.error('Error on extra', extra.id, error.message);
  }

  console.log('Data seeding complete!');
}

main().catch(console.error);
