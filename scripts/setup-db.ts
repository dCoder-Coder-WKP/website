import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { PIZZAS, TOPPINGS, EXTRAS } from '../src/lib/menuData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrrrapitaqfvrxqkcoac.supabase.co';
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
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, sort_order = EXCLUDED.sort_order;

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
  is_sold_out boolean NOT NULL DEFAULT false,
  image_url text,
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
  image_url text,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_spicy boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  is_sold_out boolean NOT NULL DEFAULT false,
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
  image_url text,
  is_veg boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  is_sold_out boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  image_url text,
  type text NOT NULL DEFAULT 'notice',
  cta_label text,
  cta_url text,
  pinned boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number serial UNIQUE,
  status text NOT NULL DEFAULT 'pending', 
  total_price integer NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending', 
  payment_method text NOT NULL DEFAULT 'cod', 
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pizza_id uuid REFERENCES pizzas(id),
  extra_id uuid REFERENCES extras(id),
  item_type text NOT NULL, 
  size text, 
  quantity integer NOT NULL DEFAULT 1,
  price integer NOT NULL,
  customization_json jsonb DEFAULT '{}'::jsonb,
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
  ('delivery_note', '', 'Delivery Note', 'text'),
  ('announcement_bar', 'Free delivery on orders above ₹500!', 'Announcement Bar', 'text')
ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, type = EXCLUDED.type;

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

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications;
CREATE TRIGGER trg_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_site_config_updated_at ON site_config;
CREATE TRIGGER trg_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizza_toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY public_read_notifications ON notifications FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS public_read_site_config ON site_config;
CREATE POLICY public_read_site_config ON site_config FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS public_read_orders ON orders;
CREATE POLICY public_read_orders ON orders FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS public_insert_orders ON orders;
CREATE POLICY public_insert_orders ON orders FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS public_insert_order_items ON order_items;
CREATE POLICY public_insert_order_items ON order_items FOR INSERT TO anon WITH CHECK (true);

-- NEW TABLES FOR $10M SCALE-UP

CREATE TABLE IF NOT EXISTS villa_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  villa_name text NOT NULL,
  villa_location text NOT NULL, -- ward/area in Aldona
  phone text UNIQUE NOT NULL,
  email text UNIQUE,
  is_verified boolean NOT NULL DEFAULT false,
  concierge_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iot_sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_type text NOT NULL, -- fermentation_ph, fermentation_temp, oven_temp, humidity
  location text NOT NULL, -- fridge_1, oven_1, prep_area
  is_active boolean NOT NULL DEFAULT true,
  last_reading numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iot_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id uuid NOT NULL REFERENCES iot_sensors(id) ON DELETE CASCADE,
  value numeric NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS delivery_fleet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type text NOT NULL DEFAULT 'ebike',
  vehicle_identifier text UNIQUE NOT NULL, -- bike_01, bike_02
  current_lat numeric,
  current_lng numeric,
  status text NOT NULL DEFAULT 'idle', -- idle, delivering, maintenance
  battery_level integer NOT NULL DEFAULT 100,
  noise_impact_decibels numeric NOT NULL DEFAULT 0, -- monitoring our silent impact
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text UNIQUE NOT NULL,
  category text NOT NULL, -- flour, cheese, veg, meat, gas
  current_stock numeric NOT NULL DEFAULT 0,
  unit text NOT NULL, -- kg, liters, units
  min_threshold numeric NOT NULL DEFAULT 10,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Triggers for new tables
CREATE TRIGGER trg_villa_owners_updated_at BEFORE UPDATE ON villa_owners FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_iot_sensors_updated_at BEFORE UPDATE ON iot_sensors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_delivery_fleet_updated_at BEFORE UPDATE ON delivery_fleet FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS for new tables
ALTER TABLE villa_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Select policies for public (limited)
CREATE POLICY public_read_active_sensors ON iot_sensors FOR SELECT TO anon USING (is_active = true);
CREATE POLICY public_read_recent_readings ON iot_readings FOR SELECT TO anon USING (recorded_at > now() - interval '1 hour');
CREATE POLICY public_read_fleet_status ON delivery_fleet FOR SELECT TO anon USING (true); -- Publicly track our silent fleet

-- Admin policies (assuming authenticated users are admins for simplicity in this setup-db script context)
-- In a real app, these would check role/email
CREATE POLICY admin_all_villa_owners ON villa_owners FOR ALL TO authenticated USING (true);
CREATE POLICY admin_all_iot ON iot_sensors FOR ALL TO authenticated USING (true);
CREATE POLICY admin_all_fleet ON delivery_fleet FOR ALL TO authenticated USING (true);
CREATE POLICY admin_all_inventory ON inventory FOR ALL TO authenticated USING (true);
`;

async function main() {
  const connectionString = 'postgresql://postgres.lrrrapitaqfvrxqkcoac:Afsaldanha67%21@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';
  
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully');
  } catch (e: any) {
    console.error(`❌ Failed to connect: ${e.message}`);
    throw e;
  }
  
  console.log('Running schema setup...');
  await client.query(schemaSql);
  console.log('Schema setup complete.');

  console.log('Fetching categories to resolve IDs...');
  const { rows: categories } = await client.query('SELECT id, slug FROM categories');
  const vegPizzaCat = categories.find((c: any) => c.slug === 'veg-pizza')?.id;
  const nonVegPizzaCat = categories.find((c: any) => c.slug === 'chicken-pizza')?.id;
  const starterCat = categories.find((c: any) => c.slug === 'starter')?.id;
  const dessertCat = categories.find((c: any) => c.slug === 'dessert')?.id;
  
  if (!vegPizzaCat || !starterCat || !dessertCat) {
      throw new Error('Categories not found!');
  }

  console.log('Upserting toppings...');
  for (const t of TOPPINGS) {
      await client.query(`
          INSERT INTO toppings (slug, name, category, mesh_type, color_hex, price_small, price_medium, price_large, is_veg, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              category = EXCLUDED.category,
              mesh_type = EXCLUDED.mesh_type,
              color_hex = EXCLUDED.color_hex,
              price_small = EXCLUDED.price_small,
              price_medium = EXCLUDED.price_medium,
              price_large = EXCLUDED.price_large,
              is_veg = EXCLUDED.is_veg,
              image_url = EXCLUDED.image_url
      `, [t.id, t.name, t.category, t.mesh, t.color, t.prices.small, t.prices.medium, t.prices.large, t.veg ?? true, null]);
  }

  console.log('Upserting pizzas...');
  for (const pizza of PIZZAS) {
      const catId = pizza.dietary === 'non-veg' ? nonVegPizzaCat : vegPizzaCat;
      await client.query(`
          INSERT INTO pizzas (slug, name, description, category_id, price_small, price_medium, price_large, is_bestseller, is_spicy, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              category_id = EXCLUDED.category_id,
              price_small = EXCLUDED.price_small,
              price_medium = EXCLUDED.price_medium,
              price_large = EXCLUDED.price_large,
              is_bestseller = EXCLUDED.is_bestseller,
              is_spicy = EXCLUDED.is_spicy,
              image_url = EXCLUDED.image_url
      `, [pizza.id, pizza.name, pizza.description, catId, pizza.prices.small, pizza.prices.medium, pizza.prices.large, false, pizza.spicy ?? false, pizza.image]);
  }

  console.log('Upserting pizza_toppings (clearing first)...');
  await client.query('DELETE FROM pizza_toppings');
  for (const pizza of PIZZAS) {
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
      const catId = extra.category === 'dessert' ? dessertCat : starterCat;
      await client.query(`
          INSERT INTO extras (slug, name, description, category_id, price, is_veg, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              category_id = EXCLUDED.category_id,
              price = EXCLUDED.price,
              is_veg = EXCLUDED.is_veg,
              image_url = EXCLUDED.image_url
      `, [extra.id, extra.name, extra.description ?? '', catId, extra.price, extra.dietary === 'veg', extra.image]);
  }

  console.log('Seeding initial notification...');
  await client.query(`
      INSERT INTO notifications (title, body, type, pinned, is_active)
      VALUES ($1, $2, $3, $4, $5)
  `, ['Welcome to Carona', 'Experience the 72-hour curated sourdough journey.', 'notice', true, true]);


  console.log('Seeding $10M Scale-up data...');

  // Seed Villa Owners
  const villaOwners = [
      { name: 'Aurelius Fernandes', villa: 'Villa Aldona', location: 'Carona Riverside', phone: '9123456789', email: 'aurelius@villaaldona.com' },
      { name: 'Elena D’Souza', villa: 'Casa de Serenity', location: 'Aldona Church Ward', phone: '9123456780', email: 'elena@casaserenity.in' }
  ];
  for (const v of villaOwners) {
      await client.query(`
          INSERT INTO villa_owners (full_name, villa_name, villa_location, phone, email, is_verified)
          VALUES ($1, $2, $3, $4, $5, true)
          ON CONFLICT (phone) DO NOTHING
      `, [v.name, v.villa, v.location, v.phone, v.email]);
  }

  // Seed IoT Sensors
  const sensors = [
      { type: 'fermentation_ph', location: 'Prep Lab Fridge A', last: 4.5 },
      { type: 'fermentation_temp', location: 'Prep Lab Fridge A', last: 4.2 },
      { type: 'oven_temp', location: 'Main Wood-Fired Oven', last: 425.5 },
      { type: 'humidity', location: 'Dough Proofing Room', last: 65 }
  ];
  for (const s of sensors) {
      await client.query(`
          INSERT INTO iot_sensors (sensor_type, location, last_reading)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
      `, [s.type, s.location, s.last]);
  }

  // Seed Delivery Fleet
  const fleet = [
      { id: 'bike_01', status: 'idle', noise: 12 },
      { id: 'bike_02', status: 'delivering', noise: 15 }
  ];
  for (const b of fleet) {
      await client.query(`
          INSERT INTO delivery_fleet (vehicle_identifier, status, noise_impact_decibels)
          VALUES ($1, $2, $3)
          ON CONFLICT (vehicle_identifier) DO UPDATE SET status = EXCLUDED.status, noise_impact_decibels = EXCLUDED.noise_impact_decibels
      `, [b.id, b.status, b.noise]);
  }

  // Seed Inventory
  const stock = [
      { name: 'Tipo 00 Flour', cat: 'flour', stock: 150, unit: 'kg', min: 20 },
      { name: 'Artisanal Chorizo', cat: 'meat', stock: 45, unit: 'kg', min: 5 },
      { name: 'Aldona Wild Mushrooms', cat: 'veg', stock: 12, unit: 'kg', min: 2 }
  ];
  for (const i of stock) {
      await client.query(`
          INSERT INTO inventory (item_name, category, current_stock, unit, min_threshold)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (item_name) DO UPDATE SET current_stock = EXCLUDED.current_stock
      `, [i.name, i.cat, i.stock, i.unit, i.min]);
  }

  console.log('Data seeding complete.');
  await client.end();
}

main().catch(console.error);
