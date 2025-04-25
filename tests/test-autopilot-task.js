// Test script to manually trigger an auto-pilot task
// This script will make an API call to the auto-pilot/tasks endpoint

import fetch from 'node-fetch';

async function main() {
  try {
    // First, get the list of available tasks
    console.log('Fetching available auto-pilot tasks...');
    const tasksResponse = await fetch('http://localhost:5000/api/admin/auto-pilot/tasks', {
      headers: {
        'Cookie': 'adminSessionId=test-session-id' // This is just for testing
      }
    });
    
    if (!tasksResponse.ok) {
      console.error('Failed to fetch tasks:', await tasksResponse.text());
      return;
    }
    
    const tasksData = await tasksResponse.json();
    console.log('Available tasks:', tasksData);
    
    // If we have tasks, trigger the first one
    if (tasksData.tasks && tasksData.tasks.length > 0) {
      const firstTask = tasksData.tasks[0];
      console.log(`Triggering task: ${firstTask.feature} (ID: ${firstTask.id})...`);
      
      const runResponse = await fetch(`http://localhost:5000/api/admin/auto-pilot/tasks/${firstTask.id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'adminSessionId=test-session-id' // This is just for testing
        }
      });
      
      if (!runResponse.ok) {
        console.error('Failed to run task:', await runResponse.text());
        return;
      }
      
      const runData = await runResponse.json();
      console.log('Task triggered:', runData);
    } else {
      console.log('No tasks available to trigger');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();