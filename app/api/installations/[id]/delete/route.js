import { PrismaClient } from '@prisma/client';
import { deleteInstallation } from '../../../../lib/deletion-automation.js';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { confirmations } = body;

    // Validate required confirmations
    if (!confirmations?.understandDataLoss || !confirmations?.confirmDeletion) {
      return Response.json({
        success: false,
        error: 'Required confirmations not provided'
      }, { status: 400 });
    }

    // Get installation details
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id }
    });

    if (!installation) {
      return Response.json({
        success: false,
        error: 'Installation not found'
      }, { status: 404 });
    }

    // Check if installation can be deleted (not currently deploying)
    if (installation.deployment_status === 'starting' || installation.deployment_status === 'in_progress') {
      return Response.json({
        success: false,
        error: 'Cannot delete installation while deployment is in progress'
      }, { status: 400 });
    }

    // Start deletion process in background
    console.log(`Starting deletion process for installation: ${installation.company_name} (${installation.id})`);
    
    deleteInstallation(installation).then((result) => {
      if (result.success) {
        console.log(`Deletion completed successfully for ${installation.company_name}`);
      } else {
        console.error(`Deletion had issues for ${installation.company_name}:`, result.message);
      }
    }).catch((error) => {
      console.error(`Deletion process error for ${installation.company_name}:`, error);
    });

    return Response.json({
      success: true,
      message: 'Deletion process started',
      installation: {
        id: installation.id,
        company_name: installation.company_name,
        subdomain: installation.subdomain
      }
    });

  } catch (error) {
    console.error('Error starting deletion process:', error);
    return Response.json({
      success: false,
      error: 'Failed to start deletion process'
    }, { status: 500 });
  } finally {
    await managementPrisma.$disconnect();
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get installation details for deletion confirmation
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id },
      select: {
        id: true,
        company_name: true,
        subdomain: true,
        domain: true,
        deployment_status: true,
        port_number: true,
        created_at: true
      }
    });

    if (!installation) {
      return Response.json({
        success: false,
        error: 'Installation not found'
      }, { status: 404 });
    }

    // Check what resources would be cleaned up
    const cleanupItems = [
      `PM2 process: ${installation.subdomain}-asari`,
      `Deployment directory: /home/jacob/asari_installations/${installation.subdomain}`,
      `Nginx configuration for: ${installation.domain}`,
      `SSL certificate for: ${installation.domain}`,
      `PostgreSQL database: ${installation.subdomain}_asari_db`,
      `MinIO bucket: ${installation.subdomain}-resumes`,
      `Port assignment: ${installation.port_number}`,
      'All related logs, tokens, and deployment history'
    ];

    return Response.json({
      success: true,
      installation,
      cleanupItems
    });

  } catch (error) {
    console.error('Error getting installation details:', error);
    return Response.json({
      success: false,
      error: 'Failed to get installation details'
    }, { status: 500 });
  } finally {
    await managementPrisma.$disconnect();
  }
}