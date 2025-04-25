<?php
/**
 * Template Name: Splash Screen
 *
 * @package Tesco_Comparison
 */
get_header('splash');
?>

<div id="splashScreen" class="splash-screen">
    <div class="splash-content">
        <div class="splash-logo">
            <img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/tesco-logo.svg" alt="Tesco Logo">
        </div>
        <h1 class="splash-title">Tesco Price Comparison</h1>
        <p class="splash-tagline">Find the best deals across multiple stores</p>
        <div class="splash-loader">
            <div class="loader-progress"></div>
        </div>
        <p class="splash-countries">
            Available in UK, Germany, France, USA, Canada, Australia, Kenya, Uganda, Tanzania, and South Africa
        </p>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const splashScreen = document.getElementById('splashScreen');
        
        if (splashScreen) {
            // If WordPress option is set to disable splash screen, hide it immediately
            <?php if (!get_option('tesco_enable_splash_screen')): ?>
                splashScreen.style.display = 'none';
            <?php else: ?>
                // Check if we've already shown the splash screen in this session
                const splashShown = sessionStorage.getItem('splash_screen_shown');
                
                if (splashShown) {
                    // Don't show splash screen again in this session
                    splashScreen.style.display = 'none';
                } else {
                    // Animate the progress bar
                    const loaderProgress = document.querySelector('.loader-progress');
                    let progress = 0;
                    const interval = setInterval(function() {
                        progress += 1;
                        loaderProgress.style.width = progress + '%';
                        
                        if (progress >= 100) {
                            clearInterval(interval);
                            
                            // Hide splash screen after animation completes
                            setTimeout(function() {
                                splashScreen.style.opacity = '0';
                                setTimeout(function() {
                                    splashScreen.style.display = 'none';
                                    // Redirect to homepage
                                    window.location.href = '<?php echo esc_url(home_url('/')); ?>';
                                }, 500);
                            }, 500);
                        }
                    }, 20); // Complete in ~2 seconds
                    
                    // Set session storage to remember the splash was shown
                    sessionStorage.setItem('splash_screen_shown', '1');
                }
            <?php endif; ?>
        }
    });
</script>

<?php
get_footer('splash');
?>