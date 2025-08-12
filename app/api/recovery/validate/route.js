import { validateRecoveryTokenFromInstallation } from '../../../lib/saas-recovery';

/**
 * API endpoint for customer installations to validate recovery tokens
 * This is called by the customer's installation when someone tries to use a recovery token
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, domain, ipAddress, userAgent } = body;

    if (!token || !domain) {
      return Response.json({ 
        error: 'Token and domain are required' 
      }, { status: 400 });
    }

    // Validate the recovery token
    const result = await validateRecoveryTokenFromInstallation(
      token, 
      domain, 
      ipAddress || 'unknown', 
      userAgent || 'unknown'
    );

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 401 });
    }

    // Return the validated token information
    return Response.json({
      success: true,
      token: result.token,
      permissions: result.permissions
    });

  } catch (error) {
    console.error('Error validating recovery token:', error);
    return Response.json({ 
      error: 'Token validation failed' 
    }, { status: 500 });
  }
}