import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Pure Node.js Backup Manager 
 * Creates PostgreSQL backups without requiring pg_dump
 * Works on both local development and Vercel
 */

/**
 * Create a SQL dump of database schema and data
 */
async function createSqlDump(databaseUrl) {
  const client = new Client({ connectionString: databaseUrl });
  let sqlDump = [];

  try {
    await client.connect();
    
    // Add header comment
    sqlDump.push('-- PostgreSQL Database Backup');
    sqlDump.push(`-- Generated: ${new Date().toISOString()}`);
    sqlDump.push(`-- Database: ${new URL(databaseUrl).pathname.slice(1)}`);
    sqlDump.push('-- Created by SaaS Management System\n');
    
    // Disable foreign key checks during restore
    sqlDump.push('SET session_replication_role = replica;\n');
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log(`📋 Found ${tablesResult.rows.length} tables to backup...`);
    
    // For each table, get schema and data
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      console.log(`🔄 Processing table: ${tableName}`);
      
      // Get table schema (CREATE TABLE statement)
      const schemaResult = await client.query(`
        SELECT 
          'CREATE TABLE ' || quote_ident(table_name) || ' (' ||
          string_agg(
            quote_ident(column_name) || ' ' || 
            data_type || 
            case 
              when character_maximum_length is not null then '(' || character_maximum_length || ')'
              when numeric_precision is not null and numeric_scale is not null then '(' || numeric_precision || ',' || numeric_scale || ')'
              else ''
            end ||
            case when is_nullable = 'NO' then ' NOT NULL' else '' end,
            ', '
          ) || ');' as create_statement
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        GROUP BY table_name;
      `, [tableName]);
      
      if (schemaResult.rows.length > 0) {
        sqlDump.push(`-- Table: ${tableName}`);
        sqlDump.push(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
        sqlDump.push(schemaResult.rows[0].create_statement);
        sqlDump.push('');
      }
      
      // Get table data
      const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
      
      if (dataResult.rows.length > 0) {
        // Get column names
        const columns = dataResult.fields.map(field => `"${field.name}"`).join(', ');
        
        sqlDump.push(`-- Data for table: ${tableName}`);
        
        // Create INSERT statements in batches
        const batchSize = 100;
        for (let i = 0; i < dataResult.rows.length; i += batchSize) {
          const batch = dataResult.rows.slice(i, i + batchSize);
          
          const values = batch.map(row => {
            const rowValues = dataResult.fields.map(field => {
              const value = row[field.name];
              if (value === null) return 'NULL';
              if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
              if (typeof value === 'boolean') return value ? 'true' : 'false';
              if (value instanceof Date) return `'${value.toISOString()}'`;
              if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
              return value;
            }).join(', ');
            
            return `(${rowValues})`;
          }).join(',\n  ');
          
          sqlDump.push(`INSERT INTO "${tableName}" (${columns}) VALUES\n  ${values};`);
        }
        sqlDump.push('');
      }
    }
    
    // Get indexes
    const indexResult = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname NOT LIKE '%_pkey';
    `);
    
    if (indexResult.rows.length > 0) {
      sqlDump.push('-- Indexes');
      for (const index of indexResult.rows) {
        sqlDump.push(`${index.indexdef};`);
      }
      sqlDump.push('');
    }
    
    // Re-enable foreign key checks
    sqlDump.push('SET session_replication_role = DEFAULT;');
    
    return sqlDump.join('\n');
    
  } catch (error) {
    console.error('Error creating SQL dump:', error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Upload backup to Supabase Storage
 */
async function uploadBackupToSupabase(sqlContent, installationDomain, timestamp) {
  try {
    const bucketName = process.env.SUPABASE_BACKUP_BUCKET || 'saas-backups';
    
    // Ensure bucket exists
    try {
      const { error: bucketError } = await supabase.storage.getBucket(bucketName);
      if (bucketError && bucketError.statusCode === '404') {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: ['application/sql', 'text/plain'],
          fileSizeLimit: 1024 * 1024 * 1024 // 1GB limit
        });
        
        if (createError) {
          console.log('✅ Backup bucket already exists or created successfully');
        }
      }
    } catch (err) {
      // Bucket might already exist, continue
    }
    
    // Create filename
    const cleanDomain = installationDomain.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanDomain}/${timestamp}/${cleanDomain}_${timestamp}.sql`;
    
    // Upload as Buffer
    const buffer = Buffer.from(sqlContent, 'utf8');
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: 'application/sql',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    
    // Get public URL path
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);
    
    return {
      success: true,
      supabase_path: filename,
      supabase_url: urlData.publicUrl,
      file_size: buffer.length
    };
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create database backup without pg_dump - pure Node.js
 */
export async function createNodeJsBackup(installationId) {
  let backupLog = null;
  
  try {
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id: installationId }
    });

    if (!installation) {
      throw new Error('Installation not found');
    }

    if (!installation.database_url) {
      throw new Error('No database URL configured for this installation');
    }

    if (!installation.backup_enabled) {
      throw new Error('Backups are disabled for this installation');
    }

    // Validate Supabase configuration
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    // Create backup log entry
    backupLog = await managementPrisma.saas_backup_logs.create({
      data: {
        installation_id: installationId,
        backup_type: 'database_nodejs_supabase',
        status: 'running'
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    console.log(`🚀 Starting Node.js backup for ${installation.domain}...`);
    
    // Create SQL dump using pure Node.js
    const sqlContent = await createSqlDump(installation.database_url);
    const backupSizeKB = (sqlContent.length / 1024).toFixed(2);
    
    console.log(`📦 SQL dump created (${backupSizeKB} KB), uploading to Supabase...`);

    // Upload to Supabase
    const uploadResult = await uploadBackupToSupabase(sqlContent, installation.domain, timestamp);
    
    if (!uploadResult.success) {
      throw new Error(`Upload to Supabase failed: ${uploadResult.error}`);
    }

    // Update backup log with success
    await managementPrisma.saas_backup_logs.update({
      where: { id: backupLog.id },
      data: {
        status: 'completed',
        file_size: uploadResult.file_size,
        file_path: uploadResult.supabase_path,
        completed_at: new Date(),
        error_message: null
      }
    });

    // Update installation backup status
    await managementPrisma.saas_installations.update({
      where: { id: installationId },
      data: {
        last_backup_at: new Date(),
        backup_status: 'completed'
      }
    });

    console.log(`✅ Node.js backup completed for ${installation.domain}`);

    return {
      success: true,
      backup: {
        filename: `${installation.domain.replace(/\./g, '_')}_${timestamp}.sql`,
        supabase_path: uploadResult.supabase_path,
        supabase_url: uploadResult.supabase_url,
        file_size: uploadResult.file_size,
        completed_at: new Date()
      }
    };

  } catch (error) {
    console.error('❌ Node.js backup error:', error);
    
    // Update backup log with error if it exists
    if (backupLog) {
      await managementPrisma.saas_backup_logs.update({
        where: { id: backupLog.id },
        data: {
          status: 'failed',
          error_message: error.message,
          completed_at: new Date()
        }
      });
    }

    // Update installation backup status
    if (installationId) {
      await managementPrisma.saas_installations.update({
        where: { id: installationId },
        data: {
          backup_status: 'failed'
        }
      });
    }

    return { success: false, error: error.message };
  }
}

// Export the download and list functions from supabase-backup-manager
export { 
  downloadBackupFromSupabase, 
  listSupabaseBackups, 
  cleanupSupabaseBackups 
} from './supabase-backup-manager.js';