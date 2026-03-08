-- ============================================================
-- WKP Premium Platform - Schema Migration
-- Run this SQL in the Supabase Dashboard SQL Editor
-- ============================================================

-- 1. Add new columns to existing tables
ALTER TABLE pizzas ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE pizzas ADD COLUMN IF NOT EXISTS is_sold_out boolean NOT NULL DEFAULT false;

ALTER TABLE extras ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE extras ADD COLUMN IF NOT EXISTS is_sold_out boolean NOT NULL DEFAULT false;

ALTER TABLE toppings ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE toppings ADD COLUMN IF NOT EXISTS is_sold_out boolean NOT NULL DEFAULT false;

-- 2. Orders system
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number serial UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  total_price integer NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL DEFAULT '',
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

-- 3. Add announcement_bar to site_config
INSERT INTO site_config (key, value, label, type) VALUES
  ('announcement_bar', 'Free delivery on orders above ₹500!', 'Announcement Bar', 'text')
ON CONFLICT (key) DO NOTHING;

-- 4. Triggers for new tables
DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. RLS for new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read_orders ON orders;
CREATE POLICY public_read_orders ON orders FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS public_insert_orders ON orders;
CREATE POLICY public_insert_orders ON orders FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS public_insert_order_items ON order_items;
CREATE POLICY public_insert_order_items ON order_items FOR INSERT TO anon WITH CHECK (true);

-- 6. Create storage bucket for menu images (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true) ON CONFLICT DO NOTHING;
