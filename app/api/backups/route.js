import { NextResponse } from 'next/server';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { 
  createDatabaseBackup, 
  runAllBackups, 
  getBackupHistory, 
  getBackupOverview,
  cleanupOldBackups 
} from '../../lib/backup-manager.js';
import { 
  createDatabaseBackupWithSupabase,
  downloadBackupFromSupabase,
  listSupabaseBackups,
  cleanupSupabaseBackups
} from '../../lib/supabase-backup-manager.js';
import { 
  createNodeJsBackup
} from '../../lib/nodejs-backup-manager.js';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get('installation');
    const action = searchParams.get('action');

    if (action === 'overview') {
      const result = await getBackupOverview();
      if (result.success) {
        return NextResponse.json(result.stats);
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'history' && installationId) {
      const limit = parseInt(searchParams.get('limit')) || 50;
      const result = await getBackupHistory(installationId, limit);
      if (result.success) {
        // Convert BigInt to string for JSON serialization
        const serializedLogs = result.backupLogs.map(log => ({
          ...log,
          file_size: log.file_size ? log.file_size.toString() : null
        }));
        return NextResponse.json(serializedLogs);
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { installation_id, action } = body;

    if (action === 'create-backup' && installation_id) {
      // Use Node.js backup (works everywhere - no pg_dump needed)
      const result = await createNodeJsBackup(installation_id);
      if (result.success) {
        return NextResponse.json({ 
          message: 'Backup completed and uploaded to Supabase successfully', 
          backup: result.backup 
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'download-backup') {
      const supabasePath = body.supabase_path;
      if (!supabasePath) {
        return NextResponse.json({ error: 'supabase_path is required' }, { status: 400 });
      }
      
      const result = await downloadBackupFromSupabase(supabasePath);
      if (result.success) {
        return new NextResponse(result.data, {
          headers: {
            'Content-Type': 'application/sql',
            'Content-Disposition': `attachment; filename="${path.basename(supabasePath)}"`
          }
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'list-backups' && installation_id) {
      const installation = await managementPrisma.saas_installations.findUnique({
        where: { id: installation_id },
        select: { domain: true }
      });
      
      if (!installation) {
        return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
      }
      
      const result = await listSupabaseBackups(installation.domain);
      if (result.success) {
        return NextResponse.json(result.backups);
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'run-all-backups') {
      // Run this in the background for long-running operation
      runAllBackups().then(result => {
        console.log('All backups completed:', result);
      }).catch(error => {
        console.error('Error in background backup job:', error);
      });
      
      return NextResponse.json({ 
        message: 'Backup job started for all installations. Check logs for progress.' 
      });
    }

    if (action === 'cleanup') {
      const daysToKeep = body.days_to_keep || 30;
      const result = await cleanupSupabaseBackups(daysToKeep);
      if (result.success) {
        return NextResponse.json({ 
          message: 'Cleanup completed', 
          deletedCount: result.deletedCount,
          errors: result.errors
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action or missing installation_id' }, { status: 400 });
  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}