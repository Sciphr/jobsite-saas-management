import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

/**
 * Backup Manager for SaaS Installations
 * Handles database backups for customer installations
 */

/**
 * Create a database backup for an installation
 */
export async function createDatabaseBackup(installationId) {
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

    // Create backup log entry
    backupLog = await managementPrisma.saas_backup_logs.create({
      data: {
        installation_id: installationId,
        backup_type: 'database',
        status: 'running'
      }
    });

    // Parse database URL to get connection details
    const dbUrl = new URL(installation.database_url);
    const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
    
    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${installation.domain.replace(/\./g, '_')}_${timestamp}.sql`;
    const backupPath = path.join(backupDir, filename);

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
      `--file=${backupPath}`
    ].join(' ');

    // Set password environment variable
    const env = {
      ...process.env,
      PGPASSWORD: dbUrl.password
    };

    console.log(`Starting backup for ${installation.domain}...`);
    
    // Execute backup
    const { stdout, stderr } = await execAsync(pgDumpCommand, { 
      env,
      timeout: 30 * 60 * 1000 // 30 minutes timeout
    });

    // Get file size
    const stats = await fs.stat(backupPath);
    const fileSize = stats.size;

    // Update backup log with success
    await managementPrisma.saas_backup_logs.update({
      where: { id: backupLog.id },
      data: {
        status: 'completed',
        file_size: fileSize,
        file_path: backupPath,
        completed_at: new Date()
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

    return {
      success: true,
      backup: {
        filename,
        file_path: backupPath,
        file_size: fileSize,
        completed_at: new Date()
      }
    };

  } catch (error) {
    console.error('Backup error:', error);
    
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
 * Run backups for all installations that have backups enabled
 */
export async function runAllBackups() {
  try {
    const installations = await managementPrisma.saas_installations.findMany({
      where: { 
        status: 'active',
        backup_enabled: true,
        database_url: { not: null }
      },
      select: { id: true, domain: true }
    });

    const results = [];
    
    for (const installation of installations) {
      console.log(`Running backup for ${installation.domain}...`);
      const result = await createDatabaseBackup(installation.id);
      results.push({
        installation_id: installation.id,
        domain: installation.domain,
        ...result
      });
      
      // Add delay between backups to reduce system load
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return { success: true, results };
  } catch (error) {
    console.error('Error running all backups:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get backup history for an installation
 */
export async function getBackupHistory(installationId, limit = 50) {
  try {
    const backupLogs = await managementPrisma.saas_backup_logs.findMany({
      where: { installation_id: installationId },
      orderBy: { started_at: 'desc' },
      take: limit
    });

    return { success: true, backupLogs };
  } catch (error) {
    console.error('Error getting backup history:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get backup overview statistics
 */
export async function getBackupOverview() {
  try {
    const stats = await managementPrisma.$transaction(async (tx) => {
      const totalInstallations = await tx.saas_installations.count({
        where: { 
          status: 'active',
          backup_enabled: true 
        }
      });
      
      const recentSuccessfulBackups = await tx.saas_backup_logs.count({
        where: {
          status: 'completed',
          started_at: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });
      
      const failedBackups = await tx.saas_backup_logs.count({
        where: {
          status: 'failed',
          started_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      });

      const runningBackups = await tx.saas_backup_logs.count({
        where: { status: 'running' }
      });

      // Calculate total backup storage used
      const backupSizeResult = await tx.saas_backup_logs.aggregate({
        where: { 
          status: 'completed',
          file_size: { not: null }
        },
        _sum: { file_size: true }
      });

      return {
        totalInstallations,
        recentSuccessfulBackups,
        failedBackups,
        runningBackups,
        totalStorageUsed: backupSizeResult._sum.file_size || 0
      };
    });

    return { success: true, stats };
  } catch (error) {
    console.error('Error getting backup overview:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clean up old backup files
 */
export async function cleanupOldBackups(daysToKeep = 30) {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const oldBackups = await managementPrisma.saas_backup_logs.findMany({
      where: {
        status: 'completed',
        started_at: { lt: cutoffDate },
        file_path: { not: null }
      }
    });

    let deletedCount = 0;
    let freedSpace = 0;

    for (const backup of oldBackups) {
      try {
        const stats = await fs.stat(backup.file_path);
        await fs.unlink(backup.file_path);
        
        freedSpace += stats.size;
        deletedCount++;
        
        // Update the backup log to remove file path
        await managementPrisma.saas_backup_logs.update({
          where: { id: backup.id },
          data: { file_path: null }
        });
        
      } catch (fileError) {
        console.error(`Error deleting backup file ${backup.file_path}:`, fileError);
      }
    }

    return {
      success: true,
      deletedCount,
      freedSpace
    };
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
    return { success: false, error: error.message };
  }
}