import { PrismaClient } from "@prisma/client";

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

export async function getSupportStats() {
  try {
    // Get open tickets count
    const openTickets = await managementPrisma.saas_support_tickets.count({
      where: { status: "open" }
    });

    // Get in progress tickets count
    const inProgressTickets = await managementPrisma.saas_support_tickets.count({
      where: { status: "in_progress" }
    });

    // Get tickets created in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTickets = await managementPrisma.saas_support_tickets.count({
      where: {
        created_at: { gte: sevenDaysAgo }
      }
    });

    // Get high priority open tickets
    const highPriorityTickets = await managementPrisma.saas_support_tickets.count({
      where: {
        priority: "high",
        status: { in: ["open", "in_progress"] }
      }
    });

    return {
      success: true,
      stats: {
        openTickets,
        inProgressTickets,
        recentTickets,
        highPriorityTickets
      }
    };
  } catch (error) {
    console.error("Error getting support stats:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getSupportTickets(filters = {}) {
  try {
    const { status, priority, installationId, search, limit = 50 } = filters;
    
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;
    if (installationId) where.installation_id = installationId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { customer_email: { contains: search, mode: 'insensitive' } },
        { customer_name: { contains: search, mode: 'insensitive' } }
      ];
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
      orderBy: { created_at: 'desc' },
      take: limit
    });

    return {
      success: true,
      tickets: tickets.map(ticket => ({
        ...ticket,
        installation: ticket.saas_installations
      }))
    };
  } catch (error) {
    console.error("Error getting support tickets:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getSupportTicketById(ticketId) {
  try {
    const ticket = await managementPrisma.saas_support_tickets.findUnique({
      where: { id: ticketId },
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
      return {
        success: false,
        error: "Ticket not found"
      };
    }

    return {
      success: true,
      ticket: {
        ...ticket,
        installation: ticket.saas_installations
      }
    };
  } catch (error) {
    console.error("Error getting support ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createSupportTicket(ticketData) {
  try {
    const {
      installationId,
      title,
      description,
      priority = 'medium',
      category = 'general',
      customerEmail,
      customerName,
      assignedTo
    } = ticketData;

    // Generate ticket number
    const ticketCount = await managementPrisma.saas_support_tickets.count();
    const ticketNumber = `ST-${(ticketCount + 1).toString().padStart(6, '0')}`;

    const ticket = await managementPrisma.saas_support_tickets.create({
      data: {
        installation_id: installationId,
        ticket_number: ticketNumber,
        title,
        description,
        priority,
        category,
        customer_email: customerEmail,
        customer_name: customerName,
        assigned_to: assignedTo,
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

    return {
      success: true,
      ticket: {
        ...ticket,
        installation: ticket.saas_installations
      }
    };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function addTicketMessage(ticketId, messageData) {
  try {
    const {
      senderType,
      senderName,
      senderEmail,
      message,
      isInternal = false
    } = messageData;

    const newMessage = await managementPrisma.saas_support_messages.create({
      data: {
        ticket_id: ticketId,
        sender_type: senderType,
        sender_name: senderName,
        sender_email: senderEmail,
        message,
        is_internal: isInternal
      }
    });

    return {
      success: true,
      message: newMessage
    };
  } catch (error) {
    console.error("Error adding ticket message:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function updateTicketStatus(ticketId, status, resolution = null) {
  try {
    const updateData = { status };
    if (resolution) updateData.resolution = resolution;

    const ticket = await managementPrisma.saas_support_tickets.update({
      where: { id: ticketId },
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

    return {
      success: true,
      ticket: {
        ...ticket,
        installation: ticket.saas_installations
      }
    };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
