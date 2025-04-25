// WebSocket auto-pilot task trigger test script
import WebSocket from 'ws';

// Task to trigger (can be changed to any valid task feature name)
const taskFeature = 'auto-blog-weekly';

// Local development URL
const wsUrl = 'ws://localhost:5000/ws';

// Create a WebSocket connection
const ws = new WebSocket(wsUrl);

// Connection opened
ws.on('open', function() {
  console.log('Connected to WebSocket server');
  
  // Trigger the specified task
  console.log(`Triggering task: ${taskFeature}`);
  ws.send(JSON.stringify({
    type: 'trigger_autopilot_task',
    feature: taskFeature
  }));
});

// Listen for messages
ws.on('message', function(data) {
  const message = JSON.parse(data);
  console.log('Received message type:', message.type);
  
  if (message.type === 'task_triggered') {
    console.log(`Successfully triggered task: ${message.feature}`);
    console.log(`Timestamp: ${message.timestamp}`);
    
    // Close the connection after task is triggered
    ws.close();
  } else if (message.type === 'connection') {
    console.log('Connection message:', message.message);
  } else if (message.type === 'error') {
    console.error('Error from server:', message.message);
    ws.close();
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