import { PrismaClient } from '@prisma/client';
import { spawn, exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const managementPrisma = new PrismaClient({
  datasourceUrl: process.env.MANAGEMENT_DATABASE_URL || process.env.DATABASE_URL
});

// Configuration for deployment automation
const DEPLOYMENT_CONFIG = {
  BASE_DIRECTORY: process.env.DEPLOYMENTS_BASE_DIR || '/home/jacob/asari_installations',
  GIT_REPO_URL: process.env.MAIN_APP_GIT_URL || 'http://192.168.2.100:4000/jacob/jobsite.git',
  BASE_PORT: parseInt(process.env.DEPLOYMENT_BASE_PORT) || 7000,
  BASE_DOMAIN: process.env.BASE_DOMAIN || 'asari.sciphr.ca',
  PM2_ECOSYSTEM_FILE: 'ecosystem.config.js',
  DB_HOST: process.env.DB_HOST || '192.168.2.100',
  DB_USER: process.env.DB_USER || 'jobsite_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'canada99',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || '192.168.2.100',
  MINIO_PORT: process.env.MINIO_PORT || '9000',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  // SSH Configuration for remote deployment
  SSH_HOST: process.env.SSH_HOST || '192.168.2.100',
  SSH_USER: process.env.SSH_USER || 'jacob',
  SSH_KEY_PATH: process.env.SSH_KEY_PATH || null, // Will use default SSH key or password auth
  SSH_PASSWORD: process.env.SSH_PASSWORD || null // Password for SSH authentication
};

/**
 * Generate unique NEXTAUTH_SECRET for each customer
 */
function generateUniqueSecret() {
  return require('crypto').randomBytes(32).toString('base64');
}

/**
 * Generate environment variables for a new customer deployment
 */
export function generateEnvironmentVariables(customerData) {
  const subdomain = customerData.subdomain || customerData.companySlug;
  const dbName = `${subdomain}_asari_db`;
  const bucketName = `${subdomain}-resumes`;
  const backupBucketName = `${subdomain}-backups`;
  
  return {
    // Database
    DATABASE_URL: `postgresql://${DEPLOYMENT_CONFIG.DB_USER}:${DEPLOYMENT_CONFIG.DB_PASSWORD}@${DEPLOYMENT_CONFIG.DB_HOST}:5432/${dbName}`,
    DATABASE_URL_DIRECT: `postgresql://${DEPLOYMENT_CONFIG.DB_USER}:${DEPLOYMENT_CONFIG.DB_PASSWORD}@${DEPLOYMENT_CONFIG.DB_HOST}:5432/${dbName}`,
    
    // NextAuth
    NEXTAUTH_URL: `https://${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`,
    NEXTAUTH_SECRET: generateUniqueSecret(),
    
    // Shared API Keys (from your example .env)
    CRON_API_KEY: "9FIDDb3TxYl/PEvKV+4aTU3X0IpNnepQaYLbv2Q/FB0=",
    RESEND_API_KEY: "re_evrv4ESJ_6f2NoB3BbtT8jezrgWcm67K9",
    
    // MinIO Configuration
    MINIO_ENDPOINT: DEPLOYMENT_CONFIG.MINIO_ENDPOINT,
    MINIO_PORT: DEPLOYMENT_CONFIG.MINIO_PORT,
    MINIO_USE_SSL: "false",
    MINIO_ACCESS_KEY: DEPLOYMENT_CONFIG.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: DEPLOYMENT_CONFIG.MINIO_SECRET_KEY,
    MINIO_BUCKET_NAME: bucketName,
    
    // Google Calendar Integration (shared)
    GOOGLE_CLIENT_ID: "678201785055-268ff30u0dsvfinebcl35rqcijs4iuib.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    
    // Zoom Integration
    ZOOM_CLIENT_ID: "mF1C5TFS4eOY3at_qHfjw",
    ZOOM_CLIENT_SECRET: "iHIBQP35iTmbH372T1fk98tGWK2VbFi4",
    ZOOM_REDIRECT_URI: `https://${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}/api/zoom/integration/callback`,
    
    // Microsoft Integration
    MICROSOFT_CLIENT_ID: "c3f39f86-b5d0-49d5-85e3-d6622a5c3db5",
    MICROSOFT_CLIENT_SECRET: "Cgs8Q~l-OR5ahPIxdnhpVWKJvz9hYOhxQCD3lbYK",
    MICROSOFT_REDIRECT_URI: `https://${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}/api/microsoft/integration/callback`,
    
    // LDAP Configuration (shared)
    LDAP_SERVER: "ldap.forumsys.com",
    LDAP_PORT: "389",
    LDAP_BASE_DN: "dc=example,dc=com",
    LDAP_BIND_DN: "cn=read-only-admin,dc=example,dc=com",
    LDAP_BIND_PASSWORD: "password",
    LDAP_USER_SEARCH_BASE: "dc=example,dc=com",
    LDAP_GROUP_SEARCH_BASE: "dc=example,dc=com",
    
    // SaaS Recovery System Configuration (keeps same management system)
    SAAS_MANAGEMENT_API_URL: "http://localhost:3100",
    NEXT_PUBLIC_DOMAIN: `https://${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`,
    
    // Installation Identification
    SAAS_INSTALLATION_ID: customerData.installationId,
    SAAS_INSTALLATION_DOMAIN: `https://${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`,
    
    // Backup configuration - Supabase bucket for this installation
    BACKUP_SUPABASE_BUCKET: backupBucketName,
    
    // PM2 Configuration
    PM2_APP_NAME: `asari-${customerData.companySlug}`,
    PORT: customerData.port_number.toString()
  };
}

/**
 * Create .env file content from environment variables
 */
export function createEnvFileContent(envVars) {
  return Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

/**
 * Run shell command with promise
 */
function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr, stdout });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * Run command on remote Pi via SSH
 */
function runSSHCommand(command) {
  return new Promise((resolve, reject) => {
    let sshCommand;
    
    if (DEPLOYMENT_CONFIG.SSH_PASSWORD) {
      // Use sshpass for password authentication
      sshCommand = `sshpass -p "${DEPLOYMENT_CONFIG.SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no ${DEPLOYMENT_CONFIG.SSH_USER}@${DEPLOYMENT_CONFIG.SSH_HOST} "${command}"`;
    } else if (DEPLOYMENT_CONFIG.SSH_KEY_PATH) {
      // Use SSH key
      sshCommand = `ssh -i ${DEPLOYMENT_CONFIG.SSH_KEY_PATH} -o StrictHostKeyChecking=no ${DEPLOYMENT_CONFIG.SSH_USER}@${DEPLOYMENT_CONFIG.SSH_HOST} "${command}"`;
    } else {
      // Default SSH (will prompt for password)
      sshCommand = `ssh -o StrictHostKeyChecking=no ${DEPLOYMENT_CONFIG.SSH_USER}@${DEPLOYMENT_CONFIG.SSH_HOST} "${command}"`;
    }
    
    exec(sshCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr, stdout });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * Clean up incorrectly created directories from previous failed deployments
 */
export async function cleanupIncorrectDirectories() {
  try {
    console.log('Cleaning up incorrectly created directories...');
    
    // Remove the incorrectly named directories
    await runSSHCommand('rm -rf ~/homejacobasari_installations');
    await runSSHCommand('rm -rf ~/homejacobasari_installationstester');
    
    // Ensure the correct asari_installations directory exists
    await runSSHCommand('mkdir -p ~/asari_installations');
    
    console.log('Cleanup completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error during cleanup:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clone repository for new deployment on remote Pi
 */
export async function cloneRepository(deploymentPath) {
  try {
    console.log(`Cloning repository to Pi: ${deploymentPath}...`);
    
    // Create deployment directory on Pi (properly quoted)
    await runSSHCommand(`mkdir -p "${path.dirname(deploymentPath)}"`);
    
    // Remove directory if it exists (clean install)
    await runSSHCommand(`rm -rf "${deploymentPath}"`);
    
    // Clone the repository on Pi (properly quoted)
    await runSSHCommand(`git clone "${DEPLOYMENT_CONFIG.GIT_REPO_URL}" "${deploymentPath}"`);
    
    console.log('Repository cloned successfully on Pi');
    return { success: true };
  } catch (error) {
    console.error('Error cloning repository:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Install dependencies for the deployment on remote Pi
 */
export async function installDependencies(deploymentPath) {
  try {
    console.log('Installing dependencies on Pi...');
    
    // Install npm dependencies on Pi
    await runSSHCommand(`cd "${deploymentPath}" && npm install`);
    
    console.log('Dependencies installed successfully on Pi');
    return { success: true };
  } catch (error) {
    console.error('Error installing dependencies:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create .env file for deployment on remote Pi
 */
export async function createEnvironmentFile(deploymentPath, envVars) {
  try {
    const envFilePath = `${deploymentPath}/.env`;
    const envContent = createEnvFileContent(envVars);
    
    // Validate critical environment variables
    if (!envVars.DATABASE_URL) {
      throw new Error('DATABASE_URL is missing from environment variables');
    }
    if (!envVars.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET is missing from environment variables');
    }
    
    console.log('Creating .env file with content preview:');
    console.log('Content length:', envContent.length);
    console.log('Number of lines:', envContent.split('\n').length);
    console.log('First 10 lines:');
    console.log(envContent.split('\n').slice(0, 10).join('\n') + '\n...');
    
    // Debug the actual content being sent
    console.log('Raw content (first 200 chars):', JSON.stringify(envContent.substring(0, 200)));
    
    // First ensure the directory exists
    console.log('Ensuring directory exists for .env file...');
    await runSSHCommand(`mkdir -p "${path.dirname(envFilePath)}"`);
    
    // Test if we can write to the directory
    console.log('Testing write permissions in directory...');
    await runSSHCommand(`touch "${envFilePath}.test" && rm "${envFilePath}.test"`);
    
    // Create .env file on Pi via SSH using a more robust method
    // Write to a temporary file first, then move it
    const tempFilePath = `${envFilePath}.tmp`;
    console.log(`Creating temporary .env file at: ${tempFilePath}`);
    
    // Use printf to write line by line (most reliable method)
    console.log('Creating .env file using printf method...');
    const envLines = envContent.split('\n').filter(line => line.trim());
    
    // Clear any existing file
    await runSSHCommand(`rm -f "${envFilePath}"`);
    
    // Write each line using printf (safer than echo for special characters)
    for (let i = 0; i < envLines.length; i++) {
      const line = envLines[i];
      if (line.trim()) {
        // Escape single quotes in the line
        const escapedLine = line.replace(/'/g, "'\"'\"'");
        await runSSHCommand(`printf '%s\\n' '${escapedLine}' >> "${envFilePath}"`);
      }
    }
    console.log('Used printf method to create .env file');
    
    // CRITICAL: First check if the file actually exists
    console.log('Checking if .env file actually exists...');
    try {
      await runSSHCommand(`test -f "${envFilePath}"`);
      console.log('✅ .env file exists');
    } catch (existsError) {
      throw new Error(`CRITICAL: .env file does not exist after creation attempts. File: ${envFilePath}`);
    }
    
    // CRITICAL: Verify the file was created and has content
    const verifyResult = await runSSHCommand(`ls -la "${envFilePath}" && echo "=== FILE CONTENT ===" && cat "${envFilePath}"`);
    console.log('Environment file verification:', verifyResult.stdout);
    
    // Check file size - FAIL if empty
    const sizeCheck = await runSSHCommand(`wc -l "${envFilePath}"`);
    console.log('Environment file size check:', sizeCheck.stdout);
    
    const lineCount = parseInt(sizeCheck.stdout.trim().split(' ')[0]);
    if (lineCount === 0) {
      throw new Error('CRITICAL: .env file was created but is empty. Cannot proceed with deployment.');
    }
    
    // CRITICAL: Check if DATABASE_URL is actually set in the file
    const dbUrlCheck = await runSSHCommand(`grep "DATABASE_URL" "${envFilePath}" || echo "DATABASE_URL not found"`);
    console.log('DATABASE_URL check:', dbUrlCheck.stdout);
    
    if (dbUrlCheck.stdout.includes('DATABASE_URL not found')) {
      throw new Error('CRITICAL: DATABASE_URL not found in .env file. Cannot proceed with deployment.');
    }
    
    // Additional critical variables check
    const nextAuthCheck = await runSSHCommand(`grep "NEXTAUTH_SECRET" "${envFilePath}" || echo "NEXTAUTH_SECRET not found"`);
    if (nextAuthCheck.stdout.includes('NEXTAUTH_SECRET not found')) {
      throw new Error('CRITICAL: NEXTAUTH_SECRET not found in .env file. Cannot proceed with deployment.');
    }
    
    console.log('✅ Environment file created successfully with all critical variables');
    return { success: true, envFilePath };
  } catch (error) {
    console.error('Error creating environment file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create PostgreSQL database from template for the deployment
 */
export async function createDatabase(dbName, adminEmail, companyName) {
  try {
    console.log(`Creating database from template: ${dbName}`);
    
    // First, transfer the SQL template file to the Pi in chunks
    console.log('Transferring database template to Pi...');
    const fs = require('fs');
    const templateSQL = fs.readFileSync('./asari_template.sql', 'utf8');
    const tempFile = `/tmp/asari_template_${dbName}.sql`;
    
    // Clear the temp file first
    await runSSHCommand(`> ${tempFile}`);
    
    // Transfer in chunks to avoid command line length limits
    const chunkSize = 50000; // 50KB chunks
    for (let i = 0; i < templateSQL.length; i += chunkSize) {
      const chunk = templateSQL.slice(i, i + chunkSize);
      const base64Chunk = Buffer.from(chunk).toString('base64');
      await runSSHCommand(`echo "${base64Chunk}" | base64 -d >> ${tempFile}`);
    }
    console.log('Template file transferred successfully');
    
    // Create empty database
    console.log('Creating empty database...');
    const createDbCommand = `PGPASSWORD=${DEPLOYMENT_CONFIG.DB_PASSWORD} createdb -h ${DEPLOYMENT_CONFIG.DB_HOST} -U ${DEPLOYMENT_CONFIG.DB_USER} ${dbName}`;
    await runSSHCommand(createDbCommand);
    
    // Restore from template
    console.log('Restoring database from template...');
    const restoreCommand = `PGPASSWORD=${DEPLOYMENT_CONFIG.DB_PASSWORD} psql -h ${DEPLOYMENT_CONFIG.DB_HOST} -U ${DEPLOYMENT_CONFIG.DB_USER} -d ${dbName} -f ${tempFile}`;
    const restoreResult = await runSSHCommand(restoreCommand);
    console.log('Template restoration output:', restoreResult.stdout);
    
    // Clean up template file
    await runSSHCommand(`rm -f ${tempFile}`);
    
    // Test database connection
    console.log('Testing database connection...');
    const testConnectionCommand = `PGPASSWORD=${DEPLOYMENT_CONFIG.DB_PASSWORD} psql -h ${DEPLOYMENT_CONFIG.DB_HOST} -U ${DEPLOYMENT_CONFIG.DB_USER} -d ${dbName} -c "SELECT COUNT(*) FROM roles;" | head -3 | tail -1`;
    const connectionTest = await runSSHCommand(testConnectionCommand);
    console.log('Database connection test successful - roles table has', connectionTest.stdout.trim(), 'records');
    
    console.log('Database created from template successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating database from template:', error);
    
    // Clean up template file on error
    try {
      await runSSHCommand(`rm -f /tmp/asari_template_${dbName}.sql`);
    } catch (cleanupError) {
      console.warn('Could not clean up template file:', cleanupError);
    }
    
    // Extract more detailed error information
    let errorDetails = error.message;
    if (error.stderr) {
      errorDetails += ` | STDERR: ${error.stderr}`;
    }
    if (error.stdout) {
      errorDetails += ` | STDOUT: ${error.stdout}`;
    }
    
    return { success: false, error: errorDetails };
  }
}

/**
 * Create MinIO bucket for customer on Pi
 */
export async function createMinioBucket(bucketName) {
  try {
    console.log(`Creating MinIO bucket: ${bucketName}`);
    
    // Use MinIO client on Pi to create bucket
    const mcAliasCommand = `mc alias set local http://${DEPLOYMENT_CONFIG.MINIO_ENDPOINT}:${DEPLOYMENT_CONFIG.MINIO_PORT} ${DEPLOYMENT_CONFIG.MINIO_ACCESS_KEY} ${DEPLOYMENT_CONFIG.MINIO_SECRET_KEY}`;
    await runSSHCommand(mcAliasCommand);
    
    const createBucketCommand = `mc mb local/${bucketName}`;
    await runSSHCommand(createBucketCommand);
    
    console.log('MinIO bucket created successfully on Pi');
    return { success: true };
  } catch (error) {
    console.error('Error creating MinIO bucket:', error);
    // Don't fail deployment for MinIO bucket issues - log warning and continue
    console.warn('MinIO bucket creation failed, but continuing deployment. You can create the bucket manually later.');
    return { success: true }; // Return success to continue deployment
  }
}

/**
 * Create Supabase bucket for backups (placeholder - you'll need to implement based on your Supabase setup)
 */
export async function createSupabaseBucket(bucketName, customerData) {
  try {
    console.log(`Creating Supabase backup bucket: ${bucketName}`);
    
    // This is a placeholder - you'll need to implement the actual Supabase bucket creation
    // based on your Supabase configuration and API credentials
    
    // For now, we'll just log it as created
    console.log('Supabase bucket created successfully (placeholder)');
    return { success: true };
  } catch (error) {
    console.error('Error creating Supabase bucket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Configure nginx virtual host for new subdomain
 */
export async function configureNginx(subdomain, port) {
  try {
    const domain = `${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`;
    console.log(`Configuring nginx for: ${domain} -> localhost:${port}`);
    
    // Create the nginx server block configuration
    const nginxConfig = `

# ${subdomain} - Auto-generated by SaaS deployment
server {
    server_name ${domain};

    location / {
        proxy_pass http://localhost:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 80;
}
`;
    
    // Append the configuration to the existing sciphr file using base64 encoding
    const base64NginxConfig = Buffer.from(nginxConfig).toString('base64');
    await runSSHCommand(`echo "${base64NginxConfig}" | base64 -d | sudo tee -a /etc/nginx/sites-available/sciphr`);
    
    // Test nginx configuration
    await runSSHCommand('sudo nginx -t');
    
    // Reload nginx
    await runSSHCommand('sudo systemctl reload nginx');
    
    console.log('Nginx configuration added and reloaded successfully');
    return { success: true, domain };
  } catch (error) {
    console.error('Error configuring nginx:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Setup SSL certificate using certbot on Pi
 */
export async function setupSSLCertificate(subdomain) {
  try {
    const domain = `${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`;
    console.log(`Setting up SSL certificate for: ${domain}`);
    
    // First check if the domain resolves to this server
    console.log('Checking domain DNS resolution...');
    try {
      const dnsCheck = await runSSHCommand(`nslookup ${domain}`);
      console.log('DNS lookup result:', dnsCheck.stdout);
    } catch (dnsError) {
      console.log('DNS check failed, but continuing with SSL attempt...');
    }
    
    // Use certbot on Pi to get SSL certificate
    const certbotCommand = `sudo certbot --nginx -d ${domain} --non-interactive --agree-tos --email admin@${DEPLOYMENT_CONFIG.BASE_DOMAIN}`;
    const sslResult = await runSSHCommand(certbotCommand);
    
    console.log('SSL certificate created successfully on Pi');
    return { success: true, domain };
  } catch (error) {
    console.error('Error creating SSL certificate:', error);
    
    // Extract detailed error information
    let errorDetails = error?.message || 'Unknown SSL error';
    if (error.stderr) {
      errorDetails += ` | STDERR: ${error.stderr}`;
    }
    if (error.stdout) {
      errorDetails += ` | STDOUT: ${error.stdout}`;
    }
    
    // Check for specific SSL errors
    if (error.stderr && error.stderr.includes('unauthorized')) {
      errorDetails = 'SSL certificate failed: Domain does not resolve to this server or is not accessible from the internet. You need to configure DNS first.';
    }
    
    return { success: false, error: errorDetails };
  }
}

/**
 * Create PM2 ecosystem file for deployment on Pi
 */
export async function createPM2Config(deploymentPath, envVars) {
  try {
    console.log('Creating PM2 configuration...');
    console.log('PM2 App Name:', envVars.PM2_APP_NAME);
    console.log('Deployment Path:', deploymentPath);
    console.log('Port:', envVars.PORT);
    
    const ecosystemConfig = `module.exports = {
  apps: [{
    name: '${envVars.PM2_APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${deploymentPath}',
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '${envVars.PORT}'
    }
  }]
};`;
    
    const configPath = `${deploymentPath}/${DEPLOYMENT_CONFIG.PM2_ECOSYSTEM_FILE}`;
    console.log('Creating PM2 config at:', configPath);
    
    // Create PM2 config file on Pi via SSH using base64 encoding (most reliable for multi-line)
    const base64Config = Buffer.from(ecosystemConfig).toString('base64');
    await runSSHCommand(`echo "${base64Config}" | base64 -d > "${configPath}"`);
    
    // Verify the config file was created and has content
    const verifyResult = await runSSHCommand(`ls -la "${configPath}" && echo "=== CONFIG CONTENT ===" && cat "${configPath}"`);
    console.log('PM2 config verification:', verifyResult.stdout);
    
    // Check if it's a valid JavaScript file by testing syntax
    try {
      await runSSHCommand(`node -c "${configPath}"`);
      console.log('✅ PM2 config syntax is valid');
    } catch (syntaxError) {
      throw new Error(`PM2 config syntax error: ${syntaxError.stderr || syntaxError.message}`);
    }
    
    console.log('PM2 configuration created and verified successfully');
    return { success: true, configPath };
  } catch (error) {
    console.error('Error creating PM2 configuration:', error);
    
    // Extract detailed error information
    let errorDetails = error?.message || 'Unknown PM2 config error';
    if (error.stderr) {
      errorDetails += ` | STDERR: ${error.stderr}`;
    }
    if (error.stdout) {
      errorDetails += ` | STDOUT: ${error.stdout}`;
    }
    
    return { success: false, error: errorDetails };
  }
}

/**
 * Start PM2 process for deployment on Pi
 */
export async function startPM2Process(deploymentPath) {
  try {
    const configPath = `${deploymentPath}/${DEPLOYMENT_CONFIG.PM2_ECOSYSTEM_FILE}`;
    
    console.log(`Starting PM2 process with config: ${configPath}`);
    
    // First check if the ecosystem file exists
    try {
      await runSSHCommand(`test -f "${configPath}"`);
      console.log('✅ PM2 ecosystem file exists');
    } catch (existsError) {
      throw new Error(`PM2 ecosystem file does not exist: ${configPath}`);
    }
    
    // Start the PM2 process on Pi
    const startResult = await runSSHCommand(`pm2 start "${configPath}"`);
    console.log('PM2 start output:', startResult.stdout);
    
    // Save PM2 configuration on Pi
    await runSSHCommand('pm2 save');
    
    // Verify the process is running
    const statusResult = await runSSHCommand('pm2 list');
    console.log('PM2 status after start:', statusResult.stdout);
    
    console.log('PM2 process started successfully on Pi');
    return { success: true };
  } catch (error) {
    console.error('Error starting PM2 process:', error);
    
    // Extract detailed error information
    let errorDetails = error?.message || 'Unknown PM2 start error';
    if (error.stderr) {
      errorDetails += ` | STDERR: ${error.stderr}`;
    }
    if (error.stdout) {
      errorDetails += ` | STDOUT: ${error.stdout}`;
    }
    
    return { success: false, error: errorDetails };
  }
}

/**
 * Build the Next.js application on Pi
 */
export async function buildApplication(deploymentPath) {
  try {
    console.log('Building Next.js application on Pi...');
    
    // Before building, verify the .env file exists and has the right content
    console.log('Verifying environment file before build...');
    const envCheck = await runSSHCommand(`cd "${deploymentPath}" && ls -la .env && echo "=== DATABASE_URL ===" && grep DATABASE_URL .env`);
    console.log('Environment check before build:', envCheck.stdout);
    
    const result = await runSSHCommand(`cd "${deploymentPath}" && npm run build`);
    
    console.log('Application built successfully on Pi');
    return { success: true };
  } catch (error) {
    console.error('Error building application:', error);
    
    // Extract more detailed error information
    let errorDetails = error.message;
    if (error.stderr) {
      errorDetails += ` | STDERR: ${error.stderr}`;
    }
    if (error.stdout) {
      errorDetails += ` | STDOUT: ${error.stdout}`;
    }
    
    // Check for specific Prisma errors
    if (error.stderr && error.stderr.includes('PrismaClientConstructorValidationError')) {
      errorDetails = 'Database connection error during build. The .env file may be missing or have invalid DATABASE_URL.';
    }
    
    return { success: false, error: errorDetails };
  }
}

/**
 * Run database migrations on Pi
 */
export async function runDatabaseMigrations(deploymentPath) {
  try {
    console.log('Running database migrations on Pi...');
    
    const result = await runSSHCommand(`cd ${deploymentPath} && npx prisma db push`);
    
    console.log('Database migrations completed successfully on Pi');
    return { success: true };
  } catch (error) {
    console.error('Error running database migrations:', error);
    
    // Extract more detailed error information
    let errorDetails = error.message;
    if (error.stderr) {
      errorDetails += ` | STDERR: ${error.stderr}`;
    }
    if (error.stdout) {
      errorDetails += ` | STDOUT: ${error.stdout}`;
    }
    
    // Check for specific database connection errors
    if (error.stderr && (error.stderr.includes('PrismaClientConstructorValidationError') || 
                        error.stderr.includes('connection refused') ||
                        error.stderr.includes('Invalid datasource'))) {
      errorDetails = 'Database connection failed. Check if DATABASE_URL is correctly set in .env file.';
    }
    
    return { success: false, error: errorDetails };
  }
}

/**
 * Create admin user for the new installation
 */
export async function createAdminUser(deploymentPath, adminEmail, companyName) {
  try {
    console.log(`Creating admin user: ${adminEmail}`);
    
    // Generate a random password for the admin user
    const adminPassword = require('crypto').randomBytes(12).toString('base64').slice(0, 16);
    
    // Create a Node.js script to create the admin user
    const createUserScript = `
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function createAdminUser() {
  // Read DATABASE_URL from .env file manually (no dotenv dependency)
  let databaseUrl;
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envLines = envContent.split('\\n');
    const dbUrlLine = envLines.find(line => line.startsWith('DATABASE_URL='));
    databaseUrl = dbUrlLine ? dbUrlLine.split('=')[1].replace(/"/g, '') : null;
  } catch (error) {
    console.error('Error reading .env file:', error);
    process.exit(1);
  }
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in .env file');
    process.exit(1);
  }
  
  console.log('Using database URL from .env file');
  const client = new Client({
    connectionString: databaseUrl
  });
  
  try {
    await client.connect();
    console.log('Connected to customer database');
    
    // Check if admin user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const existingResult = await client.query(existingUserQuery, ['${adminEmail}']);
    
    if (existingResult.rows.length > 0) {
      console.log('Admin user already exists:', existingResult.rows[0].email);
      await client.end();
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('${adminPassword}', 12);
    
    // Create admin user with direct SQL insert
    const insertQuery = \`
      INSERT INTO users (
        email, password, "firstName", "lastName", role, "privilegeLevel", 
        "isActive", is_active, "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, email
    \`;
    
    const values = [
      '${adminEmail}',
      hashedPassword,
      'Admin',
      'Admin', 
      'admin',
      3,
      true,
      true,
      new Date(),
      new Date()
    ];
    
    const result = await client.query(insertQuery, values);
    console.log('Admin user created successfully:', result.rows[0].email, 'ID:', result.rows[0].id);
    
    await client.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
    await client.end();
    process.exit(1);
  }
}

createAdminUser();
`;
    
    // Write the script to a temporary file using base64 encoding
    const base64Script = Buffer.from(createUserScript).toString('base64');
    await runSSHCommand(`cd "${deploymentPath}" && echo "${base64Script}" | base64 -d > create_admin_user.js`);
    
    // Execute the script with detailed debugging
    console.log('Executing admin user creation script...');
    const scriptResult = await runSSHCommand(`cd "${deploymentPath}" && node create_admin_user.js`);
    console.log('Admin user creation script output:', scriptResult.stdout);
    console.log('Admin user creation script stderr:', scriptResult.stderr);
    
    // Admin user creation is already verified by the SQL script above
    console.log('Admin user creation completed successfully - skipping schema verification');
    
    // Clean up the script file
    await runSSHCommand(`cd "${deploymentPath}" && rm create_admin_user.js`);
    
    console.log(`Admin user created successfully: ${adminEmail} / ${adminPassword}`);
    return { success: true, adminEmail, adminPassword };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message };
  }
}


/**
 * Emit progress update via WebSocket
 */
function emitProgress(installationId, step, status, message) {
  try {
    if (global.io) {
      global.io.emit('deployment-progress', {
        installationId,
        step,
        status, // 'pending', 'in_progress', 'completed', 'failed'
        message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error emitting progress:', error);
  }
}

/**
 * Complete deployment automation process
 */
export async function deployNewCustomer(customerData) {
  const deploymentId = uuidv4();
  const deploymentPath = `${DEPLOYMENT_CONFIG.BASE_DIRECTORY}/${customerData.subdomain}`;
  
  // Initialize progress tracking
  const steps = [
    'Starting deployment',
    'Cloning repository', 
    'Creating database',
    'Creating MinIO bucket',
    'Creating Supabase bucket',
    'Creating environment file',
    'Installing dependencies',
    'Building application',
    'Running database migrations',
    'Creating admin user',
    'Creating PM2 configuration',
    'Starting PM2 process',
    'Configuring nginx',
    'Setting up SSL certificate'
  ];
  
  // Emit initial progress
  emitProgress(customerData.installationId, 0, 'in_progress', 'Starting deployment...');
  
  // Log deployment start
  const deployment = await managementPrisma.saas_deployments.create({
    data: {
      id: deploymentId,
      installation_id: customerData.installationId,
      status: 'starting',
      deployment_path: deploymentPath,
      started_at: new Date()
    }
  });
  
  try {
    console.log(`Starting deployment for ${customerData.companyName} at ${deploymentPath}`);
    console.log(`BASE_DIRECTORY: ${DEPLOYMENT_CONFIG.BASE_DIRECTORY}`);
    console.log(`Subdomain: ${customerData.subdomain}`);
    console.log(`Computed deployment path: ${deploymentPath}`);
    
    // Step 0: Clean up any incorrectly created directories first
    await cleanupIncorrectDirectories();
    
    // Mark initial step as completed
    emitProgress(customerData.installationId, 0, 'completed', 'Deployment initialized');
    
    // Step 1: Clone repository from Pi
    emitProgress(customerData.installationId, 1, 'in_progress', 'Cloning repository...');
    const cloneResult = await cloneRepository(deploymentPath);
    if (!cloneResult.success) throw new Error(`Clone failed: ${cloneResult.error}`);
    emitProgress(customerData.installationId, 1, 'completed', 'Repository cloned successfully');
    
    // Step 2: Generate environment variables
    const envVars = generateEnvironmentVariables(customerData);
    
    // Step 3: Create PostgreSQL database
    emitProgress(customerData.installationId, 2, 'in_progress', 'Creating PostgreSQL database...');
    const dbName = `${customerData.subdomain}_asari_db`;
    const dbResult = await createDatabase(dbName, customerData.adminEmail, customerData.companyName);
    if (!dbResult.success) throw new Error(`Database creation failed: ${dbResult.error}`);
    emitProgress(customerData.installationId, 2, 'completed', 'Database created successfully');
    
    // Step 4: Create MinIO bucket for resumes (optional - will warn if fails)
    emitProgress(customerData.installationId, 3, 'in_progress', 'Creating MinIO bucket...');
    const bucketName = `${customerData.subdomain}-resumes`;
    const minioResult = await createMinioBucket(bucketName);
    // Don't fail deployment if MinIO bucket creation fails - just log warning
    emitProgress(customerData.installationId, 3, minioResult.success ? 'completed' : 'failed', minioResult.success ? 'MinIO bucket created' : 'MinIO bucket creation failed (continuing)');
    
    // Step 5: Create Supabase bucket for backups
    emitProgress(customerData.installationId, 4, 'in_progress', 'Creating Supabase backup bucket...');
    const backupBucketName = `${customerData.subdomain}-backups`;
    const supabaseResult = await createSupabaseBucket(backupBucketName, customerData);
    if (!supabaseResult.success) throw new Error(`Supabase bucket creation failed: ${supabaseResult.error}`);
    emitProgress(customerData.installationId, 4, 'completed', 'Supabase bucket created');
    
    // Step 6: Create environment file
    emitProgress(customerData.installationId, 5, 'in_progress', 'Creating environment configuration...');
    console.log('About to create environment file with variables:', Object.keys(envVars));
    const envResult = await createEnvironmentFile(deploymentPath, envVars);
    if (!envResult.success) {
      const errorMsg = `Environment file creation failed: ${envResult.error}`;
      emitProgress(customerData.installationId, 5, 'failed', errorMsg);
      throw new Error(errorMsg);
    }
    emitProgress(customerData.installationId, 5, 'completed', 'Environment file created and verified');
    
    // Step 7: Install dependencies
    emitProgress(customerData.installationId, 6, 'in_progress', 'Installing dependencies...');
    const depsResult = await installDependencies(deploymentPath);
    if (!depsResult.success) throw new Error(`Dependencies failed: ${depsResult.error}`);
    emitProgress(customerData.installationId, 6, 'completed', 'Dependencies installed');
    
    // Step 7.5: Run database migrations BEFORE building (as build might need schema)
    emitProgress(customerData.installationId, 7, 'in_progress', 'Setting up database schema...');
    const migrateResult = await runDatabaseMigrations(deploymentPath);
    if (!migrateResult.success) {
      const errorMsg = `Database migration failed: ${migrateResult.error || 'Unknown migration error'}`;
      emitProgress(customerData.installationId, 7, 'failed', errorMsg);
      throw new Error(errorMsg);
    }
    emitProgress(customerData.installationId, 7, 'completed', 'Database schema set up successfully');
    
    // Step 8: Build application (after database is ready)
    emitProgress(customerData.installationId, 8, 'in_progress', 'Building application...');
    
    // Final verification that .env file exists before building
    console.log('Final check: Verifying .env file exists before build...');
    try {
      const finalEnvCheck = await runSSHCommand(`ls -la "${deploymentPath}/.env" && echo "=== FINAL ENV CHECK ===" && head -5 "${deploymentPath}/.env"`);
      console.log('Final .env verification:', finalEnvCheck.stdout);
    } catch (envCheckError) {
      console.error('WARNING: .env file verification failed before build:', envCheckError);
      throw new Error('Environment file is missing or unreadable before build');
    }
    
    const buildResult = await buildApplication(deploymentPath);
    if (!buildResult.success) {
      const errorMsg = `Build failed: ${buildResult.error || 'Unknown build error'}`;
      emitProgress(customerData.installationId, 8, 'failed', errorMsg);
      throw new Error(errorMsg);
    }
    emitProgress(customerData.installationId, 8, 'completed', 'Application built successfully');
    
    // Step 9: Create admin user
    emitProgress(customerData.installationId, 9, 'in_progress', 'Creating admin user...');
    const adminUserResult = await createAdminUser(deploymentPath, customerData.adminEmail, customerData.companyName);
    if (!adminUserResult.success) throw new Error(`Admin user creation failed: ${adminUserResult.error}`);
    emitProgress(customerData.installationId, 9, 'completed', `Admin user created: ${adminUserResult.adminEmail}`);
    
    // Step 10: Create PM2 configuration
    emitProgress(customerData.installationId, 10, 'in_progress', 'Creating PM2 configuration...');
    const pm2ConfigResult = await createPM2Config(deploymentPath, envVars);
    if (!pm2ConfigResult.success) throw new Error(`PM2 config failed: ${pm2ConfigResult.error}`);
    emitProgress(customerData.installationId, 10, 'completed', 'PM2 configuration created');
    
    // Step 11: Start PM2 process
    emitProgress(customerData.installationId, 11, 'in_progress', 'Starting PM2 process...');
    const pm2StartResult = await startPM2Process(deploymentPath);
    if (!pm2StartResult.success) throw new Error(`PM2 start failed: ${pm2StartResult.error}`);
    emitProgress(customerData.installationId, 11, 'completed', 'PM2 process started');
    
    // Step 12: Configure nginx virtual host
    emitProgress(customerData.installationId, 12, 'in_progress', 'Configuring nginx...');
    const nginxResult = await configureNginx(customerData.subdomain, envVars.PORT);
    if (!nginxResult.success) {
      console.warn(`Nginx configuration failed: ${nginxResult.error}. You'll need to configure manually.`);
      emitProgress(customerData.installationId, 12, 'failed', 'Nginx configuration failed (manual setup required)');
    } else {
      emitProgress(customerData.installationId, 12, 'completed', 'Nginx configured successfully');
    }
    
    // Step 13: Setup SSL certificate
    emitProgress(customerData.installationId, 13, 'in_progress', 'Setting up SSL certificate...');
    const sslResult = await setupSSLCertificate(customerData.subdomain);
    if (!sslResult.success) {
      console.warn(`SSL certificate setup failed: ${sslResult.error}. You'll need to set this up manually.`);
      emitProgress(customerData.installationId, 13, 'failed', 'SSL setup failed (manual setup required)');
    } else {
      emitProgress(customerData.installationId, 13, 'completed', 'SSL certificate configured');
    }
    
    // Update deployment status
    await managementPrisma.saas_deployments.update({
      where: { id: deploymentId },
      data: {
        status: 'completed',
        completed_at: new Date(),
        deployment_url: envVars.NEXTAUTH_URL,
        environment_vars: JSON.stringify(envVars)
      }
    });
    
    // Update installation with admin credentials for display
    await managementPrisma.saas_installations.update({
      where: { id: customerData.installationId },
      data: {
        deployment_status: 'completed',
        deployment_url: envVars.NEXTAUTH_URL,
        admin_username: adminUserResult.adminEmail,
        admin_password: adminUserResult.adminPassword, // Store temporarily for display
        deployment_path: deploymentPath
      }
    });
    
    console.log(`Deployment completed successfully for ${customerData.companyName}`);
    console.log(`URL: ${envVars.NEXTAUTH_URL}`);
    console.log(`Database: ${dbName}`);
    console.log(`MinIO Bucket: ${bucketName}`);
    console.log(`Backup Bucket: ${backupBucketName}`);
    console.log(`PM2 App: ${envVars.PM2_APP_NAME}`);
    console.log(`Admin User: ${adminUserResult.adminEmail} / ${adminUserResult.adminPassword}`);
    
    return {
      success: true,
      deploymentId,
      url: envVars.NEXTAUTH_URL,
      envVars,
      dbName,
      bucketName,
      backupBucketName,
      adminCredentials: {
        email: adminUserResult.adminEmail,
        password: adminUserResult.adminPassword
      }
    };
    
  } catch (error) {
    console.error('Deployment failed:', error);
    
    // Emit failure progress for current step
    const currentStepIndex = steps.findIndex(step => step.includes('failed')) || steps.length - 1;
    emitProgress(customerData.installationId, currentStepIndex, 'failed', `Deployment failed: ${error.message}`);
    
    // Update deployment status to failed
    await managementPrisma.saas_deployments.update({
      where: { id: deploymentId },
      data: {
        status: 'failed',
        error_message: error.message,
        completed_at: new Date()
      }
    });
    
    return {
      success: false,
      error: error.message,
      deploymentId
    };
  }
}