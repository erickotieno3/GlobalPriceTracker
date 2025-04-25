<?php
/**
 * Content Revision System
 * This file handles unlimited content revisions for products, prices, and stores
 *
 * @package Tesco_Comparison
 */

/**
 * Increase the number of revisions kept for specific post types
 */
function tesco_increase_post_revisions($num, $post) {
    // Set to -1 for unlimited revisions for our custom post types
    if (in_array($post->post_type, array('product', 'store', 'price'))) {
        return -1; // Unlimited revisions
    }
    
    // Return default for other post types
    return $num;
}
add_filter('wp_revisions_to_keep', 'tesco_increase_post_revisions', 10, 2);

/**
 * Add revision support to custom post types if not already added
 */
function tesco_add_revision_support() {
    // Add revision support to our custom post types if not already enabled
    if (!post_type_supports('product', 'revisions')) {
        add_post_type_support('product', 'revisions');
    }
    
    if (!post_type_supports('store', 'revisions')) {
        add_post_type_support('store', 'revisions');
    }
    
    if (!post_type_supports('price', 'revisions')) {
        add_post_type_support('price', 'revisions');
    }
}
add_action('init', 'tesco_add_revision_support', 11); // Run after post types are registered

/**
 * Add custom meta box to show revision history in admin
 */
function tesco_add_revision_meta_box() {
    // Add meta box to our custom post types
    add_meta_box(
        'tesco_revision_meta_box',
        __('Revision History', 'tesco-comparison'),
        'tesco_revision_meta_box_callback',
        array('product', 'store', 'price'),
        'side',
        'low'
    );
}
add_action('add_meta_boxes', 'tesco_add_revision_meta_box');

/**
 * Meta box callback to display revision history
 */
function tesco_revision_meta_box_callback($post) {
    // Get revisions for this post
    $revisions = wp_get_post_revisions($post->ID);
    
    if (empty($revisions)) {
        echo '<p>' . __('No revisions yet.', 'tesco-comparison') . '</p>';
        return;
    }
    
    echo '<ul class="revision-list">';
    
    $count = 0;
    foreach ($revisions as $revision) {
        // Limit display to 10 most recent, but all are still stored
        if ($count >= 10) {
            $remaining = count($revisions) - 10;
            if ($remaining > 0) {
                echo '<li class="revision-more">' . sprintf(
                    __('Plus %d more revisions', 'tesco-comparison'),
                    $remaining
                ) . '</li>';
            }
            break;
        }
        
        $date = date_i18n(
            __('F j, Y @ H:i:s', 'tesco-comparison'),
            strtotime($revision->post_date)
        );
        
        $revision_link = get_edit_post_link($revision->ID);
        $restore_link = wp_nonce_url(
            admin_url(
                'revision.php?action=restore&revision=' . $revision->ID
            ),
            "restore-post_{$post->ID}|{$revision->ID}"
        );
        
        echo '<li class="revision-item">';
        echo '<span class="revision-date">' . $date . '</span>';
        echo '<div class="revision-actions">';
        echo '<a href="' . esc_url($revision_link) . '" class="button-link">' . __('View', 'tesco-comparison') . '</a>';
        echo ' | ';
        echo '<a href="' . esc_url($restore_link) . '" class="button-link">' . __('Restore', 'tesco-comparison') . '</a>';
        echo '</div>';
        echo '</li>';
        
        $count++;
    }
    
    echo '</ul>';
    
    echo '<style>
        .revision-list {
            margin: 0;
            padding: 0;
        }
        .revision-item {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .revision-item:last-child {
            border-bottom: none;
        }
        .revision-date {
            display: block;
            font-size: 12px;
            color: #666;
        }
        .revision-actions {
            margin-top: 4px;
            font-size: 12px;
        }
        .revision-more {
            padding: 8px 0;
            color: #666;
            font-style: italic;
        }
    </style>';
}

/**
 * Include post meta in revisions
 */
function tesco_revision_post_meta_fields($fields) {
    // Product price meta fields to be included in revisions
    $price_fields = array(
        'product_id',
        'store_id',
        'price_amount',
        'price_currency',
        'price_updated'
    );
    
    // Store meta fields to be included in revisions
    $store_fields = array(
        'store_website',
        'store_featured'
    );
    
    // Merge all revision fields
    return array_merge($fields, $price_fields, $store_fields);
}
add_filter('_wp_post_revision_fields', 'tesco_revision_post_meta_fields');

/**
 * Function to get revision meta data
 */
function tesco_get_revision_meta($field, $revision) {
    return get_metadata('post', $revision->ID, $field, true);
}

/**
 * Save post meta when a revision is saved
 */
function tesco_save_revision_post_meta($revision_id) {
    $revision = get_post($revision_id);
    $post_id = $revision->post_parent;
    $post = get_post($post_id);
    
    // If this is for our custom post types
    if ($post && in_array($post->post_type, array('product', 'store', 'price'))) {
        // Get all meta keys for the parent post
        $meta_keys = get_post_custom_keys($post_id);
        
        if (is_array($meta_keys)) {
            foreach ($meta_keys as $meta_key) {
                // Skip internal meta keys
                if (is_protected_meta($meta_key, 'post')) {
                    continue;
                }
                
                // Get the meta value from the parent post
                $meta_value = get_post_meta($post_id, $meta_key, true);
                
                // Add this meta value to the revision
                if ($meta_value) {
                    add_metadata('post', $revision_id, $meta_key, $meta_value);
                }
            }
        }
    }
}
add_action('_wp_put_post_revision', 'tesco_save_revision_post_meta');

/**
 * Restore post meta when a revision is restored
 */
function tesco_restore_revision_post_meta($post_id, $revision_id) {
    $revision = get_post($revision_id);
    $post = get_post($post_id);
    
    // If this is for our custom post types
    if ($post && in_array($post->post_type, array('product', 'store', 'price'))) {
        // Get all meta keys for the revision
        $meta_keys = get_post_custom_keys($revision_id);
        
        if (is_array($meta_keys)) {
            foreach ($meta_keys as $meta_key) {
                // Skip internal meta keys
                if (is_protected_meta($meta_key, 'post')) {
                    continue;
                }
                
                // Get the meta value from the revision
                $meta_value = get_post_meta($revision_id, $meta_key, true);
                
                // Update the parent post with this meta value
                if ($meta_value) {
                    update_post_meta($post_id, $meta_key, $meta_value);
                } else {
                    delete_post_meta($post_id, $meta_key);
                }
            }
        }
    }
}
add_action('wp_restore_post_revision', 'tesco_restore_revision_post_meta', 10, 2);

/**
 * Add a "View Revisions" link to the post row actions
 */
function tesco_add_revision_link($actions, $post) {
    // Only add for our custom post types
    if (in_array($post->post_type, array('product', 'store', 'price'))) {
        $revisions = wp_get_post_revisions($post->ID);
        
        if (!empty($revisions)) {
            $count = count($revisions);
            $revision_link = add_query_arg('action', 'browse', get_edit_post_link($post->ID));
            
            $actions['revisions'] = sprintf(
                '<a href="%s">%s</a>',
                esc_url($revision_link),
                sprintf(_n('%s Revision', '%s Revisions', $count, 'tesco-comparison'), number_format_i18n($count))
            );
        }
    }
    
    return $actions;
}
add_filter('post_row_actions', 'tesco_add_revision_link', 10, 2);

/**
 * Add revision browser to the admin bar for quick access
 */
function tesco_add_revision_admin_bar($admin_bar) {
    // Only add when editing one of our custom post types
    if (is_admin() && isset($_GET['post'])) {
        $post_id = intval($_GET['post']);
        $post = get_post($post_id);
        
        if ($post && in_array($post->post_type, array('product', 'store', 'price'))) {
            $revisions = wp_get_post_revisions($post_id);
            
            if (!empty($revisions)) {
                $admin_bar->add_menu(array(
                    'id'    => 'revisions',
                    'title' => __('Revisions', 'tesco-comparison'),
                    'href'  => add_query_arg('action', 'browse', get_edit_post_link($post_id)),
                ));
                
                $count = 0;
                foreach ($revisions as $revision) {
                    // Limit to 5 in the dropdown
                    if ($count >= 5) {
                        break;
                    }
                    
                    $date = date_i18n(
                        __('F j, Y @ H:i:s', 'tesco-comparison'),
                        strtotime($revision->post_date)
                    );
                    
                    $admin_bar->add_menu(array(
                        'id'     => 'revision-' . $revision->ID,
                        'parent' => 'revisions',
                        'title'  => $date,
                        'href'   => get_edit_post_link($revision->ID),
                    ));
                    
                    $count++;
                }
                
                // Add "View All" link if there are more than 5 revisions
                if (count($revisions) > 5) {
                    $admin_bar->add_menu(array(
                        'id'     => 'view-all-revisions',
                        'parent' => 'revisions',
                        'title'  => __('View All Revisions', 'tesco-comparison'),
                        'href'   => add_query_arg('action', 'browse', get_edit_post_link($post_id)),
                    ));
                }
            }
        }
    }
}
add_action('admin_bar_menu', 'tesco_add_revision_admin_bar', 100);

/**
 * Add a database option to control revision retention period
 */
function tesco_register_revision_settings() {
    register_setting('tesco_comparison_options', 'tesco_revision_retention_days');
}
add_action('admin_init', 'tesco_register_revision_settings');

/**
 * Add revision settings to the theme options page
 */
function tesco_add_revision_settings_fields($settings_page) {
    add_settings_section(
        'tesco_revision_settings_section',
        __('Content Revision Settings', 'tesco-comparison'),
        'tesco_revision_settings_section_callback',
        $settings_page
    );
    
    add_settings_field(
        'tesco_revision_retention_days',
        __('Revision Retention Period (Days)', 'tesco-comparison'),
        'tesco_revision_retention_days_callback',
        $settings_page,
        'tesco_revision_settings_section'
    );
}
add_action('admin_init', function() {
    tesco_add_revision_settings_fields('tesco_comparison_options');
});

/**
 * Settings section description callback
 */
function tesco_revision_settings_section_callback() {
    echo '<p>' . __('Configure how product, store, and price revisions are managed.', 'tesco-comparison') . '</p>';
    echo '<p>' . __('By default, all revisions are kept indefinitely. You can set a retention period to automatically clean up old revisions.', 'tesco-comparison') . '</p>';
}

/**
 * Revision retention days settings field callback
 */
function tesco_revision_retention_days_callback() {
    $days = get_option('tesco_revision_retention_days', '0');
    
    echo '<input type="number" name="tesco_revision_retention_days" value="' . esc_attr($days) . '" min="0" step="1" class="small-text">';
    echo '<p class="description">' . __('Number of days to keep revisions. Set to 0 for unlimited (no automatic deletion).', 'tesco-comparison') . '</p>';
}

/**
 * Schedule cleanup of old revisions
 */
function tesco_schedule_revision_cleanup() {
    if (!wp_next_scheduled('tesco_revision_cleanup_event')) {
        wp_schedule_event(time(), 'daily', 'tesco_revision_cleanup_event');
    }
}
add_action('wp', 'tesco_schedule_revision_cleanup');

/**
 * Cleanup old revisions based on retention settings
 */
function tesco_cleanup_old_revisions() {
    $retention_days = get_option('tesco_revision_retention_days', '0');
    
    // Skip if retention is set to 0 (unlimited)
    if ($retention_days <= 0) {
        return;
    }
    
    global $wpdb;
    
    // Get post types to clean up
    $post_types = array('product', 'store', 'price');
    
    foreach ($post_types as $post_type) {
        // Get all posts of this type
        $posts = $wpdb->get_col($wpdb->prepare(
            "SELECT ID FROM $wpdb->posts WHERE post_type = %s",
            $post_type
        ));
        
        if (empty($posts)) {
            continue;
        }
        
        foreach ($posts as $post_id) {
            // Get revisions for this post
            $revisions = wp_get_post_revisions($post_id);
            
            if (empty($revisions)) {
                continue;
            }
            
            // Calculate cutoff time
            $cutoff_time = time() - (intval($retention_days) * DAY_IN_SECONDS);
            
            foreach ($revisions as $revision) {
                // Skip if revision is newer than cutoff time
                if (strtotime($revision->post_date_gmt) > $cutoff_time) {
                    continue;
                }
                
                // Delete the revision
                wp_delete_post_revision($revision->ID);
            }
        }
    }
}
add_action('tesco_revision_cleanup_event', 'tesco_cleanup_old_revisions');

/**
 * Clean up the scheduled event on theme deactivation
 */
function tesco_deactivate_revision_cleanup() {
    wp_clear_scheduled_hook('tesco_revision_cleanup_event');
}
register_deactivation_hook(__FILE__, 'tesco_deactivate_revision_cleanup');