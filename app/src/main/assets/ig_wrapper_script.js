(function() {
    console.log('[MyInsta Wrapper] Initializing custom Instagram tweaks...');

    // Inject CSS rules for hiding ads, sponsored posts, reels, and promo footers
    const styleId = 'myinsta-custom-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Hide Ads and Sponsored Content */
            article:has(a[href*="/explore/ads/"]),
            article:has(a[href*="/about/ads/"]),
            div[data-testid="sponsored-post"] {
                display: none !important;
            }

            /* Hide Reels elements in Feed */
            main[role="main"] article:has(a[href*="/reel/"]),
            main[role="main"] article:has(a[href*="/reels/"]) {
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                visibility: hidden !important;
            }

            /* Hide Reels Navigation Link / Tab bar items */
            nav a[href*="/reels/"],
            a[href*="/reels/"] {
                display: none !important;
            }

            /* Hide Meta promos / Footer links */
            a[href*="about.meta.com"],
            a[href*="threads.net"],
            footer {
                display: none !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }
})();
