/**
 * Marketplace Affiliate Programs Configuration
 * 
 * This file contains the configuration for various online marketplace
 * affiliate programs including tracking IDs, links formats, and commission rates.
 */

export interface MarketplaceAffiliate {
  id: string;
  name: string;
  logo: string;
  baseUrl: string;
  affiliateIdParam: string; // The URL parameter for the affiliate ID
  defaultCommissionRate: number; // As a percentage
  cookieDuration: number; // In days
  minPayoutAmount: number;
  paymentMethods: string[];
  regions: string[];
  programUrl: string; // URL to sign up for the affiliate program
  categories: string[];
  searchEndpoint?: string; // API endpoint for product search if available
  apiKey?: string; // API key parameter name if applicable
}

export const marketplaceAffiliates: MarketplaceAffiliate[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '/assets/marketplace-logos/amazon.svg',
    baseUrl: 'https://www.amazon.com',
    affiliateIdParam: 'tag',
    defaultCommissionRate: 4.5,
    cookieDuration: 24,
    minPayoutAmount: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card', 'Check'],
    regions: ['Global', 'US', 'UK', 'Canada', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'Australia'],
    programUrl: 'https://affiliate-program.amazon.com/',
    categories: ['Electronics', 'Home & Kitchen', 'Books', 'Fashion', 'Beauty', 'Toys', 'Sports & Outdoors'],
    searchEndpoint: '/s',
  },
  {
    id: 'ebay-uk',
    name: 'eBay UK',
    logo: '/assets/marketplace-logos/ebay.svg',
    baseUrl: 'https://www.ebay.co.uk',
    affiliateIdParam: 'customid',
    defaultCommissionRate: 3.0,
    cookieDuration: 24,
    minPayoutAmount: 10,
    paymentMethods: ['Direct Deposit', 'PayPal'],
    regions: ['UK', 'Europe'],
    programUrl: 'https://partnernetwork.ebay.co.uk/',
    categories: ['Electronics', 'Fashion', 'Home & Garden', 'Sporting Goods', 'Toys & Hobbies', 'Business & Industrial'],
    searchEndpoint: '/sch/i.html',
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    logo: '/assets/marketplace-logos/aliexpress.svg',
    baseUrl: 'https://www.aliexpress.com',
    affiliateIdParam: 'aff_platform',
    defaultCommissionRate: 8.0,
    cookieDuration: 30,
    minPayoutAmount: 15,
    paymentMethods: ['Bank Transfer', 'PayPal', 'Wire Transfer'],
    regions: ['Global', 'China', 'Asia', 'Europe', 'Africa'],
    programUrl: 'https://portals.aliexpress.com/',
    categories: ['Consumer Electronics', 'Home & Garden', 'Apparel', 'Beauty & Health', 'Toys & Hobbies', 'Sports & Entertainment'],
    searchEndpoint: '/wholesale',
  },
  {
    id: 'jumia',
    name: 'Jumia',
    logo: '/assets/marketplace-logos/jumia.svg',
    baseUrl: 'https://www.jumia.co.ke',
    affiliateIdParam: 'ref',
    defaultCommissionRate: 11.0,
    cookieDuration: 30,
    minPayoutAmount: 50,
    paymentMethods: ['Bank Transfer', 'Mobile Money'],
    regions: ['Kenya', 'Nigeria', 'Egypt', 'Morocco', 'Ivory Coast', 'Ghana', 'Uganda', 'Tanzania', 'Algeria', 'Senegal'],
    programUrl: 'https://affiliates.jumia.com/',
    categories: ['Phones & Tablets', 'Electronics', 'Computing', 'Home & Office', 'Fashion', 'Health & Beauty', 'Baby Products', 'Sports & Fitness'],
    searchEndpoint: '/catalog/',
  },
  {
    id: 'kilimall',
    name: 'Kilimall',
    logo: '/assets/marketplace-logos/kilimall.svg',
    baseUrl: 'https://www.kilimall.co.ke',
    affiliateIdParam: 'cps_source',
    defaultCommissionRate: 10.0,
    cookieDuration: 30,
    minPayoutAmount: 30,
    paymentMethods: ['M-Pesa', 'Bank Transfer'],
    regions: ['Kenya', 'Uganda', 'Nigeria'],
    programUrl: 'https://www.kilimall.co.ke/new/affiliate',
    categories: ['Phones & Tablets', 'Computing', 'Electronics', 'Fashion', 'Home & Living', 'Health & Beauty', 'Baby, Kids & Toys'],
    searchEndpoint: '/classification',
  }
];

/**
 * Generate an affiliate link for a specific marketplace
 * 
 * @param marketplaceId The ID of the marketplace
 * @param productLink The original product link
 * @param affiliateId Your affiliate ID for the marketplace
 * @returns Formatted affiliate link
 */
export function generateAffiliateLink(marketplaceId: string, productLink: string, affiliateId: string): string {
  const marketplace = marketplaceAffiliates.find(m => m.id === marketplaceId);
  
  if (!marketplace) {
    return productLink; // Return original link if marketplace not found
  }
  
  // Check if the link already has query parameters
  const hasQueryParams = productLink.includes('?');
  const separator = hasQueryParams ? '&' : '?';
  
  // Add affiliate parameter
  return `${productLink}${separator}${marketplace.affiliateIdParam}=${affiliateId}`;
}

/**
 * Calculate commission for a given marketplace and amount
 * 
 * @param marketplaceId The ID of the marketplace
 * @param amount The purchase amount
 * @returns The expected commission amount
 */
export function calculateCommission(marketplaceId: string, amount: number): number {
  const marketplace = marketplaceAffiliates.find(m => m.id === marketplaceId);
  
  if (!marketplace) {
    return 0;
  }
  
  return (amount * marketplace.defaultCommissionRate) / 100;
}

/**
 * Get marketplace by region/country
 * 
 * @param region The region or country code
 * @returns Array of marketplaces available in that region
 */
export function getMarketplacesByRegion(region: string): MarketplaceAffiliate[] {
  return marketplaceAffiliates.filter(marketplace => 
    marketplace.regions.some(r => r.toLowerCase() === region.toLowerCase())
  );
}

/**
 * Get marketplace by category
 * 
 * @param category The product category
 * @returns Array of marketplaces that support that category
 */
export function getMarketplacesByCategory(category: string): MarketplaceAffiliate[] {
  return marketplaceAffiliates.filter(marketplace => 
    marketplace.categories.some(c => c.toLowerCase() === category.toLowerCase())
  );
}