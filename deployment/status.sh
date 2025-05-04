#!/bin/bash
# Combined Deployment Status Script
# This script checks the status of all deployment components

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check keep-alive script
if [ -f deployment/keep-alive.pid ]; then
  if ps -p $(cat deployment/keep-alive.pid) > /dev/null; then
    echo "✓ Keep-alive script: RUNNING (PID: $(cat deployment/keep-alive.pid))"
  else
    echo "✗ Keep-alive script: STOPPED (stale PID file)"
  fi
else
  echo "✗ Keep-alive script: NOT STARTED"
fi

# Check deployment coordinator
if [ -f deployment/coordinator.pid ]; then
  if ps -p $(cat deployment/coordinator.pid) > /dev/null; then
    echo "✓ Deployment coordinator: RUNNING (PID: $(cat deployment/coordinator.pid))"
  else
    echo "✗ Deployment coordinator: STOPPED (stale PID file)"
  fi
else
  echo "✗ Deployment coordinator: NOT STARTED"
fi

# Check auto-deployment script
if [ -f deployment/auto-deploy.pid ]; then
  if ps -p $(cat deployment/auto-deploy.pid) > /dev/null; then
    echo "✓ Auto-deployment script: RUNNING (PID: $(cat deployment/auto-deploy.pid))"
  else
    echo "✗ Auto-deployment script: STOPPED (stale PID file)"
  fi
else
  echo "✗ Auto-deployment script: NOT STARTED"
fi

echo ""
echo "Recent log entries:"
echo "-------------------"
echo "Keep-alive log:"
tail -n 5 logs/keep-alive.log 2>/dev/null || echo "No keep-alive logs found"
echo ""
echo "Coordinator log:"
tail -n 5 logs/deployment-coordinator.log 2>/dev/null || echo "No coordinator logs found"
echo ""
echo "Auto-deployment log:"
tail -n 5 logs/auto-deploy.log 2>/dev/null || echo "No auto-deployment logs found"