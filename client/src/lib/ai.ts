/**
 * AI Services for Tesco Compare
 * 
 * This module provides AI-powered features for the application including:
 * - Smart product recommendations
 * - Natural language search
 * - Personalized shopping insights
 * - Price trend analysis
 */

/**
 * Get AI-powered product recommendations based on user preferences and shopping history
 */
export async function getProductRecommendations(userId?: string, productId?: number, category?: string) {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (productId) params.append('productId', productId.toString());
    if (category) params.append('category', category);
    
    const response = await fetch(`/api/ai/recommendations?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching recommendations: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get AI recommendations:', error);
    return { 
      recommendations: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Search products using natural language
 */
export async function naturalLanguageSearch(query: string, country?: string) {
  try {
    const params = new URLSearchParams({
      query,
      ...(country && { country })
    });
    
    const response = await fetch(`/api/ai/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error performing search: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to perform AI search:', error);
    return { 
      results: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get AI-powered insights on price trends for a product
 */
export async function getPriceTrendInsights(productId: number) {
  try {
    const response = await fetch(`/api/ai/price-insights/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching price insights: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get price insights:', error);
    return { 
      insights: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate a personalized shopping guide for a user
 */
export async function getPersonalizedShoppingGuide(userId: string) {
  try {
    const response = await fetch(`/api/ai/shopping-guide/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Error generating shopping guide: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to generate shopping guide:', error);
    return { 
      guide: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Analyze product descriptions to extract key features
 */
export async function extractProductFeatures(description: string) {
  try {
    const response = await fetch('/api/ai/extract-features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    
    if (!response.ok) {
      throw new Error(`Error extracting features: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to extract product features:', error);
    return { 
      features: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Compare two products and generate a detailed comparison
 */
export async function compareProductsAI(product1Id: number, product2Id: number) {
  try {
    const response = await fetch(`/api/ai/compare-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product1Id, product2Id }),
    });
    
    if (!response.ok) {
      throw new Error(`Error comparing products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to compare products:', error);
    return { 
      comparison: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}