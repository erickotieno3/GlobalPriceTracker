# Tesco Price Comparison API Reference

This document provides a comprehensive reference for all API endpoints available in the Tesco Price Comparison platform.

## Base URL

```
https://api.hyrisecrown.com
```

For local development:
```
http://localhost:5000
```

## Authentication

Most endpoints require authentication using JSON Web Tokens (JWT).

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Authentication Endpoints**:

### Register a new user

```
POST /api/register
```

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "id": 123,
  "username": "user@example.com",
  "name": "John Doe"
}
```

### Log in

```
POST /api/login
```

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "id": 123,
  "username": "user@example.com",
  "name": "John Doe"
}
```

### Log out

```
POST /api/logout
```

**Response**:
```
Status: 200 OK
```

### Get current user

```
GET /api/user
```

**Response**:
```json
{
  "id": 123,
  "username": "user@example.com",
  "name": "John Doe"
}
```

## Products API

### Get all products

```
GET /api/products
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category ID
- `search` (optional): Search term

**Response**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Milk",
      "description": "Fresh whole milk",
      "imageUrl": "https://example.com/milk.jpg",
      "categoryId": 5,
      "barcode": "5000112637922"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### Get product by ID

```
GET /api/products/:id
```

**Response**:
```json
{
  "id": 1,
  "name": "Milk",
  "description": "Fresh whole milk",
  "imageUrl": "https://example.com/milk.jpg",
  "categoryId": 5,
  "barcode": "5000112637922"
}
```

### Get product prices

```
GET /api/products/:id/prices
```

**Response**:
```json
[
  {
    "id": 101,
    "productId": 1,
    "storeId": 1,
    "price": 1.45,
    "currency": "£",
    "lastUpdated": "2023-09-01T12:00:00Z"
  },
  {
    "id": 102,
    "productId": 1,
    "storeId": 2,
    "price": 1.35,
    "currency": "£",
    "lastUpdated": "2023-09-01T14:30:00Z"
  }
]
```

### Get product by barcode

```
GET /api/products/barcode/:barcode
```

**Response**:
```json
{
  "id": 1,
  "name": "Milk",
  "description": "Fresh whole milk",
  "imageUrl": "https://example.com/milk.jpg",
  "categoryId": 5,
  "barcode": "5000112637922"
}
```

## Stores API

### Get all stores

```
GET /api/stores
```

**Query Parameters**:
- `country` (optional): Filter by country ID

**Response**:
```json
[
  {
    "id": 1,
    "name": "Tesco",
    "logoUrl": "https://example.com/tesco.png",
    "websiteUrl": "https://tesco.com",
    "countryId": 1
  },
  {
    "id": 2,
    "name": "Walmart",
    "logoUrl": "https://example.com/walmart.png",
    "websiteUrl": "https://walmart.com",
    "countryId": 2
  }
]
```

### Get store by ID

```
GET /api/stores/:id
```

**Response**:
```json
{
  "id": 1,
  "name": "Tesco",
  "logoUrl": "https://example.com/tesco.png",
  "websiteUrl": "https://tesco.com",
  "countryId": 1
}
```

## Categories API

### Get all categories

```
GET /api/categories
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Dairy",
    "imageUrl": "https://example.com/dairy.png"
  },
  {
    "id": 2,
    "name": "Bakery",
    "imageUrl": "https://example.com/bakery.png"
  }
]
```

## Countries API

### Get all countries

```
GET /api/countries
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "United Kingdom",
    "code": "UK",
    "currency": "£",
    "flagUrl": "https://example.com/uk.png"
  },
  {
    "id": 2,
    "name": "United States",
    "code": "US",
    "currency": "$",
    "flagUrl": "https://example.com/us.png"
  }
]
```

## Price Comparison API

### Compare prices

```
GET /api/compare
```

**Query Parameters**:
- `productIds`: Comma-separated list of product IDs
- `countryId` (optional): Filter by country

**Response**:
```json
[
  {
    "productId": 1,
    "name": "Milk",
    "imageUrl": "https://example.com/milk.jpg",
    "stores": [
      {
        "storeId": 1,
        "name": "Tesco",
        "logoUrl": "https://example.com/tesco.png",
        "price": 1.45,
        "currency": "£",
        "lastUpdated": "2023-09-01T12:00:00Z"
      },
      {
        "storeId": 2,
        "name": "Walmart",
        "logoUrl": "https://example.com/walmart.png",
        "price": 1.35,
        "currency": "£",
        "lastUpdated": "2023-09-01T14:30:00Z"
      }
    ],
    "lowestPrice": {
      "storeId": 2,
      "price": 1.35,
      "currency": "£"
    },
    "highestPrice": {
      "storeId": 1,
      "price": 1.45,
      "currency": "£"
    },
    "priceDifference": 0.10,
    "percentageDifference": 6.9
  }
]
```

### Get price history

```
GET /api/products/:id/price-history
```

**Query Parameters**:
- `storeId` (optional): Filter by store
- `days` (optional): Number of days (default: 30)

**Response**:
```json
[
  {
    "date": "2023-09-01",
    "storeId": 1,
    "price": 1.45,
    "currency": "£"
  },
  {
    "date": "2023-08-25",
    "storeId": 1,
    "price": 1.50,
    "currency": "£"
  }
]
```

## AI Features API

### Get product recommendations

```
GET /api/ai/recommendations
```

**Query Parameters**:
- `userId`: User ID for personalized recommendations
- `limit` (optional): Number of recommendations (default: 10)

**Response**:
```json
[
  {
    "id": 5,
    "name": "Fresh Orange Juice",
    "description": "100% pure squeezed orange juice",
    "imageUrl": "https://example.com/orange-juice.jpg",
    "categoryId": 3,
    "score": 0.95,
    "reason": "Based on your previous purchases"
  }
]
```

### Get price insights

```
GET /api/ai/price-insights/:productId
```

**Response**:
```json
{
  "currentPrice": {
    "price": 1.45,
    "currency": "£",
    "storeId": 1,
    "storeName": "Tesco"
  },
  "priceAnalysis": "The current price is 10% lower than the 3-month average. This is a good time to buy.",
  "priceForecasts": [
    {
      "period": "1 week",
      "prediction": "stable",
      "confidence": 0.85
    },
    {
      "period": "1 month",
      "prediction": "increase",
      "confidence": 0.7
    }
  ],
  "bestTimeToBy": "Now is a good time to buy based on historical trends."
}
```

### Natural language search

```
GET /api/ai/search
```

**Query Parameters**:
- `query`: Search query in natural language
- `limit` (optional): Number of results (default: 10)

**Response**:
```json
{
  "query": "cheap gluten free bread",
  "interpretation": "Looking for affordable bread products that are certified gluten-free",
  "results": [
    {
      "id": 42,
      "name": "Free From White Bread",
      "description": "Gluten-free white bread",
      "imageUrl": "https://example.com/gf-bread.jpg",
      "categoryId": 2,
      "prices": [
        {
          "storeId": 1,
          "price": 2.50,
          "currency": "£"
        }
      ],
      "relevanceScore": 0.95
    }
  ]
}
```

## Savings Challenge API

### Get all challenges

```
GET /api/savings-challenges
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "52-Week Challenge",
    "description": "Save increasing amounts each week for a year",
    "durationDays": 365,
    "targetAmount": 1378.0,
    "difficulty": "medium",
    "imageUrl": "https://example.com/52-week.jpg"
  }
]
```

### Join a challenge

```
POST /api/savings-challenges/:id/join
```

**Response**:
```json
{
  "message": "Successfully joined the challenge",
  "challengeId": 1,
  "startDate": "2023-09-01T00:00:00Z",
  "endDate": "2024-08-31T23:59:59Z",
  "status": "active"
}
```

### Update challenge progress

```
POST /api/savings-challenges/:id/progress
```

**Request Body**:
```json
{
  "amount": 5.0,
  "date": "2023-09-01T12:00:00Z",
  "notes": "Week 1 savings"
}
```

**Response**:
```json
{
  "challengeId": 1,
  "totalSaved": 5.0,
  "targetAmount": 1378.0,
  "progressPercentage": 0.36,
  "daysRemaining": 358
}
```

### Get user challenge progress

```
GET /api/savings-challenges/progress
```

**Response**:
```json
[
  {
    "challengeId": 1,
    "name": "52-Week Challenge",
    "startDate": "2023-09-01T00:00:00Z",
    "endDate": "2024-08-31T23:59:59Z",
    "totalSaved": 5.0,
    "targetAmount": 1378.0,
    "progressPercentage": 0.36,
    "daysRemaining": 358,
    "status": "active"
  }
]
```

## Affiliate Marketing API

### Get affiliate links

```
GET /api/affiliate/links
```

**Query Parameters**:
- `productId`: Product ID to generate affiliate links for

**Response**:
```json
[
  {
    "storeId": 3,
    "storeName": "Amazon",
    "productUrl": "https://amazon.com/dp/B0123456789",
    "affiliateUrl": "https://hyrisecrown.com/affiliate/redirect?id=abc123",
    "commission": "3%"
  }
]
```

### Record affiliate click

```
POST /api/affiliate/click
```

**Request Body**:
```json
{
  "linkId": "abc123",
  "productId": 42,
  "storeId": 3
}
```

**Response**:
```
Status: 200 OK
```

## Revision Management API

### Get revisions for a product

```
GET /api/revisions/product/:id
```

**Response**:
```json
[
  {
    "id": 101,
    "productId": 1,
    "title": "Milk",
    "description": "Fresh whole milk",
    "image": "https://example.com/milk.jpg",
    "categoryId": 5,
    "countryId": 1,
    "createdAt": "2023-08-15T12:00:00Z"
  },
  {
    "id": 102,
    "productId": 1,
    "title": "Whole Milk",
    "description": "Fresh cow's whole milk",
    "image": "https://example.com/milk.jpg",
    "categoryId": 5,
    "countryId": 1,
    "createdAt": "2023-09-01T14:30:00Z"
  }
]
```

### Restore a product to a specific revision

```
POST /api/revisions/product/restore/:id
```

**Response**:
```json
{
  "success": true,
  "message": "Product restored to revision from 2023-08-15T12:00:00Z",
  "product": {
    "id": 1,
    "name": "Milk",
    "description": "Fresh whole milk",
    "imageUrl": "https://example.com/milk.jpg",
    "categoryId": 5,
    "barcode": "5000112637922"
  }
}
```

## Admin API

Admin endpoints require special admin privileges.

### Admin login

```
POST /api/admin/login
```

**Request Body**:
```json
{
  "username": "admin@example.com",
  "password": "adminPassword123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Run auto-pilot task

```
POST /api/admin/auto-pilot/tasks/:id/run
```

**Response**:
```json
{
  "success": true,
  "message": "Task started successfully",
  "taskId": "price-update",
  "status": "running"
}
```

### Generate blog post

```
POST /api/admin/auto-blog/generate
```

**Request Body**:
```json
{
  "topic": "Price trends for dairy products",
  "tags": ["dairy", "prices", "trends"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Blog post generated successfully",
  "blogPostId": 42
}
```

## Payment Processing API

### Create payment intent

```
POST /api/create-payment-intent
```

**Request Body**:
```json
{
  "amount": 1999
}
```

**Response**:
```json
{
  "clientSecret": "pi_3NkCGpJbZI8FG8U11BKZKlGY_secret_6c07YkxhgZ2G8UGT6NwASrTpf"
}
```

### Create subscription

```
POST /api/get-or-create-subscription
```

**Response**:
```json
{
  "subscriptionId": "sub_1NkCGpJbZI8FG8U1",
  "clientSecret": "pi_3NkCGpJbZI8FG8U11BKZKlGY_secret_6c07YkxhgZ2G8UGT6NwASrTpf"
}
```

## WebSocket API

Connect to the WebSocket server for real-time updates:

```
ws://api.hyrisecrown.com/ws
```

### Message Types

#### Price Update

```json
{
  "type": "price_update",
  "data": {
    "productId": 1,
    "storeId": 1,
    "oldPrice": 1.50,
    "newPrice": 1.45,
    "currency": "£",
    "timestamp": "2023-09-01T12:00:00Z"
  }
}
```

#### Task Completion

```json
{
  "type": "task_completion",
  "data": {
    "feature": "price-update",
    "status": "completed",
    "message": "Price data updated successfully",
    "timestamp": "2023-09-01T12:05:00Z"
  }
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": ["Field 'username' is required"]
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse. The current limits are:

- Anonymous users: 60 requests per minute
- Authenticated users: 120 requests per minute
- Admin users: 300 requests per minute

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1630508280
```

When the rate limit is exceeded, a `429 Too Many Requests` status code is returned.