import { PrismaClient } from '@prisma/client';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

/**
 * Support Ticket Management System
 * Handles customer support tickets and communication
 */

/**
 * Create a new support ticket
 */
export async function createSupportTicket(data) {
  try {
    const ticket = await managementPrisma.saas_support_tickets.create({
      data: {
        installation_id: data.installationId,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        category: data.category || 'technical',
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        assigned_to: data.assignedTo || 'admin'
      },
      include: {
        installation: {
          select: {
            domain: true,
            company_name: true
          }
        }
      }
    });

    // Create initial message with the ticket description
    await managementPrisma.saas_support_messages.create({
      data: {
        ticket_id: ticket.id,
        sender_type: 'customer',
        sender_name: data.customerName,
        sender_email: data.customerEmail,
        message: data.description,
        is_internal: false
      }
    });

    return { success: true, ticket };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all support tickets with filtering and pagination
 */
export async function getSupportTickets(filters = {}) {
  try {
    const where = {};
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.priority) {
      where.priority = filters.priority;
    }
    
    if (filters.installationId) {
      where.installation_id = filters.installationId;
    }
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { ticket_number: { contains: filters.search, mode: 'insensitive' } },
        { customer_email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const tickets = await managementPrisma.saas_support_tickets.findMany({
      where,
      include: {
        installation: {
          select: {
            domain: true,
            company_name: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: filters.limit || 50
    });

    return { success: true, tickets };
  } catch (error) {
    console.error('Error getting support tickets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get a single support ticket with messages
 */
export async function getSupportTicketById(ticketId) {
  try {
    const ticket = await managementPrisma.saas_support_tickets.findUnique({
      where: { id: ticketId },
      include: {
        installation: {
          select: {
            domain: true,
            company_name: true,
            admin_email: true
          }
        },
        messages: {
          orderBy: { created_at: 'asc' }
        }
      }
    });

    if (!ticket) {
      return { success: false, error: 'Ticket not found' };
    }

    return { success: true, ticket };
  } catch (error) {
    console.error('Error getting support ticket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add a message to a support ticket
 */
export async function addTicketMessage(ticketId, messageData) {
  try {
    const message = await managementPrisma.saas_support_messages.create({
      data: {
        ticket_id: ticketId,
        sender_type: messageData.senderType,
        sender_name: messageData.senderName,
        sender_email: messageData.senderEmail,
        message: messageData.message,
        is_internal: messageData.isInternal || false
      }
    });

    // Update ticket's updated_at timestamp
    await managementPrisma.saas_support_tickets.update({
      where: { id: ticketId },
      data: { updated_at: new Date() }
    });

    return { success: true, message };
  } catch (error) {
    console.error('Error adding ticket message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update support ticket status
 */
export async function updateTicketStatus(ticketId, status, resolution = null) {
  try {
    const updateData = {
      status,
      updated_at: new Date()
    };

    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date();
      if (resolution) {
        updateData.resolution_notes = resolution;
      }
    }

    const ticket = await managementPrisma.saas_support_tickets.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        installation: {
          select: {
            domain: true,
            company_name: true
          }
        }
      }
    });

    return { success: true, ticket };
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get support ticket statistics
 */
export async function getSupportStats() {
  try {
    const stats = await managementPrisma.$transaction(async (tx) => {
      const totalTickets = await tx.saas_support_tickets.count();
      
      const openTickets = await tx.saas_support_tickets.count({
        where: { status: { in: ['open', 'in_progress'] } }
      });
      
      const resolvedTickets = await tx.saas_support_tickets.count({
        where: { status: { in: ['resolved', 'closed'] } }
      });
      
      const urgentTickets = await tx.saas_support_tickets.count({
        where: { 
          priority: 'urgent',
          status: { in: ['open', 'in_progress'] }
        }
      });

      const recentTickets = await tx.saas_support_tickets.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      });

      // Calculate average resolution time
      const resolvedWithTimes = await tx.saas_support_tickets.findMany({
        where: {
          status: { in: ['resolved', 'closed'] },
          resolved_at: { not: null }
        },
        select: {
          created_at: true,
          resolved_at: true
        }
      });

      let avgResolutionHours = 0;
      if (resolvedWithTimes.length > 0) {
        const totalHours = resolvedWithTimes.reduce((sum, ticket) => {
          const hours = (ticket.resolved_at - ticket.created_at) / (1000 * 60 * 60);
          return sum + hours;
        }, 0);
        avgResolutionHours = Math.round(totalHours / resolvedWithTimes.length);
      }

      return {
        totalTickets,
        openTickets,
        resolvedTickets,
        urgentTickets,
        recentTickets,
        avgResolutionHours
      };
    });

    return { success: true, stats };
  } catch (error) {
    console.error('Error getting support stats:', error);
    return { success: false, error: error.message };
  }
}