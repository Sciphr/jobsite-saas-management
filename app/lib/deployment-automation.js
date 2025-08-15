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
  BASE_DIRECTORY: process.env.DEPLOYMENTS_BASE_DIR || '/home/deployments',
  GIT_REPO_URL: process.env.MAIN_APP_GIT_URL || 'https://github.com/yourusername/your-main-app.git',
  BASE_PORT: parseInt(process.env.DEPLOYMENT_BASE_PORT) || 3001,
  BASE_DOMAIN: process.env.BASE_DOMAIN || 'yourdomain.com',
  PM2_ECOSYSTEM_FILE: 'ecosystem.config.js'
};

/**
 * Generate environment variables for a new customer deployment
 */
export function generateEnvironmentVariables(customerData) {
  const installationId = uuidv4();
  const dbName = `${customerData.companySlug}_${installationId.slice(0, 8)}`;
  const port = DEPLOYMENT_CONFIG.BASE_PORT + customerData.portOffset;
  const subdomain = customerData.subdomain || customerData.companySlug;
  
  return {
    // Customer-specific
    INSTALLATION_ID: installationId,
    COMPANY_NAME: customerData.companyName,
    DOMAIN: `${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`,
    DATABASE_URL: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${dbName}`,
    
    // App configuration
    PORT: port.toString(),
    PM2_APP_NAME: `jobsite-${customerData.companySlug}`,
    NEXT_PUBLIC_APP_URL: `https://${subdomain}.${DEPLOYMENT_CONFIG.BASE_DOMAIN}`,
    
    // Shared configuration
    NEXTAUTH_SECRET: process.env.SHARED_NEXTAUTH_SECRET,
    MANAGEMENT_DATABASE_URL: process.env.MANAGEMENT_DATABASE_URL,
    MANAGEMENT_API_KEY: process.env.MANAGEMENT_API_KEY,
    
    // Email configuration (if using)
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    
    // Other shared secrets
    JWT_SECRET: process.env.SHARED_JWT_SECRET,
    ENCRYPTION_KEY: process.env.SHARED_ENCRYPTION_KEY
  };
}

/**
 * Create .env file content from environment variables
 */
export function createEnvFileContent(envVars) {
  return Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\\n');
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
 * Clone repository for new deployment
 */
export async function cloneRepository(deploymentPath) {
  try {
    console.log(`Cloning repository to ${deploymentPath}...`);
    
    // Ensure deployment directory exists
    await fs.mkdir(path.dirname(deploymentPath), { recursive: true });
    
    // Clone the repository
    await runCommand(`git clone ${DEPLOYMENT_CONFIG.GIT_REPO_URL} ${deploymentPath}`);
    
    console.log('Repository cloned successfully');
    return { success: true };
  } catch (error) {
    console.error('Error cloning repository:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Install dependencies for the deployment
 */
export async function installDependencies(deploymentPath) {
  try {
    console.log('Installing dependencies...');
    
    // Install npm dependencies
    await runCommand('npm install', deploymentPath);
    
    console.log('Dependencies installed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error installing dependencies:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create .env file for deployment
 */
export async function createEnvironmentFile(deploymentPath, envVars) {
  try {
    const envFilePath = path.join(deploymentPath, '.env.local');
    const envContent = createEnvFileContent(envVars);
    
    await fs.writeFile(envFilePath, envContent);
    
    console.log('Environment file created successfully');
    return { success: true, envFilePath };
  } catch (error) {
    console.error('Error creating environment file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create database for the deployment
 */
export async function createDatabase(dbName, adminEmail, companyName) {
  try {
    console.log(`Creating database: ${dbName}`);
    
    // Create database
    await runCommand(`createdb ${dbName}`);
    
    // Run migrations (assuming you have a migration script)
    // You might need to adjust this based on your app's migration setup
    const migrationCommand = `psql ${dbName} < /path/to/your/initial-schema.sql`;
    await runCommand(migrationCommand);
    
    console.log('Database created and initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating database:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create PM2 ecosystem file for deployment
 */
export async function createPM2Config(deploymentPath, envVars) {
  try {
    const ecosystemConfig = `
module.exports = {
  apps: [{
    name: '${envVars.PM2_APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${deploymentPath}',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '${envVars.PORT}'
    }
  }]
};
`;
    
    const configPath = path.join(deploymentPath, DEPLOYMENT_CONFIG.PM2_ECOSYSTEM_FILE);
    await fs.writeFile(configPath, ecosystemConfig);
    
    console.log('PM2 configuration created successfully');
    return { success: true, configPath };
  } catch (error) {
    console.error('Error creating PM2 configuration:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Start PM2 process for deployment
 */
export async function startPM2Process(deploymentPath) {
  try {
    const configPath = path.join(deploymentPath, DEPLOYMENT_CONFIG.PM2_ECOSYSTEM_FILE);
    
    // Start the PM2 process
    await runCommand(`pm2 start ${configPath}`);
    
    // Save PM2 configuration
    await runCommand('pm2 save');
    
    console.log('PM2 process started successfully');
    return { success: true };
  } catch (error) {
    console.error('Error starting PM2 process:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Build the Next.js application
 */
export async function buildApplication(deploymentPath) {
  try {
    console.log('Building Next.js application...');
    
    await runCommand('npm run build', deploymentPath);
    
    console.log('Application built successfully');
    return { success: true };
  } catch (error) {
    console.error('Error building application:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Complete deployment automation process
 */
export async function deployNewCustomer(customerData) {
  const deploymentId = uuidv4();
  const deploymentPath = path.join(DEPLOYMENT_CONFIG.BASE_DIRECTORY, customerData.companySlug);
  
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
    // Step 1: Clone repository
    const cloneResult = await cloneRepository(deploymentPath);
    if (!cloneResult.success) throw new Error(`Clone failed: ${cloneResult.error}`);
    
    // Step 2: Generate environment variables
    const envVars = generateEnvironmentVariables(customerData);
    
    // Step 3: Create environment file
    const envResult = await createEnvironmentFile(deploymentPath, envVars);
    if (!envResult.success) throw new Error(`Environment file failed: ${envResult.error}`);
    
    // Step 4: Install dependencies
    const depsResult = await installDependencies(deploymentPath);
    if (!depsResult.success) throw new Error(`Dependencies failed: ${depsResult.error}`);
    
    // Step 5: Create database
    const dbName = envVars.DATABASE_URL.split('/').pop();
    const dbResult = await createDatabase(dbName, customerData.adminEmail, customerData.companyName);
    if (!dbResult.success) throw new Error(`Database creation failed: ${dbResult.error}`);
    
    // Step 6: Build application
    const buildResult = await buildApplication(deploymentPath);
    if (!buildResult.success) throw new Error(`Build failed: ${buildResult.error}`);
    
    // Step 7: Create PM2 configuration
    const pm2ConfigResult = await createPM2Config(deploymentPath, envVars);
    if (!pm2ConfigResult.success) throw new Error(`PM2 config failed: ${pm2ConfigResult.error}`);
    
    // Step 8: Start PM2 process
    const pm2StartResult = await startPM2Process(deploymentPath);
    if (!pm2StartResult.success) throw new Error(`PM2 start failed: ${pm2StartResult.error}`);
    
    // Update deployment status
    await managementPrisma.saas_deployments.update({
      where: { id: deploymentId },
      data: {
        status: 'completed',
        completed_at: new Date(),
        deployment_url: envVars.NEXT_PUBLIC_APP_URL,
        environment_vars: JSON.stringify(envVars)
      }
    });
    
    return {
      success: true,
      deploymentId,
      url: envVars.NEXT_PUBLIC_APP_URL,
      envVars
    };
    
  } catch (error) {
    console.error('Deployment failed:', error);
    
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