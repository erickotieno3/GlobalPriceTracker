# Tesco Price Comparison Website - Codebase Structure

This document outlines the structure and organization of the codebase to help developers understand how the application is built.

## Top-Level Structure

```
/
├── client/             # Frontend React application
├── server/             # Backend Node.js API
├── shared/             # Shared code (schemas, types)
├── public/             # Static assets
├── wordpress/          # WordPress theme integration
├── docs/               # Documentation
├── tests/              # Test files
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build configuration
```

## Client-Side Code Structure

```
/client
├── src/
│   ├── App.tsx                    # Main application component
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/                # Layout components
│   │   └── feature-specific/      # Feature-specific components
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-auth.tsx           # Authentication hook
│   │   └── use-toast.tsx          # Toast notifications hook
│   ├── lib/                       # Utility functions
│   │   ├── queryClient.ts         # TanStack Query setup
│   │   └── utils.ts               # Misc utilities
│   ├── pages/                     # Page components
│   │   ├── home-page.tsx          # Homepage
│   │   ├── product-page.tsx       # Product details
│   │   ├── compare-page.tsx       # Price comparison
│   │   └── auth-page.tsx          # Authentication page
│   └── index.tsx                  # Entry point
└── assets/                        # Static assets for frontend
```

## Server-Side Code Structure

```
/server
├── index.ts                     # Entry point for server
├── routes.ts                    # Route registration
├── db.ts                        # Database connection setup
├── storage.ts                   # Data access layer
├── auth.ts                      # Authentication logic
├── auto-pilot.ts                # Automated tasks system
├── auto-blog.ts                 # Automated blog generation
├── auto-updater.ts              # Price data auto-updater
├── revisions.ts                 # Content revision system
├── admin-routes.ts              # Admin panel routes
├── affiliate-routes.ts          # Affiliate program routes
├── ai-routes.ts                 # AI-powered features
├── marketplace-routes.ts        # Marketplace integration
├── revision-routes.ts           # Revision management API
├── savings-challenge-routes.ts  # Savings challenge feature
└── social-media.ts              # Social media integration
```

## Shared Code Structure

```
/shared
├── schema.ts               # Database schema definitions
├── schema-revisions.ts     # Revision system schema
└── types.ts                # Shared TypeScript types
```

## WordPress Integration

```
/wordpress
└── wp-content/
    └── themes/
        └── tesco-comparison-theme/
            ├── style.css                 # Theme stylesheet
            ├── functions.php             # Theme functions
            ├── front-page.php            # Homepage template
            ├── page-compare.php          # Price comparison template
            ├── splash-screen.php         # Splash screen
            └── inc/
                ├── api-integration.php   # API integration
                └── revisions.php         # WordPress revisions integration
```

## Key Technologies Used

1. **Frontend**:
   - React (UI library)
   - TanStack Query (data fetching)
   - shadcn/ui (UI components)
   - Vite (build tool)
   - TypeScript (type safety)

2. **Backend**:
   - Node.js (runtime)
   - Express (web framework)
   - Drizzle ORM (database ORM)
   - WebSockets (real-time communication)
   - Passport.js (authentication)

3. **Database**:
   - PostgreSQL (primary database)

4. **APIs and Integrations**:
   - OpenAI API (AI features)
   - Stripe API (payment processing)
   - Social media APIs
   - WordPress REST API

## Architecture

The application follows a client-server architecture with:

1. **Frontend**: A React SPA (Single Page Application) that communicates with the backend via REST API endpoints and WebSockets for real-time updates.

2. **Backend**: A Node.js Express server that handles:
   - API requests
   - Database interactions
   - Authentication
   - WebSocket connections
   - Scheduled tasks (auto-pilot, auto-blog, auto-updater)

3. **Database**: PostgreSQL database with schemas defined using Drizzle ORM.

4. **Dual Platform Support**: The application can run as a standalone Node.js application or integrate with WordPress via the custom theme and API integration layer.

## Development Workflow

1. The frontend is built using Vite which provides hot module replacement during development.

2. The backend runs using Node.js with TypeScript support.

3. The application can be started in development mode using `npm run dev` which starts both the backend server and the Vite development server.

4. Database migrations are handled through Drizzle ORM's schema push capability.

## Testing

The application includes various types of tests:

1. **Unit Tests**: Testing individual functions and components
2. **Integration Tests**: Testing API endpoints and database interactions
3. **End-to-End Tests**: Testing the entire application flow

Tests can be run using `npm test`.