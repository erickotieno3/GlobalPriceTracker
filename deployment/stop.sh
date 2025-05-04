#!/bin/bash
# Combined Deployment Shutdown Script
# This script stops all the components of the combined deployment approach

# Change to the project root directory
cd "$(dirname "$0")/.."

# Stop the keep-alive script
if [ -f deployment/keep-alive.pid ]; then
  echo "Stopping keep-alive script..."
  kill $(cat deployment/keep-alive.pid) 2>/dev/null || echo "Keep-alive process not running"
  rm deployment/keep-alive.pid
fi

# Stop the deployment coordinator
if [ -f deployment/coordinator.pid ]; then
  echo "Stopping deployment coordinator..."
  kill $(cat deployment/coordinator.pid) 2>/dev/null || echo "Coordinator process not running"
  rm deployment/coordinator.pid
fi

# Stop the auto-deployment script
if [ -f deployment/auto-deploy.pid ]; then
  echo "Stopping auto-deployment script..."
  kill $(cat deployment/auto-deploy.pid) 2>/dev/null || echo "Auto-deployment process not running"
  rm deployment/auto-deploy.pid
fi

# Stop the auto-SEO system
if [ -f deployment/auto-seo.pid ]; then
  echo "Stopping auto-SEO system..."
  kill $(cat deployment/auto-seo.pid) 2>/dev/null || echo "Auto-SEO process not running"
  rm deployment/auto-seo.pid
fi

# Stop the auto-Campaign marketing system
if [ -f deployment/auto-campaign.pid ]; then
  echo "Stopping auto-Campaign marketing system..."
  kill $(cat deployment/auto-campaign.pid) 2>/dev/null || echo "Auto-Campaign process not running"
  rm deployment/auto-campaign.pid
fi

echo ""
echo "All components stopped."