# Implementation Guide for Tesco Price Comparison Website

This guide provides step-by-step instructions for setting up the Tesco Price Comparison website on your own server or hosting platform.

## Technical Requirements

- Node.js v18+ and npm
- PostgreSQL database server
- Domain name with DNS access
- SSL certificate (recommended for production)
- Git for version control

## Step 1: Server Setup

1. Set up a server with at least:
   - 2GB RAM
   - 2 CPU cores
   - 20GB SSD storage
   - Ubuntu 20.04 LTS or newer

2. Install required software:
   ```bash
   # Update package lists
   sudo apt update
   sudo apt upgrade -y
   
   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Enable and start services
   sudo systemctl enable postgresql
   sudo systemctl start postgresql
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

## Step 2: Database Setup

1. Configure PostgreSQL:
   ```bash
   # Access PostgreSQL
   sudo -u postgres psql
   
   # Create database and user
   CREATE DATABASE tesco_comparison;
   CREATE USER tesco_user WITH ENCRYPTED PASSWORD 'your_strong_password';
   GRANT ALL PRIVILEGES ON DATABASE tesco_comparison TO tesco_user;
   
   # Exit PostgreSQL
   \q
   ```

## Step 3: Application Deployment

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd tesco-comparison-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://tesco_user:your_strong_password@localhost:5432/tesco_comparison
   OPENAI_API_KEY=your_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Set up the database schema:
   ```bash
   npm run db:push
   ```

5. Build the application:
   ```bash
   npm run build
   ```

6. Set up a process manager (PM2):
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start the application
   pm2 start npm --name "tesco-comparison" -- start
   
   # Ensure PM2 starts on reboot
   pm2 startup
   pm2 save
   ```

## Step 4: Nginx Configuration

1. Create an Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/tesco-comparison
   ```

2. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/tesco-comparison /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Step 5: SSL Setup (Let's Encrypt)

1. Install Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain and install SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. Follow the prompts to complete the setup.

## Step 6: DNS Configuration

1. Log in to your domain registrar's control panel.
2. Create an A record pointing to your server's IP address:
   - Type: A
   - Name: @
   - Value: Your server's IP address
   - TTL: 3600 (or 1 hour)

3. Create a CNAME record for the www subdomain:
   - Type: CNAME
   - Name: www
   - Value: yourdomain.com
   - TTL: 3600 (or 1 hour)

## Step 7: Testing and Verification

1. Visit your domain in a web browser to verify the website is running.
2. Test key functionality:
   - Search for products
   - User registration and login
   - Price comparison
   - Mobile responsiveness

## Troubleshooting

Check the application logs for errors:
```bash
pm2 logs tesco-comparison
```

Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

## Maintenance and Updates

To update the application:
```bash
cd tesco-comparison-website
git pull
npm install
npm run build
pm2 restart tesco-comparison
```

## Security Considerations

1. Set up a firewall:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

2. Secure PostgreSQL:
   - Edit the PostgreSQL configuration file to only listen on localhost
   - Implement strong passwords
   - Regularly back up the database

3. Keep the server updated:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```