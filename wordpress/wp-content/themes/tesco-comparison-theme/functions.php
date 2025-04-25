<?php
/**
 * Tesco Price Comparison Theme functions and definitions
 */

if (!defined('_S_VERSION')) {
    // Replace the version number as needed
    define('_S_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function tesco_comparison_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');

    // Register navigation menus
    register_nav_menus(
        array(
            'primary' => esc_html__('Primary Menu', 'tesco-comparison'),
            'footer' => esc_html__('Footer Menu', 'tesco-comparison'),
        )
    );

    // Switch default core markup to output valid HTML5.
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );

    // Add theme support for selective refresh for widgets.
    add_theme_support('customize-selective-refresh-widgets');

    // Add support for responsive embeds
    add_theme_support('responsive-embeds');

    // Add support for editor styles
    add_theme_support('editor-styles');
}
add_action('after_setup_theme', 'tesco_comparison_setup');

/**
 * Enqueue scripts and styles.
 */
function tesco_comparison_scripts() {
    wp_enqueue_style('tesco-comparison-style', get_stylesheet_uri(), array(), _S_VERSION);
    wp_enqueue_style('google-material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), null);
    
    wp_enqueue_script('tesco-comparison-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true);
    wp_enqueue_script('tesco-comparison-splash', get_template_directory_uri() . '/js/splash-screen.js', array(), _S_VERSION, true);
    
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
    
    // Add Google AdSense script if ID is available
    $adsense_id = get_option('tesco_google_adsense_id');
    if (!empty($adsense_id)) {
        wp_enqueue_script('google-adsense', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . esc_attr($adsense_id), array(), null, true);
    }
    
    // Add Google Analytics script if ID is available
    $analytics_id = get_option('tesco_google_analytics_id');
    if (!empty($analytics_id)) {
        wp_enqueue_script('google-analytics', 'https://www.googletagmanager.com/gtag/js?id=' . esc_attr($analytics_id), array(), null, true);
        wp_add_inline_script('google-analytics', "
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '" . esc_js($analytics_id) . "');
        ");
    }
}
add_action('wp_enqueue_scripts', 'tesco_comparison_scripts');

/**
 * Register widget area.
 */
function tesco_comparison_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'tesco-comparison'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here.', 'tesco-comparison'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );
    
    register_sidebar(
        array(
            'name'          => esc_html__('Footer 1', 'tesco-comparison'),
            'id'            => 'footer-1',
            'description'   => esc_html__('Add widgets for the first footer column here.', 'tesco-comparison'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="footer-widget-title">',
            'after_title'   => '</h3>',
        )
    );
    
    register_sidebar(
        array(
            'name'          => esc_html__('Footer 2', 'tesco-comparison'),
            'id'            => 'footer-2',
            'description'   => esc_html__('Add widgets for the second footer column here.', 'tesco-comparison'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="footer-widget-title">',
            'after_title'   => '</h3>',
        )
    );
    
    register_sidebar(
        array(
            'name'          => esc_html__('Footer 3', 'tesco-comparison'),
            'id'            => 'footer-3',
            'description'   => esc_html__('Add widgets for the third footer column here.', 'tesco-comparison'),
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="footer-widget-title">',
            'after_title'   => '</h3>',
        )
    );
}
add_action('widgets_init', 'tesco_comparison_widgets_init');

/**
 * Create a custom post type for Stores
 */
function tesco_comparison_register_post_types() {
    register_post_type(
        'store',
        array(
            'labels' => array(
                'name' => __('Stores', 'tesco-comparison'),
                'singular_name' => __('Store', 'tesco-comparison'),
                'add_new' => __('Add New Store', 'tesco-comparison'),
                'add_new_item' => __('Add New Store', 'tesco-comparison'),
                'edit_item' => __('Edit Store', 'tesco-comparison'),
                'new_item' => __('New Store', 'tesco-comparison'),
                'view_item' => __('View Store', 'tesco-comparison'),
                'search_items' => __('Search Stores', 'tesco-comparison'),
                'not_found' => __('No stores found', 'tesco-comparison'),
                'not_found_in_trash' => __('No stores found in Trash', 'tesco-comparison'),
            ),
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-store',
            'menu_position' => 20,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'show_in_rest' => true,
        )
    );
    
    register_post_type(
        'product',
        array(
            'labels' => array(
                'name' => __('Products', 'tesco-comparison'),
                'singular_name' => __('Product', 'tesco-comparison'),
                'add_new' => __('Add New Product', 'tesco-comparison'),
                'add_new_item' => __('Add New Product', 'tesco-comparison'),
                'edit_item' => __('Edit Product', 'tesco-comparison'),
                'new_item' => __('New Product', 'tesco-comparison'),
                'view_item' => __('View Product', 'tesco-comparison'),
                'search_items' => __('Search Products', 'tesco-comparison'),
                'not_found' => __('No products found', 'tesco-comparison'),
                'not_found_in_trash' => __('No products found in Trash', 'tesco-comparison'),
            ),
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-cart',
            'menu_position' => 21,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'show_in_rest' => true,
        )
    );
    
    register_post_type(
        'price',
        array(
            'labels' => array(
                'name' => __('Prices', 'tesco-comparison'),
                'singular_name' => __('Price', 'tesco-comparison'),
                'add_new' => __('Add New Price', 'tesco-comparison'),
                'add_new_item' => __('Add New Price', 'tesco-comparison'),
                'edit_item' => __('Edit Price', 'tesco-comparison'),
                'new_item' => __('New Price', 'tesco-comparison'),
                'view_item' => __('View Price', 'tesco-comparison'),
                'search_items' => __('Search Prices', 'tesco-comparison'),
                'not_found' => __('No prices found', 'tesco-comparison'),
                'not_found_in_trash' => __('No prices found in Trash', 'tesco-comparison'),
            ),
            'public' => true,
            'has_archive' => false,
            'menu_icon' => 'dashicons-money-alt',
            'menu_position' => 22,
            'supports' => array('title', 'custom-fields'),
            'show_in_rest' => true,
        )
    );
    
    register_taxonomy(
        'product_category',
        'product',
        array(
            'labels' => array(
                'name' => __('Product Categories', 'tesco-comparison'),
                'singular_name' => __('Product Category', 'tesco-comparison'),
                'search_items' => __('Search Product Categories', 'tesco-comparison'),
                'all_items' => __('All Product Categories', 'tesco-comparison'),
                'edit_item' => __('Edit Product Category', 'tesco-comparison'),
                'update_item' => __('Update Product Category', 'tesco-comparison'),
                'add_new_item' => __('Add New Product Category', 'tesco-comparison'),
                'new_item_name' => __('New Product Category Name', 'tesco-comparison'),
                'menu_name' => __('Categories', 'tesco-comparison'),
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_admin_column' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'product-category'),
            'show_in_rest' => true,
        )
    );
    
    register_taxonomy(
        'country',
        array('store', 'product'),
        array(
            'labels' => array(
                'name' => __('Countries', 'tesco-comparison'),
                'singular_name' => __('Country', 'tesco-comparison'),
                'search_items' => __('Search Countries', 'tesco-comparison'),
                'all_items' => __('All Countries', 'tesco-comparison'),
                'edit_item' => __('Edit Country', 'tesco-comparison'),
                'update_item' => __('Update Country', 'tesco-comparison'),
                'add_new_item' => __('Add New Country', 'tesco-comparison'),
                'new_item_name' => __('New Country Name', 'tesco-comparison'),
                'menu_name' => __('Countries', 'tesco-comparison'),
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_admin_column' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'country'),
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'tesco_comparison_register_post_types');

/**
 * Add theme options page
 */
function tesco_comparison_add_theme_options() {
    add_menu_page(
        __('Tesco Comparison Settings', 'tesco-comparison'),
        __('Tesco Settings', 'tesco-comparison'),
        'manage_options',
        'tesco-comparison-settings',
        'tesco_comparison_settings_page',
        'dashicons-admin-generic',
        59
    );
}
add_action('admin_menu', 'tesco_comparison_add_theme_options');

/**
 * Register theme settings
 */
function tesco_comparison_register_settings() {
    register_setting('tesco_comparison_options', 'tesco_google_adsense_id');
    register_setting('tesco_comparison_options', 'tesco_google_analytics_id');
    register_setting('tesco_comparison_options', 'tesco_firebase_api_key');
    register_setting('tesco_comparison_options', 'tesco_stripe_public_key');
    register_setting('tesco_comparison_options', 'tesco_stripe_secret_key');
    register_setting('tesco_comparison_options', 'tesco_enable_splash_screen', 'sanitize_checkbox');
}
add_action('admin_init', 'tesco_comparison_register_settings');

/**
 * Sanitize checkbox
 */
function sanitize_checkbox($input) {
    return (isset($input) && $input == 1) ? 1 : 0;
}

/**
 * Theme options page content
 */
function tesco_comparison_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html__('Tesco Price Comparison Settings', 'tesco-comparison'); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('tesco_comparison_options');
            do_settings_sections('tesco_comparison_options');
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><?php echo esc_html__('Google AdSense Client ID', 'tesco-comparison'); ?></th>
                    <td>
                        <input type="text" name="tesco_google_adsense_id" value="<?php echo esc_attr(get_option('tesco_google_adsense_id')); ?>" class="regular-text" />
                        <p class="description"><?php echo esc_html__('Enter your Google AdSense Client ID (e.g., ca-pub-1234567890)', 'tesco-comparison'); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php echo esc_html__('Google Analytics ID', 'tesco-comparison'); ?></th>
                    <td>
                        <input type="text" name="tesco_google_analytics_id" value="<?php echo esc_attr(get_option('tesco_google_analytics_id')); ?>" class="regular-text" />
                        <p class="description"><?php echo esc_html__('Enter your Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)', 'tesco-comparison'); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php echo esc_html__('Firebase API Key', 'tesco-comparison'); ?></th>
                    <td>
                        <input type="text" name="tesco_firebase_api_key" value="<?php echo esc_attr(get_option('tesco_firebase_api_key')); ?>" class="regular-text" />
                        <p class="description"><?php echo esc_html__('Enter your Firebase API Key', 'tesco-comparison'); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php echo esc_html__('Stripe Public Key', 'tesco-comparison'); ?></th>
                    <td>
                        <input type="text" name="tesco_stripe_public_key" value="<?php echo esc_attr(get_option('tesco_stripe_public_key')); ?>" class="regular-text" />
                        <p class="description"><?php echo esc_html__('Enter your Stripe Public Key (pk_...)', 'tesco-comparison'); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php echo esc_html__('Stripe Secret Key', 'tesco-comparison'); ?></th>
                    <td>
                        <input type="password" name="tesco_stripe_secret_key" value="<?php echo esc_attr(get_option('tesco_stripe_secret_key')); ?>" class="regular-text" />
                        <p class="description"><?php echo esc_html__('Enter your Stripe Secret Key (sk_...)', 'tesco-comparison'); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php echo esc_html__('Enable Splash Screen', 'tesco-comparison'); ?></th>
                    <td>
                        <input type="checkbox" name="tesco_enable_splash_screen" value="1" <?php checked(1, get_option('tesco_enable_splash_screen'), true); ?> />
                        <p class="description"><?php echo esc_html__('Enable the splash screen when users first visit the site', 'tesco-comparison'); ?></p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

/**
 * Register REST API endpoints for price comparison
 */
function tesco_comparison_register_rest_routes() {
    register_rest_route(
        'tesco-comparison/v1',
        '/products',
        array(
            'methods' => 'GET',
            'callback' => 'tesco_comparison_get_products',
            'permission_callback' => '__return_true',
        )
    );
    
    register_rest_route(
        'tesco-comparison/v1',
        '/products/(?P<id>\d+)',
        array(
            'methods' => 'GET',
            'callback' => 'tesco_comparison_get_product',
            'permission_callback' => '__return_true',
            'args' => array(
                'id' => array(
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ),
            ),
        )
    );
    
    register_rest_route(
        'tesco-comparison/v1',
        '/stores',
        array(
            'methods' => 'GET',
            'callback' => 'tesco_comparison_get_stores',
            'permission_callback' => '__return_true',
        )
    );
    
    register_rest_route(
        'tesco-comparison/v1',
        '/countries',
        array(
            'methods' => 'GET',
            'callback' => 'tesco_comparison_get_countries',
            'permission_callback' => '__return_true',
        )
    );
    
    register_rest_route(
        'tesco-comparison/v1',
        '/compare',
        array(
            'methods' => 'GET',
            'callback' => 'tesco_comparison_compare_prices',
            'permission_callback' => '__return_true',
            'args' => array(
                'product_id' => array(
                    'required' => true,
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ),
            ),
        )
    );
}
add_action('rest_api_init', 'tesco_comparison_register_rest_routes');

/**
 * REST API callbacks
 */
function tesco_comparison_get_products($request) {
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
    );
    
    // Filter by category if provided
    if (!empty($request['category'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'product_category',
            'field' => 'slug',
            'terms' => $request['category'],
        );
    }
    
    // Filter by country if provided
    if (!empty($request['country'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'country',
            'field' => 'slug',
            'terms' => $request['country'],
        );
    }
    
    $products = get_posts($args);
    $data = array();
    
    foreach ($products as $product) {
        $product_data = array(
            'id' => $product->ID,
            'title' => $product->post_title,
            'description' => $product->post_content,
            'image' => get_the_post_thumbnail_url($product->ID, 'thumbnail'),
            'category' => wp_get_post_terms($product->ID, 'product_category', array('fields' => 'names')),
            'country' => wp_get_post_terms($product->ID, 'country', array('fields' => 'names')),
        );
        
        $data[] = $product_data;
    }
    
    return $data;
}

function tesco_comparison_get_product($request) {
    $product_id = $request['id'];
    $product = get_post($product_id);
    
    if (!$product || $product->post_type !== 'product') {
        return new WP_Error('product_not_found', 'Product not found', array('status' => 404));
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
        
        $price_data[] = array(
            'id' => $price->ID,
            'price' => get_post_meta($price->ID, 'price_amount', true),
            'currency' => get_post_meta($price->ID, 'price_currency', true),
            'store' => array(
                'id' => $store_id,
                'name' => $store ? $store->post_title : '',
                'logo' => get_the_post_thumbnail_url($store_id, 'thumbnail'),
            ),
            'last_updated' => get_post_meta($price->ID, 'price_updated', true),
        );
    }
    
    $product_data = array(
        'id' => $product->ID,
        'title' => $product->post_title,
        'description' => $product->post_content,
        'image' => get_the_post_thumbnail_url($product->ID, 'medium'),
        'category' => wp_get_post_terms($product->ID, 'product_category', array('fields' => 'names')),
        'country' => wp_get_post_terms($product->ID, 'country', array('fields' => 'names')),
        'prices' => $price_data,
    );
    
    return $product_data;
}

function tesco_comparison_get_stores($request) {
    $args = array(
        'post_type' => 'store',
        'posts_per_page' => -1,
    );
    
    // Filter by country if provided
    if (!empty($request['country'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'country',
            'field' => 'slug',
            'terms' => $request['country'],
        );
    }
    
    $stores = get_posts($args);
    $data = array();
    
    foreach ($stores as $store) {
        $store_data = array(
            'id' => $store->ID,
            'name' => $store->post_title,
            'description' => $store->post_content,
            'logo' => get_the_post_thumbnail_url($store->ID, 'thumbnail'),
            'country' => wp_get_post_terms($store->ID, 'country', array('fields' => 'names')),
            'website' => get_post_meta($store->ID, 'store_website', true),
        );
        
        $data[] = $store_data;
    }
    
    return $data;
}

function tesco_comparison_get_countries() {
    $countries = get_terms(array(
        'taxonomy' => 'country',
        'hide_empty' => false,
    ));
    
    $data = array();
    
    foreach ($countries as $country) {
        $data[] = array(
            'id' => $country->term_id,
            'name' => $country->name,
            'slug' => $country->slug,
            'count' => $country->count,
        );
    }
    
    return $data;
}

function tesco_comparison_compare_prices($request) {
    $product_id = $request['product_id'];
    $product = get_post($product_id);
    
    if (!$product || $product->post_type !== 'product') {
        return new WP_Error('product_not_found', 'Product not found', array('status' => 404));
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
        
        $price_data[] = array(
            'id' => $price->ID,
            'price' => get_post_meta($price->ID, 'price_amount', true),
            'currency' => get_post_meta($price->ID, 'price_currency', true),
            'store' => array(
                'id' => $store_id,
                'name' => $store ? $store->post_title : '',
                'logo' => get_the_post_thumbnail_url($store_id, 'thumbnail'),
            ),
            'last_updated' => get_post_meta($price->ID, 'price_updated', true),
        );
    }
    
    // Sort prices from lowest to highest
    usort($price_data, function($a, $b) {
        return $a['price'] - $b['price'];
    });
    
    $result = array(
        'product' => array(
            'id' => $product->ID,
            'title' => $product->post_title,
            'image' => get_the_post_thumbnail_url($product->ID, 'thumbnail'),
        ),
        'prices' => $price_data,
        'lowest_price' => !empty($price_data) ? $price_data[0] : null,
        'price_difference' => !empty($price_data) && count($price_data) > 1 ? $price_data[count($price_data) - 1]['price'] - $price_data[0]['price'] : 0,
    );
    
    return $result;
}

/**
 * Add shortcode for price comparison
 */
function tesco_comparison_shortcode($atts) {
    $atts = shortcode_atts(array(
        'product_id' => 0,
        'stores' => '',
        'limit' => 5,
    ), $atts);
    
    if (empty($atts['product_id'])) {
        return '<p>' . __('Please specify a product ID to compare prices.', 'tesco-comparison') . '</p>';
    }
    
    $product = get_post($atts['product_id']);
    if (!$product || $product->post_type !== 'product') {
        return '<p>' . __('Invalid product ID.', 'tesco-comparison') . '</p>';
    }
    
    $price_args = array(
        'post_type' => 'price',
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => 'product_id',
                'value' => $atts['product_id'],
            ),
        ),
    );
    
    // Filter by specific stores if provided
    if (!empty($atts['stores'])) {
        $store_ids = explode(',', $atts['stores']);
        $price_args['meta_query'][] = array(
            'key' => 'store_id',
            'value' => $store_ids,
            'compare' => 'IN',
        );
    }
    
    $prices = get_posts($price_args);
    
    if (empty($prices)) {
        return '<p>' . __('No price data available for this product.', 'tesco-comparison') . '</p>';
    }
    
    $price_data = array();
    foreach ($prices as $price) {
        $store_id = get_post_meta($price->ID, 'store_id', true);
        $store = get_post($store_id);
        
        if ($store) {
            $price_data[] = array(
                'price' => get_post_meta($price->ID, 'price_amount', true),
                'currency' => get_post_meta($price->ID, 'price_currency', true),
                'store_name' => $store->post_title,
                'store_logo' => get_the_post_thumbnail_url($store_id, 'thumbnail'),
            );
        }
    }
    
    // Sort prices from lowest to highest
    usort($price_data, function($a, $b) {
        return $a['price'] - $b['price'];
    });
    
    // Limit the number of results
    $price_data = array_slice($price_data, 0, intval($atts['limit']));
    
    ob_start();
    ?>
    <div class="tesco-price-comparison">
        <div class="tesco-product-info">
            <h3><?php echo esc_html($product->post_title); ?></h3>
            <?php if (has_post_thumbnail($product->ID)): ?>
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($product->ID, 'thumbnail')); ?>" alt="<?php echo esc_attr($product->post_title); ?>" class="tesco-product-image">
            <?php endif; ?>
        </div>
        
        <div class="tesco-price-list">
            <h4><?php _e('Price Comparison', 'tesco-comparison'); ?></h4>
            <ul>
                <?php foreach ($price_data as $price): ?>
                    <li class="tesco-price-item">
                        <div class="tesco-store">
                            <?php if (!empty($price['store_logo'])): ?>
                                <img src="<?php echo esc_url($price['store_logo']); ?>" alt="<?php echo esc_attr($price['store_name']); ?>" class="tesco-store-logo">
                            <?php endif; ?>
                            <span><?php echo esc_html($price['store_name']); ?></span>
                        </div>
                        <div class="tesco-price"><?php echo esc_html($price['currency'] . $price['price']); ?></div>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        
        <?php if (count($price_data) > 1): ?>
            <div class="tesco-savings">
                <p>
                    <?php 
                    $savings = $price_data[count($price_data) - 1]['price'] - $price_data[0]['price'];
                    printf(
                        __('Save up to %s by shopping at %s instead of %s', 'tesco-comparison'),
                        '<strong>' . $price_data[0]['currency'] . number_format($savings, 2) . '</strong>',
                        '<strong>' . $price_data[0]['store_name'] . '</strong>',
                        '<strong>' . $price_data[count($price_data) - 1]['store_name'] . '</strong>'
                    );
                    ?>
                </p>
            </div>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('price_comparison', 'tesco_comparison_shortcode');

/**
 * Create sample content on theme activation
 */
function tesco_comparison_create_sample_content() {
    // Only proceed if the theme was just activated
    if (get_option('tesco_comparison_sample_content_created')) {
        return;
    }
    
    // Create countries
    $countries = array(
        'Kenya' => 'kenya',
        'United Kingdom' => 'uk',
        'Germany' => 'germany',
        'USA' => 'usa',
        'South Africa' => 'south-africa',
    );
    
    $country_ids = array();
    foreach ($countries as $name => $slug) {
        $term = wp_insert_term($name, 'country', array('slug' => $slug));
        if (!is_wp_error($term)) {
            $country_ids[$slug] = $term['term_id'];
        }
    }
    
    // Create stores
    $stores = array(
        'Tesco' => array(
            'description' => 'Tesco is one of the world\'s leading multinational grocers.',
            'country' => 'uk',
            'logo' => 'tesco-logo.svg',
            'website' => 'https://www.tesco.com/',
        ),
        'Carrefour' => array(
            'description' => 'Carrefour is a French multinational retail corporation.',
            'country' => 'kenya',
            'logo' => 'carrefour-logo.svg',
            'website' => 'https://www.carrefour.ke/',
        ),
        'Naivas' => array(
            'description' => 'Naivas is a leading supermarket chain in Kenya.',
            'country' => 'kenya',
            'logo' => 'naivas-logo.svg',
            'website' => 'https://www.naivas.co.ke/',
        ),
        'Walmart' => array(
            'description' => 'Walmart is an American multinational retail corporation.',
            'country' => 'usa',
            'logo' => 'walmart-logo.svg',
            'website' => 'https://www.walmart.com/',
        ),
    );
    
    $store_ids = array();
    foreach ($stores as $name => $store_data) {
        $store_args = array(
            'post_title' => $name,
            'post_content' => $store_data['description'],
            'post_status' => 'publish',
            'post_type' => 'store',
        );
        
        $store_id = wp_insert_post($store_args);
        
        if (!is_wp_error($store_id)) {
            $store_ids[$name] = $store_id;
            
            // Set country
            if (isset($country_ids[$store_data['country']])) {
                wp_set_object_terms($store_id, $country_ids[$store_data['country']], 'country');
            }
            
            // Set custom fields
            update_post_meta($store_id, 'store_website', $store_data['website']);
            
            // Set featured image
            tesco_comparison_set_featured_image_from_asset($store_id, $store_data['logo']);
        }
    }
    
    // Create products and prices
    $products = array(
        'Milk 1L' => array(
            'description' => 'Fresh whole milk, 1 liter carton.',
            'category' => 'Dairy',
            'image' => 'product-milk.svg',
            'prices' => array(
                'Tesco' => array('amount' => 1.10, 'currency' => '£'),
                'Carrefour' => array('amount' => 1.20, 'currency' => '£'),
                'Naivas' => array('amount' => 1.15, 'currency' => '£'),
                'Walmart' => array('amount' => 1.05, 'currency' => '£'),
            ),
        ),
        'Bread Loaf' => array(
            'description' => 'White bread loaf, 800g.',
            'category' => 'Bakery',
            'image' => 'product-sunlight.svg',
            'prices' => array(
                'Tesco' => array('amount' => 1.00, 'currency' => '£'),
                'Carrefour' => array('amount' => 1.10, 'currency' => '£'),
                'Naivas' => array('amount' => 1.05, 'currency' => '£'),
                'Walmart' => array('amount' => 0.95, 'currency' => '£'),
            ),
        ),
        'Eggs (Dozen)' => array(
            'description' => 'Fresh large eggs, pack of 12.',
            'category' => 'Dairy',
            'image' => 'product-sunlight.svg',
            'prices' => array(
                'Tesco' => array('amount' => 2.00, 'currency' => '£'),
                'Carrefour' => array('amount' => 2.20, 'currency' => '£'),
                'Naivas' => array('amount' => 2.10, 'currency' => '£'),
                'Walmart' => array('amount' => 1.95, 'currency' => '£'),
            ),
        ),
    );
    
    // Create product category taxonomy
    $categories = array();
    foreach ($products as $name => $product_data) {
        if (!isset($categories[$product_data['category']])) {
            $term = wp_insert_term($product_data['category'], 'product_category');
            if (!is_wp_error($term)) {
                $categories[$product_data['category']] = $term['term_id'];
            }
        }
    }
    
    // Create products and prices
    foreach ($products as $name => $product_data) {
        $product_args = array(
            'post_title' => $name,
            'post_content' => $product_data['description'],
            'post_status' => 'publish',
            'post_type' => 'product',
        );
        
        $product_id = wp_insert_post($product_args);
        
        if (!is_wp_error($product_id)) {
            // Set category
            if (isset($categories[$product_data['category']])) {
                wp_set_object_terms($product_id, $categories[$product_data['category']], 'product_category');
            }
            
            // Set featured image
            tesco_comparison_set_featured_image_from_asset($product_id, $product_data['image']);
            
            // Create prices
            foreach ($product_data['prices'] as $store_name => $price_data) {
                if (isset($store_ids[$store_name])) {
                    $price_args = array(
                        'post_title' => $name . ' - ' . $store_name,
                        'post_status' => 'publish',
                        'post_type' => 'price',
                    );
                    
                    $price_id = wp_insert_post($price_args);
                    
                    if (!is_wp_error($price_id)) {
                        update_post_meta($price_id, 'product_id', $product_id);
                        update_post_meta($price_id, 'store_id', $store_ids[$store_name]);
                        update_post_meta($price_id, 'price_amount', $price_data['amount']);
                        update_post_meta($price_id, 'price_currency', $price_data['currency']);
                        update_post_meta($price_id, 'price_updated', date('Y-m-d H:i:s'));
                    }
                }
            }
        }
    }
    
    // Create pages
    $pages = array(
        'Price Comparison' => array(
            'content' => '<!-- wp:heading {"level":1} -->
<h1>Compare Supermarket Prices</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Welcome to the Tesco Price Comparison platform, where you can compare prices across multiple stores and marketplaces worldwide.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[price_comparison product_id="' . array_values(get_posts(array('post_type' => 'product', 'posts_per_page' => 1)))[0]->ID . '"]
<!-- /wp:shortcode -->

<!-- wp:heading -->
<h2>Featured Stores</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":1,"query":{"perPage":4,"postType":"store","order":"asc","orderBy":"title"}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column {"width":"25%"} -->
<div class="wp-block-column" style="flex-basis:25%">
<!-- wp:post-featured-image {"isLink":true,"width":"100px","height":"80px"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"75%"} -->
<div class="wp-block-column" style="flex-basis:75%">
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-excerpt {"moreText":"Visit Store"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
<!-- /wp:post-template -->
</div>
<!-- /wp:query -->',
            'template' => 'page-comparison.php',
        ),
        'Stores' => array(
            'content' => '<!-- wp:heading {"level":1} -->
<h1>Our Partner Stores</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Browse the list of stores available for price comparison on our platform.</p>
<!-- /wp:paragraph -->

<!-- wp:query {"queryId":2,"query":{"perPage":-1,"postType":"store","order":"asc","orderBy":"title"}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column {"width":"20%"} -->
<div class="wp-block-column" style="flex-basis:20%">
<!-- wp:post-featured-image {"isLink":true,"width":"100px","height":"80px"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"80%"} -->
<div class="wp-block-column" style="flex-basis:80%">
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-excerpt {"moreText":"View Store Details"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
<!-- /wp:post-template -->
</div>
<!-- /wp:query -->',
            'template' => 'page-stores.php',
        ),
        'Products' => array(
            'content' => '<!-- wp:heading {"level":1} -->
<h1>Product Catalog</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Browse our product catalog to find and compare prices across multiple stores.</p>
<!-- /wp:paragraph -->

<!-- wp:query {"queryId":3,"query":{"perPage":-1,"postType":"product","order":"asc","orderBy":"title"}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column {"width":"20%"} -->
<div class="wp-block-column" style="flex-basis:20%">
<!-- wp:post-featured-image {"isLink":true,"width":"100px","height":"100px"} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"80%"} -->
<div class="wp-block-column" style="flex-basis:80%">
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-excerpt {"moreText":"Compare Prices"} /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
<!-- /wp:post-template -->
</div>
<!-- /wp:query -->',
            'template' => 'page-products.php',
        ),
        'About Us' => array(
            'content' => '<!-- wp:heading {"level":1} -->
<h1>About Tesco Price Comparison</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Tesco Price Comparison is a global e-commerce price comparison platform that leverages advanced real-time tracking and intelligent analytics to help users make informed purchasing decisions across multiple countries and stores.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Our Mission</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Our mission is to empower consumers with transparent pricing information, allowing them to make smart shopping decisions and save money on their everyday purchases.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Our Coverage</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We currently cover multiple countries including Kenya, Uganda, Tanzania, South Africa, UK, Germany, Italy, France, USA, Canada, and Australia. Our platform compares prices from major supermarkets and online marketplaces including Amazon, eBay, AliExpress, Jumia, and Kilimall.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Features</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>Real-time price tracking across multiple retailers</li>
<li>Multi-language support for global accessibility</li>
<li>Responsive design for both desktop and mobile</li>
<li>Price history tracking to identify trends</li>
<li>AI-powered product recommendations</li>
<li>User reviews and ratings</li>
</ul>
<!-- /wp:list -->',
            'template' => 'page.php',
        ),
        'Contact' => array(
            'content' => '<!-- wp:heading {"level":1} -->
<h1>Contact Us</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We\'d love to hear from you! Please use the form below to get in touch with our team.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<form class="contact-form" id="contactForm">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="subject" required>
  </div>
  
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  
  <button type="submit" class="submit-button">Send Message</button>
</form>
<!-- /wp:html -->

<!-- wp:heading {"level":2} -->
<h2>Our Office</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Address:</strong> 123 Comparison Street, Nairobi, Kenya<br><strong>Email:</strong> info@hyrisecrown.com<br><strong>Phone:</strong> +254 123 456 789</p>
<!-- /wp:paragraph -->',
            'template' => 'page.php',
        ),
    );
    
    foreach ($pages as $title => $page_data) {
        $page_args = array(
            'post_title' => $title,
            'post_content' => $page_data['content'],
            'post_status' => 'publish',
            'post_type' => 'page',
        );
        
        $page_id = wp_insert_post($page_args);
        
        if (!is_wp_error($page_id) && !empty($page_data['template'])) {
            update_post_meta($page_id, '_wp_page_template', $page_data['template']);
        }
    }
    
    // Set front page
    $home = get_page_by_title('Price Comparison');
    if ($home) {
        update_option('page_on_front', $home->ID);
        update_option('show_on_front', 'page');
    }
    
    // Set menu
    $menu_name = 'Primary Menu';
    $menu_exists = wp_get_nav_menu_object($menu_name);
    
    if (!$menu_exists) {
        $menu_id = wp_create_nav_menu($menu_name);
        
        // Add pages to menu
        foreach ($pages as $title => $page_data) {
            $page = get_page_by_title($title);
            if ($page) {
                wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title' => $page->post_title,
                    'menu-item-object' => 'page',
                    'menu-item-object-id' => $page->ID,
                    'menu-item-type' => 'post_type',
                    'menu-item-status' => 'publish',
                ));
            }
        }
        
        // Assign menu to location
        $locations = get_theme_mod('nav_menu_locations');
        $locations['primary'] = $menu_id;
        set_theme_mod('nav_menu_locations', $locations);
    }
    
    // Mark as completed
    update_option('tesco_comparison_sample_content_created', true);
}
add_action('after_switch_theme', 'tesco_comparison_create_sample_content');

/**
 * Helper function to set featured image from assets
 */
function tesco_comparison_set_featured_image_from_asset($post_id, $asset_filename) {
    $upload_dir = wp_upload_dir();
    $asset_path = get_template_directory() . '/assets/' . $asset_filename;
    
    if (file_exists($asset_path)) {
        $file_type = wp_check_filetype(basename($asset_path), null);
        
        $attachment = array(
            'guid' => $upload_dir['url'] . '/' . basename($asset_path),
            'post_mime_type' => $file_type['type'],
            'post_title' => sanitize_file_name(basename($asset_path)),
            'post_content' => '',
            'post_status' => 'inherit',
        );
        
        $attach_id = wp_insert_attachment($attachment, $asset_path, $post_id);
        
        if (!is_wp_error($attach_id)) {
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            $attach_data = wp_generate_attachment_metadata($attach_id, $asset_path);
            wp_update_attachment_metadata($attach_id, $attach_data);
            set_post_thumbnail($post_id, $attach_id);
        }
    }
}

/**
 * Define splash screen constants and functions
 */
function tesco_comparison_splash_screen() {
    if (get_option('tesco_enable_splash_screen')) {
        ?>
        <div class="splash-screen" id="splashScreen">
            <div class="splash-logo">tesco</div>
            <div class="splash-spinner"></div>
        </div>
        <?php
    }
}
add_action('wp_body_open', 'tesco_comparison_splash_screen');

/**
 * Add required JavaScript files
 */
function tesco_comparison_create_js_files() {
    // Create directory
    if (!file_exists(get_template_directory() . '/js')) {
        mkdir(get_template_directory() . '/js', 0755, true);
    }
    
    // Create navigation.js
    $navigation_js_path = get_template_directory() . '/js/navigation.js';
    if (!file_exists($navigation_js_path)) {
        $navigation_js = "/**
 * Navigation Script
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', function() {
            primaryNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Country selector functionality
    const countrySelector = document.querySelector('.select-wrapper');
    if (countrySelector) {
        countrySelector.addEventListener('click', function() {
            // In a real implementation, this would show a dropdown of countries
            alert('Country selection will be implemented in the future!');
        });
    }
    
    // Compare button functionality
    const compareButtons = document.querySelectorAll('.compare-button');
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.trending-deal').querySelector('.product-title').textContent;
            alert('Comparing prices for ' + productName + ' (This would open a comparison modal in the full implementation)');
        });
    });
});";
        file_put_contents($navigation_js_path, $navigation_js);
    }
    
    // Create splash-screen.js
    $splash_js_path = get_template_directory() . '/js/splash-screen.js';
    if (!file_exists($splash_js_path)) {
        $splash_js = "/**
 * Splash Screen Script
 */
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splashScreen');
    
    if (splashScreen) {
        // Hide splash screen after 2 seconds
        setTimeout(function() {
            splashScreen.style.opacity = '0';
            setTimeout(function() {
                splashScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }
});";
        file_put_contents($splash_js_path, $splash_js);
    }
}
add_action('after_setup_theme', 'tesco_comparison_create_js_files');

/**
 * Setup theme templates
 */
function tesco_comparison_create_templates() {
    // Create header.php
    $header_path = get_template_directory() . '/header.php';
    if (!file_exists($header_path)) {
        $header_content = '<?php
/**
 * The header for our theme
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo(\'charset\'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <a href="<?php echo esc_url(home_url(\'/\')); ?>" class="logo">tesco</a>
    
    <div class="domain">
        <span class="material-icons" style="font-size: 18px;">language</span>
        <?php echo esc_html(str_replace(\'www.\', \'\', parse_url(get_site_url(), PHP_URL_HOST))); ?>
    </div>
    
    <button class="mobile-menu-toggle" aria-controls="primary-menu" aria-expanded="false">
        <span class="material-icons">menu</span>
    </button>
    
    <nav id="site-navigation" class="primary-navigation">
        <?php
        wp_nav_menu(
            array(
                \'theme_location\' => \'primary\',
                \'menu_id\'        => \'primary-menu\',
                \'container\'      => false,
            )
        );
        ?>
    </nav>
    
    <select class="language-selector">
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="de">DE</option>
        <option value="it">IT</option>
        <option value="es">ES</option>
        <option value="sw">SW</option>
    </select>
</header>';
        file_put_contents($header_path, $header_content);
    }
    
    // Create footer.php
    $footer_path = get_template_directory() . '/footer.php';
    if (!file_exists($footer_path)) {
        $footer_content = '<?php
/**
 * The footer for our theme
 */
?>

<footer class="site-footer">
    <div class="container">
        <div class="footer-widgets">
            <?php if (is_active_sidebar(\'footer-1\')): ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar(\'footer-1\'); ?>
                </div>
            <?php else: ?>
                <div class="footer-widget-area">
                    <h3 class="footer-widget-title">Tesco Price Comparison</h3>
                    <p>Compare prices across multiple stores and marketplaces worldwide.</p>
                </div>
            <?php endif; ?>
            
            <?php if (is_active_sidebar(\'footer-2\')): ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar(\'footer-2\'); ?>
                </div>
            <?php else: ?>
                <div class="footer-widget-area">
                    <h3 class="footer-widget-title">Quick Links</h3>
                    <ul>
                        <li><a href="<?php echo esc_url(home_url(\'/products/\')); ?>">Products</a></li>
                        <li><a href="<?php echo esc_url(home_url(\'/stores/\')); ?>">Stores</a></li>
                        <li><a href="<?php echo esc_url(home_url(\'/about-us/\')); ?>">About Us</a></li>
                        <li><a href="<?php echo esc_url(home_url(\'/contact/\')); ?>">Contact</a></li>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if (is_active_sidebar(\'footer-3\')): ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar(\'footer-3\'); ?>
                </div>
            <?php else: ?>
                <div class="footer-widget-area">
                    <h3 class="footer-widget-title">Legal</h3>
                    <ul>
                        <li><a href="<?php echo esc_url(home_url(\'/terms/\')); ?>">Terms of Service</a></li>
                        <li><a href="<?php echo esc_url(home_url(\'/privacy/\')); ?>">Privacy Policy</a></li>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="footer-copyright">
            <p>&copy; <?php echo date(\'Y\'); ?> Tesco Price Comparison. All rights reserved.</p>
            <p>Powered by WordPress | Domain: <a href="https://hyrisecrown.com">hyrisecrown.com</a></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?></body></html>';
        file_put_contents($footer_path, $footer_content);
    }
    
    // Create index.php
    $index_path = get_template_directory() . '/index.php';
    if (!file_exists($index_path)) {
        $index_content = '<?php
/**
 * The main template file
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php if (is_home() && !is_front_page()): ?>
    <header class="page-header">
        <h1 class="page-title"><?php single_post_title(); ?></h1>
    </header>
    <?php endif; ?>

    <?php if (have_posts()): ?>
        <div class="posts-container">
            <?php while (have_posts()): the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <?php if (has_post_thumbnail()): ?>
                        <div class="post-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail(\'medium\'); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    
                    <header class="entry-header">
                        <?php the_title(\'<h2 class="entry-title"><a href="\' . esc_url(get_permalink()) . \'" rel="bookmark">\', \'</a></h2>\'); ?>
                        
                        <div class="entry-meta">
                            <span class="posted-on">
                                <?php echo esc_html(get_the_date()); ?>
                            </span>
                            <span class="posted-by">
                                <?php echo esc_html(get_the_author()); ?>
                            </span>
                        </div>
                    </header>
                    
                    <div class="entry-content">
                        <?php the_excerpt(); ?>
                    </div>
                    
                    <footer class="entry-footer">
                        <a href="<?php the_permalink(); ?>" class="read-more-link">
                            <?php _e(\'Read More\', \'tesco-comparison\'); ?>
                        </a>
                    </footer>
                </article>
            <?php endwhile; ?>
        </div>
        
        <?php the_posts_navigation(); ?>
        
    <?php else: ?>
        <div class="no-results">
            <h2><?php _e(\'No posts found\', \'tesco-comparison\'); ?></h2>
            <p><?php _e(\'Sorry, no posts matched your criteria.\', \'tesco-comparison\'); ?></p>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>';
        file_put_contents($index_path, $index_content);
    }
    
    // Create front-page.php
    $front_page_path = get_template_directory() . '/front-page.php';
    if (!file_exists($front_page_path)) {
        $front_page_content = '<?php
/**
 * The front page template file
 */

get_header();
?>

<main id="primary" class="site-main">
    <!-- Hero Section -->
    <section class="hero">
        <h1>Compare Supermarket Prices</h1>
        <a href="#compare" class="button" id="startCompareButton">Start Comparing</a>
    </section>
    
    <!-- Country Selector -->
    <div class="country-selector">
        <div class="select-wrapper">
            <div class="country-select">
                <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/kenya-flag.png\'); ?>" alt="Kenya Flag" class="country-flag">
                <span>Kenya</span>
            </div>
            <span class="material-icons">expand_more</span>
        </div>
    </div>
    
    <?php if (get_option(\'tesco_google_adsense_id\')): ?>
    <!-- Google AdSense Banner -->
    <div class="ad-banner" id="adBanner">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=<?php echo esc_attr(get_option(\'tesco_google_adsense_id\')); ?>"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="<?php echo esc_attr(get_option(\'tesco_google_adsense_id\')); ?>"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </div>
    <?php else: ?>
    <!-- Placeholder for AdSense -->
    <div class="ad-banner">
        <div style="height: 60px; display: flex; align-items: center; justify-content: center; text-align: center;">
            Google AdSense banner will appear here
        </div>
    </div>
    <?php endif; ?>
    
    <!-- Featured Stores -->
    <h2 class="section-title">Featured Stores</h2>
    <?php
    $featured_stores = get_posts(array(
        \'post_type\' => \'store\',
        \'posts_per_page\' => 4,
        \'orderby\' => \'title\',
        \'order\' => \'ASC\',
    ));
    
    if ($featured_stores): ?>
    <div class="store-list">
        <?php foreach ($featured_stores as $store): ?>
        <div class="store-card">
            <?php if (has_post_thumbnail($store->ID)): ?>
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($store->ID, \'thumbnail\')); ?>" alt="<?php echo esc_attr($store->post_title); ?>" class="store-logo">
            <?php else: ?>
                <div class="store-name"><?php echo esc_html($store->post_title); ?></div>
            <?php endif; ?>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else: ?>
    <div class="store-list">
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/tesco-logo.svg\'); ?>" alt="Tesco" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/carrefour-logo.svg\'); ?>" alt="Carrefour" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/naivas-logo.svg\'); ?>" alt="Naivas" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/walmart-logo.svg\'); ?>" alt="Walmart" class="store-logo">
        </div>
    </div>
    <?php endif; ?>
    
    <!-- Trending Deals -->
    <h2 class="section-title">Trending Deals</h2>
    <?php
    $trending_products = get_posts(array(
        \'post_type\' => \'product\',
        \'posts_per_page\' => 2,
        \'orderby\' => \'rand\',
    ));
    
    if ($trending_products): ?>
    <div class="trending-deals-container">
        <?php foreach ($trending_products as $product): 
            // Get the lowest price for this product
            $price_args = array(
                \'post_type\' => \'price\',
                \'posts_per_page\' => 1,
                \'meta_key\' => \'price_amount\',
                \'orderby\' => \'meta_value_num\',
                \'order\' => \'ASC\',
                \'meta_query\' => array(
                    array(
                        \'key\' => \'product_id\',
                        \'value\' => $product->ID,
                    ),
                ),
            );
            
            $prices = get_posts($price_args);
            $price_display = \'\';
            
            if (!empty($prices)) {
                $price = $prices[0];
                $amount = get_post_meta($price->ID, \'price_amount\', true);
                $currency = get_post_meta($price->ID, \'price_currency\', true);
                $price_display = $currency . number_format((float)$amount, 2);
            }
        ?>
        <div class="trending-deal">
            <?php if (has_post_thumbnail($product->ID)): ?>
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($product->ID, \'thumbnail\')); ?>" alt="<?php echo esc_attr($product->post_title); ?>" class="product-image">
            <?php else: ?>
                <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/product-sunlight.svg\'); ?>" alt="<?php echo esc_attr($product->post_title); ?>" class="product-image">
            <?php endif; ?>
            
            <div class="product-details">
                <div class="product-title"><?php echo esc_html($product->post_title); ?></div>
                <?php if ($price_display): ?>
                    <div class="product-price"><?php echo esc_html($price_display); ?></div>
                <?php endif; ?>
            </div>
            
            <a href="<?php echo esc_url(add_query_arg(\'product_id\', $product->ID, home_url(\'/compare/\'))); ?>" class="compare-button" aria-label="Compare Prices">
                <span class="material-icons">search</span>
            </a>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else: ?>
    <div class="trending-deal">
        <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/product-sunlight.svg\'); ?>" alt="Sunlight Washing Powder" class="product-image">
        <div class="product-details">
            <div class="product-title">Sunlight Washing Powder 2kg</div>
            <div class="product-price">$4.99</div>
        </div>
        <a href="#compare" class="compare-button" aria-label="Compare Prices">
            <span class="material-icons">search</span>
        </a>
    </div>
    
    <div class="trending-deal">
        <img src="<?php echo esc_url(get_template_directory_uri() . \'/assets/product-milk.svg\'); ?>" alt="Fresh Milk" class="product-image">
        <div class="product-details">
            <div class="product-title">Fresh Milk 1L</div>
            <div class="product-price">$1.29</div>
        </div>
        <a href="#compare" class="compare-button" aria-label="Compare Prices">
            <span class="material-icons">search</span>
        </a>
    </div>
    <?php endif; ?>
    
    <!-- Newsletter -->
    <div class="newsletter">
        <h2 class="newsletter-title">Newsletter</h2>
        <p class="newsletter-subtitle">Sign up for updates on the latest deals and price drops</p>
        <form class="newsletter-form" id="newsletterForm">
            <input type="email" placeholder="Email address" class="email-input" required>
            <button type="submit" class="subscribe-button">Subscribe</button>
        </form>
    </div>
    
    <?php the_content(); ?>
</main>

<?php get_footer(); ?>';
        file_put_contents($front_page_path, $front_page_content);
    }
}
add_action('after_setup_theme', 'tesco_comparison_create_templates');