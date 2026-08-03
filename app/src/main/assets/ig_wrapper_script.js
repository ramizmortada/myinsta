(function() {
    console.log('[MyInsta Wrapper] Initializing custom Instagram tweaks...');

    // 1. Enforce Following feed ONLY when user is logged in
    function enforceFollowingFeed() {
        const path = window.location.pathname;
        const search = window.location.search;
        
        // Don't attempt redirect on login/accounts pages
        if (path.includes('/accounts/') || path.includes('/login/')) {
            return;
        }

        // Check if user is logged in (session cookies or main page navigation)
        const isLoggedOut = document.querySelector('form[id="loginForm"]') || document.querySelector('a[href*="/accounts/login/"]');
        if (isLoggedOut) {
            return;
        }

        if ((path === '/' || path === '') && !search.includes('variant=following')) {
            console.log('[MyInsta Wrapper] Redirecting to Following feed...');
            window.location.replace('https://www.instagram.com/?variant=following');
        }
    }

    // Run check after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enforceFollowingFeed);
    } else {
        enforceFollowingFeed();
    }

    // 2. Inject CSS rules for hiding ads, sponsored posts, reels, and promo footers
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

    // 3. Intercept navigation home clicks to stay on 'Following' feed
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        if (anchor) {
            const href = anchor.getAttribute('href');
            if (href === '/' || href === 'https://www.instagram.com/') {
                const isLoggedOut = document.querySelector('form[id="loginForm"]') || document.querySelector('a[href*="/accounts/login/"]');
                if (!isLoggedOut) {
                    e.preventDefault();
                    window.location.href = 'https://www.instagram.com/?variant=following';
                }
            }
        }
    }, true);
})();
