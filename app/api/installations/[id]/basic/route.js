import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

/**
 * Get basic installation details by ID (optimized for editing - no related data)
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Installation ID is required" },
        { status: 400 }
      );
    }

    // Only fetch the installation data, no related records
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id },
      select: {
        id: true,
        domain: true,
        company_name: true,
        admin_email: true,
        database_url: true,
        status: true,
        created_at: true,
        updated_at: true,
        last_accessed_at: true,
        billing_email: true,
        billing_plan: true,
        billing_cycle: true,
        billing_amount: true,
        next_billing_date: true,
        billing_status: true,
        notes: true,
        last_health_check: true,
        health_status: true,
        backup_enabled: true,
        last_backup_at: true,
        backup_status: true
      }
    });

    if (!installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      installation
    });
  } catch (error) {
    console.error("Error fetching basic installation:", error);
    return NextResponse.json(
      { error: "Failed to fetch installation" },
      { status: 500 }
    );
  }
}