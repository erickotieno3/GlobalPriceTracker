<?php
/**
 * API Integration functions
 * This file contains functions to integrate WordPress with the Node.js backend API
 *
 * @package Tesco_Comparison
 */

/**
 * Define API constants
 */
define('TESCO_API_URL', 'http://localhost:5000/api');
define('TESCO_API_CACHE_TIME', 5 * MINUTE_IN_SECONDS);

/**
 * Fetch data from the API
 *
 * @param string $endpoint The API endpoint to fetch from.
 * @param array  $params   The parameters to include in the request.
 * @param string $method   The HTTP method to use (GET, POST, etc.).
 * @param array  $body     The request body for POST requests.
 * @return array|WP_Error The API response or error.
 */
function tesco_fetch_from_api($endpoint, $params = array(), $method = 'GET', $body = array()) {
    // Build request URL
    $url = TESCO_API_URL . '/' . ltrim($endpoint, '/');
    
    if (!empty($params) && $method === 'GET') {
        $url = add_query_arg($params, $url);
    }
    
    // Build request args
    $args = array(
        'method' => $method,
        'timeout' => 30,
        'redirection' => 5,
        'httpversion' => '1.1',
        'blocking' => true,
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
    );
    
    if (!empty($body) && $method !== 'GET') {
        $args['body'] = json_encode($body);
    }
    
    // Make the request
    $response = wp_remote_request($url, $args);
    
    // Check for errors
    if (is_wp_error($response)) {
        return $response;
    }
    
    // Get response code
    $response_code = wp_remote_retrieve_response_code($response);
    
    if ($response_code !== 200) {
        return new WP_Error(
            'api_error',
            sprintf('API request failed with code %d', $response_code),
            array('status' => $response_code)
        );
    }
    
    // Get response body
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return new WP_Error(
            'api_invalid_json',
            'API returned invalid JSON',
            array('response' => $body)
        );
    }
    
    return $data;
}

/**
 * Fetch data from the API with caching
 *
 * @param string $endpoint    The API endpoint to fetch from.
 * @param array  $params      The parameters to include in the request.
 * @param int    $cache_time  The time to cache the result for (in seconds).
 * @return array|WP_Error The API response or error.
 */
function tesco_fetch_from_api_cached($endpoint, $params = array(), $cache_time = TESCO_API_CACHE_TIME) {
    // Generate cache key
    $cache_key = 'tesco_api_' . md5($endpoint . json_encode($params));
    
    // Check if we have a cached version
    $cached_data = get_transient($cache_key);
    
    if ($cached_data !== false) {
        return $cached_data;
    }
    
    // Fetch from API
    $data = tesco_fetch_from_api($endpoint, $params);
    
    // Cache the result if not an error
    if (!is_wp_error($data)) {
        set_transient($cache_key, $data, $cache_time);
    }
    
    return $data;
}

/**
 * Get trending deals
 *
 * @param int $limit The number of deals to return.
 * @return array|WP_Error The trending deals or error.
 */
function tesco_get_trending_deals($limit = 4) {
    $deals = tesco_fetch_from_api_cached('trending-deals', array('limit' => $limit));
    
    if (is_wp_error($deals)) {
        // Fallback to WordPress products if API fails
        $products = get_posts(array(
            'post_type' => 'product',
            'posts_per_page' => $limit,
            'orderby' => 'rand',
        ));
        
        if (empty($products)) {
            return $deals; // Return the original error
        }
        
        $fallback_deals = array();
        
        foreach ($products as $product) {
            // Get the lowest price for this product
            $price_args = array(
                'post_type' => 'price',
                'posts_per_page' => 1,
                'meta_key' => 'price_amount',
                'orderby' => 'meta_value_num',
                'order' => 'ASC',
                'meta_query' => array(
                    array(
                        'key' => 'product_id',
                        'value' => $product->ID,
                    ),
                ),
            );
            
            $prices = get_posts($price_args);
            $price_display = '';
            $price_amount = 0;
            $price_currency = '$';
            
            if (!empty($prices)) {
                $price = $prices[0];
                $price_amount = get_post_meta($price->ID, 'price_amount', true);
                $price_currency = get_post_meta($price->ID, 'price_currency', true);
                $price_display = $price_currency . number_format((float)$price_amount, 2);
            }
            
            $fallback_deals[] = array(
                'id' => $product->ID,
                'title' => $product->post_title,
                'description' => $product->post_content,
                'image' => get_the_post_thumbnail_url($product->ID, 'thumbnail'),
                'price' => $price_display,
                'price_amount' => $price_amount,
                'price_currency' => $price_currency,
            );
        }
        
        return $fallback_deals;
    }
    
    return $deals;
}

/**
 * Get featured stores
 *
 * @param int $limit The number of stores to return.
 * @return array|WP_Error The featured stores or error.
 */
function tesco_get_featured_stores($limit = 4) {
    $stores = tesco_fetch_from_api_cached('stores', array('featured' => true, 'limit' => $limit));
    
    if (is_wp_error($stores)) {
        // Fallback to WordPress stores if API fails
        $wp_stores = get_posts(array(
            'post_type' => 'store',
            'posts_per_page' => $limit,
            'orderby' => 'title',
            'order' => 'ASC',
        ));
        
        if (empty($wp_stores)) {
            return $stores; // Return the original error
        }
        
        $fallback_stores = array();
        
        foreach ($wp_stores as $store) {
            $fallback_stores[] = array(
                'id' => $store->ID,
                'name' => $store->post_title,
                'description' => $store->post_content,
                'logo' => get_the_post_thumbnail_url($store->ID, 'thumbnail'),
                'website' => get_post_meta($store->ID, 'store_website', true),
            );
        }
        
        return $fallback_stores;
    }
    
    return $stores;
}

/**
 * Get countries
 *
 * @return array|WP_Error The countries or error.
 */
function tesco_get_countries() {
    $countries = tesco_fetch_from_api_cached('countries');
    
    if (is_wp_error($countries)) {
        // Fallback to WordPress countries if API fails
        $wp_countries = get_terms(array(
            'taxonomy' => 'country',
            'hide_empty' => false,
        ));
        
        if (is_wp_error($wp_countries) || empty($wp_countries)) {
            return $countries; // Return the original error
        }
        
        $fallback_countries = array();
        
        foreach ($wp_countries as $country) {
            $fallback_countries[] = array(
                'id' => $country->term_id,
                'name' => $country->name,
                'slug' => $country->slug,
                'count' => $country->count,
            );
        }
        
        return $fallback_countries;
    }
    
    return $countries;
}

/**
 * Compare product prices
 *
 * @param int $product_id The product ID to compare.
 * @return array|WP_Error The comparison results or error.
 */
function tesco_compare_product_prices($product_id) {
    $comparison = tesco_fetch_from_api('compare', array('product_id' => $product_id));
    
    if (is_wp_error($comparison)) {
        // Fallback to WordPress data if API fails
        $product = get_post($product_id);
        
        if (!$product || $product->post_type !== 'product') {
            return $comparison; // Return the original error
        }
        
        // Get price data
        $price_args = array(
            'post_type' => 'price',
            'posts_per_page' => -1,
            'meta_query' => array(
                array(
                    'key' => 'product_id',
                    'value' => $product_id,
                ),
            ),
        );
        
        $prices = get_posts($price_args);
        $price_data = array();
        
        foreach ($prices as $price) {
            $store_id = get_post_meta($price->ID, 'store_id', true);
            $store = get_post($store_id);
            
            if ($store) {
                $price_data[] = array(
                    'id' => $price->ID,
                    'price' => get_post_meta($price->ID, 'price_amount', true),
                    'currency' => get_post_meta($price->ID, 'price_currency', true) ?: '$',
                    'store' => array(
                        'id' => $store_id,
                        'name' => $store->post_title,
                        'logo' => get_the_post_thumbnail_url($store_id, 'thumbnail'),
                    ),
                    'last_updated' => get_post_meta($price->ID, 'price_updated', true),
                );
            }
        }
        
        // Sort prices from lowest to highest
        usort($price_data, function($a, $b) {
            return $a['price'] - $b['price'];
        });
        
        return array(
            'product' => array(
                'id' => $product->ID,
                'title' => $product->post_title,
                'image' => get_the_post_thumbnail_url($product->ID, 'thumbnail'),
            ),
            'prices' => $price_data,
            'lowest_price' => !empty($price_data) ? $price_data[0] : null,
            'price_difference' => !empty($price_data) && count($price_data) > 1 ? 
                $price_data[count($price_data) - 1]['price'] - $price_data[0]['price'] : 0,
        );
    }
    
    return $comparison;
}

/**
 * Search products
 *
 * @param string $query The search query.
 * @param int    $limit The number of results to return.
 * @return array|WP_Error The search results or error.
 */
function tesco_search_products($query, $limit = 10) {
    $results = tesco_fetch_from_api('search', array('q' => $query, 'limit' => $limit));
    
    if (is_wp_error($results)) {
        // Fallback to WordPress search if API fails
        $products = get_posts(array(
            'post_type' => 'product',
            'posts_per_page' => $limit,
            's' => $query,
        ));
        
        if (empty($products)) {
            return $results; // Return the original error
        }
        
        $fallback_results = array();
        
        foreach ($products as $product) {
            // Get the lowest price for this product
            $price_args = array(
                'post_type' => 'price',
                'posts_per_page' => 1,
                'meta_key' => 'price_amount',
                'orderby' => 'meta_value_num',
                'order' => 'ASC',
                'meta_query' => array(
                    array(
                        'key' => 'product_id',
                        'value' => $product->ID,
                    ),
                ),
            );
            
            $prices = get_posts($price_args);
            $price_display = '';
            
            if (!empty($prices)) {
                $price = $prices[0];
                $amount = get_post_meta($price->ID, 'price_amount', true);
                $currency = get_post_meta($price->ID, 'price_currency', true) ?: '$';
                $price_display = $currency . number_format((float)$amount, 2);
            }
            
            $fallback_results[] = array(
                'id' => $product->ID,
                'title' => $product->post_title,
                'description' => $product->post_content,
                'image' => get_the_post_thumbnail_url($product->ID, 'thumbnail'),
                'price' => $price_display,
                'category' => wp_get_post_terms($product->ID, 'product_category', array('fields' => 'names')),
            );
        }
        
        return $fallback_results;
    }
    
    return $results;
}

/**
 * Subscribe to newsletter
 *
 * @param string $email The email address to subscribe.
 * @return array|WP_Error The subscription result or error.
 */
function tesco_subscribe_to_newsletter($email) {
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Please enter a valid email address');
    }
    
    // First check if this email already exists in our system
    $existing = get_posts(array(
        'post_type' => 'subscriber',
        'meta_key' => 'subscriber_email',
        'meta_value' => $email,
        'posts_per_page' => 1,
    ));
    
    if (!empty($existing)) {
        return array(
            'success' => false,
            'message' => 'This email is already subscribed',
        );
    }
    
    // Try to subscribe via API
    $result = tesco_fetch_from_api('newsletter/subscribe', array(), 'POST', array('email' => $email));
    
    if (is_wp_error($result)) {
        // Fallback to WordPress if API fails
        $subscriber_args = array(
            'post_title' => $email,
            'post_type' => 'subscriber',
            'post_status' => 'publish',
        );
        
        $subscriber_id = wp_insert_post($subscriber_args);
        
        if (is_wp_error($subscriber_id)) {
            return $subscriber_id;
        }
        
        update_post_meta($subscriber_id, 'subscriber_email', $email);
        update_post_meta($subscriber_id, 'subscriber_status', 'active');
        update_post_meta($subscriber_id, 'subscriber_date', current_time('mysql'));
        
        return array(
            'success' => true,
            'message' => 'Thank you for subscribing!',
        );
    }
    
    return $result;
}

/**
 * Process Stripe payment
 *
 * @param string $payment_method_id The Stripe payment method ID.
 * @param float  $amount           The payment amount.
 * @param string $currency         The payment currency.
 * @return array|WP_Error The payment result or error.
 */
function tesco_process_payment($payment_method_id, $amount, $currency = 'usd') {
    // Check if we have Stripe API key
    $stripe_secret_key = get_option('tesco_stripe_secret_key');
    
    if (empty($stripe_secret_key)) {
        return new WP_Error('missing_stripe_key', 'Stripe secret key is not configured');
    }
    
    // Try to process payment via API
    $result = tesco_fetch_from_api('payment/process', array(), 'POST', array(
        'payment_method_id' => $payment_method_id,
        'amount' => $amount,
        'currency' => $currency,
    ));
    
    return $result;
}

/**
 * Register REST API endpoints
 */
function tesco_register_rest_routes() {
    register_rest_route('tesco/v1', '/trending-deals', array(
        'methods' => 'GET',
        'callback' => function ($request) {
            $limit = $request->get_param('limit') ?: 4;
            return tesco_get_trending_deals($limit);
        },
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('tesco/v1', '/featured-stores', array(
        'methods' => 'GET',
        'callback' => function ($request) {
            $limit = $request->get_param('limit') ?: 4;
            return tesco_get_featured_stores($limit);
        },
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('tesco/v1', '/countries', array(
        'methods' => 'GET',
        'callback' => function () {
            return tesco_get_countries();
        },
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('tesco/v1', '/compare', array(
        'methods' => 'GET',
        'callback' => function ($request) {
            $product_id = $request->get_param('product_id');
            
            if (empty($product_id)) {
                return new WP_Error('missing_product_id', 'Product ID is required');
            }
            
            return tesco_compare_product_prices($product_id);
        },
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('tesco/v1', '/search', array(
        'methods' => 'GET',
        'callback' => function ($request) {
            $query = $request->get_param('q');
            $limit = $request->get_param('limit') ?: 10;
            
            if (empty($query)) {
                return new WP_Error('missing_query', 'Search query is required');
            }
            
            return tesco_search_products($query, $limit);
        },
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('tesco/v1', '/newsletter/subscribe', array(
        'methods' => 'POST',
        'callback' => function ($request) {
            $email = $request->get_param('email');
            
            if (empty($email)) {
                return new WP_Error('missing_email', 'Email is required');
            }
            
            return tesco_subscribe_to_newsletter($email);
        },
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('tesco/v1', '/payment/process', array(
        'methods' => 'POST',
        'callback' => function ($request) {
            $payment_method_id = $request->get_param('payment_method_id');
            $amount = $request->get_param('amount');
            $currency = $request->get_param('currency') ?: 'usd';
            
            if (empty($payment_method_id) || empty($amount)) {
                return new WP_Error('missing_parameters', 'Payment method ID and amount are required');
            }
            
            return tesco_process_payment($payment_method_id, $amount, $currency);
        },
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'tesco_register_rest_routes');

/**
 * Admin AJAX handler for newsletter subscription
 */
function tesco_ajax_newsletter_subscribe() {
    // Check nonce
    check_ajax_referer('subscribe_newsletter_nonce', 'newsletter_nonce');
    
    // Get email
    $email = sanitize_email($_POST['email']);
    
    if (empty($email)) {
        wp_send_json_error(array('message' => 'Please enter a valid email address'));
    }
    
    // Subscribe
    $result = tesco_subscribe_to_newsletter($email);
    
    if (is_wp_error($result)) {
        wp_send_json_error(array('message' => $result->get_error_message()));
    } else if (!$result['success']) {
        wp_send_json_error(array('message' => $result['message']));
    } else {
        wp_send_json_success(array('message' => $result['message']));
    }
}
add_action('wp_ajax_subscribe_newsletter', 'tesco_ajax_newsletter_subscribe');
add_action('wp_ajax_nopriv_subscribe_newsletter', 'tesco_ajax_newsletter_subscribe');