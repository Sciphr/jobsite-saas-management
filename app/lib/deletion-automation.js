import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Use the management database
const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

// Configuration constants
const DEPLOYMENT_CONFIG = {
  SSH_HOST: '192.168.2.100',
  SSH_USER: 'jacob',
  BASE_DIRECTORY: '/home/jacob/asari_installations',
  DB_HOST: '192.168.2.100',
  DB_USER: 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'your_password',
  MINIO_ENDPOINT: '192.168.2.100',
  MINIO_PORT: '9000',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
};

/**
 * Run command on remote Pi via SSH
 */
function runSSHCommand(command) {
  return new Promise((resolve, reject) => {
    const sshCommand = `ssh -o StrictHostKeyChecking=no ${DEPLOYMENT_CONFIG.SSH_USER}@${DEPLOYMENT_CONFIG.SSH_HOST} "${command}"`;
    
    exec(sshCommand, { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * Stop PM2 process for the installation
 */
export async function stopPM2Process(subdomain) {
  try {
    console.log(`Stopping PM2 process for ${subdomain}...`);
    
    // Get PM2 app name (should match what was used during deployment)
    const appName = `${subdomain}-asari`;
    
    // Stop the PM2 process
    await runSSHCommand(`pm2 stop ${appName} || echo "Process already stopped"`);
    
    // Delete the PM2 process
    await runSSHCommand(`pm2 delete ${appName} || echo "Process not found"`);
    
    // Save PM2 configuration
    await runSSHCommand('pm2 save');
    
    console.log(`PM2 process stopped successfully for ${subdomain}`);
    return { success: true };
  } catch (error) {
    console.error('Error stopping PM2 process:', error);
    return { 
      success: false, 
      error: `Failed to stop PM2 process: ${error.error?.message || error.stderr || 'Unknown error'}`,
      canContinue: true // This failure shouldn't block other cleanup steps
    };
  }
}

/**
 * Remove deployment directory from Pi
 */
export async function removeDeploymentDirectory(subdomain) {
  try {
    console.log(`Removing deployment directory for ${subdomain}...`);
    
    const deploymentPath = `${DEPLOYMENT_CONFIG.BASE_DIRECTORY}/${subdomain}`;
    
    // Check if directory exists first
    try {
      await runSSHCommand(`test -d "${deploymentPath}"`);
      console.log(`Directory exists: ${deploymentPath}`);
    } catch (error) {
      console.log(`Directory does not exist: ${deploymentPath} - skipping removal`);
      return { success: true, skipped: true };
    }
    
    // Remove the entire deployment directory
    await runSSHCommand(`rm -rf "${deploymentPath}"`);
    
    // Verify removal
    try {
      await runSSHCommand(`test -d "${deploymentPath}"`);
      throw new Error('Directory still exists after removal attempt');
    } catch (verifyError) {
      // This is expected - directory should not exist
      console.log(`Directory successfully removed: ${deploymentPath}`);
    }
    
    console.log(`Deployment directory removed successfully for ${subdomain}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing deployment directory:', error);
    return { 
      success: false, 
      error: `Failed to remove deployment directory: ${error.error?.message || error.stderr || error.message || 'Unknown error'}`
    };
  }
}

/**
 * Remove nginx configuration
 */
export async function removeNginxConfig(subdomain) {
  try {
    console.log(`Removing nginx configuration for ${subdomain}...`);
    
    const domain = `${subdomain}.asari.sciphr.ca`;
    
    // Check if nginx config exists
    const checkConfigCommand = `sudo grep -n "${domain}" /etc/nginx/sites-available/sciphr || echo "Config not found"`;
    const checkResult = await runSSHCommand(checkConfigCommand);
    
    if (checkResult.stdout.includes('Config not found')) {
      console.log(`Nginx config for ${domain} not found - skipping removal`);
      return { success: true, skipped: true };
    }
    
    // Create a backup of the current config
    await runSSHCommand(`sudo cp /etc/nginx/sites-available/sciphr /etc/nginx/sites-available/sciphr.backup.$(date +%s)`);
    
    // Remove the server block for this domain
    const removeConfigScript = `
    sudo awk '
    BEGIN { skip = 0; brace_count = 0 }
    /server {/ && /# ${domain}/ { skip = 1; brace_count = 1; next }
    skip && /{/ { brace_count++; next }
    skip && /}/ { 
        brace_count--; 
        if (brace_count == 0) { 
            skip = 0; 
        }
        next 
    }
    !skip { print }
    ' /etc/nginx/sites-available/sciphr > /tmp/sciphr.tmp && sudo mv /tmp/sciphr.tmp /etc/nginx/sites-available/sciphr
    `;
    
    await runSSHCommand(removeConfigScript);
    
    // Test nginx configuration
    await runSSHCommand('sudo nginx -t');
    
    // Reload nginx
    await runSSHCommand('sudo systemctl reload nginx');
    
    console.log(`Nginx configuration removed successfully for ${subdomain}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing nginx config:', error);
    return { 
      success: false, 
      error: `Failed to remove nginx config: ${error.error?.message || error.stderr || 'Unknown error'}`,
      canContinue: true // Nginx issues shouldn't block database cleanup
    };
  }
}

/**
 * Revoke SSL certificate
 */
export async function revokeSSLCertificate(subdomain) {
  try {
    console.log(`Revoking SSL certificate for ${subdomain}...`);
    
    const domain = `${subdomain}.asari.sciphr.ca`;
    
    // Check if certificate exists
    const checkCertCommand = `sudo certbot certificates | grep "${domain}" || echo "Certificate not found"`;
    const checkResult = await runSSHCommand(checkCertCommand);
    
    if (checkResult.stdout.includes('Certificate not found')) {
      console.log(`SSL certificate for ${domain} not found - skipping revocation`);
      return { success: true, skipped: true };
    }
    
    // Revoke and delete the certificate
    const revokeCommand = `sudo certbot delete --cert-name ${domain} --non-interactive`;
    await runSSHCommand(revokeCommand);
    
    console.log(`SSL certificate revoked successfully for ${subdomain}`);
    return { success: true };
  } catch (error) {
    console.error('Error revoking SSL certificate:', error);
    return { 
      success: false, 
      error: `Failed to revoke SSL certificate: ${error.error?.message || error.stderr || 'Unknown error'}`,
      canContinue: true // SSL issues shouldn't block other cleanup
    };
  }
}

/**
 * Drop customer database
 */
export async function dropCustomerDatabase(subdomain) {
  try {
    console.log(`Dropping customer database for ${subdomain}...`);
    
    const dbName = `${subdomain}_asari_db`;
    
    // Check if database exists first
    const checkDbCommand = `PGPASSWORD=${DEPLOYMENT_CONFIG.DB_PASSWORD} psql -h ${DEPLOYMENT_CONFIG.DB_HOST} -U ${DEPLOYMENT_CONFIG.DB_USER} -lqt | cut -d \\| -f 1 | grep -qw ${dbName} && echo "exists" || echo "not found"`;
    const checkResult = await runSSHCommand(checkDbCommand);
    
    if (checkResult.stdout.includes('not found')) {
      console.log(`Database ${dbName} not found - skipping drop`);
      return { success: true, skipped: true };
    }
    
    // Terminate all connections to the database first
    const terminateConnectionsCommand = `PGPASSWORD=${DEPLOYMENT_CONFIG.DB_PASSWORD} psql -h ${DEPLOYMENT_CONFIG.DB_HOST} -U ${DEPLOYMENT_CONFIG.DB_USER} -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbName}';"`;
    await runSSHCommand(terminateConnectionsCommand);
    
    // Drop the database
    const dropDbCommand = `PGPASSWORD=${DEPLOYMENT_CONFIG.DB_PASSWORD} dropdb -h ${DEPLOYMENT_CONFIG.DB_HOST} -U ${DEPLOYMENT_CONFIG.DB_USER} ${dbName}`;
    await runSSHCommand(dropDbCommand);
    
    // Verify database was dropped
    const verifyResult = await runSSHCommand(checkDbCommand);
    if (verifyResult.stdout.includes('exists')) {
      throw new Error('Database still exists after drop attempt');
    }
    
    console.log(`Customer database dropped successfully: ${dbName}`);
    return { success: true };
  } catch (error) {
    console.error('Error dropping customer database:', error);
    return { 
      success: false, 
      error: `Failed to drop customer database: ${error.error?.message || error.stderr || error.message || 'Unknown error'}`
    };
  }
}

/**
 * Remove MinIO bucket (optional)
 */
export async function removeMinIOBucket(subdomain) {
  try {
    console.log(`Removing MinIO bucket for ${subdomain}...`);
    
    const bucketName = `${subdomain}-resumes`;
    
    // Check if MinIO client is available
    try {
      await runSSHCommand('which mc');
    } catch (error) {
      console.log('MinIO client (mc) not available - skipping bucket removal');
      return { success: true, skipped: true };
    }
    
    // Set up MinIO alias
    const mcAliasCommand = `mc alias set local http://${DEPLOYMENT_CONFIG.MINIO_ENDPOINT}:${DEPLOYMENT_CONFIG.MINIO_PORT} ${DEPLOYMENT_CONFIG.MINIO_ACCESS_KEY} ${DEPLOYMENT_CONFIG.MINIO_SECRET_KEY}`;
    await runSSHCommand(mcAliasCommand);
    
    // Check if bucket exists
    const checkBucketCommand = `mc ls local/${bucketName} || echo "Bucket not found"`;
    const checkResult = await runSSHCommand(checkBucketCommand);
    
    if (checkResult.stdout.includes('Bucket not found')) {
      console.log(`MinIO bucket ${bucketName} not found - skipping removal`);
      return { success: true, skipped: true };
    }
    
    // Remove all objects in the bucket first
    await runSSHCommand(`mc rm --recursive --force local/${bucketName} || echo "No objects to remove"`);
    
    // Remove the bucket
    await runSSHCommand(`mc rb local/${bucketName}`);
    
    console.log(`MinIO bucket removed successfully: ${bucketName}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing MinIO bucket:', error);
    return { 
      success: false, 
      error: `Failed to remove MinIO bucket: ${error.error?.message || error.stderr || 'Unknown error'}`,
      canContinue: true // MinIO issues shouldn't block main cleanup
    };
  }
}

/**
 * Release port assignment
 */
export async function releasePortAssignment(installationId) {
  try {
    console.log(`Releasing port assignment for installation ${installationId}...`);
    
    // Find and release the port
    const portAssignment = await managementPrisma.saas_port_assignments.findFirst({
      where: { installation_id: installationId }
    });
    
    if (!portAssignment) {
      console.log('No port assignment found - skipping release');
      return { success: true, skipped: true };
    }
    
    await managementPrisma.saas_port_assignments.update({
      where: { id: portAssignment.id },
      data: {
        is_available: true,
        installation_id: null,
        assigned_at: null,
        released_at: new Date()
      }
    });
    
    console.log(`Port ${portAssignment.port_number} released successfully`);
    return { success: true, port: portAssignment.port_number };
  } catch (error) {
    console.error('Error releasing port assignment:', error);
    return { 
      success: false, 
      error: `Failed to release port assignment: ${error.message}`
    };
  }
}

/**
 * Emit progress update via WebSocket for deletion process
 */
function emitDeletionProgress(installationId, step, status, message) {
  try {
    if (global.io) {
      global.io.emit('deletion-progress', {
        installationId,
        step,
        status, // 'pending', 'in_progress', 'completed', 'failed', 'skipped'
        message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error emitting deletion progress:', error);
  }
}

/**
 * Complete installation deletion process
 */
export async function deleteInstallation(installationData) {
  const { id: installationId, subdomain, company_name } = installationData;
  
  console.log(`Starting deletion process for ${company_name} (${subdomain})`);
  
  // Define cleanup steps
  const steps = [
    'Stopping PM2 process',
    'Removing deployment directory',
    'Removing nginx configuration', 
    'Revoking SSL certificate',
    'Dropping customer database',
    'Removing MinIO bucket',
    'Releasing port assignment',
    'Cleaning up management database'
  ];
  
  let results = [];
  let allSuccessful = true;
  
  try {
    // Step 0: Stop PM2 process
    emitDeletionProgress(installationId, 0, 'in_progress', 'Stopping PM2 process...');
    const pm2Result = await stopPM2Process(subdomain);
    results.push({ step: 0, name: steps[0], ...pm2Result });
    emitDeletionProgress(installationId, 0, pm2Result.success ? 'completed' : 'failed', 
      pm2Result.success ? 'PM2 process stopped' : pm2Result.error);
    if (!pm2Result.success && !pm2Result.canContinue) allSuccessful = false;
    
    // Step 1: Remove deployment directory  
    emitDeletionProgress(installationId, 1, 'in_progress', 'Removing deployment files...');
    const dirResult = await removeDeploymentDirectory(subdomain);
    results.push({ step: 1, name: steps[1], ...dirResult });
    emitDeletionProgress(installationId, 1, dirResult.success ? 'completed' : 'failed',
      dirResult.success ? (dirResult.skipped ? 'Directory not found (already removed)' : 'Deployment directory removed') : dirResult.error);
    if (!dirResult.success) allSuccessful = false;
    
    // Step 2: Remove nginx configuration
    emitDeletionProgress(installationId, 2, 'in_progress', 'Removing nginx configuration...');
    const nginxResult = await removeNginxConfig(subdomain);
    results.push({ step: 2, name: steps[2], ...nginxResult });
    emitDeletionProgress(installationId, 2, nginxResult.success ? 'completed' : 'failed',
      nginxResult.success ? (nginxResult.skipped ? 'Nginx config not found' : 'Nginx config removed') : nginxResult.error);
    if (!nginxResult.success && !nginxResult.canContinue) allSuccessful = false;
    
    // Step 3: Revoke SSL certificate
    emitDeletionProgress(installationId, 3, 'in_progress', 'Revoking SSL certificate...');
    const sslResult = await revokeSSLCertificate(subdomain);
    results.push({ step: 3, name: steps[3], ...sslResult });
    emitDeletionProgress(installationId, 3, sslResult.success ? 'completed' : 'failed',
      sslResult.success ? (sslResult.skipped ? 'SSL certificate not found' : 'SSL certificate revoked') : sslResult.error);
    if (!sslResult.success && !sslResult.canContinue) allSuccessful = false;
    
    // Step 4: Drop customer database
    emitDeletionProgress(installationId, 4, 'in_progress', 'Dropping customer database...');
    const dbResult = await dropCustomerDatabase(subdomain);
    results.push({ step: 4, name: steps[4], ...dbResult });
    emitDeletionProgress(installationId, 4, dbResult.success ? 'completed' : 'failed',
      dbResult.success ? (dbResult.skipped ? 'Database not found' : 'Customer database dropped') : dbResult.error);
    if (!dbResult.success) allSuccessful = false;
    
    // Step 5: Remove MinIO bucket
    emitDeletionProgress(installationId, 5, 'in_progress', 'Removing MinIO bucket...');
    const minioResult = await removeMinIOBucket(subdomain);
    results.push({ step: 5, name: steps[5], ...minioResult });
    emitDeletionProgress(installationId, 5, minioResult.success ? 'completed' : 'failed',
      minioResult.success ? (minioResult.skipped ? 'MinIO bucket not found' : 'MinIO bucket removed') : minioResult.error);
    if (!minioResult.success && !minioResult.canContinue) allSuccessful = false;
    
    // Step 6: Release port assignment
    emitDeletionProgress(installationId, 6, 'in_progress', 'Releasing port assignment...');
    const portResult = await releasePortAssignment(installationId);
    results.push({ step: 6, name: steps[6], ...portResult });
    emitDeletionProgress(installationId, 6, portResult.success ? 'completed' : 'failed',
      portResult.success ? (portResult.skipped ? 'No port assignment found' : `Port ${portResult.port} released`) : portResult.error);
    if (!portResult.success) allSuccessful = false;
    
    // Step 7: Clean up management database (only if all critical steps succeeded)
    if (allSuccessful) {
      emitDeletionProgress(installationId, 7, 'in_progress', 'Cleaning up management database...');
      
      // Delete from management database (cascading deletes will handle related records)
      await managementPrisma.saas_installations.delete({
        where: { id: installationId }
      });
      
      results.push({ step: 7, name: steps[7], success: true });
      emitDeletionProgress(installationId, 7, 'completed', 'Management database cleaned up');
      
      console.log(`Installation deletion completed successfully for ${company_name}`);
      return {
        success: true,
        message: `Installation ${company_name} deleted successfully`,
        results
      };
    } else {
      emitDeletionProgress(installationId, 7, 'failed', 'Skipped due to previous failures - try again to retry failed steps');
      
      console.log(`Installation deletion had failures for ${company_name}. Management database not modified.`);
      return {
        success: false,
        message: 'Some cleanup steps failed. Fix the issues and try again.',
        results,
        canRetry: true
      };
    }
    
  } catch (error) {
    console.error('Deletion process failed:', error);
    emitDeletionProgress(installationId, results.length, 'failed', `Deletion failed: ${error.message}`);
    
    return {
      success: false,
      message: `Deletion failed: ${error.message}`,
      results,
      canRetry: true
    };
  }
}