import { getInstallations, getDashboardStats } from '../../lib/saas-recovery';

export async function GET(request) {
  try {
    // Get installations and stats in parallel
    const [installationsResult, statsResult] = await Promise.all([
      getInstallations(),
      getDashboardStats()
    ]);

    if (!installationsResult.success) {
      return Response.json({ error: installationsResult.error }, { status: 500 });
    }

    if (!statsResult.success) {
      return Response.json({ error: statsResult.error }, { status: 500 });
    }

    return Response.json({
      installations: installationsResult.installations,
      stats: statsResult.stats
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}