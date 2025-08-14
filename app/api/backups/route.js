import { NextResponse } from 'next/server';
import { 
  createDatabaseBackup, 
  runAllBackups, 
  getBackupHistory, 
  getBackupOverview,
  cleanupOldBackups 
} from '../../lib/backup-manager.js';

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
        return NextResponse.json(result.backupLogs);
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
      const result = await createDatabaseBackup(installation_id);
      if (result.success) {
        return NextResponse.json({ 
          message: 'Backup completed successfully', 
          backup: result.backup 
        });
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
      const result = await cleanupOldBackups(daysToKeep);
      if (result.success) {
        return NextResponse.json({ 
          message: 'Cleanup completed', 
          deletedCount: result.deletedCount,
          freedSpace: result.freedSpace
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