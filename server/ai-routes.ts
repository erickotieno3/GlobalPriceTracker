/**
 * AI-Powered API Routes
 * 
 * This file contains routes for various AI-powered features including:
 * - Product recommendations
 * - Natural language search
 * - Price trend analysis
 * - Smart shopping guide generation
 * - Product comparison
 */

import { Router, Request, Response } from 'express';
import { OpenAI } from 'openai';
import { storage } from './storage';

// Initialize the OpenAI client
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');
  } else {
    console.warn('OPENAI_API_KEY not provided. AI features will be limited.');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Create router
export const aiRouter = Router();

/**
 * Get AI-powered product recommendations
 */
aiRouter.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const { userId, productId, category } = req.query;
    
    // If OpenAI is not available, return basic recommendations from database
    if (!openai) {
      const recommendedProducts = await storage.getRecommendedProducts(
        category as string,
        productId ? parseInt(productId as string) : undefined
      );
      
      return res.json({
        recommendations: recommendedProducts,
        source: 'database',
        message: 'AI-powered recommendations not available, showing popular items instead',
      });
    }
    
    // Get basic product info for context if productId is provided
    let productContext = '';
    if (productId) {
      const product = await storage.getProduct(parseInt(productId as string));
      if (product) {
        productContext = `Based on user interest in ${product.name} (${product.description || 'No description'}).`;
      }
    }
    
    // Query category info if provided
    let categoryContext = '';
    if (category) {
      const categoryInfo = await storage.getCategory(parseInt(category as string) || category as string);
      if (categoryInfo) {
        categoryContext = `For the category ${categoryInfo.name}.`;
      }
    }
    
    // Get user preferences if available
    let userContext = '';
    if (userId) {
      const userPreferences = await storage.getUserPreferences(userId as string);
      if (userPreferences) {
        userContext = `User typically shops for ${userPreferences.preferredCategories.join(', ')}.`;
      }
    }
    
    // Generate AI recommendations
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product recommendation specialist. Generate relevant product recommendations in JSON format based on the user context provided."
        },
        {
          role: "user",
          content: `Please provide product recommendations as a JSON array of objects with 'name', 'category', and 'reason' fields.
          ${productContext} ${categoryContext} ${userContext}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });
    
    const responseData = JSON.parse(completion.choices[0].message.content);
    
    // Enhance AI recommendations with actual database data
    const enhancedRecommendations = await storage.enhanceRecommendations(responseData.recommendations);
    
    res.json({
      recommendations: enhancedRecommendations,
      source: 'ai',
      message: 'AI-powered recommendations',
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: error instanceof Error ? error.message : 'Unknown error',
      recommendations: [] 
    });
  }
});

/**
 * Natural language search for products
 */
aiRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const { query, country } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // If OpenAI is not available, perform basic text search
    if (!openai) {
      const searchResults = await storage.searchProducts(query as string, country as string);
      
      return res.json({
        results: searchResults,
        source: 'database',
        message: 'Basic text search results (AI search not available)',
      });
    }
    
    // Prepare search context
    let countryContext = '';
    if (country) {
      const countryInfo = await storage.getCountry(country as string);
      if (countryInfo) {
        countryContext = `Results should be relevant to shoppers in ${countryInfo.name}.`;
      }
    }
    
    // Generate structured search query using AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a search query analyzer. Extract search parameters from natural language queries."
        },
        {
          role: "user",
          content: `Convert this natural language query into structured search parameters as JSON with fields: 
            'mainCategory', 'subCategory', 'keywords', 'priceRange', 'brands', 'sortBy'.
            Query: "${query}" ${countryContext}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    });
    
    const searchParams = JSON.parse(completion.choices[0].message.content);
    
    // Perform enhanced search with AI-parsed parameters
    const searchResults = await storage.enhancedProductSearch(searchParams);
    
    res.json({
      results: searchResults,
      source: 'ai',
      message: 'AI-enhanced search results',
      searchParameters: searchParams
    });
  } catch (error) {
    console.error('Error performing AI search:', error);
    res.status(500).json({ 
      error: 'Failed to perform search',
      message: error instanceof Error ? error.message : 'Unknown error',
      results: [] 
    });
  }
});

/**
 * Get AI-powered price trend insights
 */
aiRouter.get('/price-insights/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Get historical price data
    const priceHistory = await storage.getProductPriceHistory(parseInt(productId));
    
    if (!priceHistory || priceHistory.length === 0) {
      return res.status(404).json({ error: 'No price history found for this product' });
    }
    
    // If OpenAI is not available, return basic statistical analysis
    if (!openai) {
      const basicInsights = await storage.getBasicPriceInsights(parseInt(productId));
      
      return res.json({
        insights: basicInsights,
        source: 'database',
        message: 'Basic price analysis (AI insights not available)',
      });
    }
    
    // Get product details for context
    const product = await storage.getProduct(parseInt(productId));
    
    // Generate AI insights on price trends
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a price analysis expert. Analyze price trends and provide insights in JSON format."
        },
        {
          role: "user",
          content: `Analyze this price history data for ${product?.name || 'a product'} and provide insights as JSON with 'summary', 'trend', 'bestTimeToBuy', 'priceRange', and 'prediction' fields.
          Price History: ${JSON.stringify(priceHistory)}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 600,
    });
    
    const insights = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      productId: parseInt(productId),
      productName: product?.name,
      insights,
      priceHistory,
      source: 'ai',
      message: 'AI-powered price insights',
    });
  } catch (error) {
    console.error('Error generating price insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate price insights',
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Generate AI-powered personalized shopping guide
 */
aiRouter.get('/shopping-guide/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get user preferences and shopping history
    const userPreferences = await storage.getUserPreferences(userId);
    const shoppingHistory = await storage.getUserShoppingHistory(userId);
    
    if (!userPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    
    // If OpenAI is not available, return basic shopping guide
    if (!openai) {
      const basicGuide = await storage.getBasicShoppingGuide(userId);
      
      return res.json({
        guide: basicGuide,
        source: 'database',
        message: 'Basic shopping guide (AI personalization not available)',
      });
    }
    
    // Generate personalized shopping guide using AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a personal shopping assistant. Generate a personalized shopping guide based on the user's preferences and shopping history."
        },
        {
          role: "user",
          content: `Create a personalized shopping guide as JSON with 'summary', 'recommendations', 'savingTips', and 'weeklyPlan' fields.
          User Preferences: ${JSON.stringify(userPreferences)}
          Shopping History: ${JSON.stringify(shoppingHistory)}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });
    
    const guide = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      userId,
      guide,
      source: 'ai',
      message: 'AI-powered personalized shopping guide',
    });
  } catch (error) {
    console.error('Error generating shopping guide:', error);
    res.status(500).json({ 
      error: 'Failed to generate shopping guide',
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Extract product features from description
 */
aiRouter.post('/extract-features', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'Product description is required' });
    }
    
    // If OpenAI is not available, perform basic extraction
    if (!openai) {
      // Simple keyword extraction
      const keywords = description
        .split(/[.,;:\s]+/)
        .filter(word => word.length > 4)
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 5);
      
      return res.json({
        features: keywords.map(keyword => ({ name: keyword, confidence: 0.5 })),
        source: 'rule-based',
        message: 'Basic feature extraction (AI extraction not available)',
      });
    }
    
    // Extract features using AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product analyst. Extract key features from product descriptions as a structured JSON."
        },
        {
          role: "user",
          content: `Extract the key features from this product description and return as a JSON array of objects with 'feature', 'category', and 'importance' (1-10) fields.
          Description: "${description}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    });
    
    const features = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      features: features.features || [],
      source: 'ai',
      message: 'AI-powered feature extraction',
    });
  } catch (error) {
    console.error('Error extracting features:', error);
    res.status(500).json({ 
      error: 'Failed to extract features',
      message: error instanceof Error ? error.message : 'Unknown error',
      features: [] 
    });
  }
});

/**
 * Compare two products using AI
 */
aiRouter.post('/compare-products', async (req: Request, res: Response) => {
  try {
    const { product1Id, product2Id } = req.body;
    
    if (!product1Id || !product2Id) {
      return res.status(400).json({ error: 'Both product IDs are required' });
    }
    
    // Get product details
    const product1 = await storage.getProduct(product1Id);
    const product2 = await storage.getProduct(product2Id);
    
    if (!product1 || !product2) {
      return res.status(404).json({ error: 'One or both products not found' });
    }
    
    // If OpenAI is not available, return basic comparison
    if (!openai) {
      const basicComparison = await storage.getBasicProductComparison(product1Id, product2Id);
      
      return res.json({
        comparison: basicComparison,
        source: 'database',
        message: 'Basic product comparison (AI comparison not available)',
      });
    }
    
    // Generate detailed product comparison using AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a product comparison expert. Compare products and highlight differences in a structured JSON format."
        },
        {
          role: "user",
          content: `Compare these two products and provide a detailed comparison as JSON with 'summary', 'similarities', 'differences', 'valueComparison', and 'recommendation' fields.
          Product 1: ${JSON.stringify(product1)}
          Product 2: ${JSON.stringify(product2)}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 700,
    });
    
    const comparison = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      product1: { id: product1.id, name: product1.name },
      product2: { id: product2.id, name: product2.name },
      comparison,
      source: 'ai',
      message: 'AI-powered product comparison',
    });
  } catch (error) {
    console.error('Error comparing products:', error);
    res.status(500).json({ 
      error: 'Failed to compare products',
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Generate personalized content
 */
aiRouter.post('/generate-content', async (req: Request, res: Response) => {
  try {
    const { topic, userInterests, length } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    // If OpenAI is not available, return template content
    if (!openai) {
      return res.json({
        content: `Content about ${topic} would appear here.`,
        source: 'template',
        message: 'Template content (AI generation not available)',
      });
    }
    
    // Generate personalized content using AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content creator specializing in e-commerce and shopping topics."
        },
        {
          role: "user",
          content: `Create ${length || 'medium-length'} content about ${topic}.
          User Interests: ${userInterests || 'shopping, deals, price comparison'}
          Format the content with HTML for easy display on a website.`
        }
      ],
      max_tokens: length === 'short' ? 300 : length === 'long' ? 800 : 500,
    });
    
    const content = completion.choices[0].message.content;
    
    res.json({
      content,
      source: 'ai',
      message: 'AI-generated content',
      topic,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});