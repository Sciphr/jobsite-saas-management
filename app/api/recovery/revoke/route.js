import { NextResponse } from 'next/server';
import { revokeRecoveryToken } from '../../../lib/saas-recovery';

/**
 * Revoke a recovery token
 */
export async function POST(request) {
  try {
    const { tokenId, revokedBy, reason } = await request.json();

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    const result = await revokeRecoveryToken(
      tokenId,
      revokedBy || 'admin',
      reason || 'Revoked from management panel'
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error revoking recovery token:', error);
    return NextResponse.json(
      { error: 'Failed to revoke recovery token' },
      { status: 500 }
    );
  }
}