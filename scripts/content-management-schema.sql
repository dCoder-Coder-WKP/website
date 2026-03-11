-- ============================================================
-- WKP Pizzeria - Content Management Schema
-- This schema enables full database-driven content management
-- ============================================================

-- 1. Enhanced site_config table for all dynamic content
-- Add new configuration keys for complete content management
INSERT INTO site_config (key, value, label, type, description) VALUES
  -- Hero Section
  ('hero_title', 'We Knead Pizza', 'Hero Title', 'text', 'Main title displayed in hero section'),
  ('hero_subtitle', 'Hand-tossed pizza, freshly kneaded and baked daily in Carona, Goa. Generous toppings, honest ingredients, proper good taste.', 'Hero Subtitle', 'textarea', 'Subtitle text in hero section'),
  ('hero_cta_text', 'View Our Menu', 'Hero CTA Text', 'text', 'Call-to-action button text in hero'),
  ('hero_cta_link', '/menu', 'Hero CTA Link', 'text', 'Call-to-action button destination'),
  
  -- About Section
  ('about_title', 'About We Knead Pizza', 'About Title', 'text', 'Title for about section'),
  ('about_content', 'Generational Goan Baked pizza. Gas-oven fired with fresh dough, healthy toppings, and amazing taste. Owned by Willie Fernandes.', 'About Content', 'textarea', 'About us description'),
  ('about_image_url', '', 'About Image', 'image', 'Image for about section'),
  
  -- Contact Information
  ('phone_number', '+91 84848 02540', 'Phone Number', 'text', 'Primary contact number'),
  ('whatsapp_number', '918484802540', 'WhatsApp Number', 'text', 'WhatsApp contact number (without +)'),
  ('email_address', 'info@wekneadpizza.com', 'Email Address', 'text', 'Contact email'),
  ('address_line1', 'Carona', 'Address Line 1', 'text', 'First line of address'),
  ('address_line2', 'Goa, India', 'Address Line 2', 'text', 'Second line of address'),
  ('google_maps_link', '', 'Google Maps Link', 'text', 'Link to Google Maps location'),
  
  -- Operating Hours
  ('monday_open', '17:00', 'Monday Opening Time', 'time', 'Monday opening time'),
  ('monday_close', '21:00', 'Monday Closing Time', 'time', 'Monday closing time'),
  ('tuesday_open', '17:00', 'Tuesday Opening Time', 'time', 'Tuesday opening time'),
  ('tuesday_close', '21:00', 'Tuesday Closing Time', 'time', 'Tuesday closing time'),
  ('wednesday_open', '17:00', 'Wednesday Opening Time', 'time', 'Wednesday opening time'),
  ('wednesday_close', '21:00', 'Wednesday Closing Time', 'time', 'Wednesday closing time'),
  ('thursday_open', '17:00', 'Thursday Opening Time', 'time', 'Thursday opening time'),
  ('thursday_close', '21:00', 'Thursday Closing Time', 'time', 'Thursday closing time'),
  ('friday_open', '17:00', 'Friday Opening Time', 'time', 'Friday opening time'),
  ('friday_close', '21:00', 'Friday Closing Time', 'time', 'Friday closing time'),
  ('saturday_open', '17:00', 'Saturday Opening Time', 'time', 'Saturday opening time'),
  ('saturday_close', '21:00', 'Saturday Closing Time', 'time', 'Saturday closing time'),
  ('sunday_open', '17:00', 'Sunday Opening Time', 'time', 'Sunday opening time'),
  ('sunday_close', '21:00', 'Sunday Closing Time', 'time', 'Sunday closing time'),
  
  -- Social Media
  ('facebook_url', '', 'Facebook URL', 'text', 'Facebook page link'),
  ('instagram_url', '', 'Instagram URL', 'text', 'Instagram profile link'),
  ('twitter_url', '', 'Twitter URL', 'text', 'Twitter profile link'),
  ('zomato_url', '', 'Zomato URL', 'text', 'Zomato page link'),
  ('swiggy_url', '', 'Swiggy URL', 'text', 'Swiggy page link'),
  
  -- SEO & Meta
  ('meta_description', 'Freshly kneaded, hand-tossed pizza baked daily in Carona, Goa. Generous toppings, honest ingredients. Dine-in, takeaway & delivery.', 'Meta Description', 'textarea', 'SEO meta description'),
  ('meta_keywords', 'pizza, goa, carona, delivery, dine-in, takeaway, fresh pizza', 'Meta Keywords', 'text', 'SEO keywords'),
  
  -- Legal
  ('fssai_license', '20621001001228', 'FSSAI License', 'text', 'FSSAI license number'),
  ('privacy_policy', '', 'Privacy Policy', 'textarea', 'Privacy policy content'),
  ('terms_of_service', '', 'Terms of Service', 'textarea', 'Terms of service content'),
  
  -- Delivery Information
  ('delivery_info', 'Free delivery on orders above ₹500!', 'Delivery Info', 'text', 'Delivery information banner'),
  ('delivery_radius', '10', 'Delivery Radius (km)', 'number', 'Maximum delivery radius in kilometers'),
  ('min_order_amount', '200', 'Minimum Order Amount', 'number', 'Minimum order amount for delivery')
ON CONFLICT (key) DO NOTHING;

-- 2. Content Blocks table for rich text sections
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL DEFAULT 'rich_text', -- rich_text, html, markdown
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for content_blocks
CREATE INDEX IF NOT EXISTS idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX IF NOT EXISTS idx_content_blocks_active ON content_blocks(is_active);
CREATE INDEX IF NOT EXISTS idx_content_blocks_sort ON content_blocks(sort_order);

-- 3. Testimonials table for customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_rating integer NOT NULL CHECK (customer_rating >= 1 AND customer_rating <= 5),
  testimonial_text text NOT NULL,
  customer_image_url text,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials(sort_order);

-- 4. Gallery table for photo gallery
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'general', -- pizza, restaurant, team, events, general
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for gallery
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery(sort_order);

-- 5. Promotions/Banners table for promotional banners
CREATE TABLE IF NOT EXISTS promotional_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  mobile_image_url text,
  link_url text,
  link_text text DEFAULT 'Order Now',
  banner_type text NOT NULL DEFAULT 'hero', -- hero, side, popup, announcement
  is_active boolean NOT NULL DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for promotional_banners
CREATE INDEX IF NOT EXISTS idx_promotional_banners_active ON promotional_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_promotional_banners_type ON promotional_banners(banner_type);
CREATE INDEX IF NOT EXISTS idx_promotional_banners_dates ON promotional_banners(start_date, end_date);

-- 6. FAQ table for frequently asked questions
CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'general', -- general, ordering, delivery, payment, menu
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for faq
CREATE INDEX IF NOT EXISTS idx_faq_active ON faq(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_sort ON faq(sort_order);

-- 7. Team Members table for team information
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for team_members
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order);

-- 8. Update triggers for new tables
DROP TRIGGER IF EXISTS trg_content_blocks_updated_at ON content_blocks;
CREATE TRIGGER trg_content_blocks_updated_at BEFORE UPDATE ON content_blocks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON testimonials;
CREATE TRIGGER trg_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_gallery_updated_at ON gallery;
CREATE TRIGGER trg_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_promotional_banners_updated_at ON promotional_banners;
CREATE TRIGGER trg_promotional_banners_updated_at BEFORE UPDATE ON promotional_banners FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_faq_updated_at ON faq;
CREATE TRIGGER trg_faq_updated_at BEFORE UPDATE ON faq FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_team_members_updated_at ON team_members;
CREATE TRIGGER trg_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 9. Enable RLS for new tables
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies for public read access
-- Content Blocks
DROP POLICY IF EXISTS public_read_content_blocks ON content_blocks;
CREATE POLICY public_read_content_blocks ON content_blocks FOR SELECT TO anon USING (is_active = true);

-- Testimonials
DROP POLICY IF EXISTS public_read_testimonials ON testimonials;
CREATE POLICY public_read_testimonials ON testimonials FOR SELECT TO anon USING (is_active = true);

-- Gallery
DROP POLICY IF EXISTS public_read_gallery ON gallery;
CREATE POLICY public_read_gallery ON gallery FOR SELECT TO anon USING (is_active = true);

-- Promotional Banners
DROP POLICY IF EXISTS public_read_promotional_banners ON promotional_banners;
CREATE POLICY public_read_promotional_banners ON promotional_banners FOR SELECT TO anon USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- FAQ
DROP POLICY IF EXISTS public_read_faq ON faq;
CREATE POLICY public_read_faq ON faq FOR SELECT TO anon USING (is_active = true);

-- Team Members
DROP POLICY IF EXISTS public_read_team_members ON team_members;
CREATE POLICY public_read_team_members ON team_members FOR SELECT TO anon USING (is_active = true);

-- 11. Insert sample data
INSERT INTO content_blocks (slug, title, content, sort_order) VALUES
  ('story', 'Our Story', 'From our family kitchen to yours, We Knead Pizza brings you the authentic taste of Goan baking tradition. Started by Willie Fernandes, we believe in using the freshest ingredients and time-honored techniques to create pizzas that truly satisfy.', 1),
  ('quality-promise', 'Our Quality Promise', 'Every pizza we make is crafted with love and attention to detail. From hand-kneading our dough to selecting the finest toppings, we ensure that each bite delivers the perfect balance of flavors and textures.', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO testimonials (customer_name, customer_rating, testimonial_text, sort_order) VALUES
  ('Priya S.', 5, 'Best pizza in Goa! The crust is perfect and toppings are so fresh. Love that they use authentic ingredients.', 1),
  ('Rohan M.', 5, 'Ordered for a party and everyone was impressed. Delivery was on time and pizzas were still hot!', 2),
  ('Maria D.', 4, 'Great variety of options for both veg and non-veg lovers. The paneer tikka pizza is my favorite!', 3)
ON CONFLICT DO NOTHING;

INSERT INTO faq (question, answer, category, sort_order) VALUES
  ('Do you deliver to my area?', 'We deliver within a 10km radius of Carona, Goa. Please check your location when ordering or call us to confirm.', 'delivery', 1),
  ('How long does delivery take?', 'Delivery typically takes 30-45 minutes depending on your location and order size.', 'delivery', 2),
  ('Can I customize my pizza?', 'Yes! You can add or remove toppings according to your preference. Use our pizza builder to create your perfect pizza.', 'ordering', 3),
  ('What payment methods do you accept?', 'We accept cash on delivery, UPI, and all major credit/debit cards.', 'payment', 4)
ON CONFLICT DO NOTHING;
