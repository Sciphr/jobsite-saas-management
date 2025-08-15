import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usedPorts = await prisma.saas_installations.findMany({
      where: {
        port_number: { not: null }
      },
      select: { port_number: true }
    });

    const usedDomains = await prisma.saas_installations.findMany({
      where: {
        OR: [
          { subdomain: { not: null } },
          { domain: { not: null } }
        ]
      },
      select: { subdomain: true, domain: true }
    });

    const portNumbers = usedPorts.map(p => p.port_number).filter(Boolean);
    const domainNames = [
      ...usedDomains.map(d => d.subdomain).filter(Boolean),
      ...usedDomains.map(d => d.domain).filter(Boolean)
    ];

    return Response.json({
      success: true,
      usedPorts: portNumbers,
      usedDomains: domainNames
    });
  } catch (error) {
    console.error('Error fetching conflicts:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch conflict data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}