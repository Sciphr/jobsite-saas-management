import { NextResponse } from 'next/server';
import { runHealthCheck, runAllHealthChecks, getHealthOverview } from '../../lib/health-monitor.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get('installation');
    const action = searchParams.get('action');

    if (action === 'overview') {
      const result = await getHealthOverview();
      if (result.success) {
        return NextResponse.json(result.stats);
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'run-all') {
      const result = await runAllHealthChecks();
      if (result.success) {
        return NextResponse.json({ message: 'Health checks completed', results: result.results });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (installationId) {
      const result = await runHealthCheck(installationId);
      if (result.success) {
        return NextResponse.json(result.results);
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
  } catch (error) {
    console.error('Health check API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { installation_id, action } = body;

    if (action === 'run-check' && installation_id) {
      const result = await runHealthCheck(installation_id);
      if (result.success) {
        return NextResponse.json({ message: 'Health check completed', results: result.results });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'run-all') {
      const result = await runAllHealthChecks();
      if (result.success) {
        return NextResponse.json({ message: 'All health checks completed', results: result.results });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action or missing installation_id' }, { status: 400 });
  } catch (error) {
    console.error('Health check API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}