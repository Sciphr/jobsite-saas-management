import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deployNewCustomer } from '../../lib/deployment-automation.js';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get('installation');
    const status = searchParams.get('status');

    const where = {};
    if (installationId) where.installation_id = installationId;
    if (status) where.status = status;

    const deployments = await managementPrisma.saas_deployments.findMany({
      where,
      include: {
        saas_installations: {
          select: {
            id: true,
            company_name: true,
            domain: true,
            admin_email: true
          }
        }
      },
      orderBy: {
        started_at: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      deployments: deployments.map(deployment => ({
        ...deployment,
        installation: deployment.saas_installations
      }))
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch deployments' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'deploy-customer') {
      const {
        installation_id,
        company_name,
        admin_email,
        subdomain,
        billing_plan = 'Pro'
      } = body;

      // Validate required fields
      if (!installation_id || !company_name || !admin_email) {
        return NextResponse.json({ 
          success: false, 
          error: 'Installation ID, company name, and admin email are required' 
        }, { status: 400 });
      }

      // Check if installation exists
      const installation = await managementPrisma.saas_installations.findUnique({
        where: { id: installation_id }
      });

      if (!installation) {
        return NextResponse.json({ 
          success: false, 
          error: 'Installation not found' 
        }, { status: 404 });
      }

      // Check if already deployed
      if (installation.deployment_status === 'completed') {
        return NextResponse.json({ 
          success: false, 
          error: 'Installation is already deployed' 
        }, { status: 400 });
      }

      // Get next available port
      const availablePort = await managementPrisma.saas_port_assignments.findFirst({
        where: { is_available: true },
        orderBy: { port_number: 'asc' }
      });

      if (!availablePort) {
        return NextResponse.json({ 
          success: false, 
          error: 'No available ports for deployment' 
        }, { status: 500 });
      }

      // Reserve the port
      await managementPrisma.saas_port_assignments.update({
        where: { id: availablePort.id },
        data: {
          is_available: false,
          installation_id: installation_id,
          assigned_at: new Date()
        }
      });

      // Prepare customer data for deployment
      const companySlug = company_name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const customerData = {
        installationId: installation_id,
        companyName: company_name,
        companySlug,
        adminEmail: admin_email,
        subdomain: subdomain || companySlug,
        billingPlan: billing_plan,
        portOffset: availablePort.port_number - 3001
      };

      // Update installation status
      await managementPrisma.saas_installations.update({
        where: { id: installation_id },
        data: {
          deployment_status: 'starting',
          subdomain: customerData.subdomain,
          port_number: availablePort.port_number
        }
      });

      // Start deployment in background
      deployNewCustomer(customerData).then(async (result) => {
        if (result.success) {
          // Update installation with deployment info
          await managementPrisma.saas_installations.update({
            where: { id: installation_id },
            data: {
              deployment_status: 'completed',
              deployment_url: result.url,
              deployment_path: `/home/deployments/${companySlug}`
            }
          });
          console.log(`Deployment completed for ${company_name}: ${result.url}`);
        } else {
          // Release the port if deployment failed
          await managementPrisma.saas_port_assignments.update({
            where: { id: availablePort.id },
            data: {
              is_available: true,
              installation_id: null,
              assigned_at: null,
              released_at: new Date()
            }
          });

          // Update installation status
          await managementPrisma.saas_installations.update({
            where: { id: installation_id },
            data: {
              deployment_status: 'failed'
            }
          });
          console.error(`Deployment failed for ${company_name}:`, result.error);
        }
      }).catch(async (error) => {
        console.error('Deployment process error:', error);
        
        // Release port and update status on unexpected error
        await managementPrisma.saas_port_assignments.update({
          where: { id: availablePort.id },
          data: {
            is_available: true,
            installation_id: null,
            assigned_at: null,
            released_at: new Date()
          }
        });

        await managementPrisma.saas_installations.update({
          where: { id: installation_id },
          data: {
            deployment_status: 'failed'
          }
        });
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Deployment started successfully',
        estimatedTime: '5-10 minutes',
        port: availablePort.port_number,
        subdomain: customerData.subdomain
      });
    }

    if (action === 'check-deployment-status') {
      const { installation_id } = body;
      
      if (!installation_id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Installation ID is required' 
        }, { status: 400 });
      }

      const installation = await managementPrisma.saas_installations.findUnique({
        where: { id: installation_id },
        select: {
          deployment_status: true,
          deployment_url: true,
          port_number: true,
          subdomain: true
        }
      });

      const latestDeployment = await managementPrisma.saas_deployments.findFirst({
        where: { installation_id },
        orderBy: { started_at: 'desc' }
      });

      return NextResponse.json({ 
        success: true, 
        status: installation?.deployment_status || 'pending',
        url: installation?.deployment_url,
        port: installation?.port_number,
        subdomain: installation?.subdomain,
        deployment: latestDeployment
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Deployment API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}