/**
 * Navigation Script
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', function() {
            primaryNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Country selector functionality
    const countrySelector = document.querySelector('.select-wrapper');
    if (countrySelector) {
        countrySelector.addEventListener('click', function() {
            // In a real implementation, this would show a dropdown of countries
            // This is now handled by app-integration.js
        });
    }
    
    // Compare button functionality
    const compareButtons = document.querySelectorAll('.compare-button');
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#compare') {
                e.preventDefault();
                const compareModal = document.getElementById('compareModal');
                if (compareModal) {
                    compareModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
                
                // In a real implementation, this would load comparison data
                const productTitle = this.closest('.trending-deal')?.querySelector('.product-title')?.textContent;
                if (productTitle && document.querySelector('#compareResults h4')) {
                    document.querySelector('#compareResults h4').textContent = productTitle;
                }
            }
        });
    });
});