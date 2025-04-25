<?php
/**
 * Template Name: Splash Screen
 * 
 * A template that displays only the splash screen
 *
 * @package Tesco_Comparison
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <title><?php bloginfo('name'); ?> - <?php bloginfo('description'); ?></title>
    <style>
        :root {
            --tesco-blue: #0078D7;
            --tesco-dark-blue: #00539f;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: white;
        }
        
        .splash-container {
            text-align: center;
        }
        
        .splash-logo {
            font-size: 48px;
            font-weight: 700;
            color: var(--tesco-blue);
            margin-bottom: 20px;
        }
        
        .splash-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 120, 215, 0.2);
            border-radius: 50%;
            border-top-color: var(--tesco-blue);
            margin: 0 auto;
            animation: spin 1s infinite linear;
        }
        
        .splash-text {
            margin-top: 20px;
            font-size: 18px;
            color: #666;
        }
        
        .splash-tagline {
            margin-top: 10px;
            font-size: 14px;
            color: #999;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Redirect after 3 seconds */
        .redirect-message {
            position: fixed;
            bottom: 20px;
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: #999;
        }
    </style>
    <?php wp_head(); ?>
    <script>
        // Redirect to the main site after 3 seconds
        setTimeout(function() {
            window.location.href = "<?php echo esc_url(home_url('/')); ?>";
        }, 3000);
    </script>
</head>
<body>
    <div class="splash-container">
        <div class="splash-logo">tesco</div>
        <div class="splash-spinner"></div>
        <div class="splash-text">Price Comparison Platform</div>
        <div class="splash-tagline">Find the best deals across multiple stores</div>
    </div>
    
    <div class="redirect-message">
        Redirecting to the main site...
    </div>
    
    <?php wp_footer(); ?>
</body>
</html>