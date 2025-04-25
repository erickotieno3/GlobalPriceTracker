<?php
/**
 * The header for our theme
 *
 * @package Tesco_Comparison
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php if (get_option('tesco_google_analytics_id')): ?>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr(get_option('tesco_google_analytics_id')); ?>"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?php echo esc_js(get_option('tesco_google_analytics_id')); ?>');
    </script>
    <?php endif; ?>
    
    <?php if (get_option('tesco_firebase_api_key')): ?>
    <!-- Firebase Integration -->
    <script type="module">
      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
      
      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "<?php echo esc_js(get_option('tesco_firebase_api_key')); ?>",
        // Additional config would be set in the theme options
        projectId: "tesco-comparison",
        appId: "1:123456789012:web:abcdef1234567890"
      };
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
    </script>
    <?php endif; ?>
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">tesco</a>
    
    <div class="domain">
        <span class="material-icons" style="font-size: 18px;">language</span>
        hyrisecrown.com
    </div>
    
    <button class="mobile-menu-toggle" aria-controls="primary-menu" aria-expanded="false">
        <span class="material-icons">menu</span>
    </button>
    
    <nav id="site-navigation" class="primary-navigation">
        <?php
        wp_nav_menu(
            array(
                'theme_location' => 'primary',
                'menu_id'        => 'primary-menu',
                'container'      => false,
                'fallback_cb'    => function() {
                    echo '<ul id="primary-menu">';
                    echo '<li><a href="' . esc_url(home_url('/')) . '">' . __('Home', 'tesco-comparison') . '</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/products/')) . '">' . __('Products', 'tesco-comparison') . '</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/stores/')) . '">' . __('Stores', 'tesco-comparison') . '</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/about-us/')) . '">' . __('About', 'tesco-comparison') . '</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/contact/')) . '">' . __('Contact', 'tesco-comparison') . '</a></li>';
                    echo '</ul>';
                }
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
</header>

<?php if (get_option('tesco_enable_splash_screen') && !isset($_COOKIE['splash_screen_shown'])): ?>
<div class="splash-screen" id="splashScreen">
    <div class="splash-logo">tesco</div>
    <div class="splash-spinner"></div>
</div>
<script>
    // Hide splash screen after 2 seconds and set cookie
    setTimeout(function() {
        document.getElementById('splashScreen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('splashScreen').style.display = 'none';
        }, 500);
        
        // Set cookie to not show splash on subsequent pages
        document.cookie = "splash_screen_shown=1; path=/; max-age=3600";
    }, 2000);
</script>
<?php endif; ?>