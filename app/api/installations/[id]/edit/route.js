import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Update installation details
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { 
      companyName, 
      domain, 
      adminEmail, 
      databaseUrl, 
      billingEmail, 
      billingPlan, 
      notes, 
      status 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Installation ID is required' },
        { status: 400 }
      );
    }

    // Check if installation exists
    const existingInstallation = await prisma.saas_installations.findUnique({
      where: { id }
    });

    if (!existingInstallation) {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    // Update the installation
    const updatedInstallation = await prisma.saas_installations.update({
      where: { id },
      data: {
        company_name: companyName || existingInstallation.company_name,
        domain: domain || existingInstallation.domain,
        admin_email: adminEmail || existingInstallation.admin_email,
        database_url: databaseUrl !== undefined ? databaseUrl : existingInstallation.database_url,
        billing_email: billingEmail !== undefined ? billingEmail : existingInstallation.billing_email,
        billing_plan: billingPlan || existingInstallation.billing_plan,
        notes: notes !== undefined ? notes : existingInstallation.notes,
        status: status || existingInstallation.status,
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      installation: updatedInstallation,
      message: 'Installation updated successfully'
    });

  } catch (error) {
    console.error('Error updating installation:', error);
    
    // Handle unique constraint violations (e.g., duplicate domain)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Domain already exists for another installation' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update installation' },
      { status: 500 }
    );
  }
}