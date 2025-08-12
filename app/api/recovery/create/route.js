import { createRecoveryToken } from '../../../lib/saas-recovery';

export async function POST(request) {
  try {
    const body = await request.json();
    const { installationId, purpose, expirationHours, maxUses, permissions } = body;

    if (!installationId || !purpose) {
      return Response.json({ error: 'Installation ID and purpose are required' }, { status: 400 });
    }

    // Get client info for logging
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create the recovery token
    const result = await createRecoveryToken(installationId, purpose, 'saas-admin', {
      expirationHours: parseInt(expirationHours) || 24,
      maxUses: parseInt(maxUses) || 1,
      permissions: permissions || ['admin_access'],
      ipAddress: clientIP,
      userAgent: userAgent
    });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result);

  } catch (error) {
    console.error('Error creating recovery token:', error);
    return Response.json({ error: 'Failed to create recovery token' }, { status: 500 });
  }
}