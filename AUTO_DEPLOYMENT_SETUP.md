# Auto-Deployment Setup Guide

This guide explains how to set up automatic deployment for your Tesco Price Comparison application directly within Replit without requiring GitHub integration.

## Method 1: Scheduled Auto-Deployment

This method uses a scheduled script that runs at specified intervals to automatically create deployments of your application.

### Prerequisites

1. A Replit API token
2. Your Replit project ID/slug

### Step 1: Generate a Replit API Token

1. Go to your Replit account settings: https://replit.com/account
2. Navigate to the "API Tokens" section
3. Click "Generate new token"
4. Give your token a descriptive name like "Auto-Deploy"
5. Copy the generated token (you will only see it once)

### Step 2: Add the API Token to Replit Secrets

1. In your Replit project, go to the "Secrets" tab in the left sidebar (lock icon)
2. Add a new secret:
   - Key: `REPLIT_API_TOKEN`
   - Value: Paste your Replit API token from Step 1
3. Add another secret:
   - Key: `REPLIT_SLUG`
   - Value: Your Replit project ID (found in the URL of your Replit project)

### Step 3: Start the Deployment Scheduler

There are two ways to use the auto-deployment scheduler:

#### Option A: Run as a separate process

Run the scheduler script directly:
```bash
node scripts/schedule-deploy.js
```

This will start the scheduler that will create deployments at the configured interval (default: every 12 hours).

#### Option B: Integrate with your application

Add the following code to your application's startup script (e.g., `server/index.ts`):

```javascript
// Start the auto-deployment scheduler
require('../scripts/schedule-deploy').scheduleDeployments();
```

### Step 4: Configure Domain (After Deployment)

After deployment is successful, you need to set up your domain:

1. In Porkbun (domain registrar):
   - Set an A record for @ (root domain) pointing to Replit's IP: 5.161.202.234
   - Set a CNAME record for www pointing to your Replit deployment URL

## Method 2: Manual Deployment Script

If you prefer to trigger deployments manually, you can use the deployment script:

```bash
node scripts/auto-deploy.js
```

## Notes

- You'll still need to manually click the "Promote" button in Replit to make a deployment live
- This is a safety feature to ensure that you don't automatically promote a broken build
- Deployment logs are stored in the `logs` directory for troubleshooting

## Customizing the Deployment Schedule

You can change the deployment interval by editing the `deploymentInterval` property in `scripts/schedule-deploy.js`. The default is set to 12 hours (in milliseconds).

## Troubleshooting

If you encounter any issues with the auto-deployment:

1. Check the deployment logs in the `logs` directory
2. Verify your REPLIT_API_TOKEN is correct and hasn't expired
3. Make sure your REPLIT_SLUG is set correctly
4. Look for error messages in the console output