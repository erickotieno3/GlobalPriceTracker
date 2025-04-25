// Test script to verify WebSocket functionality in auto-pilot module
// This script creates a WebSocket connection to the server and listens for task completion events

const WebSocket = require('ws');

function main() {
  console.log('Connecting to WebSocket server...');
  
  // Connect to the WebSocket server
  const ws = new WebSocket('ws://localhost:5000/ws');
  
  // Handle connection open
  ws.on('open', function open() {
    console.log('WebSocket connection established');
    console.log('Waiting for auto-pilot task completion events...');
    console.log('Run the test-autopilot-task.js script in another terminal to trigger a task');
  });
  
  // Handle messages
  ws.on('message', function incoming(data) {
    try {
      const message = JSON.parse(data);
      console.log('Received message:', message);
      
      if (message.type === 'auto-pilot-task-completed') {
        console.log('✅ Auto-pilot task completed successfully!');
        console.log('Feature:', message.feature);
        console.log('Result:', message.result);
        console.log('Timestamp:', message.timestamp);
        
        // WebSocket functionality is working correctly
        console.log('WebSocket functionality is working correctly');
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  // Handle errors
  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });
  
  // Handle connection close
  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
  
  // Keep the script running
  console.log('Press Ctrl+C to exit');
}

main();