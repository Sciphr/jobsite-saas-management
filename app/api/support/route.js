import { NextResponse } from 'next/server';
import { 
  createSupportTicket, 
  getSupportTickets, 
  getSupportTicketById,
  addTicketMessage,
  updateTicketStatus,
  getSupportStats
} from '../../lib/support-tickets.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');
    const action = searchParams.get('action');

    if (action === 'stats') {
      const result = await getSupportStats();
      if (result.success) {
        return NextResponse.json(result.stats);
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (ticketId) {
      const result = await getSupportTicketById(ticketId);
      if (result.success) {
        return NextResponse.json(result.ticket);
      } else {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
    }

    // Get filtered tickets
    const filters = {
      status: searchParams.get('status'),
      priority: searchParams.get('priority'),
      installationId: searchParams.get('installation'),
      search: searchParams.get('search'),
      limit: parseInt(searchParams.get('limit')) || 50
    };

    const result = await getSupportTickets(filters);
    if (result.success) {
      return NextResponse.json(result.tickets);
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-ticket') {
      const result = await createSupportTicket({
        installationId: body.installation_id,
        title: body.title,
        description: body.description,
        priority: body.priority,
        category: body.category,
        customerEmail: body.customer_email,
        customerName: body.customer_name,
        assignedTo: body.assigned_to
      });

      if (result.success) {
        return NextResponse.json({ 
          message: 'Ticket created successfully', 
          ticket: result.ticket 
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'add-message') {
      const result = await addTicketMessage(body.ticket_id, {
        senderType: body.sender_type,
        senderName: body.sender_name,
        senderEmail: body.sender_email,
        message: body.message,
        isInternal: body.is_internal
      });

      if (result.success) {
        return NextResponse.json({ 
          message: 'Message added successfully', 
          messageData: result.message 
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    if (action === 'update-status') {
      const result = await updateTicketStatus(
        body.ticket_id, 
        body.status, 
        body.resolution
      );

      if (result.success) {
        return NextResponse.json({ 
          message: 'Ticket status updated successfully', 
          ticket: result.ticket 
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}