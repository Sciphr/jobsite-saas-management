import { PrismaClient } from '@prisma/client';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

/**
 * Health Monitor for SaaS Installations
 * Performs various health checks on customer installations
 */

/**
 * Perform a basic HTTP health check
 */
async function performHttpCheck(domain) {
  const startTime = Date.now();
  
  try {
    // Handle domains that already include protocol
    let url;
    if (domain.startsWith('http://') || domain.startsWith('https://')) {
      url = `${domain}/api/health`;
    } else {
      const protocol = domain.includes('localhost') ? 'http' : 'https';
      url = `${protocol}://${domain}/api/health`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'SaaS-Management-Health-Check/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        status: 'healthy',
        response_time: responseTime,
        details: {
          status_code: response.status,
          headers: Object.fromEntries(response.headers)
        }
      };
    } else {
      return {
        status: 'unhealthy',
        response_time: responseTime,
        error_message: `HTTP ${response.status}: ${response.statusText}`,
        details: {
          status_code: response.status
        }
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'error',
      response_time: responseTime,
      error_message: error.message,
      details: {
        error_type: error.name
      }
    };
  }
}

/**
 * Perform database connectivity check (if database URL is available)
 */
async function performDatabaseCheck(databaseUrl) {
  if (!databaseUrl) {
    return {
      status: 'skipped',
      error_message: 'No database URL configured'
    };
  }

  try {
    const testPrisma = new PrismaClient({
      datasourceUrl: databaseUrl
    });
    
    const startTime = Date.now();
    await testPrisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    await testPrisma.$disconnect();
    
    return {
      status: 'healthy',
      response_time: responseTime,
      details: {
        connection_test: 'passed'
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error_message: error.message,
      details: {
        error_type: error.name
      }
    };
  }
}

/**
 * Run health check for a single installation
 */
export async function runHealthCheck(installationId) {
  try {
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id: installationId }
    });

    if (!installation) {
      throw new Error('Installation not found');
    }

    const results = {
      overall_status: 'healthy',
      checks: {}
    };

    // HTTP Health Check
    const httpResult = await performHttpCheck(installation.domain);
    results.checks.http = httpResult;
    
    if (httpResult.status !== 'healthy') {
      results.overall_status = httpResult.status;
    }

    // Database Health Check
    if (installation.database_url) {
      const dbResult = await performDatabaseCheck(installation.database_url);
      results.checks.database = dbResult;
      
      if (dbResult.status === 'error' && results.overall_status === 'healthy') {
        results.overall_status = 'degraded';
      }
    }

    // Store health check results
    await managementPrisma.saas_health_checks.create({
      data: {
        installation_id: installationId,
        check_type: 'full_check',
        status: results.overall_status,
        response_time: results.checks.http?.response_time || null,
        error_message: results.checks.http?.error_message || null,
        details: results
      }
    });

    // Update installation health status
    await managementPrisma.saas_installations.update({
      where: { id: installationId },
      data: {
        health_status: results.overall_status,
        health_details: results,
        last_health_check: new Date()
      }
    });

    return { success: true, results };
  } catch (error) {
    console.error('Error running health check:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Run health checks for all active installations
 */
export async function runAllHealthChecks() {
  try {
    const installations = await managementPrisma.saas_installations.findMany({
      where: { status: 'active' },
      select: { id: true, domain: true }
    });

    const results = [];
    
    for (const installation of installations) {
      console.log(`Running health check for ${installation.domain}...`);
      const result = await runHealthCheck(installation.id);
      results.push({
        installation_id: installation.id,
        domain: installation.domain,
        ...result
      });
      
      // Add small delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { success: true, results };
  } catch (error) {
    console.error('Error running all health checks:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get health check history for an installation
 */
export async function getHealthHistory(installationId, limit = 50) {
  try {
    const healthChecks = await managementPrisma.saas_health_checks.findMany({
      where: { installation_id: installationId },
      orderBy: { checked_at: 'desc' },
      take: limit
    });

    return { success: true, healthChecks };
  } catch (error) {
    console.error('Error getting health history:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get system-wide health overview
 */
export async function getHealthOverview() {
  try {
    const stats = await managementPrisma.$transaction(async (tx) => {
      const totalInstallations = await tx.saas_installations.count({
        where: { status: 'active' }
      });
      
      const healthyInstallations = await tx.saas_installations.count({
        where: { 
          status: 'active',
          health_status: 'healthy'
        }
      });
      
      const unhealthyInstallations = await tx.saas_installations.count({
        where: { 
          status: 'active',
          health_status: { in: ['unhealthy', 'error'] }
        }
      });
      
      const degradedInstallations = await tx.saas_installations.count({
        where: { 
          status: 'active',
          health_status: 'degraded'
        }
      });

      const recentChecks = await tx.saas_health_checks.count({
        where: {
          checked_at: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      return {
        totalInstallations,
        healthyInstallations,
        unhealthyInstallations,
        degradedInstallations,
        recentChecks
      };
    });

    return { success: true, stats };
  } catch (error) {
    console.error('Error getting health overview:', error);
    return { success: false, error: error.message };
  }
}