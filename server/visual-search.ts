/**
 * Visual Product Search Service
 * 
 * This service provides AI-powered image recognition for products,
 * allowing users to upload photos and find similar products across stores.
 */

import OpenAI from 'openai';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { storage } from './storage';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up multer for handling file uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, 'product-' + uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  },
});

/**
 * Middleware for handling image uploads
 */
export const uploadProductImage = upload.single('productImage');

/**
 * Extract product details from an image using AI vision
 */
export async function analyzeProductImage(imagePath: string): Promise<{
  productName?: string;
  brand?: string;
  category?: string;
  attributes: Record<string, string>;
  confidence: number;
}> {
  try {
    // Read the image file as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Call OpenAI API for image analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a product identification specialist. Analyze the product image and extract key details including product name, brand, category, and any visible attributes like size, color, etc. Format your response as structured JSON with these fields."
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: "text",
              text: "Identify this product and give me detailed information about it. Return the results in valid JSON format with the following fields: productName, brand, category, attributes (as an object with key-value pairs), and confidence (a number between 0 and 1 indicating your confidence in the identification)."
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }
    
    const productInfo = JSON.parse(content);
    
    // Ensure the response has the expected structure
    return {
      productName: productInfo.productName,
      brand: productInfo.brand,
      category: productInfo.category,
      attributes: productInfo.attributes || {},
      confidence: typeof productInfo.confidence === 'number' ? productInfo.confidence : 0.5,
    };
  } catch (error) {
    console.error('Error analyzing product image:', error);
    return {
      attributes: {},
      confidence: 0,
    };
  }
}

/**
 * Find similar products based on product details
 */
export async function findSimilarProducts(productDetails: {
  productName?: string;
  brand?: string;
  category?: string;
  attributes: Record<string, string>;
}): Promise<any[]> {
  try {
    // Get all products from storage
    const products = await storage.getAllProducts();
    
    if (!products || products.length === 0) {
      return [];
    }
    
    // Create a search query based on identified product details
    let searchQuery = '';
    if (productDetails.productName) searchQuery += productDetails.productName + ' ';
    if (productDetails.brand) searchQuery += productDetails.brand + ' ';
    if (productDetails.category) searchQuery += productDetails.category + ' ';
    
    // Add key attributes to search query
    const importantAttributes = ['size', 'color', 'weight', 'flavor', 'type'];
    importantAttributes.forEach(attr => {
      if (productDetails.attributes[attr]) {
        searchQuery += productDetails.attributes[attr] + ' ';
      }
    });
    
    searchQuery = searchQuery.trim();
    
    if (!searchQuery) {
      return [];
    }
    
    // Use OpenAI to find the most relevant products
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are a product search expert. Find the most relevant products from a catalog based on the identified product details."
        },
        {
          role: "user",
          content: `Find products similar to: "${searchQuery}". Return the most relevant products from this catalog as a JSON array with only product IDs, ranked by relevance: ${JSON.stringify(products.slice(0, 100))}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }
    
    const result = JSON.parse(content);
    
    // Extract product IDs (handling different possible formats)
    let productIds: number[] = [];
    if (Array.isArray(result)) {
      productIds = result.map(item => typeof item === 'number' ? item : item.id || item.productId || 0).filter(id => id > 0);
    } else if (result.products && Array.isArray(result.products)) {
      productIds = result.products.map(item => typeof item === 'number' ? item : item.id || item.productId || 0).filter(id => id > 0);
    } else if (result.ids && Array.isArray(result.ids)) {
      productIds = result.ids.filter(id => typeof id === 'number' && id > 0);
    } else if (result.productIds && Array.isArray(result.productIds)) {
      productIds = result.productIds.filter(id => typeof id === 'number' && id > 0);
    }
    
    // Get full product details for the IDs
    const similarProducts = productIds
      .map(id => products.find(p => p.id === id))
      .filter(p => p !== undefined)
      .slice(0, 10); // Limit to top 10 results
    
    return similarProducts;
  } catch (error) {
    console.error('Error finding similar products:', error);
    return [];
  }
}

/**
 * Handle product image upload and search request
 */
export async function handleVisualSearch(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image uploaded' });
      return;
    }

    const imagePath = req.file.path;
    
    // Step 1: Analyze the image to identify the product
    const productDetails = await analyzeProductImage(imagePath);
    
    // Step 2: Find similar products based on the identified details
    const similarProducts = await findSimilarProducts(productDetails);
    
    // Step 3: Combine results and send response
    res.json({
      success: true,
      identifiedProduct: {
        name: productDetails.productName || 'Unknown product',
        brand: productDetails.brand || 'Unknown brand',
        category: productDetails.category || 'Unknown category',
        attributes: productDetails.attributes || {},
        confidence: productDetails.confidence,
      },
      similarProducts,
    });
    
    // Clean up: remove the uploaded file after processing
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error removing uploaded file:', err);
    });
  } catch (error) {
    console.error('Error in visual search:', error);
    res.status(500).json({ error: 'Failed to process product image' });
  }
}

/**
 * Handle B2B product insights request
 */
export async function getB2BInsights(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    
    if (!productId || isNaN(parseInt(productId))) {
      res.status(400).json({ error: 'Valid product ID is required' });
      return;
    }
    
    const productIdNum = parseInt(productId);
    
    // Get the product details
    const product = await storage.getProduct(productIdNum);
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    // Get price history and other data
    const priceHistory = await storage.getProductPriceHistory(productIdNum);
    const allProducts = await storage.getAllProducts();
    const categoryProducts = allProducts.filter(p => p.category === product.category);
    
    // Use OpenAI to generate B2B insights
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are a B2B product analyst specializing in retail and supply chain insights. Provide valuable business insights for retailers and wholesalers based on product data."
        },
        {
          role: "user",
          content: `Generate B2B insights for this product: ${JSON.stringify(product)}
          
          Price History: ${JSON.stringify(priceHistory)}
          
          Category Competition Overview (${categoryProducts.length} products in same category):
          ${JSON.stringify(categoryProducts.slice(0, 5))}
          
          Generate insights in JSON format with these sections:
          1. priceAnalysis: Analysis of pricing trends and competitiveness
          2. supplyChainInsights: Procurement advice and supply chain observations
          3. marketingRecommendations: How to position this product effectively
          4. competitiveAnalysis: How this product compares to alternatives
          5. businessOpportunities: Specific B2B opportunities for this product
          6. risks: Potential challenges or issues to be aware of
          `
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1500,
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }
    
    // Parse and send the insights
    const insights = JSON.parse(content);
    
    res.json({
      success: true,
      product,
      insights
    });
  } catch (error) {
    console.error('Error generating B2B insights:', error);
    res.status(500).json({ error: 'Failed to generate B2B insights' });
  }
}