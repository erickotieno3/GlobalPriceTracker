/**
 * Splash Screen Script
 */
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splashScreen');
    
    if (splashScreen) {
        // Check if we've already shown the splash screen in this session
        const splashShown = sessionStorage.getItem('splash_screen_shown');
        
        if (!splashShown) {
            // Hide splash screen after 2 seconds
            setTimeout(function() {
                splashScreen.style.opacity = '0';
                setTimeout(function() {
                    splashScreen.style.display = 'none';
                }, 500);
                
                // Set session storage to remember the splash was shown
                sessionStorage.setItem('splash_screen_shown', '1');
            }, 2000);
        } else {
            // Don't show splash screen again in this session
            splashScreen.style.display = 'none';
        }
    }
});