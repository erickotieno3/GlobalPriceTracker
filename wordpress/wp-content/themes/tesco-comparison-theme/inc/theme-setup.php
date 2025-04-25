<?php
/**
 * Theme setup functions
 * This file contains functions to set up the theme
 *
 * @package Tesco_Comparison
 */

/**
 * Register post types for the theme
 */
function tesco_register_post_types() {
    // Register store post type
    register_post_type('store', array(
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
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite' => array('slug' => 'stores'),
        'show_in_rest' => true,
    ));
    
    // Register product post type
    register_post_type('product', array(
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
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite' => array('slug' => 'products'),
        'show_in_rest' => true,
    ));
    
    // Register price post type
    register_post_type('price', array(
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
        'supports' => array('title', 'custom-fields'),
        'show_in_rest' => true,
    ));
    
    // Register subscriber post type
    register_post_type('subscriber', array(
        'labels' => array(
            'name' => __('Subscribers', 'tesco-comparison'),
            'singular_name' => __('Subscriber', 'tesco-comparison'),
            'add_new' => __('Add New Subscriber', 'tesco-comparison'),
            'add_new_item' => __('Add New Subscriber', 'tesco-comparison'),
            'edit_item' => __('Edit Subscriber', 'tesco-comparison'),
            'new_item' => __('New Subscriber', 'tesco-comparison'),
            'view_item' => __('View Subscriber', 'tesco-comparison'),
            'search_items' => __('Search Subscribers', 'tesco-comparison'),
            'not_found' => __('No subscribers found', 'tesco-comparison'),
            'not_found_in_trash' => __('No subscribers found in Trash', 'tesco-comparison'),
        ),
        'public' => false,
        'show_ui' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-email',
        'supports' => array('title', 'custom-fields'),
        'show_in_rest' => true,
    ));
    
    // Register taxonomies
    register_taxonomy('product_category', 'product', array(
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
    ));
    
    register_taxonomy('country', array('store', 'product'), array(
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
    ));
}
add_action('init', 'tesco_register_post_types');

/**
 * Register meta boxes for the theme
 */
function tesco_register_meta_boxes() {
    // Store meta box
    add_meta_box(
        'tesco_store_meta',
        __('Store Details', 'tesco-comparison'),
        'tesco_store_meta_box_callback',
        'store',
        'normal',
        'default'
    );
    
    // Price meta box
    add_meta_box(
        'tesco_price_meta',
        __('Price Details', 'tesco-comparison'),
        'tesco_price_meta_box_callback',
        'price',
        'normal',
        'default'
    );
    
    // Subscriber meta box
    add_meta_box(
        'tesco_subscriber_meta',
        __('Subscriber Details', 'tesco-comparison'),
        'tesco_subscriber_meta_box_callback',
        'subscriber',
        'normal',
        'default'
    );
}
add_action('add_meta_boxes', 'tesco_register_meta_boxes');

/**
 * Store meta box callback
 *
 * @param WP_Post $post The post object.
 */
function tesco_store_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('tesco_store_meta_box', 'tesco_store_meta_box_nonce');
    
    // Get the current values
    $website = get_post_meta($post->ID, 'store_website', true);
    $featured = get_post_meta($post->ID, 'store_featured', true);
    
    ?>
    <p>
        <label for="store_website"><?php _e('Store Website URL:', 'tesco-comparison'); ?></label>
        <input type="url" id="store_website" name="store_website" value="<?php echo esc_url($website); ?>" class="widefat">
    </p>
    <p>
        <label for="store_featured">
            <input type="checkbox" id="store_featured" name="store_featured" value="1" <?php checked($featured, '1'); ?>>
            <?php _e('Featured Store', 'tesco-comparison'); ?>
        </label>
    </p>
    <?php
}

/**
 * Price meta box callback
 *
 * @param WP_Post $post The post object.
 */
function tesco_price_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('tesco_price_meta_box', 'tesco_price_meta_box_nonce');
    
    // Get the current values
    $product_id = get_post_meta($post->ID, 'product_id', true);
    $store_id = get_post_meta($post->ID, 'store_id', true);
    $amount = get_post_meta($post->ID, 'price_amount', true);
    $currency = get_post_meta($post->ID, 'price_currency', true);
    $updated = get_post_meta($post->ID, 'price_updated', true);
    
    // Get products for dropdown
    $products = get_posts(array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    ));
    
    // Get stores for dropdown
    $stores = get_posts(array(
        'post_type' => 'store',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    ));
    
    ?>
    <p>
        <label for="product_id"><?php _e('Product:', 'tesco-comparison'); ?></label>
        <select id="product_id" name="product_id" class="widefat">
            <option value=""><?php _e('Select a product', 'tesco-comparison'); ?></option>
            <?php foreach ($products as $product): ?>
                <option value="<?php echo esc_attr($product->ID); ?>" <?php selected($product_id, $product->ID); ?>>
                    <?php echo esc_html($product->post_title); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <p>
        <label for="store_id"><?php _e('Store:', 'tesco-comparison'); ?></label>
        <select id="store_id" name="store_id" class="widefat">
            <option value=""><?php _e('Select a store', 'tesco-comparison'); ?></option>
            <?php foreach ($stores as $store): ?>
                <option value="<?php echo esc_attr($store->ID); ?>" <?php selected($store_id, $store->ID); ?>>
                    <?php echo esc_html($store->post_title); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <p>
        <label for="price_amount"><?php _e('Price Amount:', 'tesco-comparison'); ?></label>
        <input type="number" id="price_amount" name="price_amount" value="<?php echo esc_attr($amount); ?>" class="widefat" step="0.01" min="0">
    </p>
    <p>
        <label for="price_currency"><?php _e('Currency:', 'tesco-comparison'); ?></label>
        <input type="text" id="price_currency" name="price_currency" value="<?php echo esc_attr($currency); ?>" class="widefat" placeholder="$">
    </p>
    <p>
        <label for="price_updated"><?php _e('Last Updated:', 'tesco-comparison'); ?></label>
        <input type="datetime-local" id="price_updated" name="price_updated" value="<?php echo esc_attr(str_replace(' ', 'T', $updated)); ?>" class="widefat">
    </p>
    <?php
}

/**
 * Subscriber meta box callback
 *
 * @param WP_Post $post The post object.
 */
function tesco_subscriber_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('tesco_subscriber_meta_box', 'tesco_subscriber_meta_box_nonce');
    
    // Get the current values
    $email = get_post_meta($post->ID, 'subscriber_email', true);
    $status = get_post_meta($post->ID, 'subscriber_status', true);
    $date = get_post_meta($post->ID, 'subscriber_date', true);
    
    ?>
    <p>
        <label for="subscriber_email"><?php _e('Email:', 'tesco-comparison'); ?></label>
        <input type="email" id="subscriber_email" name="subscriber_email" value="<?php echo esc_attr($email); ?>" class="widefat">
    </p>
    <p>
        <label for="subscriber_status"><?php _e('Status:', 'tesco-comparison'); ?></label>
        <select id="subscriber_status" name="subscriber_status" class="widefat">
            <option value="active" <?php selected($status, 'active'); ?>><?php _e('Active', 'tesco-comparison'); ?></option>
            <option value="inactive" <?php selected($status, 'inactive'); ?>><?php _e('Inactive', 'tesco-comparison'); ?></option>
            <option value="unsubscribed" <?php selected($status, 'unsubscribed'); ?>><?php _e('Unsubscribed', 'tesco-comparison'); ?></option>
        </select>
    </p>
    <p>
        <label for="subscriber_date"><?php _e('Subscription Date:', 'tesco-comparison'); ?></label>
        <input type="datetime-local" id="subscriber_date" name="subscriber_date" value="<?php echo esc_attr(str_replace(' ', 'T', $date)); ?>" class="widefat">
    </p>
    <?php
}

/**
 * Save meta box data
 *
 * @param int $post_id The post ID.
 */
function tesco_save_meta_box_data($post_id) {
    // Check if we're autosaving
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Check the user's permissions
    if (isset($_POST['post_type'])) {
        if ($_POST['post_type'] === 'store') {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
            
            // Store meta box
            if (isset($_POST['tesco_store_meta_box_nonce']) && wp_verify_nonce($_POST['tesco_store_meta_box_nonce'], 'tesco_store_meta_box')) {
                // Save store website
                $website = isset($_POST['store_website']) ? sanitize_url($_POST['store_website']) : '';
                update_post_meta($post_id, 'store_website', $website);
                
                // Save featured status
                $featured = isset($_POST['store_featured']) ? '1' : '';
                update_post_meta($post_id, 'store_featured', $featured);
            }
        } elseif ($_POST['post_type'] === 'price') {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
            
            // Price meta box
            if (isset($_POST['tesco_price_meta_box_nonce']) && wp_verify_nonce($_POST['tesco_price_meta_box_nonce'], 'tesco_price_meta_box')) {
                // Save product ID
                $product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : '';
                update_post_meta($post_id, 'product_id', $product_id);
                
                // Save store ID
                $store_id = isset($_POST['store_id']) ? absint($_POST['store_id']) : '';
                update_post_meta($post_id, 'store_id', $store_id);
                
                // Save price amount
                $amount = isset($_POST['price_amount']) ? floatval($_POST['price_amount']) : '';
                update_post_meta($post_id, 'price_amount', $amount);
                
                // Save currency
                $currency = isset($_POST['price_currency']) ? sanitize_text_field($_POST['price_currency']) : '$';
                update_post_meta($post_id, 'price_currency', $currency);
                
                // Save updated date
                $updated = isset($_POST['price_updated']) ? sanitize_text_field($_POST['price_updated']) : current_time('mysql');
                $updated = str_replace('T', ' ', $updated);
                update_post_meta($post_id, 'price_updated', $updated);
                
                // Update post title
                $product = get_post($product_id);
                $store = get_post($store_id);
                
                if ($product && $store) {
                    $title = sprintf(
                        '%s - %s - %s%s',
                        $product->post_title,
                        $store->post_title,
                        $currency,
                        number_format($amount, 2)
                    );
                    
                    wp_update_post(array(
                        'ID' => $post_id,
                        'post_title' => $title,
                    ));
                }
            }
        } elseif ($_POST['post_type'] === 'subscriber') {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
            
            // Subscriber meta box
            if (isset($_POST['tesco_subscriber_meta_box_nonce']) && wp_verify_nonce($_POST['tesco_subscriber_meta_box_nonce'], 'tesco_subscriber_meta_box')) {
                // Save email
                $email = isset($_POST['subscriber_email']) ? sanitize_email($_POST['subscriber_email']) : '';
                update_post_meta($post_id, 'subscriber_email', $email);
                
                // Save status
                $status = isset($_POST['subscriber_status']) ? sanitize_text_field($_POST['subscriber_status']) : 'active';
                update_post_meta($post_id, 'subscriber_status', $status);
                
                // Save date
                $date = isset($_POST['subscriber_date']) ? sanitize_text_field($_POST['subscriber_date']) : current_time('mysql');
                $date = str_replace('T', ' ', $date);
                update_post_meta($post_id, 'subscriber_date', $date);
                
                // Update post title
                wp_update_post(array(
                    'ID' => $post_id,
                    'post_title' => $email,
                ));
            }
        }
    }
}
add_action('save_post', 'tesco_save_meta_box_data');

/**
 * Add meta columns to admin list tables
 *
 * @param array $columns The columns array.
 * @param string $post_type The post type.
 * @return array The modified columns array.
 */
function tesco_add_meta_columns($columns, $post_type) {
    switch ($post_type) {
        case 'store':
            $columns['store_website'] = __('Website', 'tesco-comparison');
            $columns['store_featured'] = __('Featured', 'tesco-comparison');
            $columns['country'] = __('Country', 'tesco-comparison');
            break;
        case 'product':
            $columns['product_category'] = __('Category', 'tesco-comparison');
            $columns['country'] = __('Country', 'tesco-comparison');
            break;
        case 'price':
            $columns['product'] = __('Product', 'tesco-comparison');
            $columns['store'] = __('Store', 'tesco-comparison');
            $columns['price'] = __('Price', 'tesco-comparison');
            $columns['updated'] = __('Updated', 'tesco-comparison');
            break;
        case 'subscriber':
            $columns['email'] = __('Email', 'tesco-comparison');
            $columns['status'] = __('Status', 'tesco-comparison');
            $columns['date'] = __('Subscription Date', 'tesco-comparison');
            break;
    }
    
    return $columns;
}
add_filter('manage_posts_columns', 'tesco_add_meta_columns', 10, 2);

/**
 * Display meta columns in admin list tables
 *
 * @param string $column The column name.
 * @param int $post_id The post ID.
 */
function tesco_display_meta_columns($column, $post_id) {
    switch ($column) {
        case 'store_website':
            $website = get_post_meta($post_id, 'store_website', true);
            if ($website) {
                echo '<a href="' . esc_url($website) . '" target="_blank">' . esc_html($website) . '</a>';
            } else {
                echo '—';
            }
            break;
        case 'store_featured':
            $featured = get_post_meta($post_id, 'store_featured', true);
            if ($featured) {
                echo '<span class="dashicons dashicons-star-filled" style="color: #ffb900;"></span>';
            } else {
                echo '—';
            }
            break;
        case 'country':
            $terms = get_the_terms($post_id, 'country');
            if ($terms && !is_wp_error($terms)) {
                $countries = array();
                foreach ($terms as $term) {
                    $countries[] = $term->name;
                }
                echo esc_html(implode(', ', $countries));
            } else {
                echo '—';
            }
            break;
        case 'product_category':
            $terms = get_the_terms($post_id, 'product_category');
            if ($terms && !is_wp_error($terms)) {
                $categories = array();
                foreach ($terms as $term) {
                    $categories[] = $term->name;
                }
                echo esc_html(implode(', ', $categories));
            } else {
                echo '—';
            }
            break;
        case 'product':
            $product_id = get_post_meta($post_id, 'product_id', true);
            $product = get_post($product_id);
            if ($product) {
                echo '<a href="' . esc_url(get_edit_post_link($product_id)) . '">' . esc_html($product->post_title) . '</a>';
            } else {
                echo '—';
            }
            break;
        case 'store':
            $store_id = get_post_meta($post_id, 'store_id', true);
            $store = get_post($store_id);
            if ($store) {
                echo '<a href="' . esc_url(get_edit_post_link($store_id)) . '">' . esc_html($store->post_title) . '</a>';
            } else {
                echo '—';
            }
            break;
        case 'price':
            $amount = get_post_meta($post_id, 'price_amount', true);
            $currency = get_post_meta($post_id, 'price_currency', true) ?: '$';
            if ($amount !== '') {
                echo esc_html($currency . number_format($amount, 2));
            } else {
                echo '—';
            }
            break;
        case 'updated':
            $updated = get_post_meta($post_id, 'price_updated', true);
            if ($updated) {
                echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($updated)));
            } else {
                echo '—';
            }
            break;
        case 'email':
            $email = get_post_meta($post_id, 'subscriber_email', true);
            if ($email) {
                echo esc_html($email);
            } else {
                echo '—';
            }
            break;
        case 'status':
            $status = get_post_meta($post_id, 'subscriber_status', true);
            if ($status) {
                $status_labels = array(
                    'active' => __('Active', 'tesco-comparison'),
                    'inactive' => __('Inactive', 'tesco-comparison'),
                    'unsubscribed' => __('Unsubscribed', 'tesco-comparison'),
                );
                
                $label = isset($status_labels[$status]) ? $status_labels[$status] : $status;
                $color = $status === 'active' ? 'green' : ($status === 'inactive' ? 'orange' : 'red');
                
                echo '<span style="color: ' . esc_attr($color) . ';">' . esc_html($label) . '</span>';
            } else {
                echo '—';
            }
            break;
        case 'date':
            $date = get_post_meta($post_id, 'subscriber_date', true);
            if ($date) {
                echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($date)));
            } else {
                echo '—';
            }
            break;
    }
}
add_action('manage_posts_custom_column', 'tesco_display_meta_columns', 10, 2);

/**
 * Make meta columns sortable in admin list tables
 *
 * @param array $columns The sortable columns array.
 * @return array The modified sortable columns array.
 */
function tesco_make_meta_columns_sortable($columns) {
    $columns['store_featured'] = 'store_featured';
    $columns['price'] = 'price_amount';
    $columns['updated'] = 'price_updated';
    $columns['status'] = 'subscriber_status';
    $columns['date'] = 'subscriber_date';
    
    return $columns;
}
add_filter('manage_edit-price_sortable_columns', 'tesco_make_meta_columns_sortable');
add_filter('manage_edit-store_sortable_columns', 'tesco_make_meta_columns_sortable');
add_filter('manage_edit-subscriber_sortable_columns', 'tesco_make_meta_columns_sortable');

/**
 * Add ordering for meta columns in admin list tables
 *
 * @param WP_Query $query The query object.
 */
function tesco_meta_columns_orderby($query) {
    if (!is_admin()) {
        return;
    }
    
    $orderby = $query->get('orderby');
    
    switch ($orderby) {
        case 'store_featured':
            $query->set('meta_key', 'store_featured');
            $query->set('orderby', 'meta_value');
            break;
        case 'price_amount':
            $query->set('meta_key', 'price_amount');
            $query->set('orderby', 'meta_value_num');
            break;
        case 'price_updated':
            $query->set('meta_key', 'price_updated');
            $query->set('orderby', 'meta_value');
            break;
        case 'subscriber_status':
            $query->set('meta_key', 'subscriber_status');
            $query->set('orderby', 'meta_value');
            break;
        case 'subscriber_date':
            $query->set('meta_key', 'subscriber_date');
            $query->set('orderby', 'meta_value');
            break;
    }
}
add_action('pre_get_posts', 'tesco_meta_columns_orderby');