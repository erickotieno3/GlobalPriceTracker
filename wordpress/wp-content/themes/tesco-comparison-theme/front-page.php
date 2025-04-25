<?php
/**
 * The front page template file
 *
 * @package Tesco_Comparison
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
                <?php 
                // Get the default country flag (Kenya)
                $kenya_flag = get_template_directory_uri() . '/assets/kenya-flag.png';
                if (!file_exists(get_template_directory() . '/assets/kenya-flag.png')) {
                    $kenya_flag = 'https://flagcdn.com/w320/ke.png';
                }
                ?>
                <img src="<?php echo esc_url($kenya_flag); ?>" alt="Kenya Flag" class="country-flag">
                <span>Kenya</span>
            </div>
            <span class="material-icons">expand_more</span>
        </div>
    </div>
    
    <?php if (get_option('tesco_google_adsense_id')): ?>
    <!-- Google AdSense Banner -->
    <div class="ad-banner" id="adBanner">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=<?php echo esc_attr(get_option('tesco_google_adsense_id')); ?>"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="<?php echo esc_attr(get_option('tesco_google_adsense_id')); ?>"
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
        'post_type' => 'store',
        'posts_per_page' => 4,
        'orderby' => 'title',
        'order' => 'ASC',
    ));
    
    if ($featured_stores): ?>
    <div class="store-list">
        <?php foreach ($featured_stores as $store): ?>
        <div class="store-card">
            <?php if (has_post_thumbnail($store->ID)): ?>
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($store->ID, 'thumbnail')); ?>" alt="<?php echo esc_attr($store->post_title); ?>" class="store-logo">
            <?php else: ?>
                <div class="store-name"><?php echo esc_html($store->post_title); ?></div>
            <?php endif; ?>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else: ?>
    <div class="store-list">
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/tesco-logo.svg'); ?>" alt="Tesco" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/carrefour-logo.svg'); ?>" alt="Carrefour" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/naivas-logo.svg'); ?>" alt="Naivas" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/walmart-logo.svg'); ?>" alt="Walmart" class="store-logo">
        </div>
    </div>
    <?php endif; ?>
    
    <!-- Location-Based Stores -->
    <h2 class="section-title">Local Stores Near You</h2>
    <div class="store-list">
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/aldi-logo.svg'); ?>" alt="Aldi" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/lidl-logo.svg'); ?>" alt="Lidl" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/quickmart-logo.svg'); ?>" alt="Quickmart" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/shoprite-logo.svg'); ?>" alt="Shoprite" class="store-logo">
        </div>
        <div class="store-card">
            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/tumaini-logo.svg'); ?>" alt="Tumaini" class="store-logo">
        </div>
    </div>
    
    <!-- Trending Deals -->
    <h2 class="section-title">Trending Deals</h2>
    <?php
    $trending_products = get_posts(array(
        'post_type' => 'product',
        'posts_per_page' => 2,
        'orderby' => 'rand',
    ));
    
    if ($trending_products): ?>
    <div class="trending-deals-container">
        <?php foreach ($trending_products as $product): 
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
                $currency = get_post_meta($price->ID, 'price_currency', true);
                $price_display = $currency . number_format((float)$amount, 2);
            }
        ?>
        <div class="trending-deal">
            <?php if (has_post_thumbnail($product->ID)): ?>
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($product->ID, 'thumbnail')); ?>" alt="<?php echo esc_attr($product->post_title); ?>" class="product-image">
            <?php else: ?>
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/product-sunlight.svg'); ?>" alt="<?php echo esc_attr($product->post_title); ?>" class="product-image">
            <?php endif; ?>
            
            <div class="product-details">
                <div class="product-title"><?php echo esc_html($product->post_title); ?></div>
                <?php if ($price_display): ?>
                    <div class="product-price"><?php echo esc_html($price_display); ?></div>
                <?php endif; ?>
            </div>
            
            <a href="<?php echo esc_url(add_query_arg('product_id', $product->ID, home_url('/compare/'))); ?>" class="compare-button" aria-label="Compare Prices">
                <span class="material-icons">search</span>
            </a>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else: ?>
    <div class="trending-deal">
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/product-sunlight.svg'); ?>" alt="Sunlight Washing Powder" class="product-image">
        <div class="product-details">
            <div class="product-title">Sunlight Washing Powder 2kg</div>
            <div class="product-price">$4.99</div>
        </div>
        <a href="#compare" class="compare-button" aria-label="Compare Prices">
            <span class="material-icons">search</span>
        </a>
    </div>
    
    <div class="trending-deal">
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/product-milk.svg'); ?>" alt="Fresh Milk" class="product-image">
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
        <form class="newsletter-form" id="newsletterForm" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="subscribe_newsletter">
            <?php wp_nonce_field('subscribe_newsletter_nonce', 'newsletter_nonce'); ?>
            <input type="email" name="email" placeholder="Email address" class="email-input" required>
            <button type="submit" class="subscribe-button">Subscribe</button>
        </form>
    </div>
    
    <?php 
    // Display page content if available
    while (have_posts()) : the_post(); 
        the_content();
    endwhile; 
    ?>
    
    <!-- Compare Modal (hidden by default) -->
    <div class="modal" id="compareModal" style="display:none">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Compare Prices</h3>
                <button class="modal-close" id="closeCompareModal">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="compareResults">
                    <h4>Sunlight Washing Powder 2kg</h4>
                    <div style="margin-top: 16px;">
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/tesco-logo.svg'); ?>" alt="Tesco" style="width: 40px; height: 25px; object-fit: contain;">
                                <span>Tesco</span>
                            </div>
                            <div style="font-weight: 600;">$4.99</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/carrefour-logo.svg'); ?>" alt="Carrefour" style="width: 40px; height: 25px; object-fit: contain;">
                                <span>Carrefour</span>
                            </div>
                            <div style="font-weight: 600;">$5.49</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/naivas-logo.svg'); ?>" alt="Naivas" style="width: 40px; height: 25px; object-fit: contain;">
                                <span>Naivas</span>
                            </div>
                            <div style="font-weight: 600;">$5.29</div>
                        </div>
                    </div>
                    <div style="margin-top: 16px; background-color: #f5f5f5; padding: 12px; border-radius: 8px;">
                        <p style="font-weight: 500;">Save up to <span style="color: #0078D7; font-weight: 700;">$0.50</span> by shopping at Tesco!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Compare Modal
    const startCompareButton = document.getElementById('startCompareButton');
    const compareModal = document.getElementById('compareModal');
    const closeCompareModal = document.getElementById('closeCompareModal');
    
    if (startCompareButton && compareModal && closeCompareModal) {
        startCompareButton.addEventListener('click', function(e) {
            e.preventDefault();
            compareModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        closeCompareModal.addEventListener('click', function() {
            compareModal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking outside
        compareModal.addEventListener('click', function(e) {
            if (e.target === compareModal) {
                compareModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Compare buttons
    const compareButtons = document.querySelectorAll('.compare-button');
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#compare') {
                e.preventDefault();
                compareModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // In a real implementation, we would load comparison data for the specific product
                const productTitle = this.closest('.trending-deal').querySelector('.product-title').textContent;
                document.querySelector('#compareResults h4').textContent = productTitle;
            }
        });
    });
});
</script>

<?php get_footer(); ?>