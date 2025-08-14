import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Enhanced Backup Manager with Supabase Storage
 * Handles database backups for customer installations and uploads to Supabase
 */

/**
 * Ensure backup bucket exists in Supabase
 */
async function ensureBackupBucket() {
  const bucketName = process.env.SUPABASE_BACKUP_BUCKET || 'saas-backups';
  
  try {
    // Try to get bucket info (will throw if doesn't exist)
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error && error.statusCode === '404') {
      // Create bucket if it doesn't exist
      const { data: createData, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['application/sql', 'text/plain'],
        fileSizeLimit: 1024 * 1024 * 1024 // 1GB limit
      });
      
      if (createError) {
        console.error('Error creating backup bucket:', createError);
        throw new Error(`Failed to create backup bucket: ${createError.message}`);
      }
      
      console.log(`✅ Created backup bucket: ${bucketName}`);
    }
    
    return bucketName;
  } catch (error) {
    console.error('Error ensuring backup bucket:', error);
    throw error;
  }
}

/**
 * Upload backup file to Supabase Storage
 */
async function uploadBackupToSupabase(filePath, installationDomain, timestamp) {
  try {
    const bucketName = await ensureBackupBucket();
    const fileData = await fs.readFile(filePath);
    
    // Create a clean filename
    const cleanDomain = installationDomain.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanDomain}/${timestamp}/${path.basename(filePath)}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, fileData, {
        contentType: 'application/sql',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    
    // Get public URL (even though bucket is private, we get the path)
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);
    
    return {
      success: true,
      supabase_path: filename,
      supabase_url: urlData.publicUrl,
      file_size: fileData.length
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
 * Create a database backup for an installation and upload to Supabase
 */
export async function createDatabaseBackupWithSupabase(installationId) {
  let backupLog = null;
  let tempFilePath = null;
  
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
        backup_type: 'database_supabase',
        status: 'running'
      }
    });

    // Parse database URL to get connection details
    const dbUrl = new URL(installation.database_url);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Create temp directory for backup
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'saas-backup-'));
    const filename = `${installation.domain.replace(/\./g, '_')}_${timestamp}.sql`;
    tempFilePath = path.join(tempDir, filename);

    // Construct pg_dump command
    const pgDumpCommand = [
      'pg_dump',
      `--host=${dbUrl.hostname}`,
      `--port=${dbUrl.port || 5432}`,
      `--username=${dbUrl.username}`,
      `--dbname=${dbUrl.pathname.slice(1)}`,
      '--no-password',
      '--verbose',
      '--clean',
      '--if-exists',
      '--create',
      `--file=${tempFilePath}`
    ].join(' ');

    // Set password environment variable
    const env = {
      ...process.env,
      PGPASSWORD: dbUrl.password
    };

    console.log(`🚀 Starting backup for ${installation.domain}...`);
    
    // Execute backup
    const { stdout, stderr } = await execAsync(pgDumpCommand, { 
      env,
      timeout: 30 * 60 * 1000 // 30 minutes timeout
    });

    // Get local file size
    const stats = await fs.stat(tempFilePath);
    const localFileSize = stats.size;

    console.log(`📦 Backup created (${(localFileSize / 1024 / 1024).toFixed(2)} MB), uploading to Supabase...`);

    // Upload to Supabase
    const uploadResult = await uploadBackupToSupabase(tempFilePath, installation.domain, timestamp);
    
    if (!uploadResult.success) {
      throw new Error(`Upload to Supabase failed: ${uploadResult.error}`);
    }

    // Clean up temp file
    await fs.unlink(tempFilePath);
    await fs.rmdir(path.dirname(tempFilePath));

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

    console.log(`✅ Backup completed for ${installation.domain}`);

    return {
      success: true,
      backup: {
        filename,
        supabase_path: uploadResult.supabase_path,
        supabase_url: uploadResult.supabase_url,
        file_size: uploadResult.file_size,
        completed_at: new Date()
      }
    };

  } catch (error) {
    console.error('❌ Backup error:', error);
    
    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        await fs.rmdir(path.dirname(tempFilePath));
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    
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
    await managementPrisma.saas_installations.update({
      where: { id: installationId },
      data: {
        backup_status: 'failed'
      }
    });

    return { success: false, error: error.message };
  }
}

/**
 * Download backup from Supabase
 */
export async function downloadBackupFromSupabase(supabasePath) {
  try {
    const bucketName = process.env.SUPABASE_BACKUP_BUCKET || 'saas-backups';
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(supabasePath);
    
    if (error) {
      throw new Error(`Failed to download backup: ${error.message}`);
    }
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error downloading backup from Supabase:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List all backups for an installation from Supabase
 */
export async function listSupabaseBackups(installationDomain) {
  try {
    const bucketName = process.env.SUPABASE_BACKUP_BUCKET || 'saas-backups';
    const cleanDomain = installationDomain.replace(/[^a-zA-Z0-9]/g, '_');
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(cleanDomain, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      throw new Error(`Failed to list backups: ${error.message}`);
    }
    
    return {
      success: true,
      backups: data || []
    };
  } catch (error) {
    console.error('Error listing Supabase backups:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete old backups from Supabase (cleanup)
 */
export async function cleanupSupabaseBackups(daysToKeep = 30) {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const bucketName = process.env.SUPABASE_BACKUP_BUCKET || 'saas-backups';
    
    // Get old backup records from database
    const oldBackups = await managementPrisma.saas_backup_logs.findMany({
      where: {
        status: 'completed',
        backup_type: 'database_supabase',
        started_at: { lt: cutoffDate },
        file_path: { not: null }
      },
      include: {
        saas_installations: {
          select: { domain: true }
        }
      }
    });

    let deletedCount = 0;
    let errors = [];

    for (const backup of oldBackups) {
      try {
        // Delete from Supabase storage
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([backup.file_path]);
        
        if (error) {
          errors.push(`Failed to delete ${backup.file_path}: ${error.message}`);
          continue;
        }
        
        // Update backup log to remove file path
        await managementPrisma.saas_backup_logs.update({
          where: { id: backup.id },
          data: { file_path: null }
        });
        
        deletedCount++;
        
      } catch (fileError) {
        errors.push(`Error deleting backup ${backup.file_path}: ${fileError.message}`);
      }
    }

    return {
      success: true,
      deletedCount,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    console.error('Error cleaning up Supabase backups:', error);
    return { success: false, error: error.message };
  }
}