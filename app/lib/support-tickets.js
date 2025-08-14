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
