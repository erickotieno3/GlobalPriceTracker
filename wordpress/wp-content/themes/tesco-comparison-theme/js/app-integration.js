/**
 * Integration with the main application
 * This script connects the WordPress theme with the Node.js backend
 */

class TescoAppIntegration {
    constructor() {
        this.apiBase = '/api';
        this.apiCacheTime = 5 * 60 * 1000; // 5 minutes
        this.init();
    }

    init() {
        // Initialize the integration when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initProductComparison();
            this.initCountrySelector();
            this.initSearchForm();
            this.initNewsletter();
            
            // Load trending deals from the API
            this.loadTrendingDeals();
            
            // Handle Stripe integration (if available)
            if (typeof stripe !== 'undefined' && document.getElementById('payment-form')) {
                this.initStripePayment();
            }
        });
    }

    /**
     * Initialize the product comparison functionality
     */
    initProductComparison() {
        const compareButtons = document.querySelectorAll('.compare-button');
        const compareModal = document.getElementById('compareModal');
        const closeCompareModal = document.getElementById('closeCompareModal');
        
        if (!compareModal) return;
        
        // Close modal functionality
        if (closeCompareModal) {
            closeCompareModal.addEventListener('click', () => {
                compareModal.style.display = 'none';
                document.body.style.overflow = '';
            });
            
            // Close when clicking outside
            compareModal.addEventListener('click', (e) => {
                if (e.target === compareModal) {
                    compareModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Product comparison functionality
        compareButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                if (button.href && button.href.includes('product_id=')) {
                    e.preventDefault();
                    
                    // Extract product ID from URL
                    const url = new URL(button.href);
                    const productId = url.searchParams.get('product_id');
                    
                    if (productId) {
                        compareModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                        
                        // Show loading state
                        const resultsContainer = document.getElementById('compareResults');
                        if (resultsContainer) {
                            resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
                            
                            try {
                                // Fetch comparison data from API
                                const data = await this.fetchComparisonData(productId);
                                this.renderComparisonResults(data, resultsContainer);
                            } catch (error) {
                                resultsContainer.innerHTML = `
                                    <div class="error-message">
                                        <p>Failed to load comparison data. Please try again.</p>
                                    </div>
                                `;
                                console.error('Comparison error:', error);
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * Fetch product comparison data from the API
     */
    async fetchComparisonData(productId) {
        const response = await fetch(`${this.apiBase}/compare?product_id=${productId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch comparison data: ${response.status}`);
        }
        
        return await response.json();
    }

    /**
     * Render comparison results in the modal
     */
    renderComparisonResults(data, container) {
        if (!data || !data.product || !data.prices || !container) {
            container.innerHTML = '<p>No comparison data available</p>';
            return;
        }
        
        let html = `
            <h4>${data.product.title}</h4>
            <div style="margin-top: 16px;">
        `;
        
        // Sort prices from lowest to highest
        const sortedPrices = [...data.prices].sort((a, b) => a.price - b.price);
        
        // Calculate potential savings
        let lowestPrice = sortedPrices.length > 0 ? sortedPrices[0].price : 0;
        let highestPrice = sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1].price : 0;
        let potentialSavings = highestPrice - lowestPrice;
        
        // Render each price row
        sortedPrices.forEach(price => {
            const isLowest = price.price === lowestPrice;
            
            html += `
                <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; ${isLowest ? 'background-color: rgba(0, 120, 215, 0.05);' : ''}">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${price.store.logo ? `<img src="${price.store.logo}" alt="${price.store.name}" style="width: 40px; height: 25px; object-fit: contain;">` : ''}
                        <span>${price.store.name}</span>
                    </div>
                    <div style="font-weight: 600; ${isLowest ? 'color: #0078D7;' : ''}">${price.currency}${price.price.toFixed(2)}</div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add savings information if relevant
        if (potentialSavings > 0 && sortedPrices.length > 1) {
            html += `
                <div style="margin-top: 16px; background-color: #f5f5f5; padding: 12px; border-radius: 8px;">
                    <p style="font-weight: 500;">Save up to <span style="color: #0078D7; font-weight: 700;">${sortedPrices[0].currency}${potentialSavings.toFixed(2)}</span> by shopping at ${sortedPrices[0].store.name}!</p>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    /**
     * Initialize the country selector
     */
    initCountrySelector() {
        const countrySelector = document.querySelector('.country-selector .select-wrapper');
        
        if (countrySelector) {
            countrySelector.addEventListener('click', async () => {
                try {
                    const countries = await this.fetchCountries();
                    this.showCountryDropdown(countries, countrySelector);
                } catch (error) {
                    console.error('Failed to load countries:', error);
                }
            });
        }
    }

    /**
     * Fetch countries from the API
     */
    async fetchCountries() {
        const cachedData = this.getCachedData('countries');
        if (cachedData) return cachedData;
        
        const response = await fetch(`${this.apiBase}/countries`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        
        const data = await response.json();
        this.setCachedData('countries', data);
        
        return data;
    }

    /**
     * Show country dropdown
     */
    showCountryDropdown(countries, targetElement) {
        // Remove any existing dropdown
        const existingDropdown = document.querySelector('.country-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Create dropdown element
        const dropdown = document.createElement('div');
        dropdown.className = 'country-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.right = '0';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        dropdown.style.borderRadius = '8px';
        dropdown.style.marginTop = '4px';
        dropdown.style.zIndex = '100';
        dropdown.style.maxHeight = '300px';
        dropdown.style.overflowY = 'auto';
        
        // Add countries to dropdown
        if (countries && countries.length) {
            countries.forEach(country => {
                const item = document.createElement('div');
                item.className = 'country-item';
                item.style.padding = '12px 16px';
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.gap = '8px';
                item.style.cursor = 'pointer';
                item.style.borderBottom = '1px solid #f0f0f0';
                
                item.innerHTML = `
                    <img src="https://flagcdn.com/w20/${country.slug}.png" 
                         alt="${country.name}" 
                         style="width: 20px; height: 15px; object-fit: cover;">
                    <span>${country.name}</span>
                `;
                
                item.addEventListener('click', () => {
                    this.selectCountry(country, targetElement);
                    dropdown.remove();
                });
                
                dropdown.appendChild(item);
            });
        } else {
            dropdown.innerHTML = '<div style="padding: 12px 16px;">No countries available</div>';
        }
        
        // Add dropdown to the DOM
        targetElement.style.position = 'relative';
        targetElement.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !targetElement.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }

    /**
     * Select a country
     */
    selectCountry(country, targetElement) {
        const flagImage = targetElement.querySelector('.country-flag');
        const countryName = targetElement.querySelector('.country-select span');
        
        if (flagImage && countryName) {
            flagImage.src = `https://flagcdn.com/w20/${country.slug}.png`;
            flagImage.alt = `${country.name} Flag`;
            countryName.textContent = country.name;
            
            // Update stores based on country
            this.updateStoresByCountry(country.id);
        }
    }

    /**
     * Update stores based on selected country
     */
    async updateStoresByCountry(countryId) {
        try {
            const stores = await this.fetchStoresByCountry(countryId);
            this.renderStores(stores);
        } catch (error) {
            console.error('Failed to update stores:', error);
        }
    }

    /**
     * Fetch stores by country
     */
    async fetchStoresByCountry(countryId) {
        const cachedKey = `stores_country_${countryId}`;
        const cachedData = this.getCachedData(cachedKey);
        if (cachedData) return cachedData;
        
        const response = await fetch(`${this.apiBase}/stores?country=${countryId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch stores: ${response.status}`);
        }
        
        const data = await response.json();
        this.setCachedData(cachedKey, data);
        
        return data;
    }

    /**
     * Render stores in the store list
     */
    renderStores(stores) {
        const storeList = document.querySelector('.store-list');
        if (!storeList || !stores || !stores.length) return;
        
        let html = '';
        
        stores.forEach(store => {
            html += `
                <div class="store-card">
                    ${store.logo ? 
                        `<img src="${store.logo}" alt="${store.name}" class="store-logo">` : 
                        `<div class="store-name">${store.name}</div>`
                    }
                </div>
            `;
        });
        
        storeList.innerHTML = html;
    }

    /**
     * Initialize search form
     */
    initSearchForm() {
        const searchForm = document.getElementById('searchForm');
        
        if (searchForm) {
            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const searchInput = searchForm.querySelector('input[name="search"]');
                if (!searchInput || !searchInput.value.trim()) return;
                
                const query = searchInput.value.trim();
                
                try {
                    const results = await this.searchProducts(query);
                    this.renderSearchResults(results);
                } catch (error) {
                    console.error('Search error:', error);
                }
            });
        }
    }

    /**
     * Search products via API
     */
    async searchProducts(query) {
        const response = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
        }
        
        return await response.json();
    }

    /**
     * Render search results
     */
    renderSearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        if (!results || !results.length) {
            resultsContainer.innerHTML = '<p>No results found</p>';
            return;
        }
        
        let html = '<div class="search-results-grid">';
        
        results.forEach(product => {
            html += `
                <div class="product-card">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.title}" class="product-image">` : 
                        '<div class="no-image">No image</div>'
                    }
                    <h3>${product.title}</h3>
                    ${product.price ? `<div class="product-price">${product.price}</div>` : ''}
                    <a href="/compare?product_id=${product.id}" class="compare-link">Compare Prices</a>
                </div>
            `;
        });
        
        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    /**
     * Load trending deals from API
     */
    async loadTrendingDeals() {
        const trendingDealsContainer = document.querySelector('.trending-deals-container');
        if (!trendingDealsContainer) return;
        
        try {
            const deals = await this.fetchTrendingDeals();
            this.renderTrendingDeals(deals, trendingDealsContainer);
        } catch (error) {
            console.error('Failed to load trending deals:', error);
        }
    }

    /**
     * Fetch trending deals
     */
    async fetchTrendingDeals() {
        const cachedData = this.getCachedData('trending_deals');
        if (cachedData) return cachedData;
        
        const response = await fetch(`${this.apiBase}/trending-deals`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch trending deals: ${response.status}`);
        }
        
        const data = await response.json();
        this.setCachedData('trending_deals', data);
        
        return data;
    }

    /**
     * Render trending deals
     */
    renderTrendingDeals(deals, container) {
        if (!deals || !deals.length) return;
        
        let html = '';
        
        deals.forEach(deal => {
            html += `
                <div class="trending-deal">
                    <img src="${deal.image || '/wp-content/themes/tesco-comparison-theme/assets/product-placeholder.svg'}" 
                         alt="${deal.title}" 
                         class="product-image">
                    <div class="product-details">
                        <div class="product-title">${deal.title}</div>
                        <div class="product-price">${deal.price}</div>
                    </div>
                    <a href="/compare?product_id=${deal.id}" class="compare-button" aria-label="Compare Prices">
                        <span class="material-icons">search</span>
                    </a>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    /**
     * Initialize newsletter subscription
     */
    initNewsletter() {
        const newsletterForm = document.getElementById('newsletterForm');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                if (!emailInput || !emailInput.value.trim()) return;
                
                const email = emailInput.value.trim();
                
                try {
                    const result = await this.subscribeToNewsletter(email);
                    
                    if (result.success) {
                        // Show success message
                        const successMessage = document.createElement('div');
                        successMessage.className = 'newsletter-success';
                        successMessage.textContent = 'Thank you for subscribing!';
                        successMessage.style.marginTop = '8px';
                        successMessage.style.color = 'green';
                        
                        newsletterForm.innerHTML = '';
                        newsletterForm.appendChild(successMessage);
                    } else {
                        throw new Error(result.message || 'Subscription failed');
                    }
                } catch (error) {
                    console.error('Newsletter error:', error);
                    
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'newsletter-error';
                    errorMessage.textContent = error.message || 'Failed to subscribe. Please try again.';
                    errorMessage.style.marginTop = '8px';
                    errorMessage.style.color = 'red';
                    
                    // Remove any existing error message
                    const existingError = newsletterForm.querySelector('.newsletter-error');
                    if (existingError) {
                        existingError.remove();
                    }
                    
                    newsletterForm.appendChild(errorMessage);
                }
            });
        }
    }

    /**
     * Subscribe to newsletter
     */
    async subscribeToNewsletter(email) {
        const response = await fetch(`${this.apiBase}/newsletter/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        return await response.json();
    }

    /**
     * Initialize Stripe payment
     */
    initStripePayment() {
        const paymentForm = document.getElementById('payment-form');
        const card = stripe.elements().create('card');
        card.mount('#card-element');
        
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = paymentForm.querySelector('button[type="submit"]');
            const errorElement = document.getElementById('card-errors');
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
            }
            
            try {
                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: card,
                });
                
                if (error) {
                    throw error;
                }
                
                // Send payment method ID to server
                const response = await fetch(`${this.apiBase}/payment/process`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment_method_id: paymentMethod.id,
                        amount: document.getElementById('payment-amount').value,
                        currency: 'usd',
                    }),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    window.location.href = result.redirect;
                } else {
                    throw new Error(result.message || 'Payment failed');
                }
            } catch (error) {
                console.error('Payment error:', error);
                
                if (errorElement) {
                    errorElement.textContent = error.message || 'An error occurred during payment. Please try again.';
                    errorElement.style.display = 'block';
                }
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Pay Now';
                }
            }
        });
    }

    /**
     * Get cached data
     */
    getCachedData(key) {
        const cachedItem = localStorage.getItem(`tesco_cache_${key}`);
        
        if (!cachedItem) return null;
        
        try {
            const { data, timestamp } = JSON.parse(cachedItem);
            
            // Check if cache is still valid
            if (Date.now() - timestamp < this.apiCacheTime) {
                return data;
            }
            
            // Cache expired
            localStorage.removeItem(`tesco_cache_${key}`);
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Set cached data
     */
    setCachedData(key, data) {
        const cacheItem = {
            data,
            timestamp: Date.now(),
        };
        
        localStorage.setItem(`tesco_cache_${key}`, JSON.stringify(cacheItem));
    }
}

// Initialize the app integration
const appIntegration = new TescoAppIntegration();