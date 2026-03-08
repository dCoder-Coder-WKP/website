const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lrrrapitaqfvrxqkcoac.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycnJhcGl0YXFmdnJ4cWtjb2FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk1NTU2OSwiZXhwIjoyMDg4NTMxNTY5fQ.w9eUDdHVddkBI32mbwOxpUT9mVBFVkDtk4NxyayJPXQ'
);

async function run() {
  const { error } = await supabase.from('site_config').upsert([
    { key: 'logo_url', value: 'https://lrrrapitaqfvrxqkcoac.supabase.co/storage/v1/object/public/brand-assets/logo.png', label: 'Brand Logo URL', type: 'text' },
    { key: 'hero_bg_url', value: 'https://lrrrapitaqfvrxqkcoac.supabase.co/storage/v1/object/public/brand-assets/hero-bg.jpg', label: 'Hero Background Image URL', type: 'text' },
    { key: 'dough_img_url', value: 'https://lrrrapitaqfvrxqkcoac.supabase.co/storage/v1/object/public/brand-assets/artisanal-dough.jpg', label: 'Artisanal Dough Image URL', type: 'text' }
  ], { onConflict: 'key' });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Inserted config values successfully');
  }
}

run();
