const { readFileSync } = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Missing SUPABASE_DB_URL or DATABASE_URL environment variable.');
    process.exit(1);
  }

  const schemaPath = path.resolve(__dirname, 'cms-schema.sql');
  const schemaSql = readFileSync(schemaPath, 'utf8');

  const client = new Client({ connectionString });

  console.log('🔌 Connecting to Supabase database...');
  await client.connect();

  try {
    console.log(`⚙️  Applying schema from ${schemaPath}`);
    await client.query(schemaSql);
    console.log('✅ Supabase schema reset completed successfully.');
  } catch (error) {
    console.error('❌ Failed to reset Supabase schema:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
    console.log('🔒 Connection closed.');
  }
}

main();
