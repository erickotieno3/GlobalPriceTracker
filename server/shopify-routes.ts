/**
 * Shopify Integration Routes
 * 
 * This file contains routes for interacting with Shopify stores
 * and managing the Shopify integration.
 */

import { Router, Request, Response } from 'express';
import { getShopifyIntegration, initializeShopifyIntegration } from './shopify-integration';
import { db } from './db';
import { stores, products, productPrices } from '@shared/schema';
import { eq, and, desc, like } from 'drizzle-orm';
import { z } from 'zod';

export const shopifyRouter = Router();

// Schema for adding a Shopify store
const addShopifyStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  shopDomain: z.string().min(1, "Shopify domain is required"),
  accessToken: z.string().min(1, "Access token is required"),
  countryId: z.number().int().positive("Country ID must be a positive integer"),
  logoUrl: z.string().url().optional(),
});

/**
 * Add a new Shopify store
 */
shopifyRouter.post('/stores', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = addShopifyStoreSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid store data',
        details: validationResult.error.format() 
      });
    }
    
    const storeData = validationResult.data;
    
    // Add store using Shopify integration
    const shopifyIntegration = getShopifyIntegration();
    const storeId = await shopifyIntegration.addShopifyStore(storeData);
    
    res.status(201).json({ 
      success: true, 
      storeId,
      message: `Added Shopify store: ${storeData.name}`
    });
  } catch (error) {
    console.error('Failed to add Shopify store:', error);
    res.status(500).json({ 
      error: 'Failed to add Shopify store',
      message: error.message 
    });
  }
});

/**
 * List all Shopify stores
 */
shopifyRouter.get('/stores', async (req: Request, res: Response) => {
  try {
    const shopifyStores = await db
      .select()
      .from(stores)
      .where(eq(stores.type, 'shopify'));
    
    // Remove sensitive info like API keys
    const safeStores = shopifyStores.map(store => ({
      id: store.id,
      name: store.name,
      domain: store.apiUrl.replace('https://', '').replace('/', ''),
      countryId: store.countryId,
      logoUrl: store.logoUrl,
      active: store.active,
      lastUpdated: store.updatedAt,
    }));
    
    res.json(safeStores);
  } catch (error) {
    console.error('Failed to fetch Shopify stores:', error);
    res.status(500).json({ error: 'Failed to fetch Shopify stores' });
  }
});

/**
 * Start a sync for all Shopify stores
 */
shopifyRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const shopifyIntegration = getShopifyIntegration();
    
    // Start the sync process asynchronously
    res.status(202).json({ 
      success: true,
      message: 'Shopify sync started'
    });
    
    // Perform sync after sending response to avoid timeout
    shopifyIntegration.fetchAllStoreProducts()
      .then(count => {
        console.log(`Synced ${count} products from Shopify stores`);
      })
      .catch(error => {
        console.error('Error during Shopify sync:', error);
      });
  } catch (error) {
    console.error('Failed to start Shopify sync:', error);
    res.status(500).json({ 
      error: 'Failed to start Shopify sync',
      message: error.message 
    });
  }
});

/**
 * Get products from Shopify stores with pagination
 */
shopifyRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '20');
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search as string || '';
    
    // Query products from Shopify source
    let query = db
      .select({
        product: products,
        store: stores,
        price: productPrices,
      })
      .from(products)
      .innerJoin(productPrices, eq(products.id, productPrices.productId))
      .innerJoin(stores, eq(productPrices.storeId, stores.id))
      .where(eq(products.source, 'shopify'))
      .orderBy(desc(products.updatedAt))
      .limit(limit)
      .offset(offset);
    
    // Add search filter if provided
    if (searchTerm) {
      query = query.where(like(products.name, `%${searchTerm}%`));
    }
    
    const results = await query;
    
    // Format results
    const formattedProducts = results.map(item => ({
      id: item.product.id,
      name: item.product.name,
      description: item.product.description,
      imageUrl: item.product.imageUrl,
      price: item.price.price,
      currency: item.price.currency,
      inStock: item.price.inStock,
      onSale: item.price.onSale,
      originalPrice: item.price.originalPrice,
      storeName: item.store.name,
      storeLogoUrl: item.store.logoUrl,
      lastUpdated: item.price.lastChecked,
    }));
    
    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: db.fn.count(products.id) })
      .from(products)
      .where(eq(products.source, 'shopify'));
    
    res.json({
      products: formattedProducts,
      pagination: {
        total: Number(count),
        page,
        limit,
        pages: Math.ceil(Number(count) / limit),
      }
    });
  } catch (error) {
    console.error('Failed to fetch Shopify products:', error);
    res.status(500).json({ error: 'Failed to fetch Shopify products' });
  }
});

/**
 * Get detailed information about a single product
 */
shopifyRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Get product details
    const [productDetail] = await db
      .select({
        product: products,
        store: stores,
        price: productPrices,
      })
      .from(products)
      .innerJoin(productPrices, eq(products.id, productPrices.productId))
      .innerJoin(stores, eq(productPrices.storeId, stores.id))
      .where(
        and(
          eq(products.source, 'shopify'),
          eq(products.id, productId)
        )
      );
    
    if (!productDetail) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Format response
    const formattedProduct = {
      id: productDetail.product.id,
      name: productDetail.product.name,
      description: productDetail.product.description,
      imageUrl: productDetail.product.imageUrl,
      price: productDetail.price.price,
      currency: productDetail.price.currency,
      inStock: productDetail.price.inStock,
      onSale: productDetail.price.onSale,
      originalPrice: productDetail.price.originalPrice,
      storeName: productDetail.store.name,
      storeLogoUrl: productDetail.store.logoUrl,
      storeUrl: productDetail.price.url,
      attributes: JSON.parse(productDetail.product.attributes || '{}'),
      lastUpdated: productDetail.price.lastChecked,
    };
    
    res.json(formattedProduct);
  } catch (error) {
    console.error(`Failed to fetch Shopify product:`, error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

/**
 * Compare prices between Shopify and other sources
 */
shopifyRouter.get('/compare', async (req: Request, res: Response) => {
  try {
    const productName = req.query.name as string;
    
    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    
    // Find similar products by name
    const similarProducts = await db
      .select({
        product: products,
        store: stores,
        price: productPrices,
      })
      .from(products)
      .innerJoin(productPrices, eq(products.id, productPrices.productId))
      .innerJoin(stores, eq(productPrices.storeId, stores.id))
      .where(like(products.name, `%${productName}%`))
      .orderBy(productPrices.price);
    
    if (similarProducts.length === 0) {
      return res.status(404).json({ 
        error: 'No matching products found',
        message: `No products matching "${productName}" were found`
      });
    }
    
    // Group by source (shopify vs others)
    const shopifyProducts = similarProducts.filter(p => p.product.source === 'shopify');
    const otherProducts = similarProducts.filter(p => p.product.source !== 'shopify');
    
    // Format comparison results
    const comparison = {
      query: productName,
      shopifyProducts: shopifyProducts.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price.price,
        currency: item.price.currency,
        storeName: item.store.name,
        source: 'shopify',
      })),
      otherStoreProducts: otherProducts.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price.price,
        currency: item.price.currency,
        storeName: item.store.name,
        source: item.product.source,
      })),
      priceDifference: shopifyProducts.length > 0 && otherProducts.length > 0 
        ? {
            lowestShopifyPrice: Math.min(...shopifyProducts.map(p => p.price.price)),
            lowestOtherPrice: Math.min(...otherProducts.map(p => p.price.price)),
            percentageDifference: calculatePercentageDifference(
              Math.min(...shopifyProducts.map(p => p.price.price)),
              Math.min(...otherProducts.map(p => p.price.price))
            )
          }
        : null
    };
    
    res.json(comparison);
  } catch (error) {
    console.error('Failed to compare products:', error);
    res.status(500).json({ error: 'Failed to compare products' });
  }
});

/**
 * Helper function to calculate percentage difference between two prices
 */
function calculatePercentageDifference(price1: number, price2: number): number {
  if (price1 === 0 || price2 === 0) return 0;
  
  const diff = ((price1 - price2) / price2) * 100;
  return parseFloat(diff.toFixed(2));
}