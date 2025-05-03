/**
 * Keep-Alive Script for Replit
 * 
 * This script prevents your Replit application from sleeping due to inactivity
 * by sending regular HTTP requests to it.
 * 
 * To use this script:
 * 1. Update the REPLIT_URL with your actual Replit app URL
 * 2. Run it with 'node scripts/keep-alive.js'
 * 3. For best results, run this on another server or another Replit
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Replace with your actual Replit URL
  url: 'https://a4749bdf-c5e6-4c33-87d1-5f5f180970bb-00-2k1ghfi4i47hj.worf.replit.dev',
  
  // How often to ping (in milliseconds)
  // 10 minutes is a good balance - too frequent might waste resources
  interval: 10 * 60 * 1000,
  
  // Log file path
  logFile: path.join(__dirname, '..', 'logs', 'keep-alive.log'),
  
  // Maximum log file size before rotation (in bytes)
  // 5MB is a reasonable size
  maxLogSize: 5 * 1024 * 1024
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
 * Log a message to both console and log file
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  // Write to log file
  ensureLogDirectory();
  fs.appendFileSync(config.logFile, logMessage + '\n');
  
  // Check if log file needs rotation
  try {
    const stats = fs.statSync(config.logFile);
    if (stats.size > config.maxLogSize) {
      rotateLogFile();
    }
  } catch (error) {
    console.error(`Error checking log file size: ${error.message}`);
  }
}

/**
 * Rotate the log file when it gets too big
 */
function rotateLogFile() {
  try {
    const backupFile = `${config.logFile}.backup`;
    if (fs.existsSync(backupFile)) {
      fs.unlinkSync(backupFile);
    }
    fs.renameSync(config.logFile, backupFile);
    log('Log file rotated');
  } catch (error) {
    console.error(`Error rotating log file: ${error.message}`);
  }
}

/**
 * Send a ping to keep the Replit application alive
 */
function pingReplit() {
  log(`Pinging ${config.url}`);
  
  // Using HTTPS to make a GET request to the URL
  https.get(config.url, (res) => {
    log(`Ping response: ${res.statusCode} ${res.statusMessage}`);
    
    // Handle redirects (common with Replit)
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      log(`Following redirect to: ${res.headers.location}`);
      https.get(res.headers.location, (redirectRes) => {
        log(`Redirect response: ${redirectRes.statusCode} ${redirectRes.statusMessage}`);
      }).on('error', (err) => {
        log(`Redirect error: ${err.message}`);
      });
    }
    
    // Consume response data (required by the Node.js HTTP API)
    res.on('data', () => {});
    
  }).on('error', (err) => {
    log(`Ping error: ${err.message}`);
  });
}

/**
 * Main function to start the keep-alive service
 */
function startKeepAliveService() {
  log('Starting keep-alive service');
  log(`Target: ${config.url}`);
  log(`Interval: ${config.interval / 1000 / 60} minutes`);
  
  // Send an initial ping
  pingReplit();
  
  // Schedule regular pings
  setInterval(pingReplit, config.interval);
}

// Start the service
startKeepAliveService();