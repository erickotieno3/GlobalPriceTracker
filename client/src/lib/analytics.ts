/**
 * Google Analytics Integration
 * 
 * This file provides functions for tracking user interactions and events
 * with Google Analytics 4 (GA4).
 */

// Define event types for type safety
export type AnalyticsEvent = 
  | 'page_view'
  | 'product_view'
  | 'store_view'
  | 'price_comparison'
  | 'app_download'
  | 'affiliate_click'
  | 'newsletter_signup'
  | 'search'
  | 'country_selection'
  | 'language_selection';

// Define event parameters for different event types
export interface AnalyticsEventParams {
  // Common parameters
  [key: string]: any;
  
  // Specific typings for known parameters
  product_id?: number;
  product_name?: string;
  store_id?: number;
  store_name?: string;
  country_code?: string;
  country_name?: string;
  language_code?: string;
  category_id?: number;
  category_name?: string;
  search_term?: string;
  platform?: 'web' | 'android' | 'ios';
  price?: number;
  currency?: string;
  affiliate_store?: string;
}

/**
 * Initialize Google Analytics
 * 
 * Call this function once when the application loads
 * @param measurementId Your GA4 measurement ID (G-XXXXXXXX)
 */
export const initializeAnalytics = (measurementId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Add Google Analytics script to page
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  // Configure GA with your measurement ID
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false // We'll track page views manually
  });
  
  console.log('Google Analytics initialized with ID:', measurementId);
};

/**
 * Track a page view event
 * 
 * @param path The page path (e.g., '/products/123')
 * @param title The page title
 */
export const trackPageView = (path: string, title: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href
  });
};

/**
 * Track a custom event
 * 
 * @param eventName The name of the event to track
 * @param params Additional parameters for the event
 */
export const trackEvent = (
  eventName: AnalyticsEvent, 
  params: AnalyticsEventParams = {}
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', eventName, params);
};

/**
 * Track an affiliate link click
 * 
 * @param storeName The name of the store (e.g., 'Tesco')
 * @param productId Optional product ID if click is product-specific
 * @param productName Optional product name if click is product-specific
 */
export const trackAffiliateClick = (
  storeName: string, 
  productId?: number, 
  productName?: string
): void => {
  trackEvent('affiliate_click', {
    affiliate_store: storeName,
    product_id: productId,
    product_name: productName,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track app download clicks
 * 
 * @param platform 'android' or 'ios'
 */
export const trackAppDownload = (platform: 'android' | 'ios'): void => {
  trackEvent('app_download', {
    platform,
    timestamp: new Date().toISOString()
  });
};

/**
 * Set user properties (for logged-in users)
 * 
 * @param userId Unique identifier for the user
 * @param properties Additional user properties
 */
export const setUserProperties = (
  userId: string, 
  properties: Record<string, any> = {}
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Set user ID for cross-platform tracking
  window.gtag('set', 'user_id', userId);
  
  // Set custom user properties
  window.gtag('set', 'user_properties', properties);
};

// Add type definitions for the window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackAffiliateClick,
  trackAppDownload,
  setUserProperties
};