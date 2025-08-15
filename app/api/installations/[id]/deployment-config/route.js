import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const configData = await request.json();

    // Validate required fields
    if (!configData.subdomain || !configData.port_number) {
      return Response.json(
        { error: 'Subdomain and port number are required' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const existingSubdomain = await prisma.saas_installations.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { 
            OR: [
              { subdomain: configData.subdomain },
              { domain: configData.subdomain }
            ]
          }
        ]
      }
    });

    if (existingSubdomain) {
      return Response.json(
        { error: 'Subdomain is already in use by another installation' },
        { status: 400 }
      );
    }

    const existingPort = await prisma.saas_installations.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { port_number: parseInt(configData.port_number) }
        ]
      }
    });

    if (existingPort) {
      return Response.json(
        { error: 'Port number is already in use by another installation' },
        { status: 400 }
      );
    }

    // Update the installation with deployment configuration
    const updatedInstallation = await prisma.saas_installations.update({
      where: { id },
      data: {
        subdomain: configData.subdomain,
        port_number: parseInt(configData.port_number),
        domain: configData.custom_domain || `${configData.subdomain}.yourdomain.com`,
        updated_at: new Date()
      }
    });

    return Response.json({
      success: true,
      installation: updatedInstallation
    });
  } catch (error) {
    console.error('Error saving deployment configuration:', error);
    return Response.json(
      { error: 'Failed to save deployment configuration' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}