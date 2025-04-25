// Test script to verify OpenAI API fallback functionality
// This script simulates the OpenAI API being unavailable

// First, temporarily unset the OPENAI_API_KEY to simulate the API being unavailable
const originalApiKey = process.env.OPENAI_API_KEY;
process.env.OPENAI_API_KEY = '';

const fetch = require('node-fetch');

async function main() {
  try {
    console.log('Testing OpenAI fallback functionality...');
    console.log('Simulating missing API key by temporarily unsetting OPENAI_API_KEY');
    
    // Trigger the auto-blog-weekly task which uses OpenAI
    console.log('Triggering auto-blog-weekly task...');
    
    const response = await fetch('http://localhost:5000/api/admin/auto-blog/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'adminSessionId=test-session-id' // This is just for testing
      }
    });
    
    if (!response.ok) {
      console.error('Failed to trigger auto-blog task:', await response.text());
      return;
    }
    
    const data = await response.json();
    console.log('Auto-blog task triggered:', data);
    
    // The task will be running in the background, so we can't verify the result directly here.
    // But we can check the logs to see if the fallback mechanism was triggered.
    console.log('Check the server logs to verify that the fallback mechanism was triggered');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Restore the original API key
    process.env.OPENAI_API_KEY = originalApiKey;
    console.log('OPENAI_API_KEY restored');
  }
}

main();