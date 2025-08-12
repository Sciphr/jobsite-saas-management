import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Log recovery system actions from customer installations
 * This endpoint receives log entries from customer installations
 */
export async function POST(request) {
  try {
    const { domain, action, userEmail, ipAddress, userAgent, success, details } = await request.json();

    if (!domain || !action) {
      return NextResponse.json(
        { error: 'Domain and action are required' },
        { status: 400 }
      );
    }

    // Find the installation by domain
    const installation = await prisma.saas_installations.findUnique({
      where: { domain }
    });

    if (!installation) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    // Create the log entry
    const logEntry = await prisma.saas_recovery_access_logs.create({
      data: {
        installation_id: installation.id,
        token_id: details?.token_id || null,
        action,
        user_email: userEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        success: success !== false, // default to true if not specified
        details: details || {},
        performed_by: details?.performed_by || 'customer_system'
      }
    });

    return NextResponse.json({
      success: true,
      log_id: logEntry.id,
      message: 'Recovery action logged successfully'
    });

  } catch (error) {
    console.error('Error logging recovery action:', error);
    return NextResponse.json(
      { error: 'Failed to log recovery action' },
      { status: 500 }
    );
  }
}