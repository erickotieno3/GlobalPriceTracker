<?php
/**
 * Template Name: Compare Page
 * Template for displaying product price comparisons
 *
 * @package Tesco_Comparison
 */

get_header();

// Get product ID from query string
$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

// Check if product ID is valid
if ($product_id <= 0) {
    // Redirect to home if no valid product ID
    wp_redirect(home_url('/'));
    exit;
}

// Get comparison data
$comparison = tesco_compare_product_prices($product_id);
?>

<div class="app-container">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
        <div class="app-logo">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/tesco-logo.svg" alt="<?php bloginfo('name'); ?>">
            </a>
        </div>
        
        <div class="back-button">
            <a href="<?php echo esc_url(wp_get_referer() ?: home_url('/')); ?>">
                <span class="material-icons">arrow_back</span>
            </a>
        </div>
        
        <h1 class="page-title">Price Comparison</h1>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
        <?php if (is_wp_error($comparison)): ?>
            <div class="error-message">
                <p>Error: <?php echo esc_html($comparison->get_error_message()); ?></p>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn-primary">Return to Home</a>
            </div>
        <?php elseif (empty($comparison) || empty($comparison['product']) || empty($comparison['prices'])): ?>
            <div class="error-message">
                <p>Sorry, no comparison data available for this product.</p>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn-primary">Return to Home</a>
            </div>
        <?php else: ?>
            <div class="product-comparison">
                <div class="product-header">
                    <?php if (!empty($comparison['product']['image'])): ?>
                        <img src="<?php echo esc_url($comparison['product']['image']); ?>" alt="<?php echo esc_attr($comparison['product']['title']); ?>" class="product-image">
                    <?php else: ?>
                        <img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/product-placeholder.svg" alt="<?php echo esc_attr($comparison['product']['title']); ?>" class="product-image">
                    <?php endif; ?>
                    
                    <div class="product-info">
                        <h2 class="product-title"><?php echo esc_html($comparison['product']['title']); ?></h2>
                        
                        <?php if (!empty($comparison['product']['description'])): ?>
                            <div class="product-description">
                                <?php echo wp_kses_post($comparison['product']['description']); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <h3 class="section-title">Price Comparison</h3>
                
                <div class="comparison-table">
                    <?php
                    // Sort prices from lowest to highest
                    $prices = $comparison['prices'];
                    usort($prices, function($a, $b) {
                        return $a['price'] - $b['price'];
                    });
                    
                    // Calculate potential savings
                    $lowest_price = !empty($prices) ? $prices[0]['price'] : 0;
                    $highest_price = !empty($prices) ? $prices[count($prices) - 1]['price'] : 0;
                    $potential_savings = $highest_price - $lowest_price;
                    ?>
                    
                    <?php foreach ($prices as $index => $price): ?>
                        <div class="price-row <?php echo ($price['price'] === $lowest_price) ? 'best-price' : ''; ?>">
                            <div class="store-info">
                                <?php if (!empty($price['store']['logo'])): ?>
                                    <img src="<?php echo esc_url($price['store']['logo']); ?>" alt="<?php echo esc_attr($price['store']['name']); ?>" class="store-logo">
                                <?php endif; ?>
                                <span class="store-name"><?php echo esc_html($price['store']['name']); ?></span>
                                
                                <?php if ($price['price'] === $lowest_price): ?>
                                    <span class="best-price-badge">Best Price</span>
                                <?php endif; ?>
                            </div>
                            
                            <div class="price-info">
                                <span class="price"><?php echo esc_html($price['currency'] . number_format($price['price'], 2)); ?></span>
                                
                                <?php if ($price['price'] !== $lowest_price): ?>
                                    <span class="price-difference">
                                        +<?php echo esc_html($price['currency'] . number_format($price['price'] - $lowest_price, 2)); ?>
                                    </span>
                                <?php endif; ?>
                                
                                <?php if (!empty($price['last_updated'])): ?>
                                    <span class="price-date">
                                        Last updated: <?php echo esc_html(date_i18n(get_option('date_format'), strtotime($price['last_updated']))); ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <?php if ($potential_savings > 0 && count($prices) > 1): ?>
                    <div class="savings-info">
                        <h3>Potential Savings</h3>
                        <p>Save up to <strong><?php echo esc_html($prices[0]['currency'] . number_format($potential_savings, 2)); ?></strong> by shopping at <strong><?php echo esc_html($prices[0]['store']['name']); ?></strong> instead of <strong><?php echo esc_html($prices[count($prices) - 1]['store']['name']); ?></strong>!</p>
                    </div>
                <?php endif; ?>
                
                <div class="actions">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="btn-secondary">Back to Home</a>
                    <button id="shareButton" class="btn-primary">
                        <span class="material-icons">share</span> Share This Comparison
                    </button>
                </div>
            </div>
        <?php endif; ?>
    </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('shareButton');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: '<?php echo esc_js($comparison['product']['title'] ?? 'Price Comparison'); ?>',
                    text: 'Check out this price comparison on Tesco Price Comparison!',
                    url: window.location.href
                })
                .catch(error => console.log('Error sharing:', error));
            } else {
                // Fallback - copy to clipboard
                const tempInput = document.createElement('input');
                document.body.appendChild(tempInput);
                tempInput.value = window.location.href;
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Show copied message
                const message = document.createElement('div');
                message.className = 'copy-message';
                message.textContent = 'Link copied to clipboard!';
                document.body.appendChild(message);
                
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 2000);
            }
        });
    }
});
</script>

<style>
.back-button {
    margin-right: 10px;
}

.back-button a {
    color: white;
    display: flex;
    align-items: center;
}

.page-title {
    font-size: 18px;
    color: white;
    flex: 1;
    text-align: center;
    margin: 0;
}

.product-comparison {
    background-color: white;
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 20px;
    margin-bottom: 20px;
}

.product-header {
    display: flex;
    margin-bottom: 20px;
    gap: 20px;
}

.product-header .product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
}

.product-info {
    flex: 1;
}

.product-title {
    font-size: 20px;
    margin-bottom: 10px;
}

.product-description {
    font-size: 14px;
    color: var(--text-light);
}

.comparison-table {
    margin-bottom: 20px;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}

.price-row:last-child {
    border-bottom: none;
}

.best-price {
    background-color: rgba(0, 120, 215, 0.05);
}

.store-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.store-logo {
    width: 40px;
    height: 25px;
    object-fit: contain;
}

.store-name {
    font-weight: 500;
}

.best-price-badge {
    background-color: var(--tesco-blue);
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 10px;
}

.price-info {
    text-align: right;
}

.price {
    font-weight: bold;
    font-size: 18px;
    display: block;
}

.best-price .price {
    color: var(--tesco-blue);
}

.price-difference {
    font-size: 12px;
    color: var(--tesco-red);
    display: block;
}

.price-date {
    font-size: 11px;
    color: var(--text-light);
    display: block;
    margin-top: 4px;
}

.savings-info {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.savings-info h3 {
    font-size: 16px;
    margin-bottom: 5px;
    color: var(--tesco-blue);
}

.savings-info p {
    font-size: 14px;
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    gap: 5px;
    text-decoration: none;
}

.btn-primary {
    background-color: var(--tesco-blue);
    color: white;
    border: none;
}

.btn-secondary {
    background-color: transparent;
    color: var(--tesco-blue);
    border: 1px solid var(--tesco-blue);
}

.error-message {
    background-color: white;
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 30px 20px;
    text-align: center;
}

.error-message p {
    margin-bottom: 20px;
    color: var(--text-light);
}

.copy-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 1000;
}

@media (max-width: 480px) {
    .product-header {
        flex-direction: column;
    }
    
    .product-header .product-image {
        width: 100%;
        height: 200px;
    }
    
    .actions {
        flex-direction: column;
    }
}
</style>

<?php
get_footer();
?>