# WordPress Integration Guide

This document explains how the Tesco Price Comparison platform integrates with WordPress, allowing the same application to run either as a standalone Node.js application or as a WordPress theme.

## Architecture Overview

The integration follows a dual-platform architecture:

1. **Node.js API Layer**: The core backend functionality including database access, API endpoints, and business logic.
2. **WordPress Theme Layer**: A custom WordPress theme that provides the same UI/UX as the standalone application but within WordPress.
3. **API Compatibility Layer**: A bridge that allows WordPress to use the same API endpoints as the standalone application.

```
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│   React Frontend    │     │   WordPress Theme   │
│                     │     │                     │
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          │                           │
┌─────────▼───────────┐     ┌─────────▼───────────┐
│                     │     │                     │
│    Node.js API      │◄────┤ API Compatibility   │
│                     │     │       Layer         │
└─────────┬───────────┘     └─────────────────────┘
          │                           ▲
          │                           │
┌─────────▼───────────┐     ┌─────────┴───────────┐
│                     │     │                     │
│    Database         │     │   WordPress DB      │
│                     │     │                     │
└─────────────────────┘     └─────────────────────┘
```

## WordPress Theme Structure

The WordPress theme is located in the `/wordpress/wp-content/themes/tesco-comparison-theme/` directory and follows this structure:

```
tesco-comparison-theme/
├── style.css                 # Theme stylesheet and metadata
├── functions.php             # Theme functions and setup
├── index.php                 # Main template file
├── front-page.php            # Homepage template
├── page-compare.php          # Price comparison page template
├── single-product.php        # Single product template
├── archive-product.php       # Product archive template
├── header.php                # Header template
├── footer.php                # Footer template
├── screenshot.png            # Theme screenshot for WP admin
├── splash-screen.php         # Mobile app splash screen template
├── assets/                   # Theme assets (CSS, JS, images)
├── templates/                # Template parts
└── inc/                      # Include files
    ├── api-integration.php   # API compatibility layer
    ├── custom-post-types.php # Custom post types for products/stores
    ├── revisions.php         # WordPress revisions integration
    ├── admin/                # Admin panel customizations
    │   └── theme-options.php # Theme options page
    ├── widgets/              # Custom widgets
    └── shortcodes/           # Custom shortcodes
```

## Installation

1. **WordPress Setup**:
   - Install WordPress on your server
   - Set up a database for WordPress
   - Complete the WordPress installation process

2. **Theme Installation**:
   - Upload the `tesco-comparison-theme` folder to `/wp-content/themes/`
   - Activate the theme from the WordPress admin panel
   - Go to "Appearance > Theme Options" to configure the theme

3. **API Configuration**:
   - In the theme options, set the API endpoint URL (for standalone mode)
   - Choose between "Standalone API" or "WordPress Native" mode

## Custom Post Types

The theme registers the following custom post types to mirror the standalone application's data structure:

### Products

```php
// Excerpt from inc/custom-post-types.php
function tesco_register_product_post_type() {
    $labels = array(
        'name'               => _x('Products', 'post type general name', 'tesco-comparison'),
        'singular_name'      => _x('Product', 'post type singular name', 'tesco-comparison'),
        'menu_name'          => _x('Products', 'admin menu', 'tesco-comparison'),
        'add_new'            => _x('Add New', 'product', 'tesco-comparison'),
        'add_new_item'       => __('Add New Product', 'tesco-comparison'),
        'edit_item'          => __('Edit Product', 'tesco-comparison'),
        'new_item'           => __('New Product', 'tesco-comparison'),
        'view_item'          => __('View Product', 'tesco-comparison'),
        'search_items'       => __('Search Products', 'tesco-comparison'),
        'not_found'          => __('No products found', 'tesco-comparison'),
        'not_found_in_trash' => __('No products found in Trash', 'tesco-comparison'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'product'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-cart',
        'supports'           => array('title', 'editor', 'thumbnail', 'revisions', 'custom-fields'),
        'show_in_rest'       => true,
    );

    register_post_type('product', $args);
}
add_action('init', 'tesco_register_product_post_type');
```

### Stores

```php
// Excerpt from inc/custom-post-types.php
function tesco_register_store_post_type() {
    $labels = array(
        'name'               => _x('Stores', 'post type general name', 'tesco-comparison'),
        'singular_name'      => _x('Store', 'post type singular name', 'tesco-comparison'),
        'menu_name'          => _x('Stores', 'admin menu', 'tesco-comparison'),
        'add_new'            => _x('Add New', 'store', 'tesco-comparison'),
        'add_new_item'       => __('Add New Store', 'tesco-comparison'),
        'edit_item'          => __('Edit Store', 'tesco-comparison'),
        'new_item'           => __('New Store', 'tesco-comparison'),
        'view_item'          => __('View Store', 'tesco-comparison'),
        'search_items'       => __('Search Stores', 'tesco-comparison'),
        'not_found'          => __('No stores found', 'tesco-comparison'),
        'not_found_in_trash' => __('No stores found in Trash', 'tesco-comparison'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'store'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-store',
        'supports'           => array('title', 'editor', 'thumbnail', 'revisions', 'custom-fields'),
        'show_in_rest'       => true,
    );

    register_post_type('store', $args);
}
add_action('init', 'tesco_register_store_post_type');
```

### Custom Taxonomies

```php
// Excerpt from inc/custom-post-types.php
function tesco_register_taxonomies() {
    // Product Category
    $category_labels = array(
        'name'              => _x('Categories', 'taxonomy general name', 'tesco-comparison'),
        'singular_name'     => _x('Category', 'taxonomy singular name', 'tesco-comparison'),
        'search_items'      => __('Search Categories', 'tesco-comparison'),
        'all_items'         => __('All Categories', 'tesco-comparison'),
        'parent_item'       => __('Parent Category', 'tesco-comparison'),
        'parent_item_colon' => __('Parent Category:', 'tesco-comparison'),
        'edit_item'         => __('Edit Category', 'tesco-comparison'),
        'update_item'       => __('Update Category', 'tesco-comparison'),
        'add_new_item'      => __('Add New Category', 'tesco-comparison'),
        'new_item_name'     => __('New Category Name', 'tesco-comparison'),
        'menu_name'         => __('Categories', 'tesco-comparison'),
    );

    $category_args = array(
        'hierarchical'      => true,
        'labels'            => $category_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'product-category'),
        'show_in_rest'      => true,
    );

    register_taxonomy('product_category', array('product'), $category_args);

    // Country
    $country_labels = array(
        'name'              => _x('Countries', 'taxonomy general name', 'tesco-comparison'),
        'singular_name'     => _x('Country', 'taxonomy singular name', 'tesco-comparison'),
        'search_items'      => __('Search Countries', 'tesco-comparison'),
        'all_items'         => __('All Countries', 'tesco-comparison'),
        'parent_item'       => null,
        'parent_item_colon' => null,
        'edit_item'         => __('Edit Country', 'tesco-comparison'),
        'update_item'       => __('Update Country', 'tesco-comparison'),
        'add_new_item'      => __('Add New Country', 'tesco-comparison'),
        'new_item_name'     => __('New Country Name', 'tesco-comparison'),
        'menu_name'         => __('Countries', 'tesco-comparison'),
    );

    $country_args = array(
        'hierarchical'      => false,
        'labels'            => $country_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'country'),
        'show_in_rest'      => true,
    );

    register_taxonomy('country', array('product', 'store'), $country_args);
}
add_action('init', 'tesco_register_taxonomies');
```

## Custom Meta Boxes

The theme adds custom meta boxes to store additional data required by the application:

```php
// Excerpt from inc/custom-post-types.php
function tesco_add_product_meta_boxes() {
    add_meta_box(
        'product_details',
        __('Product Details', 'tesco-comparison'),
        'tesco_product_details_callback',
        'product',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'tesco_add_product_meta_boxes');

function tesco_product_details_callback($post) {
    wp_nonce_field('tesco_product_details', 'tesco_product_details_nonce');

    $barcode = get_post_meta($post->ID, '_barcode', true);
    $price_data = get_post_meta($post->ID, '_price_data', true);
    
    ?>
    <p>
        <label for="tesco_barcode"><?php _e('Barcode', 'tesco-comparison'); ?></label>
        <input type="text" id="tesco_barcode" name="tesco_barcode" value="<?php echo esc_attr($barcode); ?>" class="widefat">
    </p>
    <div class="price-data-container">
        <h3><?php _e('Price Data', 'tesco-comparison'); ?></h3>
        <div id="price-data-fields">
            <?php
            if (is_array($price_data) && !empty($price_data)) {
                foreach ($price_data as $index => $price_item) {
                    ?>
                    <div class="price-data-row">
                        <select name="tesco_price_data[<?php echo $index; ?>][store_id]">
                            <?php
                            $stores = get_posts(array('post_type' => 'store', 'numberposts' => -1));
                            foreach ($stores as $store) {
                                printf(
                                    '<option value="%s" %s>%s</option>',
                                    esc_attr($store->ID),
                                    selected($price_item['store_id'], $store->ID, false),
                                    esc_html($store->post_title)
                                );
                            }
                            ?>
                        </select>
                        <input type="number" step="0.01" name="tesco_price_data[<?php echo $index; ?>][price]" value="<?php echo esc_attr($price_item['price']); ?>" placeholder="Price">
                        <input type="text" name="tesco_price_data[<?php echo $index; ?>][currency]" value="<?php echo esc_attr($price_item['currency']); ?>" placeholder="Currency" maxlength="3" style="width: 50px;">
                        <button type="button" class="remove-price-row button"><?php _e('Remove', 'tesco-comparison'); ?></button>
                    </div>
                    <?php
                }
            }
            ?>
        </div>
        <button type="button" id="add-price-row" class="button"><?php _e('Add Price', 'tesco-comparison'); ?></button>
    </div>
    <script>
        jQuery(document).ready(function($) {
            let index = <?php echo isset($price_data) ? count($price_data) : 0; ?>;
            
            $('#add-price-row').on('click', function() {
                const storeOptions = <?php 
                    $stores = get_posts(array('post_type' => 'store', 'numberposts' => -1));
                    $options = [];
                    foreach ($stores as $store) {
                        $options[] = [
                            'id' => $store->ID,
                            'name' => $store->post_title
                        ];
                    }
                    echo json_encode($options);
                ?>;
                
                let optionsHtml = '';
                storeOptions.forEach(function(store) {
                    optionsHtml += `<option value="${store.id}">${store.name}</option>`;
                });
                
                const newRow = `
                    <div class="price-data-row">
                        <select name="tesco_price_data[${index}][store_id]">
                            ${optionsHtml}
                        </select>
                        <input type="number" step="0.01" name="tesco_price_data[${index}][price]" placeholder="Price">
                        <input type="text" name="tesco_price_data[${index}][currency]" placeholder="Currency" maxlength="3" style="width: 50px;">
                        <button type="button" class="remove-price-row button">Remove</button>
                    </div>
                `;
                
                $('#price-data-fields').append(newRow);
                index++;
            });
            
            $(document).on('click', '.remove-price-row', function() {
                $(this).parent().remove();
            });
        });
    </script>
    <?php
}

function tesco_save_product_meta($post_id) {
    if (!isset($_POST['tesco_product_details_nonce']) || !wp_verify_nonce($_POST['tesco_product_details_nonce'], 'tesco_product_details')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (isset($_POST['post_type']) && 'product' == $_POST['post_type']) {
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
    }
    
    if (isset($_POST['tesco_barcode'])) {
        update_post_meta($post_id, '_barcode', sanitize_text_field($_POST['tesco_barcode']));
    }
    
    if (isset($_POST['tesco_price_data']) && is_array($_POST['tesco_price_data'])) {
        $price_data = array();
        
        foreach ($_POST['tesco_price_data'] as $price_item) {
            if (!empty($price_item['store_id']) && isset($price_item['price'])) {
                $price_data[] = array(
                    'store_id' => intval($price_item['store_id']),
                    'price'    => floatval($price_item['price']),
                    'currency' => isset($price_item['currency']) ? sanitize_text_field($price_item['currency']) : '£',
                );
            }
        }
        
        update_post_meta($post_id, '_price_data', $price_data);
    }
}
add_action('save_post', 'tesco_save_product_meta');
```

## API Compatibility Layer

The API compatibility layer allows the WordPress theme to communicate with the standalone API or use WordPress' native functions:

```php
// Excerpt from inc/api-integration.php
class Tesco_API_Integration {
    private $api_mode;
    private $api_endpoint;
    
    public function __construct() {
        $this->api_mode = get_option('tesco_api_mode', 'wordpress');
        $this->api_endpoint = get_option('tesco_api_endpoint', '');
        
        add_action('rest_api_init', array($this, 'register_api_endpoints'));
    }
    
    /**
     * Register custom REST API endpoints
     */
    public function register_api_endpoints() {
        register_rest_route('tesco/v1', '/products', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_products'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('tesco/v1', '/products/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('tesco/v1', '/compare', array(
            'methods' => 'GET',
            'callback' => array($this, 'compare_prices'),
            'permission_callback' => '__return_true',
        ));
        
        // Add more endpoints as needed
    }
    
    /**
     * Get products
     */
    public function get_products($request) {
        if ($this->api_mode === 'standalone') {
            return $this->proxy_to_standalone_api('products', $request->get_params());
        }
        
        // WordPress native implementation
        $args = array(
            'post_type' => 'product',
            'posts_per_page' => $request->get_param('limit') ? intval($request->get_param('limit')) : 20,
            'paged' => $request->get_param('page') ? intval($request->get_param('page')) : 1,
        );
        
        if ($request->get_param('category')) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_category',
                    'field' => 'term_id',
                    'terms' => intval($request->get_param('category')),
                ),
            );
        }
        
        if ($request->get_param('search')) {
            $args['s'] = sanitize_text_field($request->get_param('search'));
        }
        
        $query = new WP_Query($args);
        $products = array();
        
        foreach ($query->posts as $post) {
            $products[] = $this->format_product($post);
        }
        
        return array(
            'products' => $products,
            'total' => $query->found_posts,
            'page' => $args['paged'],
            'limit' => $args['posts_per_page'],
        );
    }
    
    /**
     * Get single product
     */
    public function get_product($request) {
        if ($this->api_mode === 'standalone') {
            return $this->proxy_to_standalone_api('products/' . $request['id']);
        }
        
        // WordPress native implementation
        $post = get_post($request['id']);
        
        if (!$post || $post->post_type !== 'product') {
            return new WP_Error('not_found', 'Product not found', array('status' => 404));
        }
        
        return $this->format_product($post);
    }
    
    /**
     * Format a WordPress post as a product API response
     */
    private function format_product($post) {
        $categories = wp_get_post_terms($post->ID, 'product_category');
        $category_id = !empty($categories) ? $categories[0]->term_id : null;
        
        return array(
            'id' => $post->ID,
            'name' => $post->post_title,
            'description' => $post->post_content,
            'imageUrl' => get_the_post_thumbnail_url($post->ID, 'full') ?: null,
            'categoryId' => $category_id,
            'barcode' => get_post_meta($post->ID, '_barcode', true),
        );
    }
    
    /**
     * Compare prices
     */
    public function compare_prices($request) {
        if ($this->api_mode === 'standalone') {
            return $this->proxy_to_standalone_api('compare', $request->get_params());
        }
        
        // WordPress native implementation
        $product_ids = explode(',', $request->get_param('productIds'));
        $results = array();
        
        foreach ($product_ids as $product_id) {
            $product_id = intval($product_id);
            $post = get_post($product_id);
            
            if (!$post || $post->post_type !== 'product') {
                continue;
            }
            
            $price_data = get_post_meta($product_id, '_price_data', true) ?: array();
            $stores = array();
            $lowest_price = null;
            $highest_price = null;
            
            foreach ($price_data as $price_item) {
                $store_post = get_post($price_item['store_id']);
                
                if (!$store_post) {
                    continue;
                }
                
                $store_info = array(
                    'storeId' => $store_post->ID,
                    'name' => $store_post->post_title,
                    'logoUrl' => get_the_post_thumbnail_url($store_post->ID, 'full') ?: null,
                    'price' => floatval($price_item['price']),
                    'currency' => $price_item['currency'],
                    'lastUpdated' => get_the_modified_date('c', $product_id),
                );
                
                $stores[] = $store_info;
                
                if ($lowest_price === null || $store_info['price'] < $lowest_price['price']) {
                    $lowest_price = array(
                        'storeId' => $store_info['storeId'],
                        'price' => $store_info['price'],
                        'currency' => $store_info['currency'],
                    );
                }
                
                if ($highest_price === null || $store_info['price'] > $highest_price['price']) {
                    $highest_price = array(
                        'storeId' => $store_info['storeId'],
                        'price' => $store_info['price'],
                        'currency' => $store_info['currency'],
                    );
                }
            }
            
            $price_difference = 0;
            $percentage_difference = 0;
            
            if ($lowest_price && $highest_price) {
                $price_difference = $highest_price['price'] - $lowest_price['price'];
                $percentage_difference = ($price_difference / $highest_price['price']) * 100;
            }
            
            $results[] = array(
                'productId' => $product_id,
                'name' => $post->post_title,
                'imageUrl' => get_the_post_thumbnail_url($product_id, 'full') ?: null,
                'stores' => $stores,
                'lowestPrice' => $lowest_price,
                'highestPrice' => $highest_price,
                'priceDifference' => round($price_difference, 2),
                'percentageDifference' => round($percentage_difference, 1),
            );
        }
        
        return $results;
    }
    
    /**
     * Proxy requests to standalone API
     */
    private function proxy_to_standalone_api($endpoint, $params = array()) {
        if (empty($this->api_endpoint)) {
            return new WP_Error('api_error', 'API endpoint not configured', array('status' => 500));
        }
        
        $url = trailingslashit($this->api_endpoint) . $endpoint;
        
        if (!empty($params)) {
            $url = add_query_arg($params, $url);
        }
        
        $response = wp_remote_get($url);
        
        if (is_wp_error($response)) {
            return new WP_Error('api_error', $response->get_error_message(), array('status' => 500));
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new WP_Error('api_error', 'Invalid API response', array('status' => 500));
        }
        
        return $data;
    }
}

// Initialize the API integration
new Tesco_API_Integration();
```

## Revisions System Integration

The WordPress theme integrates with the unlimited revisions system:

```php
// Excerpt from inc/revisions.php
class Tesco_Revisions {
    public function __construct() {
        // Ensure WordPress revisions are enabled
        if (!defined('WP_POST_REVISIONS') || !WP_POST_REVISIONS) {
            define('WP_POST_REVISIONS', true);
        }
        
        // Add support for custom fields in revisions
        add_filter('wp_save_post_revision_check_for_changes', array($this, 'check_for_meta_changes'), 10, 3);
        add_filter('_wp_post_revision_fields', array($this, 'add_meta_to_revision_fields'), 10, 2);
        add_action('wp_restore_post_revision', array($this, 'restore_revision_meta'), 10, 2);
        
        // Register REST API endpoints for revisions
        add_action('rest_api_init', array($this, 'register_revision_endpoints'));
    }
    
    /**
     * Check for changes in meta fields to trigger a revision
     */
    public function check_for_meta_changes($check_for_changes, $last_revision, $post) {
        // Only handle our custom post types
        if (!in_array($post->post_type, array('product', 'store'))) {
            return $check_for_changes;
        }
        
        // Get current meta values
        $meta_fields = $this->get_revisioned_meta_fields($post->post_type);
        $current_meta = array();
        
        foreach ($meta_fields as $field) {
            $current_meta[$field] = get_post_meta($post->ID, $field, true);
        }
        
        // Get last revision meta values
        $last_revision_meta = array();
        
        if ($last_revision) {
            foreach ($meta_fields as $field) {
                $last_revision_meta[$field] = get_post_meta($last_revision->ID, $field, true);
            }
        }
        
        // Check if any meta field has changed
        foreach ($meta_fields as $field) {
            $current_value = isset($current_meta[$field]) ? $current_meta[$field] : '';
            $last_value = isset($last_revision_meta[$field]) ? $last_revision_meta[$field] : '';
            
            if (is_array($current_value)) {
                $current_value = json_encode($current_value);
            }
            
            if (is_array($last_value)) {
                $last_value = json_encode($last_value);
            }
            
            if ($current_value !== $last_value) {
                return true;
            }
        }
        
        return $check_for_changes;
    }
    
    /**
     * Add meta fields to revision fields
     */
    public function add_meta_to_revision_fields($fields, $post) {
        if (!in_array($post->post_type, array('product', 'store'))) {
            return $fields;
        }
        
        $meta_fields = $this->get_revisioned_meta_fields($post->post_type);
        
        foreach ($meta_fields as $field) {
            $fields[$field] = sprintf(__('%s Meta Field', 'tesco-comparison'), $field);
            
            // Add filter to get meta value for the revision field
            add_filter('_wp_post_revision_field_' . $field, array($this, 'get_revision_meta_field'), 10, 3);
        }
        
        return $fields;
    }
    
    /**
     * Get meta value for revision field
     */
    public function get_revision_meta_field($value, $field, $post) {
        $meta_value = get_post_meta($post->ID, $field, true);
        
        if (is_array($meta_value)) {
            $meta_value = json_encode($meta_value);
        }
        
        return $meta_value;
    }
    
    /**
     * Restore meta values when restoring a revision
     */
    public function restore_revision_meta($post_id, $revision_id) {
        $post = get_post($post_id);
        
        if (!in_array($post->post_type, array('product', 'store'))) {
            return;
        }
        
        $meta_fields = $this->get_revisioned_meta_fields($post->post_type);
        
        foreach ($meta_fields as $field) {
            $meta_value = get_post_meta($revision_id, $field, true);
            
            if (is_string($meta_value) && $this->is_json($meta_value)) {
                $meta_value = json_decode($meta_value, true);
            }
            
            update_post_meta($post_id, $field, $meta_value);
        }
    }
    
    /**
     * Check if a string is JSON
     */
    private function is_json($string) {
        if (!is_string($string)) {
            return false;
        }
        
        json_decode($string);
        return (json_last_error() === JSON_ERROR_NONE);
    }
    
    /**
     * Get revisioned meta fields for a post type
     */
    private function get_revisioned_meta_fields($post_type) {
        $fields = array();
        
        if ($post_type === 'product') {
            $fields = array(
                '_barcode',
                '_price_data',
            );
        } elseif ($post_type === 'store') {
            $fields = array(
                '_website_url',
                '_store_location',
            );
        }
        
        return $fields;
    }
    
    /**
     * Register REST API endpoints for revisions
     */
    public function register_revision_endpoints() {
        register_rest_route('tesco/v1', '/revisions/product/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product_revisions'),
            'permission_callback' => array($this, 'check_revision_permissions'),
        ));
        
        register_rest_route('tesco/v1', '/revisions/product/restore/(?P<revision_id>\d+)', array(
            'methods' => 'POST',
            'callback' => array($this, 'restore_product_revision'),
            'permission_callback' => array($this, 'check_revision_permissions'),
        ));
        
        register_rest_route('tesco/v1', '/revisions/store/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_store_revisions'),
            'permission_callback' => array($this, 'check_revision_permissions'),
        ));
        
        register_rest_route('tesco/v1', '/revisions/store/restore/(?P<revision_id>\d+)', array(
            'methods' => 'POST',
            'callback' => array($this, 'restore_store_revision'),
            'permission_callback' => array($this, 'check_revision_permissions'),
        ));
    }
    
    /**
     * Check permissions for revision endpoints
     */
    public function check_revision_permissions() {
        return current_user_can('edit_posts');
    }
    
    /**
     * Get product revisions
     */
    public function get_product_revisions($request) {
        $product_id = intval($request['id']);
        $post = get_post($product_id);
        
        if (!$post || $post->post_type !== 'product') {
            return new WP_Error('not_found', 'Product not found', array('status' => 404));
        }
        
        $revisions = wp_get_post_revisions($product_id);
        $result = array();
        
        foreach ($revisions as $revision) {
            $result[] = array(
                'id' => $revision->ID,
                'productId' => $product_id,
                'title' => $revision->post_title,
                'description' => $revision->post_content,
                'barcode' => get_post_meta($revision->ID, '_barcode', true),
                'createdAt' => $revision->post_date_gmt,
            );
        }
        
        return $result;
    }
    
    /**
     * Restore product revision
     */
    public function restore_product_revision($request) {
        $revision_id = intval($request['revision_id']);
        $revision = get_post($revision_id);
        
        if (!$revision || $revision->post_type !== 'revision') {
            return new WP_Error('not_found', 'Revision not found', array('status' => 404));
        }
        
        $product_id = $revision->post_parent;
        $product = get_post($product_id);
        
        if (!$product || $product->post_type !== 'product') {
            return new WP_Error('not_found', 'Product not found', array('status' => 404));
        }
        
        wp_restore_post_revision($revision_id);
        
        return array(
            'success' => true,
            'message' => sprintf(__('Product restored to revision from %s', 'tesco-comparison'), $revision->post_date),
            'product' => array(
                'id' => $product->ID,
                'name' => $product->post_title,
                'description' => $product->post_content,
                'imageUrl' => get_the_post_thumbnail_url($product->ID, 'full') ?: null,
                'barcode' => get_post_meta($product->ID, '_barcode', true),
            ),
        );
    }
    
    /**
     * Get store revisions
     */
    public function get_store_revisions($request) {
        $store_id = intval($request['id']);
        $post = get_post($store_id);
        
        if (!$post || $post->post_type !== 'store') {
            return new WP_Error('not_found', 'Store not found', array('status' => 404));
        }
        
        $revisions = wp_get_post_revisions($store_id);
        $result = array();
        
        foreach ($revisions as $revision) {
            $result[] = array(
                'id' => $revision->ID,
                'storeId' => $store_id,
                'name' => $revision->post_title,
                'description' => $revision->post_content,
                'websiteUrl' => get_post_meta($revision->ID, '_website_url', true),
                'createdAt' => $revision->post_date_gmt,
            );
        }
        
        return $result;
    }
    
    /**
     * Restore store revision
     */
    public function restore_store_revision($request) {
        $revision_id = intval($request['revision_id']);
        $revision = get_post($revision_id);
        
        if (!$revision || $revision->post_type !== 'revision') {
            return new WP_Error('not_found', 'Revision not found', array('status' => 404));
        }
        
        $store_id = $revision->post_parent;
        $store = get_post($store_id);
        
        if (!$store || $store->post_type !== 'store') {
            return new WP_Error('not_found', 'Store not found', array('status' => 404));
        }
        
        wp_restore_post_revision($revision_id);
        
        return array(
            'success' => true,
            'message' => sprintf(__('Store restored to revision from %s', 'tesco-comparison'), $revision->post_date),
            'store' => array(
                'id' => $store->ID,
                'name' => $store->post_title,
                'description' => $store->post_content,
                'logoUrl' => get_the_post_thumbnail_url($store->ID, 'full') ?: null,
                'websiteUrl' => get_post_meta($store->ID, '_website_url', true),
            ),
        );
    }
}

// Initialize the revisions system
new Tesco_Revisions();
```

## Theme Options

The theme includes a custom options page for configuring the API integration and other settings:

```php
// Excerpt from inc/admin/theme-options.php
class Tesco_Theme_Options {
    public function __construct() {
        add_action('admin_menu', array($this, 'add_options_page'));
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    /**
     * Add options page to admin menu
     */
    public function add_options_page() {
        add_theme_page(
            __('Tesco Theme Options', 'tesco-comparison'),
            __('Theme Options', 'tesco-comparison'),
            'manage_options',
            'tesco-theme-options',
            array($this, 'render_options_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('tesco_theme_options', 'tesco_api_mode');
        register_setting('tesco_theme_options', 'tesco_api_endpoint');
        register_setting('tesco_theme_options', 'tesco_default_currency');
        register_setting('tesco_theme_options', 'tesco_enable_revisions');
        register_setting('tesco_theme_options', 'tesco_revision_retention_days');
        register_setting('tesco_theme_options', 'tesco_auto_cleanup');
        
        add_settings_section(
            'tesco_api_settings',
            __('API Settings', 'tesco-comparison'),
            array($this, 'render_api_section'),
            'tesco-theme-options'
        );
        
        add_settings_field(
            'tesco_api_mode',
            __('API Mode', 'tesco-comparison'),
            array($this, 'render_api_mode_field'),
            'tesco-theme-options',
            'tesco_api_settings'
        );
        
        add_settings_field(
            'tesco_api_endpoint',
            __('API Endpoint', 'tesco-comparison'),
            array($this, 'render_api_endpoint_field'),
            'tesco-theme-options',
            'tesco_api_settings'
        );
        
        add_settings_section(
            'tesco_revision_settings',
            __('Revision Settings', 'tesco-comparison'),
            array($this, 'render_revision_section'),
            'tesco-theme-options'
        );
        
        add_settings_field(
            'tesco_enable_revisions',
            __('Enable Revisions', 'tesco-comparison'),
            array($this, 'render_enable_revisions_field'),
            'tesco-theme-options',
            'tesco_revision_settings'
        );
        
        add_settings_field(
            'tesco_revision_retention_days',
            __('Revision Retention (Days)', 'tesco-comparison'),
            array($this, 'render_revision_retention_field'),
            'tesco-theme-options',
            'tesco_revision_settings'
        );
        
        add_settings_field(
            'tesco_auto_cleanup',
            __('Auto Cleanup', 'tesco-comparison'),
            array($this, 'render_auto_cleanup_field'),
            'tesco-theme-options',
            'tesco_revision_settings'
        );
    }
    
    /**
     * Render options page
     */
    public function render_options_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('tesco_theme_options');
                do_settings_sections('tesco-theme-options');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
    
    /**
     * Render API section description
     */
    public function render_api_section() {
        echo '<p>' . __('Configure how the theme interacts with the Tesco Price Comparison API.', 'tesco-comparison') . '</p>';
    }
    
    /**
     * Render API mode field
     */
    public function render_api_mode_field() {
        $mode = get_option('tesco_api_mode', 'wordpress');
        ?>
        <select name="tesco_api_mode">
            <option value="wordpress" <?php selected($mode, 'wordpress'); ?>><?php _e('WordPress Native', 'tesco-comparison'); ?></option>
            <option value="standalone" <?php selected($mode, 'standalone'); ?>><?php _e('Standalone API', 'tesco-comparison'); ?></option>
        </select>
        <p class="description"><?php _e('Choose whether to use WordPress native functions or connect to a standalone API.', 'tesco-comparison'); ?></p>
        <?php
    }
    
    /**
     * Render API endpoint field
     */
    public function render_api_endpoint_field() {
        $endpoint = get_option('tesco_api_endpoint', '');
        ?>
        <input type="url" name="tesco_api_endpoint" value="<?php echo esc_attr($endpoint); ?>" class="regular-text" <?php disabled($mode, 'wordpress'); ?>>
        <p class="description"><?php _e('Enter the URL of the standalone API endpoint (e.g., https://api.example.com).', 'tesco-comparison'); ?></p>
        <?php
    }
    
    /**
     * Render revision section description
     */
    public function render_revision_section() {
        echo '<p>' . __('Configure the content revision system.', 'tesco-comparison') . '</p>';
    }
    
    /**
     * Render enable revisions field
     */
    public function render_enable_revisions_field() {
        $enabled = get_option('tesco_enable_revisions', '1');
        ?>
        <label>
            <input type="checkbox" name="tesco_enable_revisions" value="1" <?php checked($enabled, '1'); ?>>
            <?php _e('Enable unlimited revisions system', 'tesco-comparison'); ?>
        </label>
        <?php
    }
    
    /**
     * Render revision retention field
     */
    public function render_revision_retention_field() {
        $days = get_option('tesco_revision_retention_days', '0');
        ?>
        <input type="number" name="tesco_revision_retention_days" value="<?php echo esc_attr($days); ?>" min="0" step="1">
        <p class="description"><?php _e('Number of days to keep revisions (0 = keep all).', 'tesco-comparison'); ?></p>
        <?php
    }
    
    /**
     * Render auto cleanup field
     */
    public function render_auto_cleanup_field() {
        $auto_cleanup = get_option('tesco_auto_cleanup', '1');
        ?>
        <label>
            <input type="checkbox" name="tesco_auto_cleanup" value="1" <?php checked($auto_cleanup, '1'); ?>>
            <?php _e('Automatically clean up old revisions', 'tesco-comparison'); ?>
        </label>
        <?php
    }
}

// Initialize the theme options
new Tesco_Theme_Options();
```

## Running the WordPress Version

To run the WordPress version:

1. Install WordPress on your web server
2. Upload and activate the `tesco-comparison-theme`
3. Go to "Appearance > Theme Options" to configure:
   - API Mode: Choose "WordPress Native" or "Standalone API"
   - If using "Standalone API", enter the API endpoint URL
   - Configure revision settings

4. Add products and stores through the WordPress admin interface

The theme will handle the integration with the standalone API if configured, or use WordPress native functions to provide the same functionality.

## Switching Between Modes

The application architecture allows you to easily switch between:

1. **Standalone Mode**: The React frontend communicates directly with the Node.js API
2. **WordPress Mode**: The WordPress theme provides the frontend and uses WordPress native functions for data storage
3. **Hybrid Mode**: The WordPress theme frontend communicates with the standalone Node.js API

This flexibility allows you to leverage the strengths of both platforms depending on your needs.

## Conclusion

The WordPress integration provides a seamless way to run the Tesco Price Comparison platform as a WordPress theme while maintaining compatibility with the standalone application. This dual-platform approach allows you to leverage WordPress's content management capabilities alongside the Node.js application's performance and flexibility.