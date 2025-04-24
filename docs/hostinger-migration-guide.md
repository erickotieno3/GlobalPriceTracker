# Tesco Price Comparison: Hostinger Migration Guide

This guide walks you through the process of migrating your Tesco Price Comparison platform from Replit to Hostinger, one of the most cost-effective hosting providers available.

## Why Hostinger?

- **Cost-effective**: Plans start at $1.99/month
- **User-friendly**: Simple control panel with one-click installations
- **Performance**: SSD storage and LiteSpeed Web Server
- **Support**: 24/7 customer support via live chat
- **Free domain**: Many plans include a free domain name
- **Automated backups**: Daily backups to protect your data

## Prerequisites

Before starting the migration process, ensure you have:

1. A Hostinger account (sign up at [hostinger.com](https://www.hostinger.com/))
2. Your domain name (hyrisecrown.com)
3. Exported project backup (using the scripts/export-project.sh script)
4. Database backup (included in the export script)

## Step 1: Choose and Set Up Your Hostinger Plan

1. **Select a Plan**: 
   - For this project, the "Premium Shared Hosting" plan ($2.99/month) is recommended
   - It includes sufficient resources, free SSL, and free domain

2. **Domain Setup**:
   - Use your existing domain (hyrisecrown.com)
   - Go to Hostinger dashboard → Domains → Transfer Domain
   - Follow the instructions to transfer your domain or point DNS to Hostinger

## Step 2: Set Up Node.js Environment

Hostinger supports Node.js applications. Here's how to set it up:

1. **Access Your Control Panel**:
   - Log in to your Hostinger account
   - Go to "Website" section → "Auto Installer"

2. **Install Node.js**:
   - Find and select "Node.js" from the list of applications
   - Click "Install" and follow the prompts
   - Set Node.js version to 16.x or higher

3. **Configure Environment**:
   - Go to "Advanced" section → "Node.js"
   - Set up environment variables (see Step 5)

## Step 3: Create Your Database

1. **Set Up MySQL/MariaDB**:
   - Go to "Databases" section in your Hostinger control panel
   - Click "Create a New Database"
   - Enter a database name (e.g., `tesco_compare`)
   - Create a database user with strong password
   - Assign all privileges to the user

2. **Import Your Database Backup**:
   - In the "Databases" section, find your new database
   - Click "Import"
   - Upload your database backup SQL file
   - Click "Import" to restore your data

## Step 4: Upload Your Project Files

1. **Use File Manager or FTP**:
   - Option 1: Use Hostinger's built-in File Manager
     - Go to "Files" section → "File Manager"
     - Navigate to your website directory (usually `public_html`)
     
   - Option 2: Use FTP (recommended for large files)
     - Install an FTP client like FileZilla
     - In Hostinger, go to "Files" → "FTP Accounts" to get connection details
     - Connect via FTP and upload files

2. **Upload Your Project**:
   - Extract your project backup ZIP file
   - Upload all files to the web directory
   - Ensure file permissions are set correctly:
     - Folders: 755
     - Files: 644
     - Executable scripts: 755

## Step 5: Configure Environment Variables

1. **Set Up .env File**:
   - Create or edit `.env` file in your project root
   - Add all necessary environment variables:

```
DATABASE_URL=mysql://username:password@localhost:3306/tesco_compare
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
PORT=8080
STRIPE_SECRET_KEY=your_stripe_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=admin@yourdomain.com
EMAIL_PASSWORD=your_email_password
```

2. **Configure Node.js Environment**:
   - In Hostinger's Node.js settings, ensure these variables are also set there
   - This provides redundancy in case the .env file has issues

## Step 6: Install Dependencies and Build Project

1. **Access SSH Terminal**:
   - In Hostinger, go to "Advanced" → "SSH Access"
   - Enable SSH and note your credentials
   - Connect using a terminal or SSH client

2. **Install Dependencies and Build**:
   ```bash
   cd public_html
   npm install
   npm run build
   ```

## Step 7: Set Up Application Entry Point

1. **Configure Application Startup**:
   - In Hostinger's Node.js settings, set the entry point to:
   ```
   server/index.js
   ```

2. **Set Up Port Forwarding**:
   - Ensure your application listens on the port provided by Hostinger
   - Usually this is done automatically via environment variables

## Step 8: Set Up SSL Certificate

1. **Enable Free SSL**:
   - Go to "Website" → "SSL"
   - Click "Install" next to Let's Encrypt SSL
   - Follow the prompts to install and activate

2. **Force HTTPS**:
   - Enable "Force HTTPS" in the SSL section
   - This redirects all HTTP traffic to HTTPS automatically

## Step 9: Test Your Deployment

1. **Visit Your Website**:
   - Go to https://hyrisecrown.com
   - Verify all pages load correctly
   - Test the core functionality

2. **Check Admin Access**:
   - Navigate to /admin-login.html
   - Test the new 2FA login process
   - Verify dashboard functionality

## Step 10: Set Up Monitoring and Maintenance

1. **Enable Monitoring**:
   - In Hostinger, go to "Advanced" → "Monitoring"
   - Enable monitoring for your website
   - Set up email alerts for downtime

2. **Schedule Regular Backups**:
   - Go to "Advanced" → "Backups"
   - Enable daily automatic backups
   - Optionally, set up a cron job for database backups:
   ```
   0 2 * * * mysqldump -u username -p'password' tesco_compare > /home/username/backups/db_backup_$(date +\%Y\%m\%d).sql
   ```

## Troubleshooting Common Issues

### Database Connection Problems
- Double-check the DATABASE_URL in your .env file
- Verify database user has correct permissions
- Ensure database name is correct

### Node.js Application Not Starting
- Check application logs in Hostinger's Node.js section
- Verify the entry point is correctly set
- Ensure dependencies are properly installed

### SSL Certificate Issues
- Verify domain DNS is correctly pointing to Hostinger
- Try reinstalling the SSL certificate
- Check for mixed content warnings in browser console

## Need Help?

If you encounter any issues during migration:
- Contact Hostinger's 24/7 support via live chat
- Refer to their documentation: https://support.hostinger.com/
- Feel free to reach out for my further assistance

---

Following this guide will ensure a smooth transition from Replit to Hostinger with minimal downtime and technical challenges. The migration preserves all functionality while providing a more cost-effective hosting solution.