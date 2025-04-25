# Tesco Price Comparison Website Source Code

This folder contains all the source code for the Tesco Price Comparison website built with:
- TypeScript/JavaScript (React frontend)
- Node.js backend
- PostgreSQL database
- Real-time communication via WebSockets
- Internationalization support
- Stripe payment integration

## Folder Structure

- `/client` - Frontend React application code
- `/server` - Backend Node.js API code
- `/shared` - Shared code between frontend and backend (schemas, types)
- `/docs` - Documentation for implementation and deployment

## Setup Instructions

1. Install Node.js (v18+) and npm
2. Install PostgreSQL database
3. Clone this repository
4. Run `npm install` in the root directory
5. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
   OPENAI_API_KEY=your_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```
6. Run database migrations with `npm run db:push`
7. Start the development server with `npm run dev`

## Deployment

For production deployment:
1. Build the application with `npm run build`
2. Set up proper DNS configuration with A record pointing to your server
3. Set up SSL certificates

## Features Implemented

- Global e-commerce price comparison
- Multi-language support
- Unlimited content revisions system
- Auto-pilot system for automated updates
- Auto-blog functionality
- AI-powered product recommendations
- WordPress theme integration
- Mobile-responsive design (PWA)
- Stripe payment processing

For technical questions or support, refer to the documentation in `/docs`.