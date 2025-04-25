// WebSocket auto-pilot test script
import WebSocket from 'ws';

// Local development URL
const wsUrl = 'ws://localhost:5000/ws';

// Create a WebSocket connection
const ws = new WebSocket(wsUrl);

// Connection opened
ws.on('open', function() {
  console.log('Connected to WebSocket server');
  
  // Request auto-pilot status
  ws.send(JSON.stringify({
    type: 'get_autopilot_status'
  }));
  
  // Wait 2 seconds then request system diagnostics
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'diagnostics',
      client: 'test-script',
      timestamp: new Date().toISOString()
    }));
  }, 2000);
});

// Listen for messages
ws.on('message', function(data) {
  const message = JSON.parse(data);
  console.log('Received message type:', message.type);
  
  if (message.type === 'autopilot_status') {
    console.log('Auto-pilot Status:');
    console.log('- Running Tasks:', message.runningTasks);
    console.log('- Completed Tasks:', message.completedTasks);
    console.log('- Next Task Time:', message.nextTaskTime);
    console.log('- Blog Posts:', message.blogPostsCount);
    
    if (message.tasks && message.tasks.length > 0) {
      console.log('\nTasks:');
      message.tasks.forEach(task => {
        console.log(`- ${task.feature} (${task.isEnabled ? 'Enabled' : 'Disabled'})`);
        console.log(`  Last Run: ${task.lastRun || 'Never'}`);
        console.log(`  Next Run: ${task.nextRun || 'Not scheduled'}`);
      });
    }
    
    if (message.logs && message.logs.length > 0) {
      console.log('\nRecent Logs:');
      message.logs.slice(0, 3).forEach(log => {
        console.log(`- ${log.feature} (${log.status})`);
        console.log(`  Started: ${log.startTime}`);
        console.log(`  Ended: ${log.endTime || 'Running...'}`);
      });
    }
  } else if (message.type === 'connection') {
    console.log('Connection message:', message.message);
  } else if (message.type === 'diagnostics_response') {
    console.log('Diagnostics Response:');
    console.log('- Server Time:', message.serverTime);
    console.log('- Node Version:', message.serverInfo.nodeVersion);
    console.log('- Environment:', message.serverInfo.environment);
    
    // Close the connection after receiving diagnostics
    console.log('\nTest complete, closing connection');
    ws.close();
  } else if (message.type === 'error') {
    console.error('Error from server:', message.message);
  } else {
    console.log('Full message:', message);
  }
});

// Handle errors
ws.on('error', function(error) {
  console.error('WebSocket error:', error.message);
});

// Connection closed
ws.on('close', function() {
  console.log('Connection closed');
});

// Close after 10 seconds if nothing else happens
setTimeout(() => {
  if (ws.readyState === WebSocket.OPEN) {
    console.log('Closing connection after timeout');
    ws.close();
  }
}, 10000);