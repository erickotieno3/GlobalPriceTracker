import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNewsletterSubscriberSchema } from "@shared/schema";
import paymentRouter from "./payment-routes";
import affiliateRouter from "./affiliate-routes";
import ipBlocker from "./ip-blocker";
import { WebSocketServer, WebSocket } from 'ws';
import { initializeAutoUpdater } from "./auto-updater";
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getActiveCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  
  app.get("/api/countries/coming-soon", async (req, res) => {
    try {
      const countries = await storage.getComingSoonCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coming soon countries" });
    }
  });
  
  app.get("/api/countries/:code", async (req, res) => {
    try {
      const country = await storage.getCountryByCode(req.params.code);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  
  // Stores
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });
  
  app.get("/api/stores/featured", async (req, res) => {
    try {
      const stores = await storage.getFeaturedStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured stores" });
    }
  });
  
  app.get("/api/countries/:countryId/stores", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      if (isNaN(countryId)) {
        return res.status(400).json({ message: "Invalid country ID" });
      }
      
      const stores = await storage.getStoresByCountry(countryId);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores for country" });
    }
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/trending", async (req, res) => {
    try {
      const limitParam = req.query.limit;
      const limit = limitParam ? parseInt(limitParam as string) : undefined;
      
      const products = await storage.getTrendingProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending products" });
    }
  });
  
  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.get("/api/categories/:categoryId/products", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products for category" });
    }
  });
  
  // Product Prices
  app.get("/api/products/:id/compare", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const prices = await storage.compareProductPrices(productId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to compare product prices" });
    }
  });
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validationResult = insertNewsletterSubscriberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid subscriber data", 
          errors: validationResult.error.errors 
        });
      }
      
      const subscriber = await storage.createNewsletterSubscriber(validationResult.data);
      res.status(201).json({ message: "Successfully subscribed to newsletter", subscriber });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  
  // Languages
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await storage.getActiveLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });
  
  // Mobile app connectivity endpoint
  app.get("/api/mobile/status", (req, res) => {
    res.json({
      status: "online",
      version: "1.0.0",
      serverTime: new Date().toISOString(),
      message: "Server is running and ready to accept connections from mobile applications",
      features: [
        "price_comparison",
        "store_locator",
        "product_search",
        "country_selection",
        "multilingual_support"
      ]
    });
  });
  
  // Simple HTML test endpoint (bypass React entirely)
  app.get("/test-basic", (req, res) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Direct Server HTML Test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            text-align: center;
            color: #333;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          
          h1 {
            color: #00539f;
          }
          
          .btn {
            display: inline-block;
            background: #00539f;
            color: white;
            padding: 8px 16px;
            margin: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .btn-reset {
            background: #e10600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Tesco Price Comparison - Direct Server Test</h1>
          <p>This is a simple static HTML page served directly from Express.</p>
          <p>If you can see this page, the server is working correctly.</p>
          
          <div id="counter-display">
            <p>Counter: <span id="count">0</span></p>
            <button class="btn" onclick="incrementCounter()">Increment</button>
            <button class="btn btn-reset" onclick="resetCounter()">Reset</button>
          </div>
          
          <p id="time">Current time: Loading...</p>
        </div>

        <script>
          // Simple counter functionality
          let count = 0;
          const countDisplay = document.getElementById('count');
          
          function incrementCounter() {
            count++;
            countDisplay.textContent = count;
          }
          
          function resetCounter() {
            count = 0;
            countDisplay.textContent = count;
          }
          
          // Update time
          function updateTime() {
            document.getElementById('time').textContent = 'Current time: ' + new Date().toLocaleTimeString();
          }
          
          // Initial time update and set interval
          updateTime();
          setInterval(updateTime, 1000);
        </script>
      </body>
      </html>
    `;
    res.send(html);
  });

  // Special direct HTML rendering route - completely bypasses all complex rendering
  app.get("/direct-html", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Direct HTML Response</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 20px; 
      text-align: center;
      background-color: #f0f0f0;
      line-height: 1.6;
    }
    h1 { color: #00539f; margin-bottom: 20px; }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .counter {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    button {
      background: #00539f;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      margin: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .reset { background: #e10600; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Tesco Price Comparison - Direct HTML Test</h1>
    <p>This is a completely self-contained HTML page sent directly from the server with no external dependencies.</p>
    
    <div class="counter">
      <h2>Interactive Counter</h2>
      <p>Counter value: <span id="count">0</span></p>
      <button onclick="increment()">Increment</button>
      <button class="reset" onclick="reset()">Reset</button>
    </div>
    
    <p id="time">Current time: Loading...</p>
    
    <script>
      // No external dependencies - everything is inline
      let count = 0;
      
      function increment() {
        count++;
        document.getElementById('count').textContent = count;
      }
      
      function reset() {
        count = 0;
        document.getElementById('count').textContent = count;
      }
      
      // Update time function
      function updateTime() {
        document.getElementById('time').textContent = 'Current time: ' + new Date().toLocaleTimeString();
      }
      
      // Initial update and set interval
      updateTime();
      setInterval(updateTime, 1000);
      
      // Log to console for verification
      console.log('Direct HTML test page loaded successfully!');
    </script>
  </div>
</body>
</html>
    `);
  });
  
  // Serve mobile app directly from mobile-app directory
  app.get('/mobile', (req, res) => {
    // Simplify to avoid path resolution issues
    res.sendFile('mobile-app/index.html', { root: '.' });
  });
  
  // Serve mobile app static assets - simplify to avoid path resolution issues
  app.use('/mobile-app', express.static('mobile-app'));
  
  // Serve mobile app assets directly
  app.use('/assets', express.static('mobile-app/assets'));

  // Payment routes
  app.use("/api/payments", paymentRouter);
  
  // Affiliate routes
  app.use("/api/affiliate", affiliateRouter);

  const httpServer = createServer(app);
  
  // WebSocket server for real-time price updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Initialize the product data auto-updater system
  initializeAutoUpdater(wss);
  
  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Tesco Price Comparison WebSocket server',
      timestamp: new Date().toISOString()
    }));
    
    // Handle messages from clients
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe_product':
            if (data.productId) {
              const productId = parseInt(data.productId);
              
              // Fetch updated product prices
              const prices = await storage.compareProductPrices(productId);
              
              // Send real-time price updates
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'price_update',
                  productId,
                  prices,
                  timestamp: new Date().toISOString()
                }));
              }
            }
            break;
            
          case 'subscribe_country':
            if (data.countryCode) {
              const country = await storage.getCountryByCode(data.countryCode);
              const stores = country ? await storage.getStoresByCountry(country.id) : [];
              
              // Send country stores update
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'country_stores_update',
                  countryCode: data.countryCode,
                  stores,
                  timestamp: new Date().toISOString()
                }));
              }
            }
            break;
            
          default:
            // Unknown message type
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type',
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Error processing message',
            timestamp: new Date().toISOString()
          }));
        }
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    // Error handling
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  return httpServer;
}
