/**
 * Upload brand assets to Supabase Storage.
 * 
 * Usage: node upload-brand-assets.mjs
 * 
 * Prerequisites:
 *   - A public bucket named "brand-assets" must exist in Supabase Storage.
 *   - Set SUPABASE_SERVICE_KEY env var for admin access, OR we use the anon key.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = 'https://lrrrapitaqfvrxqkcoac.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycnJhcGl0YXFmdnJ4cWtjb2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTU1NjksImV4cCI6MjA4ODUzMTU2OX0.2Q1Q5RyIuD8pePKsqtDwnC2ed38XWvAarNuYrqJWFUE';

// Use service role key if available, otherwise anon key
const supabase = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY
);

const BUCKET = 'brand-assets';
const BASE_DIR = 'd:/Files/Desktop/WKP-Final-Workspace';

const files = [
  { localPath: `${BASE_DIR}/Logo.png`, remotePath: 'logo.png', contentType: 'image/png' },
  { localPath: `${BASE_DIR}/dough.jpg`, remotePath: 'artisanal-dough.jpg', contentType: 'image/jpeg' },
  { localPath: `${BASE_DIR}/image_behind-weKneadPizza.jpg`, remotePath: 'hero-bg.jpg', contentType: 'image/jpeg' },
];

async function upload() {
  // First try to create the bucket (will fail gracefully if it exists)
  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  });
  
  if (bucketError) {
    if (bucketError.message?.includes('already exists') || bucketError.message?.includes('Duplicate')) {
      console.log(`✓ Bucket "${BUCKET}" already exists`);
    } else {
      console.log(`⚠ Bucket creation: ${bucketError.message}`);
    }
  } else {
    console.log(`✓ Created public bucket "${BUCKET}"`);
  }

  for (const file of files) {
    const filePath = resolve(file.localPath);
    const buffer = readFileSync(filePath);
    
    console.log(`\nUploading ${file.remotePath} (${(buffer.length / 1024).toFixed(1)} KB)...`);
    
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(file.remotePath, buffer, {
        contentType: file.contentType,
        upsert: true, // overwrite if exists
      });

    if (error) {
      console.error(`  ✗ Failed: ${error.message}`);
    } else {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file.remotePath}`;
      console.log(`  ✓ Uploaded: ${data.path}`);
      console.log(`  → Public URL: ${publicUrl}`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Logo:     ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/logo.png`);
  console.log(`Hero BG:  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/hero-bg.jpg`);
  console.log(`Dough:    ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/artisanal-dough.jpg`);
}

upload().catch(console.error);
