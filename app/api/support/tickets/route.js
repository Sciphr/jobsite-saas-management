import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get('installation');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build where clause
    const where = {};
    if (installationId) {
      where.installation_id = installationId;
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    const tickets = await managementPrisma.saas_support_tickets.findMany({
      where,
      include: {
        saas_installations: {
          select: {
            id: true,
            company_name: true,
            domain: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit
    });

    // Transform the data to match the expected structure
    const transformedTickets = tickets.map(ticket => ({
      ...ticket,
      installation: ticket.saas_installations
    }));

    return NextResponse.json({ 
      success: true, 
      tickets: transformedTickets 
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch support tickets' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      installation_id,
      title,
      description,
      priority = 'medium',
      category = 'general',
      customer_email,
      customer_name
    } = body;

    if (!title || !description || !customer_email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, description, and customer email are required' 
      }, { status: 400 });
    }

    // Generate ticket number
    const ticketCount = await managementPrisma.saas_support_tickets.count();
    const ticketNumber = `ST-${(ticketCount + 1).toString().padStart(6, '0')}`;

    const ticket = await managementPrisma.saas_support_tickets.create({
      data: {
        installation_id,
        ticket_number: ticketNumber,
        title,
        description,
        priority,
        category,
        customer_email,
        customer_name,
        status: 'open'
      },
      include: {
        saas_installations: {
          select: {
            id: true,
            company_name: true,
            domain: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      ticket: {
        ...ticket,
        installation: ticket.saas_installations
      }
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create support ticket' 
    }, { status: 500 });
  }
}