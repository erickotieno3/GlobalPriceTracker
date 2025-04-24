/**
 * Online Marketplace Routes
 *
 * This file contains routes for integrating with various online marketplaces
 * including Amazon, eBay, AliExpress, Jumia, and Kilimall.
 */

import { Router, Request, Response } from 'express';
import { getMarketplacesByRegion, getMarketplacesByCategory, generateAffiliateLink, marketplaceAffiliates } from '../shared/marketplace-affiliates';
import axios from 'axios';
import { storage } from './storage';

const marketplaceRouter = Router();

// Environment variables for marketplace API keys
const AMAZON_API_KEY = process.env.AMAZON_API_KEY || '';
const EBAY_API_KEY = process.env.EBAY_API_KEY || '';
const ALIEXPRESS_API_KEY = process.env.ALIEXPRESS_API_KEY || '';
const JUMIA_API_KEY = process.env.JUMIA_API_KEY || '';
const KILIMALL_API_KEY = process.env.KILIMALL_API_KEY || '';

// Track affiliate clicks and potential conversions
interface AffiliateClick {
  id: string;
  marketplaceId: string;
  productLink: string;
  timestamp: Date;
  userIp: string;
  userAgent: string;
  referrer: string;
  converted: boolean;
  conversionAmount?: number;
  conversionDate?: Date;
}

// In-memory storage for affiliate clicks (move to database in production)
const affiliateClicks: AffiliateClick[] = [];

/**
 * Get all supported marketplaces
 */
marketplaceRouter.get('/marketplaces', (req: Request, res: Response) => {
  // Return list of all supported marketplaces
  res.json({
    success: true,
    data: marketplaceAffiliates.map(marketplace => ({
      id: marketplace.id,
      name: marketplace.name,
      logo: marketplace.logo,
      regions: marketplace.regions,
      categories: marketplace.categories,
      programUrl: marketplace.programUrl,
    }))
  });
});

/**
 * Get marketplaces by region
 */
marketplaceRouter.get('/marketplaces/region/:region', (req: Request, res: Response) => {
  const { region } = req.params;
  const marketplaces = getMarketplacesByRegion(region);
  
  res.json({
    success: true,
    data: marketplaces.map(marketplace => ({
      id: marketplace.id,
      name: marketplace.name,
      logo: marketplace.logo,
      categories: marketplace.categories,
      programUrl: marketplace.programUrl,
    }))
  });
});

/**
 * Get marketplaces by category
 */
marketplaceRouter.get('/marketplaces/category/:category', (req: Request, res: Response) => {
  const { category } = req.params;
  const marketplaces = getMarketplacesByCategory(category);
  
  res.json({
    success: true,
    data: marketplaces.map(marketplace => ({
      id: marketplace.id,
      name: marketplace.name,
      logo: marketplace.logo,
      regions: marketplace.regions,
      programUrl: marketplace.programUrl,
    }))
  });
});

/**
 * Generate an affiliate link for a marketplace product
 */
marketplaceRouter.post('/affiliate/link', (req: Request, res: Response) => {
  const { marketplaceId, productLink, affiliateId } = req.body;
  
  if (!marketplaceId || !productLink) {
    return res.status(400).json({
      success: false,
      message: 'Marketplace ID and product link are required'
    });
  }
  
  // Use default affiliate ID if not provided
  const affId = affiliateId || getDefaultAffiliateId(marketplaceId);
  
  const affiliateLink = generateAffiliateLink(marketplaceId, productLink, affId);
  
  res.json({
    success: true,
    data: {
      originalLink: productLink,
      affiliateLink: affiliateLink,
      marketplace: marketplaceId
    }
  });
});

/**
 * Track an affiliate link click
 */
marketplaceRouter.post('/affiliate/click', (req: Request, res: Response) => {
  const { marketplaceId, productLink } = req.body;
  
  if (!marketplaceId || !productLink) {
    return res.status(400).json({
      success: false,
      message: 'Marketplace ID and product link are required'
    });
  }
  
  // Get user information for tracking
  const userIp = req.ip || '0.0.0.0';
  const userAgent = req.headers['user-agent'] || '';
  const referrer = req.headers.referer || req.headers.referrer || '';
  
  // Generate a unique ID for this click
  const clickId = generateClickId();
  
  // Store the click information
  const click: AffiliateClick = {
    id: clickId,
    marketplaceId,
    productLink,
    timestamp: new Date(),
    userIp,
    userAgent,
    referrer,
    converted: false
  };
  
  affiliateClicks.push(click);
  
  // Return the click ID for potential conversion tracking
  res.json({
    success: true,
    data: {
      clickId,
      timestamp: click.timestamp
    }
  });
});

/**
 * Record a marketplace conversion (usually called by webhook)
 */
marketplaceRouter.post('/affiliate/conversion', (req: Request, res: Response) => {
  const { clickId, amount } = req.body;
  
  if (!clickId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Click ID and conversion amount are required'
    });
  }
  
  // Find the click record
  const clickIndex = affiliateClicks.findIndex(click => click.id === clickId);
  
  if (clickIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Click record not found'
    });
  }
  
  // Update the click record with conversion information
  affiliateClicks[clickIndex].converted = true;
  affiliateClicks[clickIndex].conversionAmount = parseFloat(amount);
  affiliateClicks[clickIndex].conversionDate = new Date();
  
  res.json({
    success: true,
    data: {
      clickId,
      conversionDate: affiliateClicks[clickIndex].conversionDate,
      amount: affiliateClicks[clickIndex].conversionAmount
    }
  });
});

/**
 * Search products across multiple marketplaces
 */
marketplaceRouter.get('/search', async (req: Request, res: Response) => {
  const { query, marketplaces, category, maxPrice, minPrice } = req.query;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }
  
  try {
    // Parse the marketplaces parameter
    let marketplacesList: string[] = [];
    
    if (marketplaces) {
      if (typeof marketplaces === 'string') {
        marketplacesList = marketplaces.split(',');
      } else if (Array.isArray(marketplaces)) {
        marketplacesList = marketplaces.map(m => String(m));
      }
    } else {
      // Default to all marketplaces if none specified
      marketplacesList = marketplaceAffiliates.map(m => m.id);
    }
    
    // Prepare search promises for each marketplace
    const searchPromises = marketplacesList.map(marketplaceId => 
      searchMarketplace(marketplaceId, query as string, category as string, 
                       minPrice ? parseFloat(minPrice as string) : undefined, 
                       maxPrice ? parseFloat(maxPrice as string) : undefined)
    );
    
    // Execute all searches in parallel
    const results = await Promise.allSettled(searchPromises);
    
    // Combine and format the results
    const successfulResults = results
      .filter(result => result.status === 'fulfilled')
      .map((result: any) => result.value)
      .flat();
    
    res.json({
      success: true,
      data: successfulResults
    });
  } catch (error: any) {
    console.error('Error searching marketplaces:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products across marketplaces',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Get affiliate statistics
 */
marketplaceRouter.get('/affiliate/stats', (req: Request, res: Response) => {
  // Count clicks and conversions
  const totalClicks = affiliateClicks.length;
  const conversions = affiliateClicks.filter(click => click.converted);
  const totalConversions = conversions.length;
  
  // Calculate conversion rate
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  
  // Calculate total revenue
  const totalRevenue = conversions.reduce((sum, click) => sum + (click.conversionAmount || 0), 0);
  
  // Group by marketplace
  const marketplaceStats = marketplaceAffiliates.map(marketplace => {
    const marketplaceClicks = affiliateClicks.filter(click => click.marketplaceId === marketplace.id);
    const marketplaceConversions = marketplaceClicks.filter(click => click.converted);
    
    return {
      id: marketplace.id,
      name: marketplace.name,
      clicks: marketplaceClicks.length,
      conversions: marketplaceConversions.length,
      revenue: marketplaceConversions.reduce((sum, click) => sum + (click.conversionAmount || 0), 0),
      conversionRate: marketplaceClicks.length > 0 ? 
        (marketplaceConversions.length / marketplaceClicks.length) * 100 : 0
    };
  });
  
  res.json({
    success: true,
    data: {
      totalClicks,
      totalConversions,
      conversionRate,
      totalRevenue,
      marketplaces: marketplaceStats
    }
  });
});

// Helper functions

/**
 * Search for products in a specific marketplace
 */
async function searchMarketplace(
  marketplaceId: string, 
  query: string, 
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<any[]> {
  const marketplace = marketplaceAffiliates.find(m => m.id === marketplaceId);
  
  if (!marketplace || !marketplace.searchEndpoint) {
    return [];
  }
  
  // For now, we'll return mock data since actual API integration would require
  // specific API keys and marketplace-specific implementations
  
  // In a real implementation, you would make API calls to the respective marketplace APIs
  // and transform the results into a common format
  
  // For example, this would be the actual API call to Amazon:
  // const response = await axios.get(`https://api.amazon.com/v1/search`, {
  //   params: { q: query, category, min_price: minPrice, max_price: maxPrice },
  //   headers: { 'Authorization': `Bearer ${AMAZON_API_KEY}` }
  // });
  
  // For now, return an empty array so the endpoint works
  return [];
}

/**
 * Get the default affiliate ID for a marketplace
 * In production, these would be stored in environment variables or the database
 */
function getDefaultAffiliateId(marketplaceId: string): string {
  switch (marketplaceId) {
    case 'amazon':
      return process.env.AMAZON_AFFILIATE_ID || 'tesco-price-comparison-20';
    case 'ebay-uk':
      return process.env.EBAY_AFFILIATE_ID || 'tesco-compare';
    case 'aliexpress':
      return process.env.ALIEXPRESS_AFFILIATE_ID || 'tesco-compare';
    case 'jumia':
      return process.env.JUMIA_AFFILIATE_ID || 'tesco-compare';
    case 'kilimall':
      return process.env.KILIMALL_AFFILIATE_ID || 'tesco-compare';
    default:
      return 'tesco-compare';
  }
}

/**
 * Generate a unique ID for click tracking
 */
function generateClickId(): string {
  return `click_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default marketplaceRouter;