<?php
/**
 * The front page template file
 *
 * @package Tesco_Comparison
 */

get_header();
?>

<div class="app-container">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
        <div class="app-logo">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/tesco-logo.svg" alt="<?php bloginfo('name'); ?>">
            </a>
        </div>
        
        <div class="search-bar">
            <form id="searchForm" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
                <input type="search" name="s" placeholder="Search for products..." required>
                <button type="submit" aria-label="Search">
                    <span class="material-icons">search</span>
                </button>
            </form>
        </div>
        
        <div class="country-selector">
            <div class="select-wrapper">
                <div class="country-select">
                    <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" class="country-flag">
                    <span>United Kingdom</span>
                    <span class="material-icons">arrow_drop_down</span>
                </div>
            </div>
        </div>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
        <!-- Categories Scrollable Slider -->
        <section class="categories-slider">
            <h2 class="section-title">Categories</h2>
            <div class="scroll-container">
                <?php
                $categories = get_terms(array(
                    'taxonomy' => 'product_category',
                    'hide_empty' => false,
                ));
                
                if (!empty($categories) && !is_wp_error($categories)) {
                    foreach ($categories as $category) {
                        ?>
                        <a href="<?php echo esc_url(get_term_link($category)); ?>" class="category-card">
                            <div class="category-icon">
                                <span class="material-icons">category</span>
                            </div>
                            <span class="category-name"><?php echo esc_html($category->name); ?></span>
                        </a>
                        <?php
                    }
                } else {
                    ?>
                    <a href="#" class="category-card">
                        <div class="category-icon">
                            <span class="material-icons">shopping_basket</span>
                        </div>
                        <span class="category-name">Groceries</span>
                    </a>
                    <a href="#" class="category-card">
                        <div class="category-icon">
                            <span class="material-icons">devices</span>
                        </div>
                        <span class="category-name">Electronics</span>
                    </a>
                    <a href="#" class="category-card">
                        <div class="category-icon">
                            <span class="material-icons">chair</span>
                        </div>
                        <span class="category-name">Home</span>
                    </a>
                    <a href="#" class="category-card">
                        <div class="category-icon">
                            <span class="material-icons">checkroom</span>
                        </div>
                        <span class="category-name">Fashion</span>
                    </a>
                    <a href="#" class="category-card">
                        <div class="category-icon">
                            <span class="material-icons">toys</span>
                        </div>
                        <span class="category-name">Toys</span>
                    </a>
                    <a href="#" class="category-card">
                        <div class="category-icon">
                            <span class="material-icons">fitness_center</span>
                        </div>
                        <span class="category-name">Sports</span>
                    </a>
                    <?php
                }
                ?>
            </div>
        </section>
        
        <!-- Trending Deals -->
        <section class="trending-deals">
            <h2 class="section-title">Trending Deals</h2>
            <div class="trending-deals-container">
                <?php
                $trending_deals = tesco_get_trending_deals(4);
                
                if (!is_wp_error($trending_deals) && !empty($trending_deals)) {
                    foreach ($trending_deals as $deal) {
                        ?>
                        <div class="trending-deal">
                            <img src="<?php echo esc_url($deal['image'] ?: get_template_directory_uri() . '/assets/product-placeholder.svg'); ?>" 
                                 alt="<?php echo esc_attr($deal['title']); ?>" 
                                 class="product-image">
                            <div class="product-details">
                                <div class="product-title"><?php echo esc_html($deal['title']); ?></div>
                                <div class="product-price"><?php echo esc_html($deal['price']); ?></div>
                            </div>
                            <a href="<?php echo esc_url(add_query_arg('product_id', $deal['id'], home_url('/compare'))); ?>" class="compare-button" aria-label="Compare Prices">
                                <span class="material-icons">search</span>
                            </a>
                        </div>
                        <?php
                    }
                } else {
                    // Fallback to recent products from WordPress
                    $recent_products = get_posts(array(
                        'post_type' => 'product',
                        'posts_per_page' => 4,
                    ));
                    
                    if (!empty($recent_products)) {
                        foreach ($recent_products as $product) {
                            ?>
                            <div class="trending-deal">
                                <img src="<?php echo esc_url(get_the_post_thumbnail_url($product->ID) ?: get_template_directory_uri() . '/assets/product-placeholder.svg'); ?>" 
                                     alt="<?php echo esc_attr($product->post_title); ?>" 
                                     class="product-image">
                                <div class="product-details">
                                    <div class="product-title"><?php echo esc_html($product->post_title); ?></div>
                                    <div class="product-price">Check prices</div>
                                </div>
                                <a href="<?php echo esc_url(add_query_arg('product_id', $product->ID, home_url('/compare'))); ?>" class="compare-button" aria-label="Compare Prices">
                                    <span class="material-icons">search</span>
                                </a>
                            </div>
                            <?php
                        }
                    } else {
                        echo '<p>No trending deals available at the moment.</p>';
                    }
                }
                ?>
            </div>
        </section>
        
        <!-- Featured Stores -->
        <section class="featured-stores">
            <h2 class="section-title">Featured Stores</h2>
            <div class="store-list">
                <?php
                $stores = tesco_get_featured_stores(6);
                
                if (!is_wp_error($stores) && !empty($stores)) {
                    foreach ($stores as $store) {
                        ?>
                        <div class="store-card">
                            <?php if (!empty($store['logo'])): ?>
                                <img src="<?php echo esc_url($store['logo']); ?>" alt="<?php echo esc_attr($store['name']); ?>" class="store-logo">
                            <?php else: ?>
                                <div class="store-name"><?php echo esc_html($store['name']); ?></div>
                            <?php endif; ?>
                        </div>
                        <?php
                    }
                } else {
                    // Fallback to some common store names
                    $store_names = array('Tesco', 'Walmart', 'Carrefour', 'Aldi', 'Lidl', 'Target');
                    foreach ($store_names as $name) {
                        ?>
                        <div class="store-card">
                            <div class="store-name"><?php echo esc_html($name); ?></div>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>
        </section>
        
        <!-- Newsletter Signup -->
        <section class="newsletter-signup">
            <h2 class="section-title">Get Price Alerts</h2>
            <p>Sign up to receive alerts when prices drop on products you're interested in.</p>
            
            <form id="newsletterForm" method="post" action="<?php echo esc_url(admin_url('admin-ajax.php')); ?>">
                <input type="hidden" name="action" value="subscribe_newsletter">
                <input type="hidden" name="newsletter_nonce" value="<?php echo wp_create_nonce('subscribe_newsletter_nonce'); ?>">
                
                <div class="form-group">
                    <input type="email" name="email" placeholder="Your email address" required>
                    <button type="submit" class="btn-subscribe">Subscribe</button>
                </div>
            </form>
        </section>
    </main>
    
    <!-- Compare Modal -->
    <div id="compareModal" class="compare-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Price Comparison</h3>
                <button id="closeCompareModal" class="close-modal" aria-label="Close">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div id="compareResults" class="modal-body">
                <div class="loading-spinner"></div>
            </div>
        </div>
    </div>
</div>

<?php
get_footer();
?>