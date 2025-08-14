import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const messages = await managementPrisma.saas_support_messages.findMany({
      where: { ticket_id: id },
      orderBy: { created_at: 'asc' }
    });

    return NextResponse.json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error('Error fetching support messages:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch support messages' 
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      message,
      sender_type = 'admin',
      sender_name,
      sender_email,
      is_internal = false
    } = body;

    if (!message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message content is required' 
      }, { status: 400 });
    }

    // Verify ticket exists
    const ticket = await managementPrisma.saas_support_tickets.findUnique({
      where: { id }
    });

    if (!ticket) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ticket not found' 
      }, { status: 404 });
    }

    const newMessage = await managementPrisma.saas_support_messages.create({
      data: {
        ticket_id: id,
        message,
        sender_type,
        sender_name,
        sender_email,
        is_internal
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    });
  } catch (error) {
    console.error('Error creating support message:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create support message' 
    }, { status: 500 });
  }
}