import { getInstallations, getDashboardStats } from '../../lib/saas-recovery';
import { getHealthOverview } from '../../lib/health-monitor';
import { getBackupOverview } from '../../lib/backup-manager';
import { getSupportStats } from '../../lib/support-tickets';

export async function GET(request) {
  try {
    // Get all dashboard data in parallel
    const [installationsResult, statsResult, healthResult, backupResult, supportResult] = await Promise.all([
      getInstallations(),
      getDashboardStats(),
      getHealthOverview(),
      getBackupOverview(),
      getSupportStats()
    ]);

    if (!installationsResult.success) {
      return Response.json({ error: installationsResult.error }, { status: 500 });
    }

    if (!statsResult.success) {
      return Response.json({ error: statsResult.error }, { status: 500 });
    }

    // Health, backup, and support stats are optional - don't fail if they error
    const healthStats = healthResult.success ? healthResult.stats : {};
    const backupStats = backupResult.success ? backupResult.stats : {};
    const supportStats = supportResult.success ? supportResult.stats : {};

    return Response.json({
      installations: installationsResult.installations,
      stats: {
        ...statsResult.stats,
        health: healthStats,
        backups: backupStats,
        support: supportStats
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}