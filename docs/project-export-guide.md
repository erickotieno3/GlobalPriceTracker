# Tesco Price Comparison Project Export Guide

This guide provides instructions on how to export and backup your Tesco Price Comparison project for safekeeping. Following these steps ensures you have full control over your code and data, regardless of your Replit subscription status.

## Why Export Your Project?

- **Ownership**: While you own all the code, exporting ensures you have a local copy.
- **Continuity**: If your Replit subscription expires, you'll still have everything needed to host elsewhere.
- **Backup**: Protects against accidental changes or deletions.
- **Flexibility**: Allows you to migrate to other hosting services if needed.

## 1. Exporting Your Code Repository

### Method 1: Using Git

If your project uses Git version control:

1. Open a terminal in your Replit project
2. Run the following commands:

```bash
# Initialize Git if not already done
git init

# Add all files to Git
git add .

# Commit changes
git commit -m "Full project backup"

# Create a new repository on GitHub, GitLab, or BitBucket
# Then add that as a remote and push
git remote add origin YOUR_REPOSITORY_URL
git push -u origin master
```

### Method 2: Download as ZIP

For a simple backup without version control:

1. In your Replit project, use this command in the terminal:

```bash
# Create a zip archive of your entire project
zip -r tesco-price-comparison-backup.zip .
```

2. Right-click on the zip file in the file explorer and select "Download"

## 2. Exporting Your Database

### PostgreSQL Database Export

To export your PostgreSQL database data:

```bash
# Export the database schema and data to a SQL file
pg_dump $DATABASE_URL > tesco_database_backup.sql
```

This SQL file contains all the commands needed to recreate your database schema and restore your data.

## 3. Reinstating Your Project on Another Host

### Prerequisites

- Node.js and npm installed (version 16.x or higher recommended)
- PostgreSQL database (for database features)
- Domain configuration access (if using a custom domain)

### Steps to Reinstate

1. **Prepare the environment**:
   ```bash
   # Create a new project directory
   mkdir tesco-price-comparison
   cd tesco-price-comparison
   
   # Extract your code (if using ZIP method)
   unzip path/to/tesco-price-comparison-backup.zip
   
   # Install dependencies
   npm install
   ```

2. **Restore the database**:
   ```bash
   # Create a new database
   createdb tesco_price_comparison
   
   # Restore from backup
   psql tesco_price_comparison < path/to/tesco_database_backup.sql
   ```

3. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/tesco_price_comparison
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   # Add any other environment variables your application needs
   ```

4. **Start the application**:
   ```bash
   npm run dev  # For development
   npm run build # For production build
   npm start    # For production
   ```

## 4. Hosting Options

### Budget-Friendly Hosting Services

1. **DigitalOcean**:
   - Basic Droplet: ~$5/month
   - One-click Node.js application
   - Easy PostgreSQL setup

2. **Render**:
   - Web Services: Free to $7/month
   - PostgreSQL: Free to $7/month
   - Simple deployment from Git

3. **Railway**:
   - Starting at ~$5/month
   - PostgreSQL database included
   - Deploy directly from GitHub

4. **Fly.io**:
   - Free tier available
   - ~$5/month for basic usage
   - Global deployment options

## 5. Domain Configuration

To connect your custom domain (hyrisecrown.com) to your new host:

1. Log in to your domain registrar
2. Navigate to DNS settings
3. Update the A record to point to your new server's IP address
4. Update any CNAME records as needed
5. Wait for DNS propagation (can take 24-48 hours)

## Need Help?

If you need assistance with exporting or reinstating your project, contact support for guidance.

---

Remember, your project is your intellectual property regardless of where it's hosted. This guide helps ensure you always have access to and control over your investment.