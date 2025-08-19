import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

// This would connect to your central management database
// In production, this should be a separate database from customer installations
const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

/**
 * SaaS Recovery System for Central Management
 * This handles recovery token creation and management from the central admin panel
 */

/**
 * Generate a secure recovery token
 */
export function generateRecoveryToken() {
  return crypto.randomBytes(32).toString('hex'); // 64 character token
}

/**
 * Create a recovery token for an installation
 */
export async function createRecoveryToken(installationId, purpose, createdBy, options = {}) {
  try {
    const token = generateRecoveryToken();
    const expiresAt = new Date(Date.now() + (options.expirationHours || 24) * 60 * 60 * 1000);
    
    // Store in central management database
    const recoveryToken = await managementPrisma.saas_recovery_tokens.create({
      data: {
        installation_id: installationId,
        token,
        purpose,
        expires_at: expiresAt,
        created_by: createdBy,
        max_uses: options.maxUses || 1,
        permissions: options.permissions || ['admin_access'],
        is_active: true
      },
      include: {
        installation: true
      }
    });

    // Log the token creation
    await logRecoveryAction(installationId, recoveryToken.id, 'token_created', null, options.ipAddress, options.userAgent, true, {
      purpose,
      expires_at: expiresAt,
      created_by: createdBy
    });

    // Use http for local development, https for production
    const protocol = recoveryToken.installation.domain.includes('localhost') ? 'http' : 'https';
    
    return {
      success: true,
      token: recoveryToken,
      recoveryUrl: `${protocol}://${recoveryToken.installation.domain}/api/recovery/access?token=${token}`,
      expiresAt
    };
  } catch (error) {
    console.error('Error creating recovery token:', error);
    return { success: false, error: 'Failed to create recovery token' };
  }
}

/**
 * Get all installations
 */
export async function getInstallations() {
  try {
    const installations = await managementPrisma.saas_installations.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        recovery_tokens: {
          where: {
            is_active: true,
            expires_at: { gt: new Date() }
          }
        }
      }
    });

    return { success: true, installations };
  } catch (error) {
    console.error('Error getting installations:', error);
    return { success: false, error: 'Failed to get installations' };
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const stats = await managementPrisma.$transaction(async (tx) => {
      const totalInstallations = await tx.saas_installations.count();
      
      const activeInstallations = await tx.saas_installations.count({
        where: { status: 'active' }
      });
      
      const activeRecoveryTokens = await tx.saas_recovery_tokens.count({
        where: {
          is_active: true,
          expires_at: { gt: new Date() }
        }
      });
      
      const recentRecoveryAccess = await tx.saas_recovery_access_logs.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          },
          action: 'token_used'
        }
      });

      return {
        totalInstallations,
        activeInstallations,
        activeRecoveryTokens,
        recentRecoveryAccess
      };
    });

    return { success: true, stats };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, error: 'Failed to get dashboard stats' };
  }
}

/**
 * Create a new installation
 */
export async function createInstallation(data) {
  try {
    // Generate a temporary unique domain placeholder until deployment configuration
    const tempDomain = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.pending.local`;
    
    const installation = await managementPrisma.saas_installations.create({
      data: {
        company_name: data.companyName,
        admin_name: data.adminName,
        admin_email: data.adminEmail,
        billing_email: data.billingEmail,
        billing_plan: data.billingPlan,
        notes: data.notes,
        status: 'active',
        deployment_status: 'pending',
        domain: tempDomain, // Temporary domain until configuration
        updated_at: new Date()
      }
    });

    return { success: true, installation };
  } catch (error) {
    console.error('Error creating installation:', error);
    return { success: false, error: 'Failed to create installation' };
  }
}

/**
 * Get installation by ID
 */
export async function getInstallationById(id) {
  try {
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id },
      include: {
        recovery_tokens: {
          orderBy: { created_at: 'desc' }
        },
        recovery_access_logs: {
          orderBy: { created_at: 'desc' },
          take: 50
        }
      }
    });

    if (!installation) {
      return { success: false, error: 'Installation not found' };
    }

    return { success: true, installation };
  } catch (error) {
    console.error('Error getting installation:', error);
    return { success: false, error: 'Failed to get installation' };
  }
}

/**
 * Log recovery system actions
 */
export async function logRecoveryAction(installationId, tokenId, action, userEmail, ipAddress, userAgent, success, details = {}) {
  try {
    await managementPrisma.saas_recovery_access_logs.create({
      data: {
        installation_id: installationId,
        token_id: tokenId,
        action,
        user_email: userEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        success,
        details,
        performed_by: details.performed_by || 'system'
      }
    });
  } catch (error) {
    console.error('Error logging recovery action:', error);
  }
}

/**
 * Revoke a recovery token
 */
export async function revokeRecoveryToken(tokenId, revokedBy, reason) {
  try {
    const token = await managementPrisma.saas_recovery_tokens.update({
      where: { id: tokenId },
      data: { is_active: false },
      include: { installation: true }
    });

    await logRecoveryAction(
      token.installation_id,
      tokenId,
      'token_revoked',
      null,
      null,
      null,
      true,
      {
        revoked_by: revokedBy,
        reason
      }
    );

    return { success: true, message: 'Recovery token revoked successfully' };
  } catch (error) {
    console.error('Error revoking recovery token:', error);
    return { success: false, error: 'Failed to revoke recovery token' };
  }
}

/**
 * Validate recovery token from customer installation
 * This is called by the customer installation's API
 */
export async function validateRecoveryTokenFromInstallation(token, domain, ipAddress, userAgent) {
  try {
    // First get the installation by domain
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { domain },
      include: {
        recovery_tokens: {
          where: { token }
        }
      }
    });

    if (!installation || installation.recovery_tokens.length === 0) {
      return { success: false, error: 'Invalid recovery token' };
    }

    const recoveryToken = installation.recovery_tokens[0];

    // Check if token is expired
    if (new Date() > recoveryToken.expires_at) {
      return { success: false, error: 'Recovery token has expired' };
    }

    // Check if token is still active
    if (!recoveryToken.is_active) {
      return { success: false, error: 'Recovery token has been deactivated' };
    }

    // Check max uses
    if (recoveryToken.use_count >= recoveryToken.max_uses) {
      return { success: false, error: 'Recovery token has been used maximum times' };
    }

    // Update use count
    await managementPrisma.saas_recovery_tokens.update({
      where: { id: recoveryToken.id },
      data: {
        use_count: recoveryToken.use_count + 1,
        used_at: new Date(),
        used_by_ip: ipAddress,
        used_by_agent: userAgent
      }
    });

    // Log successful token use
    await logRecoveryAction(
      installation.id, 
      recoveryToken.id, 
      'token_used', 
      null, 
      ipAddress, 
      userAgent, 
      true, 
      {
        purpose: recoveryToken.purpose,
        use_count: recoveryToken.use_count + 1,
        domain: domain
      }
    );

    return {
      success: true,
      token: {
        ...recoveryToken,
        installation: installation
      },
      permissions: recoveryToken.permissions
    };
  } catch (error) {
    console.error('Error validating recovery token:', error);
    return { success: false, error: 'Failed to validate recovery token' };
  }
}