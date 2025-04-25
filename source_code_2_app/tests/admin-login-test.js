// Test script to perform admin login and get a valid session ID
// This script attempts to log in using the admin credentials

import fetch from 'node-fetch';

async function main() {
  try {
    console.log('Attempting admin login...');
    
    // Admin credentials (these are already defined in the admin-routes.ts)
    const credentials = {
      email: 'admin@tesco-compare.com',
      password: 'Tesco-Admin-2023!'
    };
    
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!loginResponse.ok) {
      console.error('Login failed:', await loginResponse.text());
      return;
    }
    
    // Extract session ID from cookie
    const cookies = loginResponse.headers.raw()['set-cookie'];
    let sessionId = null;
    
    if (cookies && cookies.length > 0) {
      for (const cookie of cookies) {
        if (cookie.includes('adminSessionId=')) {
          sessionId = cookie.split('adminSessionId=')[1].split(';')[0];
          break;
        }
      }
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);
    
    if (sessionId) {
      console.log('Admin session ID:', sessionId);
      console.log('Use this session ID in your other test scripts');
    } else {
      console.log('No session ID found in cookies');
    }
    
    // Now test fetching auto-pilot tasks with this session
    if (sessionId) {
      console.log('\nFetching auto-pilot tasks with the session ID...');
      
      const tasksResponse = await fetch('http://localhost:5000/api/admin/auto-pilot/tasks', {
        headers: {
          'Cookie': `adminSessionId=${sessionId}`
        }
      });
      
      if (!tasksResponse.ok) {
        console.error('Failed to fetch tasks:', await tasksResponse.text());
        return;
      }
      
      const tasksData = await tasksResponse.json();
      console.log('Available tasks:', tasksData);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();