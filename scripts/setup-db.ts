import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { PIZZAS, TOPPINGS, EXTRAS } from '../src/lib/menuData';

const connectionString = 'postgresql://postgres:Afsaldanha67!@db.lrrrapitaqfvrxqkcoac.supabase.co:5432/postgres';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrrrapitaqfvrxqkcoac.supabase.co';
// We need the service role key for seeding, but for setup purposes, we can use the same connection string for everything since we have the DB password.
// But Supabase client needs the service role key to bypass RLS. Let's use `pg` to populate data too, or use the JS client if we only use the DB directly as an admin (postgres user). Wait, postgres user bypasses RLS anyway! So we can just use `pg` for everything!
// Actually, using `pg` for everything is easier because we don't have the service role key yet (the prompt says: NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co and SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]).
// Wait, the prompt says: 'SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY] # server-only, never expose'. The user didn't provide it!
// Ah, the user DID provide it!
// In the prompt: 
// anon public: eyJhb...
// service_role: eyJhb...
// URI: postgresql://...
// So I have everything!

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycnJhcGl0YXFmdnJ4cWtjb2FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk1NTU2OSwiZXhwIjoyMDg4NTMxNTY5fQ.w9eUDdHVddkBI32mbwOxpUT9mVBFVkDtk4NxyayJPXQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const schemaSql = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text UNIQUE NOT NULL,
 label text NOT NULL,
 sort_order integer NOT NULL DEFAULT 0,
 is_active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO categories (slug, label, sort_order) VALUES
 ('veg-pizza', 'Veg Pizzas', 1),
 ('chicken-pizza', 'Chicken Pizzas', 2),
 ('starter', 'Starters', 3),
 ('dessert', 'Desserts', 4)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS toppings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text UNIQUE NOT NULL,
 name text NOT NULL,
 category text NOT NULL,
 mesh_type text NOT NULL DEFAULT 'sphere',
 color_hex text NOT NULL DEFAULT '#888888',
 price_small integer NOT NULL DEFAULT 0,
 price_medium integer NOT NULL DEFAULT 0,
 price_large integer NOT NULL DEFAULT 0,
 is_veg boolean NOT NULL DEFAULT true,
 is_active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pizzas (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text UNIQUE NOT NULL,
 name text NOT NULL,
 description text NOT NULL DEFAULT '',
 category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
 price_small integer NOT NULL,
 price_medium integer NOT NULL,
 price_large integer NOT NULL,
 is_bestseller boolean NOT NULL DEFAULT false,
 is_spicy boolean NOT NULL DEFAULT false,
 is_active boolean NOT NULL DEFAULT true,
 sort_order integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pizza_toppings (
 pizza_id uuid NOT NULL REFERENCES pizzas(id) ON DELETE CASCADE,
 topping_id uuid NOT NULL REFERENCES toppings(id) ON DELETE CASCADE,
 PRIMARY KEY (pizza_id, topping_id)
);

CREATE TABLE IF NOT EXISTS extras (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text UNIQUE NOT NULL,
 name text NOT NULL,
 description text NOT NULL DEFAULT '',
 category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
 price integer NOT NULL,
 is_veg boolean NOT NULL DEFAULT true,
 is_active boolean NOT NULL DEFAULT true,
 sort_order integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL,
 body text NOT NULL DEFAULT '',
 image_url text,
 type text NOT NULL DEFAULT 'notice',
 cta_label text,
 cta_url text,
 is_active boolean NOT NULL DEFAULT true,
 pinned boolean NOT NULL DEFAULT false,
 expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_config (
 key text PRIMARY KEY,
 value text NOT NULL,
 label text NOT NULL,
 type text NOT NULL DEFAULT 'text',
 updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO site_config (key, value, label, type) VALUES
 ('whatsapp_number', '918484802540', 'WhatsApp Order Number', 'text'),
 ('opening_time', '17:00', 'Opening Time (24h)', 'time'),
 ('closing_time', '21:00', 'Closing Time (24h)', 'time'),
 ('min_order_amount', '200', 'Minimum Order (₹)', 'number'),
 ('is_open', 'true', 'Currently Taking Orders', 'boolean'),
 ('delivery_note', '', 'Delivery Note', 'text')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = now();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_toppings_updated_at ON toppings;
CREATE TRIGGER trg_toppings_updated_at BEFORE UPDATE ON toppings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_pizzas_updated_at ON pizzas;
CREATE TRIGGER trg_pizzas_updated_at BEFORE UPDATE ON pizzas FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_extras_updated_at ON extras;
CREATE TRIGGER trg_extras_updated_at BEFORE UPDATE ON extras FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_site_config_updated_at ON site_config;
CREATE TRIGGER trg_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizza_toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read_categories ON categories;
CREATE POLICY public_read_categories ON categories FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS public_read_toppings ON toppings;
CREATE POLICY public_read_toppings ON toppings FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS public_read_pizzas ON pizzas;
CREATE POLICY public_read_pizzas ON pizzas FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS public_read_pizza_toppings ON pizza_toppings;
CREATE POLICY public_read_pizza_toppings ON pizza_toppings FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS public_read_extras ON extras;
CREATE POLICY public_read_extras ON extras FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS public_read_notifications ON notifications;
CREATE POLICY public_read_notifications ON notifications FOR SELECT TO anon USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

DROP POLICY IF EXISTS public_read_site_config ON site_config;
CREATE POLICY public_read_site_config ON site_config FOR SELECT TO anon USING (true);
`;

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  
  console.log('Running schema setup...');
  await client.query(schemaSql);
  console.log('Schema setup complete.');

  console.log('Fetching categories to resolve IDs...');
  const { rows: categories } = await client.query('SELECT id, slug FROM categories');
  const vegPizzaCat = categories.find(c => c.slug === 'veg-pizza')?.id;
  const nonVegPizzaCat = categories.find(c => c.slug === 'chicken-pizza')?.id;
  const starterCat = categories.find(c => c.slug === 'starter')?.id;
  const dessertCat = categories.find(c => c.slug === 'dessert')?.id;
  
  if (!vegPizzaCat || !starterCat || !dessertCat) {
      throw new Error('Categories not found!');
  }

  console.log('Upserting toppings...');
  for (const t of TOPPINGS) {
      await client.query(`
          INSERT INTO toppings (slug, name, category, mesh_type, color_hex, price_small, price_medium, price_large, is_veg)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              category = EXCLUDED.category,
              mesh_type = EXCLUDED.mesh_type,
              color_hex = EXCLUDED.color_hex,
              price_small = EXCLUDED.price_small,
              price_medium = EXCLUDED.price_medium,
              price_large = EXCLUDED.price_large,
              is_veg = EXCLUDED.is_veg
      `, [t.id, t.name, t.category, t.mesh, t.color, t.prices.small, t.prices.medium, t.prices.large, t.veg ?? true]);
  }

  console.log('Upserting pizzas...');
  for (const pizza of PIZZAS) {
      const catId = pizza.id.includes('chicken') ? nonVegPizzaCat : vegPizzaCat;
      await client.query(`
          INSERT INTO pizzas (slug, name, description, category_id, price_small, price_medium, price_large, is_bestseller, is_spicy)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              category_id = EXCLUDED.category_id,
              price_small = EXCLUDED.price_small,
              price_medium = EXCLUDED.price_medium,
              price_large = EXCLUDED.price_large,
              is_bestseller = EXCLUDED.is_bestseller,
              is_spicy = EXCLUDED.is_spicy
      `, [pizza.id, pizza.name, pizza.description, catId, pizza.prices.small, pizza.prices.medium, pizza.prices.large, false, pizza.spicy ?? false]);
  }

  console.log('Upserting pizza_toppings (clearing first)...');
  await client.query('DELETE FROM pizza_toppings');
  for (const pizza of PIZZAS) {
      // Get pizza internal ID
      const { rows: pRows } = await client.query('SELECT id FROM pizzas WHERE slug = $1', [pizza.id]);
      if (pRows.length === 0) continue;
      const pizzaId = pRows[0].id;
      
      for (const toppingSlug of pizza.toppings) {
          const { rows: tRows } = await client.query('SELECT id FROM toppings WHERE slug = $1', [toppingSlug]);
          if (tRows.length === 0) continue;
          const toppingId = tRows[0].id;
          
          await client.query('INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [pizzaId, toppingId]);
      }
  }

  console.log('Upserting extras...');
  for (const extra of EXTRAS) {
      const catId = extra.id.includes('brownie') ? dessertCat : starterCat;
      await client.query(`
          INSERT INTO extras (slug, name, description, category_id, price, is_veg)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              category_id = EXCLUDED.category_id,
              price = EXCLUDED.price,
              is_veg = EXCLUDED.is_veg
      `, [extra.id, extra.name, extra.description, catId, extra.price, extra.veg ?? true]);
  }

  console.log('Data seeding complete.');
  await client.end();
}

main().catch(console.error);
