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

  console.log(`  veg-pizza:     ${vegPizzaCat}`);
  console.log(`  chicken-pizza: ${nonVegPizzaCat}`);
  console.log(`  starter:       ${starterCat}`);
  console.log(`  dessert:       ${dessertCat}`);

  // ----- Toppings -----
  console.log('\nUpserting toppings...');
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
    if (error) console.error('  ❌ Topping', t.id, error.message);
    else console.log('  ✅', t.id);
  }

  // ----- Pizzas (FIX: use dietary field, not id-based heuristic) -----
  console.log('\nUpserting pizzas...');
  for (const pizza of PIZZAS) {
    // CRITICAL FIX: Use the dietary field from menuData, not a string match on the id
    const catId = pizza.dietary === 'non-veg' ? nonVegPizzaCat : vegPizzaCat;
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
    if (error) console.error('  ❌ Pizza', pizza.id, error.message);
    else console.log(`  ✅ ${pizza.id} → ${pizza.dietary === 'non-veg' ? 'CHICKEN' : 'VEG'}`);
  }

  // ----- Pizza Toppings -----
  console.log('\nUpserting pizza_toppings...');
  // Clear all first
  await supabase.from('pizza_toppings').delete().neq('pizza_id', '00000000-0000-0000-0000-000000000000');
  
  for (const pizza of PIZZAS) {
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
      if (error) console.error('  ❌ pizza_topping', pizza.id, toppingSlug, error.message);
    }
    console.log(`  ✅ ${pizza.id} (${pizza.toppings.length} toppings)`);
  }

  // ----- Extras (FIX: use category field, not id-based heuristic) -----
  console.log('\nUpserting extras...');
  for (const extra of EXTRAS) {
    const catId = extra.category === 'dessert' ? dessertCat : starterCat;
    const { error } = await supabase.from('extras').upsert({
      slug: extra.id,
      name: extra.name,
      description: extra.description ?? '',
      category_id: catId,
      price: extra.price,
      is_veg: extra.dietary === 'veg'
    }, { onConflict: 'slug' });
    if (error) console.error('  ❌ Extra', extra.id, error.message);
    else console.log(`  ✅ ${extra.id} → ${extra.category}`);
  }

  console.log('\n✅ Data seeding complete!');
}

main().catch(console.error);
