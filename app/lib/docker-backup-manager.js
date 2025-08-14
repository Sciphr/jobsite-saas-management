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
 * Docker-based Backup Manager for Windows without pg_dump
 * Uses Docker to run pg_dump in a container
 */

/**
 * Create a database backup using Docker
 */
export async function createDatabaseBackupWithDocker(installationId) {
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

    // Check if Docker is available
    try {
      await execAsync('docker --version');
    } catch (error) {
      throw new Error('Docker is not installed or not running. Please install Docker Desktop for Windows.');
    }

    // Validate Supabase configuration
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    // Create backup log entry
    backupLog = await managementPrisma.saas_backup_logs.create({
      data: {
        installation_id: installationId,
        backup_type: 'database_docker_supabase',
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

    // Convert Windows path to Docker-compatible path
    const dockerTempDir = tempDir.replace(/\\/g, '/').replace('C:', '/c');
    const dockerFilePath = `${dockerTempDir}/${filename}`;

    console.log(`🚀 Starting Docker backup for ${installation.domain}...`);
    
    // Use Docker to run pg_dump
    const dockerCommand = [
      'docker', 'run', '--rm',
      '-v', `${tempDir}:/backup`,
      'postgres:15',
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
      `--file=/backup/${filename}`
    ].join(' ');

    // Set password environment variable
    const env = {
      ...process.env,
      PGPASSWORD: dbUrl.password
    };

    // Execute backup with Docker
    const { stdout, stderr } = await execAsync(dockerCommand, { 
      env,
      timeout: 30 * 60 * 1000 // 30 minutes timeout
    });

    // Check if file was created
    const stats = await fs.stat(tempFilePath);
    const localFileSize = stats.size;

    if (localFileSize === 0) {
      throw new Error('Backup file is empty - backup may have failed');
    }

    console.log(`📦 Backup created (${(localFileSize / 1024 / 1024).toFixed(2)} MB), uploading to Supabase...`);

    // Upload to Supabase (reuse the function from supabase-backup-manager)
    const uploadResult = await uploadBackupToSupabase(tempFilePath, installation.domain, timestamp);
    
    if (!uploadResult.success) {
      throw new Error(`Upload to Supabase failed: ${uploadResult.error}`);
    }

    // Clean up temp file
    await fs.unlink(tempFilePath);
    await fs.rmdir(tempDir);

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

    console.log(`✅ Docker backup completed for ${installation.domain}`);

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
    console.error('❌ Docker backup error:', error);
    
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

// Reuse upload function from supabase-backup-manager
async function uploadBackupToSupabase(filePath, installationDomain, timestamp) {
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
          throw new Error(`Failed to create backup bucket: ${createError.message}`);
        }
      }
    } catch (err) {
      // Bucket might already exist, continue
    }
    
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