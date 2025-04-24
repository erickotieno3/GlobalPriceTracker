/**
 * Affiliate Marketing Service
 * 
 * This file provides utilities for handling affiliate links and tracking
 * for all supported retailers in the Tesco Price Comparison platform.
 */

// Store-specific affiliate IDs
// These would be your actual affiliate IDs from each retailer program
interface AffiliateIds {
  [key: string]: string;
}

const AFFILIATE_IDS: AffiliateIds = {
  tesco: 'TESCO_AFFILIATE_ID',
  carrefour: 'CARREFOUR_AFFILIATE_ID',
  aldi: 'ALDI_AFFILIATE_ID',
  walmart: 'WALMART_AFFILIATE_ID',
  sainsburys: 'SAINSBURYS_AFFILIATE_ID',
  lidl: 'LIDL_AFFILIATE_ID',
  coles: 'COLES_AFFILIATE_ID',
  woolworths: 'WOOLWORTHS_AFFILIATE_ID',
  nakumatt: 'NAKUMATT_AFFILIATE_ID'
};

// Import analytics for tracking
import analytics from './analytics';

/**
 * Generate an affiliate link for a specific store and product
 * 
 * @param storeName The name of the store (e.g., 'tesco')
 * @param productId The ID of the product in our system
 * @param productUrl The direct URL to the product on the retailer's site
 * @returns Affiliate tracking URL
 */
export const getAffiliateUrl = (
  storeName: string,
  productId: number | string,
  productUrl: string
): string => {
  const store = storeName.toLowerCase();
  const affiliateId = AFFILIATE_IDS[store] || '';
  
  if (!affiliateId) {
    console.warn(`No affiliate ID configured for store: ${storeName}`);
    return productUrl;
  }
  
  // Different stores have different affiliate URL patterns
  switch (store) {
    case 'tesco':
      // Example: https://www.tesco.com/groceries/product/12345?affid=TESCO_AFFILIATE_ID
      return `${productUrl}${productUrl.includes('?') ? '&' : '?'}affid=${affiliateId}&utm_source=tescocomparison&utm_medium=affiliate&utm_campaign=price_comparison`;
      
    case 'walmart':
      // Example: https://www.walmart.com/ip/12345?affp=WALMART_AFFILIATE_ID
      return `${productUrl}${productUrl.includes('?') ? '&' : '?'}affp=${affiliateId}&utm_source=tescocomparison&utm_medium=affiliate`;

    case 'carrefour':
      // Example for Carrefour's affiliate program
      return `${productUrl}${productUrl.includes('?') ? '&' : '?'}partner=${affiliateId}&utm_source=tescocomparison`;
      
    // Add more retailers with their specific URL patterns
    default:
      // Generic pattern that works for most affiliate networks
      return `${productUrl}${productUrl.includes('?') ? '&' : '?'}aff=${affiliateId}&utm_source=tescocomparison`;
  }
};

/**
 * Track an affiliate link click
 * 
 * @param storeName The name of the store
 * @param productId The ID of the product
 * @param productName The name of the product
 * @returns The tracking URL
 */
export const trackAffiliateClick = (
  storeName: string,
  productId: number | string,
  productName: string,
  productUrl: string
): string => {
  // Track the click in analytics
  analytics.trackAffiliateClick(storeName, typeof productId === 'string' ? parseInt(productId, 10) : productId, productName);
  
  // Return the affiliate URL
  return getAffiliateUrl(storeName, productId, productUrl);
};

/**
 * Affiliate link component props for React
 */
export interface AffiliateClickProps {
  storeName: string;
  productId: number | string;
  productName: string;
  productUrl: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Check if all required affiliate IDs are configured
 * 
 * @returns Boolean indicating if all stores have affiliate IDs
 */
export const areAffiliateIdsConfigured = (): boolean => {
  return Object.values(AFFILIATE_IDS).every(id => id && id !== 'PLACEHOLDER' && !id.includes('_AFFILIATE_ID'));
};

/**
 * Get a warning message if affiliate IDs are not properly configured
 */
export const getAffiliateConfigWarning = (): string | null => {
  if (!areAffiliateIdsConfigured()) {
    return 'Some affiliate IDs are not configured. Affiliate links may not be properly tracked.';
  }
  return null;
};

export default {
  getAffiliateUrl,
  trackAffiliateClick,
  areAffiliateIdsConfigured,
  getAffiliateConfigWarning
};