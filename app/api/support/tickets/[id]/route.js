import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const ticket = await managementPrisma.saas_support_tickets.findUnique({
      where: { id },
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

    if (!ticket) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ticket not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      ticket: {
        ...ticket,
        installation: ticket.saas_installations
      }
    });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch support ticket' 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, priority, assigned_to, category } = body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
    if (category) updateData.category = category;

    const ticket = await managementPrisma.saas_support_tickets.update({
      where: { id },
      data: updateData,
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
    console.error('Error updating support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update support ticket' 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await managementPrisma.saas_support_tickets.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Ticket deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete support ticket' 
    }, { status: 500 });
  }
}