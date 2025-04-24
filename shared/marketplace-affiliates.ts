/**
 * Shared Marketplace Affiliates Configuration
 * 
 * This file contains the configuration for supported online marketplaces
 * and their affiliate programs. It is used by both client and server.
 */

export interface MarketplaceAffiliate {
  id: string;
  name: string;
  logoPath: string;
  baseUrl: string;
  primaryRegions: string[];
  secondaryRegions: string[];
  affiliateParam?: string;
  searchEndpoint?: string;
  affiliateBaseUrl?: string;
  commissionRate?: string;
  availableCategories?: string[];
}

export const marketplaceAffiliates: MarketplaceAffiliate[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    logoPath: '/assets/marketplace-logos/amazon.svg',
    baseUrl: 'https://www.amazon.com',
    affiliateBaseUrl: 'https://www.amazon.com/?tag=',
    primaryRegions: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'CA', 'AU'],
    secondaryRegions: ['IN', 'JP', 'MX', 'BR', 'NL', 'AE', 'SA', 'SG'],
    affiliateParam: 'tag',
    searchEndpoint: 'https://www.amazon.com/s',
    commissionRate: '1-10%',
    availableCategories: [
      'Electronics', 'Computers', 'Smart Home', 
      'Home & Kitchen', 'Clothing', 'Beauty', 'Books', 
      'Movies', 'Music', 'Video Games', 'Toys', 'Health'
    ]
  },
  {
    id: 'ebay-uk',
    name: 'eBay UK',
    logoPath: '/assets/marketplace-logos/ebay.svg',
    baseUrl: 'https://www.ebay.co.uk',
    affiliateBaseUrl: 'https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&pub=5575085282&toolid=10001&campid=5338085282&customid=&mpre=',
    primaryRegions: ['UK', 'DE', 'FR', 'IT', 'ES'],
    secondaryRegions: ['US', 'CA', 'AU'],
    affiliateParam: 'campid',
    searchEndpoint: 'https://www.ebay.co.uk/sch/i.html',
    commissionRate: '1-4%',
    availableCategories: [
      'Electronics', 'Fashion', 'Home & Garden', 
      'Sporting Goods', 'Toys & Hobbies', 'Motors', 
      'Business & Industrial', 'Collectibles'
    ]
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    logoPath: '/assets/marketplace-logos/aliexpress.svg',
    baseUrl: 'https://www.aliexpress.com',
    affiliateBaseUrl: 'https://s.click.aliexpress.com/e/_',
    primaryRegions: ['CN', 'RU', 'BR', 'ES', 'PL', 'FR', 'US', 'UK'],
    secondaryRegions: ['KE', 'UG', 'TZ', 'ZA', 'SA', 'AE', 'IN', 'MY', 'PH', 'TH', 'VN', 'ID'],
    searchEndpoint: 'https://www.aliexpress.com/wholesale',
    commissionRate: '4-8%',
    availableCategories: [
      'Consumer Electronics', 'Computer & Office', 
      'Home & Garden', 'Toys & Hobbies', 'Sports & Entertainment', 
      'Beauty & Health', 'Automobiles & Motorcycles', 'Jewelry & Watches'
    ]
  },
  {
    id: 'jumia',
    name: 'Jumia',
    logoPath: '/assets/marketplace-logos/jumia.svg',
    baseUrl: 'https://www.jumia.co.ke',
    affiliateBaseUrl: 'https://kep.jumia.is/aff_c?offer_id=128&aff_id=',
    primaryRegions: ['KE', 'NG', 'EG', 'CI', 'GH', 'UG', 'TZ', 'ZA', 'MA', 'TN', 'SN', 'DZ'],
    secondaryRegions: ['UK', 'US', 'DE', 'FR'],
    affiliateParam: 'aff_id',
    searchEndpoint: 'https://www.jumia.co.ke/catalog/',
    commissionRate: '5-12%',
    availableCategories: [
      'Phones & Tablets', 'Electronics', 'Home & Office', 
      'Groceries', 'Health & Beauty', 'Fashion', 
      'Baby Products', 'Computing', 'Sporting Goods'
    ]
  },
  {
    id: 'kilimall',
    name: 'Kilimall',
    logoPath: '/assets/marketplace-logos/kilimall.svg',
    baseUrl: 'https://www.kilimall.co.ke',
    affiliateBaseUrl: 'https://www.kilimall.co.ke/?utm_source=affiliate&utm_medium=cps&utm_campaign=',
    primaryRegions: ['KE', 'UG', 'NG', 'GH'],
    secondaryRegions: ['TZ', 'ZA'],
    affiliateParam: 'utm_campaign',
    searchEndpoint: 'https://www.kilimall.co.ke/new/commoditysearch/search',
    commissionRate: '5-10%',
    availableCategories: [
      'Phones & Tablets', 'Electronics', 'Fashion', 
      'Home & Living', 'Baby, Kids & Toys', 'Health & Beauty', 
      'Sports & Outdoor', 'Automobiles'
    ]
  }
];

/**
 * Get marketplace affiliation information by ID
 */
export function getMarketplaceById(id: string): MarketplaceAffiliate | undefined {
  return marketplaceAffiliates.find(marketplace => marketplace.id === id);
}

/**
 * Get marketplaces by region
 */
export function getMarketplacesByRegion(region: string): MarketplaceAffiliate[] {
  return marketplaceAffiliates.filter(marketplace => 
    marketplace.primaryRegions.includes(region) || 
    marketplace.secondaryRegions.includes(region)
  );
}

/**
 * Get marketplaces by category
 */
export function getMarketplacesByCategory(category: string): MarketplaceAffiliate[] {
  return marketplaceAffiliates.filter(marketplace => 
    marketplace.availableCategories?.some(cat => 
      cat.toLowerCase().includes(category.toLowerCase())
    )
  );
}

/**
 * Generate an affiliate link for a marketplace product
 */
export function generateAffiliateLink(
  marketplaceId: string, 
  productUrl: string, 
  affiliateId: string
): string {
  const marketplace = getMarketplaceById(marketplaceId);
  
  if (!marketplace) {
    // If marketplace not found, return original URL
    return productUrl;
  }
  
  // Different marketplaces have different affiliate link structures
  switch (marketplaceId) {
    case 'amazon':
      // Amazon uses a simple tag parameter
      const url = new URL(productUrl);
      url.searchParams.set('tag', affiliateId);
      return url.toString();
      
    case 'ebay-uk':
      // eBay uses a redirection system
      return `https://rover.ebay.com/rover/1/710-53481-19255-0/1?ff3=4&pub=5575085282&toolid=10001&campid=${affiliateId}&customid=&mpre=${encodeURIComponent(productUrl)}`;
      
    case 'aliexpress':
      // AliExpress uses a shortened URL system, which would require API integration
      // For now, just return the base affiliate URL + product part
      return `${marketplace.affiliateBaseUrl}${productUrl.split('/').pop()}`;
      
    case 'jumia':
      // Jumia uses an affiliate ID parameter
      return `${marketplace.affiliateBaseUrl}${affiliateId}&url=${encodeURIComponent(productUrl)}`;
      
    case 'kilimall':
      // Kilimall uses UTM parameters
      return `${productUrl}${productUrl.includes('?') ? '&' : '?'}utm_source=affiliate&utm_medium=cps&utm_campaign=${affiliateId}`;
      
    default:
      // For unsupported marketplaces, return original URL
      return productUrl;
  }
}