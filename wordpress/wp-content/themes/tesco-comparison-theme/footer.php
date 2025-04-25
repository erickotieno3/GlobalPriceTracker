<?php
/**
 * The footer for our theme
 *
 * @package Tesco_Comparison
 */
?>

<footer class="site-footer">
    <div class="container">
        <div class="footer-widgets">
            <?php if (is_active_sidebar('footer-1')): ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar('footer-1'); ?>
                </div>
            <?php else: ?>
                <div class="footer-widget-area">
                    <h3 class="footer-widget-title">Tesco Price Comparison</h3>
                    <p>Compare prices across multiple stores and marketplaces worldwide.</p>
                </div>
            <?php endif; ?>
            
            <?php if (is_active_sidebar('footer-2')): ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar('footer-2'); ?>
                </div>
            <?php else: ?>
                <div class="footer-widget-area">
                    <h3 class="footer-widget-title">Quick Links</h3>
                    <ul>
                        <li><a href="<?php echo esc_url(home_url('/products/')); ?>">Products</a></li>
                        <li><a href="<?php echo esc_url(home_url('/stores/')); ?>">Stores</a></li>
                        <li><a href="<?php echo esc_url(home_url('/about-us/')); ?>">About Us</a></li>
                        <li><a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a></li>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if (is_active_sidebar('footer-3')): ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar('footer-3'); ?>
                </div>
            <?php else: ?>
                <div class="footer-widget-area">
                    <h3 class="footer-widget-title">Legal</h3>
                    <ul>
                        <li><a href="<?php echo esc_url(home_url('/terms/')); ?>">Terms of Service</a></li>
                        <li><a href="<?php echo esc_url(home_url('/privacy/')); ?>">Privacy Policy</a></li>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="footer-copyright">
            <p>&copy; <?php echo date('Y'); ?> Tesco Price Comparison. All rights reserved.</p>
            <p>Powered by WordPress | Domain: <a href="https://hyrisecrown.com">hyrisecrown.com</a></p>
        </div>
    </div>
</footer>

<?php 
// Stripe integration
if (get_option('tesco_stripe_public_key') && is_page('checkout')): 
?>
<script src="https://js.stripe.com/v3/"></script>
<script>
    var stripe = Stripe('<?php echo esc_js(get_option('tesco_stripe_public_key')); ?>');
    // Initialize Stripe elements (would be customized based on specific payment form needs)
    var elements = stripe.elements();
    
    // Custom styling
    var style = {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    // Create an instance of the card Element.
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` div.
    card.mount('#card-element');
</script>
<?php endif; ?>

<!-- Mobile navigation controls -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    
    if (mobileMenuToggle && primaryNav) {
        mobileMenuToggle.addEventListener('click', function() {
            primaryNav.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', 
                mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Country selector functionality
    const countrySelector = document.querySelector('.select-wrapper');
    if (countrySelector) {
        countrySelector.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would show a dropdown of countries
            alert('Country selection will be implemented with the WordPress API');
        });
    }
});
</script>

<?php wp_footer(); ?>
</body>
</html>