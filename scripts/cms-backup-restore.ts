// =====================================================
// We Knead Pizza: CMS Backup & Restore Utilities
// =====================================================
// This script provides backup and restore functionality
// for the complete CMS-driven Supabase database.
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// Types
// =====================================================

interface BackupData {
  version: string;
  timestamp: string;
  tables: Record<string, any[]>;
  metadata: {
    total_records: number;
    backup_type: 'full' | 'content' | 'config' | 'menu';
    created_by: string;
    checksum: string;
  };
}

// =====================================================
// Backup Functions
// =====================================================

export async function createFullBackup(createdBy: string = 'system'): Promise<BackupData> {
  console.log('🔄 Creating full backup...');
  
  const tables = [
    'categories',
    'toppings', 
    'sizes',
    'pizzas',
    'pizza_prices',
    'pizza_toppings',
    'extras',
    'site_config',
    'content_blocks',
    'testimonials',
    'gallery',
    'promotional_banners',
    'faq',
    'team_members'
  ];

  const backupData: any = { tables: {} };
  let totalRecords = 0;

  // Backup each table
  for (const tableName of tables) {
    console.log(`📦 Backing up ${tableName}...`);
    const { data, error } = await supabase.from(tableName).select('*');
    
    if (error) {
      throw new Error(`Failed to backup ${tableName}: ${error.message}`);
    }
    
    backupData.tables[tableName] = data || [];
    totalRecords += data?.length || 0;
  }

  const backup: BackupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    tables: backupData.tables,
    metadata: {
      total_records: totalRecords,
      backup_type: 'full',
      created_by: createdBy,
      checksum: generateChecksum(JSON.stringify(backupData))
    }
  };

  // Save backup metadata to database
  const { error: backupError } = await supabase.from('backups').insert({
    name: `Full Backup - ${new Date().toLocaleString()}`,
    description: 'Complete database backup including all content and configuration',
    backup_data: backup,
    backup_type: 'full',
    created_by: createdBy,
    file_size: JSON.stringify(backup).length,
    checksum: backup.metadata.checksum
  });

  if (backupError) {
    console.warn('⚠️ Failed to save backup metadata:', backupError.message);
  }

  console.log(`✅ Full backup completed. Total records: ${totalRecords}`);
  return backup;
}

export async function createContentBackup(createdBy: string = 'system'): Promise<BackupData> {
  console.log('🔄 Creating content backup...');
  
  const contentTables = [
    'site_config',
    'content_blocks',
    'testimonials',
    'gallery',
    'promotional_banners',
    'faq',
    'team_members'
  ];

  const backupData: any = { tables: {} };
  let totalRecords = 0;

  for (const tableName of contentTables) {
    console.log(`📦 Backing up ${tableName}...`);
    const { data, error } = await supabase.from(tableName).select('*');
    
    if (error) {
      throw new Error(`Failed to backup ${tableName}: ${error.message}`);
    }
    
    backupData.tables[tableName] = data || [];
    totalRecords += data?.length || 0;
  }

  const backup: BackupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    tables: backupData.tables,
    metadata: {
      total_records: totalRecords,
      backup_type: 'content',
      created_by: createdBy,
      checksum: generateChecksum(JSON.stringify(backupData))
    }
  };

  console.log(`✅ Content backup completed. Total records: ${totalRecords}`);
  return backup;
}

export async function createMenuBackup(createdBy: string = 'system'): Promise<BackupData> {
  console.log('🔄 Creating menu backup...');
  
  const menuTables = [
    'categories',
    'toppings',
    'sizes', 
    'pizzas',
    'pizza_prices',
    'pizza_toppings',
    'extras'
  ];

  const backupData: any = { tables: {} };
  let totalRecords = 0;

  for (const tableName of menuTables) {
    console.log(`📦 Backing up ${tableName}...`);
    const { data, error } = await supabase.from(tableName).select('*');
    
    if (error) {
      throw new Error(`Failed to backup ${tableName}: ${error.message}`);
    }
    
    backupData.tables[tableName] = data || [];
    totalRecords += data?.length || 0;
  }

  const backup: BackupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    tables: backupData.tables,
    metadata: {
      total_records: totalRecords,
      backup_type: 'menu',
      created_by: createdBy,
      checksum: generateChecksum(JSON.stringify(backupData))
    }
  };

  console.log(`✅ Menu backup completed. Total records: ${totalRecords}`);
  return backup;
}

// =====================================================
// Restore Functions
// =====================================================

export async function restoreFromBackup(backupData: BackupData): Promise<void> {
  console.log('🔄 Restoring from backup...');
  
  // Validate backup
  if (!validateBackup(backupData)) {
    throw new Error('Invalid backup data');
  }

  const tables = Object.keys(backupData.tables);
  
  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  for (const tableName of tables.reverse()) { // Reverse order to handle foreign keys
    const { error } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.warn(`⚠️ Failed to clear ${tableName}: ${error.message}`);
    }
  }

  // Restore data
  console.log('📥 Restoring data...');
  for (const tableName of tables) {
    const records = backupData.tables[tableName];
    if (records && records.length > 0) {
      console.log(`📦 Restoring ${tableName} (${records.length} records)...`);
      
      const { error } = await supabase.from(tableName).insert(records);
      if (error) {
        throw new Error(`Failed to restore ${tableName}: ${error.message}`);
      }
    }
  }

  console.log('✅ Restore completed successfully');
}

export async function restoreFromBackupFile(filePath: string): Promise<void> {
  console.log(`📁 Loading backup from file: ${filePath}`);
  
  try {
    const fileContent = readFileSync(filePath, 'utf8');
    const backupData: BackupData = JSON.parse(fileContent);
    
    await restoreFromBackup(backupData);
    console.log('✅ Restore from file completed');
  } catch (error) {
    throw new Error(`Failed to restore from file: ${error}`);
  }
}

// =====================================================
// Reset Functions
// =====================================================

export async function resetToDefaults(): Promise<void> {
  console.log('🔄 Resetting database to defaults...');
  
  // This would execute the cms-schema.sql file
  // For now, we'll clear and reseed with default data
  const tables = [
    'order_items',
    'orders',
    'pizza_toppings',
    'pizza_prices',
    'pizzas',
    'extras',
    'toppings',
    'sizes',
    'categories',
    'content_blocks',
    'testimonials',
    'gallery',
    'promotional_banners',
    'faq',
    'team_members',
    'site_config'
  ];

  // Clear all tables
  for (const tableName of tables) {
    console.log(`🗑️ Clearing ${tableName}...`);
    const { error } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.warn(`⚠️ Failed to clear ${tableName}: ${error.message}`);
    }
  }

  // Re-insert default data (this would typically come from the schema file)
  console.log('📥 Re-inserting default data...');
  
  // Re-insert default sizes
  const { error: sizesError } = await supabase.from('sizes').insert([
    { name: 'Small', description: 'Perfect for one person', diameter_cm: 25, slices: 6, sort_order: 1 },
    { name: 'Medium', description: 'Great for sharing', diameter_cm: 30, slices: 8, sort_order: 2 },
    { name: 'Large', description: 'Ideal for groups', diameter_cm: 35, slices: 10, sort_order: 3 }
  ]);

  if (sizesError) throw new Error(`Failed to reset sizes: ${sizesError.message}`);

  // Re-insert default categories
  const { error: categoriesError } = await supabase.from('categories').insert([
    { name: 'Pizza', description: 'Our signature pizzas', sort_order: 1 },
    { name: 'Sides', description: 'Delicious extras and sides', sort_order: 2 },
    { name: 'Beverages', description: 'Refreshing drinks', sort_order: 3 },
    { name: 'Desserts', description: 'Sweet endings', sort_order: 4 }
  ]);

  if (categoriesError) throw new Error(`Failed to reset categories: ${categoriesError.message}`);

  // Reset site config to defaults
  const defaultSiteConfig = [
    { key: 'site_name', value: 'We Knead Pizza', type: 'text', description: 'Site name', is_public: true },
    { key: 'site_maintenance_mode', value: 'false', type: 'boolean', description: 'Site maintenance mode', is_public: false },
    { key: 'is_open', value: 'true', type: 'boolean', description: 'Is the site open for orders', is_public: true }
  ];

  const { error: configError } = await supabase.from('site_config').insert(defaultSiteConfig);
  if (configError) throw new Error(`Failed to reset site config: ${configError.message}`);

  console.log('✅ Database reset to defaults completed');
}

// =====================================================
// Utility Functions
// =====================================================

function generateChecksum(data: string): string {
  // Simple checksum function (in production, use crypto)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

function validateBackup(backupData: BackupData): boolean {
  if (!backupData.version || !backupData.timestamp || !backupData.tables || !backupData.metadata) {
    return false;
  }

  // Verify checksum
  const tablesData = JSON.stringify(backupData.tables);
  const expectedChecksum = generateChecksum(tablesData);
  
  return backupData.metadata.checksum === expectedChecksum;
}

export async function downloadBackup(backupId: string): Promise<BackupData> {
  console.log(`📥 Downloading backup: ${backupId}`);
  
  const { data, error } = await supabase
    .from('backups')
    .select('backup_data')
    .eq('id', backupId)
    .single();

  if (error) {
    throw new Error(`Failed to download backup: ${error.message}`);
  }

  return data.backup_data as BackupData;
}

export async function listBackups(): Promise<any[]> {
  console.log('📋 Listing available backups...');
  
  const { data, error } = await supabase
    .from('backups')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list backups: ${error.message}`);
  }

  return data || [];
}

export async function deleteBackup(backupId: string): Promise<void> {
  console.log(`🗑️ Deleting backup: ${backupId}`);
  
  const { error } = await supabase
    .from('backups')
    .delete()
    .eq('id', backupId);

  if (error) {
    throw new Error(`Failed to delete backup: ${error.message}`);
  }

  console.log('✅ Backup deleted successfully');
}

// =====================================================
// CLI Interface
// =====================================================

async function runCLICommand() {
  const command = process.argv[2];
  const createdBy = process.argv[3] || 'cli-user';

  try {
    switch (command) {
      case 'backup-full':
        const backup = await createFullBackup(createdBy);
        const filename = `backup-full-${new Date().toISOString().split('T')[0]}.json`;
        writeFileSync(filename, JSON.stringify(backup, null, 2));
        console.log(`✅ Full backup saved to: ${filename}`);
        break;

      case 'backup-content':
        const contentBackup = await createContentBackup(createdBy);
        const contentFilename = `backup-content-${new Date().toISOString().split('T')[0]}.json`;
        writeFileSync(contentFilename, JSON.stringify(contentBackup, null, 2));
        console.log(`✅ Content backup saved to: ${contentFilename}`);
        break;

      case 'backup-menu':
        const menuBackup = await createMenuBackup(createdBy);
        const menuFilename = `backup-menu-${new Date().toISOString().split('T')[0]}.json`;
        writeFileSync(menuFilename, JSON.stringify(menuBackup, null, 2));
        console.log(`✅ Menu backup saved to: ${menuFilename}`);
        break;

      case 'restore':
        const filePath = process.argv[4];
        if (!filePath) {
          console.error('❌ Please provide backup file path');
          process.exit(1);
        }
        await restoreFromBackupFile(filePath);
        break;

      case 'reset':
        await resetToDefaults();
        break;

      case 'list':
        const backups = await listBackups();
        console.log('📋 Available backups:');
        backups.forEach(backup => {
          console.log(`- ${backup.name} (${backup.backup_type}) - ${new Date(backup.created_at).toLocaleString()}`);
        });
        break;

      default:
        console.log('Available commands:');
        console.log('  backup-full [created_by]     - Create full backup');
        console.log('  backup-content [created_by]  - Create content backup');
        console.log('  backup-menu [created_by]    - Create menu backup');
        console.log('  restore <file_path>         - Restore from file');
        console.log('  reset                       - Reset to defaults');
        console.log('  list                        - List available backups');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runCLICommand();
}
