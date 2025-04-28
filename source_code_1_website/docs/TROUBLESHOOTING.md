# Troubleshooting Guide for Tesco Price Comparison Platform

This document provides solutions for common issues you might encounter when working with the Tesco Price Comparison platform.

## API Rate Limits and Quota Issues

### OpenAI API Quota Exceeded

**Symptoms:**
- Error messages like: `OpenAI API quota exceeded. Using fallback mechanism to allow auto-pilot to continue.`
- Auto-blog generation fails with `RateLimitError: 429 You exceeded your current quota`

**Solutions:**
1. **Check API Usage:**
   - Log into your [OpenAI dashboard](https://platform.openai.com/usage) to check your current usage and limits
   - Consider upgrading to a higher tier if you're consistently hitting limits

2. **Use the Built-in Fallback Mechanism:**
   - The system is designed to use fallback content when API limits are hit
   - Examine `server/auto-blog.ts` for the fallback implementation
   - Modify the fallback content generation as needed

3. **Implement Caching:**
   - Add caching for AI-generated content to reduce API calls
   - Example implementation in `server/ai-routes.ts`

4. **Adjust Auto-pilot Schedule:**
   - Modify auto-blog generation frequency in the admin panel
   - Spread API calls throughout the day to avoid hitting rate limits

## Database Issues

### Duplicate Key Errors

**Symptoms:**
- Error messages like: `duplicate key value violates unique constraint "blog_posts_slug_unique"`
- Content fails to save with unique constraint violations

**Solutions:**
1. **Implement Unique Slug Generation:**
   - Modify the slug generation logic in `server/auto-blog.ts`
   - Add a timestamp or random suffix to ensure uniqueness
   ```typescript
   const slug = `${slugify(title)}-${Date.now().toString(36)}`;
   ```

2. **Handle Conflicts Gracefully:**
   - Add try/catch blocks to handle constraint violations
   - Implement automatic retry with modified values
   ```typescript
   try {
     await storage.createBlogPost(blogPostData);
   } catch (error) {
     if (error.code === '23505') { // PostgreSQL duplicate key error
       blogPostData.slug = `${blogPostData.slug}-${Math.random().toString(36).substring(2, 7)}`;
       await storage.createBlogPost(blogPostData);
     } else {
       throw error;
     }
   }
   ```

## Configuration Issues

### Auto-pilot Feature Not Found

**Symptoms:**
- Error messages like: `Auto-pilot feature 'auto-blog' not found in configuration`
- Scheduled tasks not running as expected

**Solutions:**
1. **Check Default Configurations:**
   - Ensure the auto-pilot configuration exists in the database
   - Verify the `ensureDefaultConfigsExist` function in `server/auto-pilot.ts`

2. **Manually Create Configuration:**
   - Use the admin panel to create missing configurations
   - If database access is limited, you can add a script to create them:
   ```typescript
   // Example script to create default auto-pilot configs
   async function createDefaultAutoPilotConfigs() {
     const features = ['price-update', 'auto-blog', 'promo-content', 'data-cleanup'];
     
     for (const feature of features) {
       const existingConfig = await db
         .select()
         .from(autoPilotConfig)
         .where(eq(autoPilotConfig.feature, feature))
         .limit(1);
       
       if (existingConfig.length === 0) {
         await db.insert(autoPilotConfig).values({
           feature: feature,
           enabled: true,
           schedule: JSON.stringify({ interval: 'daily', time: '00:00' }),
           parameters: JSON.stringify({}),
           lastRun: null,
           updatedAt: new Date(),
         });
         console.log(`Created default config for ${feature}`);
       }
     }
   }
   ```

## Network and WebSocket Issues

### WebSocket Connection Failures

**Symptoms:**
- Real-time updates not working
- Console errors related to WebSocket connections

**Solutions:**
1. **Check WebSocket Server:**
   - Verify the WebSocket server is running
   - Check for correct port and path configuration

2. **Handle Connection Issues:**
   - Implement automatic reconnection logic
   ```javascript
   // Client-side WebSocket reconnection
   function connectWebSocket() {
     const socket = new WebSocket(wsUrl);
     
     socket.onclose = (event) => {
       console.log('WebSocket connection closed. Reconnecting in 5 seconds...');
       setTimeout(connectWebSocket, 5000);
     };
     
     socket.onerror = (error) => {
       console.error('WebSocket error:', error);
       socket.close();
     };
     
     return socket;
   }
   ```

## WordPress Integration Issues

### API Compatibility Layer Problems

**Symptoms:**
- WordPress theme not communicating with standalone API
- Data not synchronizing between platforms

**Solutions:**
1. **Check API Endpoint Configuration:**
   - Verify API endpoint in the WordPress theme options
   - Ensure the correct mode (WordPress Native or Standalone API) is selected

2. **Debug API Requests:**
   - Add debugging code to `inc/api-integration.php`
   ```php
   // Add this to proxy_to_standalone_api function
   if (defined('WP_DEBUG') && WP_DEBUG) {
     error_log(sprintf('API Request to: %s', $url));
     error_log(sprintf('API Response: %s', wp_remote_retrieve_body($response)));
   }
   ```

## Mobile App Issues

### Push Notification Failures

**Symptoms:**
- Push notifications not being delivered
- Firebase configuration errors

**Solutions:**
1. **Verify Firebase Configuration:**
   - Check Firebase API key and project settings
   - Ensure proper device token registration

2. **Test Notification Service:**
   - Use the testing script in `mobile-app/src/services/test-notifications.js`
   - Verify FCM token registration

## Performance Optimization

### Slow API Responses

**Symptoms:**
- Pages loading slowly
- API requests timing out

**Solutions:**
1. **Implement Caching:**
   - Add Redis or in-memory caching for frequently accessed data
   - Configure cache expiration based on data volatility

2. **Optimize Database Queries:**
   - Review and optimize slow queries
   - Add appropriate indexes to database tables
   ```sql
   -- Example index for price lookups
   CREATE INDEX idx_product_prices_product_id ON product_prices(product_id);
   ```

3. **Implement Pagination:**
   - Ensure all list endpoints use pagination
   - Add client-side virtual scrolling for large datasets

## Security Issues

### Authentication Problems

**Symptoms:**
- Users unable to login
- Session expiration issues

**Solutions:**
1. **Check Session Configuration:**
   - Verify session settings in `server/auth.ts`
   - Ensure secure cookie settings for production

2. **Implement Session Monitoring:**
   - Add logging for authentication attempts
   - Set up alerts for unusual authentication activity

## Development Environment Setup

### Missing Dependencies

**Symptoms:**
- Build failures due to missing packages
- Runtime errors for undefined modules

**Solutions:**
1. **Verify Package Installation:**
   - Run `npm install` to ensure all dependencies are installed
   - Check for version conflicts in `package.json`

2. **Check Node.js Version:**
   - Ensure you're using Node.js v18+ as specified in the requirements
   - Use nvm to manage Node.js versions if needed

## Deployment Issues

### SSL Configuration

**Symptoms:**
- Mixed content warnings
- Secure features not working

**Solutions:**
1. **Force HTTPS:**
   - Add HTTPS redirect in server configuration
   - Use HSTS headers for enhanced security

2. **Check SSL Certificates:**
   - Verify SSL certificate validity and expiration
   - Ensure all resources are loaded over HTTPS

## Getting Additional Help

If you encounter issues not covered in this guide:

1. **Check the Documentation:**
   - Review all documentation files in the `docs` directory
   - Search for similar issues in the codebase comments

2. **Community Support:**
   - Visit the support forum at [community.hyrisecrown.com](https://community.hyrisecrown.com)
   - Join the developer Slack channel for real-time assistance

3. **Contact Professional Support:**
   - Email: support@hyrisecrown.com
   - Include detailed error logs and environment information