/**
 * Auto-Deployment Script for Replit
 * 
 * This script automatically creates a new deployment of your application
 * using the Replit API. It can be scheduled to run at specified intervals.
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Get the Replit API token from environment variable
  apiToken: process.env.REPLIT_API_TOKEN,
  // Get the Replit slug/ID from environment variable
  replSlug: process.env.REPLIT_SLUG || 'your-repl-id',
  // Clean up these files/directories before deployment
  cleanupPaths: [
    'node_modules/.cache',
    'dist',
    '.parcel-cache'
  ],
  // Log file for deployment history
  logFile: path.join(__dirname, '..', 'logs', 'deployment-history.log')
};

/**
 * Make sure the logs directory exists
 */
function ensureLogDirectory() {
  const logDir = path.dirname(config.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

/**
 * Log a message to console and the log file
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  ensureLogDirectory();
  fs.appendFileSync(config.logFile, logMessage + '\n');
}

/**
 * Clean up unnecessary files before deployment
 */
function cleanup() {
  log('Starting pre-deployment cleanup...');
  
  for (const filePath of config.cleanupPaths) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        if (fs.lstatSync(fullPath).isDirectory()) {
          fs.rmdirSync(fullPath, { recursive: true });
        } else {
          fs.unlinkSync(fullPath);
        }
        log(`✓ Cleaned up: ${filePath}`);
      } catch (error) {
        log(`⚠️ Failed to clean up ${filePath}: ${error.message}`);
      }
    }
  }
  
  log('Cleanup completed');
}

/**
 * Create a new deployment using the Replit API
 */
async function createDeployment() {
  if (!config.apiToken) {
    log('❌ Error: REPLIT_API_TOKEN environment variable is not set');
    log('Please add your Replit API token to the environment variables in the Secrets tab');
    process.exit(1);
  }
  
  log('Creating new deployment...');
  
  try {
    // Replit API endpoint for deployments
    const url = `https://api.replit.com/v1/replits/${config.replSlug}/deployments`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        // Optional metadata for the deployment
        message: `Auto-deployment at ${new Date().toISOString()}`
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    log(`✓ Deployment created successfully! Deployment ID: ${data.id}`);
    log('Note: You still need to manually promote this deployment to make it live');
    
    return data;
  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`);
    throw error;
  }
}

/**
 * Main function to run the auto-deployment process
 */
async function main() {
  log('Starting auto-deployment process...');
  
  try {
    // Step 1: Clean up unnecessary files
    cleanup();
    
    // Step 2: Create the deployment
    await createDeployment();
    
    log('Auto-deployment process completed successfully');
  } catch (error) {
    log(`Auto-deployment process failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();