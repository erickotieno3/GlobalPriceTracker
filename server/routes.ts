import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNewsletterSubscriberSchema } from "@shared/schema";
import paymentRouter from "./payment-routes";
import ipBlocker from "./ip-blocker";
import { WebSocketServer, WebSocket } from 'ws';

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

  // Payment routes
  app.use("/api/payments", paymentRouter);

  const httpServer = createServer(app);
  
  // WebSocket server for real-time price updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
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
