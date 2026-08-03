(function() {
    console.log('[MyInsta Wrapper] Initializing top-bar nav & settings...');

    // 1. CSS rules for hiding ads, reels, footers
    const styleId = 'myinsta-custom-styles';
    let style = document.getElementById(styleId);
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        (document.head || document.documentElement).appendChild(style);
    }

    style.textContent = `
        /* Hide Ads and Sponsored Content */
        article:has(span:contains("Sponsored")),
        article:has(a[href*="/explore/ads/"]),
        article:has(a[href*="/about/ads/"]),
        div[data-testid="sponsored-post"],
        div:has(> span:contains("Sponsored")),
        div:has(> a[href*="/about/ads/"]) {
            display: none !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Hide Reels from Feed */
        main[role="main"] article:has(a[href*="/reel/"]),
        main[role="main"] article:has(a[href*="/reels/"]) {
            display: none !important;
            height: 0 !important;
        }

        /* Hide Reels Navigation & Tab bar items */
        nav a[href*="/reels/"],
        a[href*="/reels/"],
        div[role="tablist"] a[href*="/reels/"] {
            display: none !important;
        }

        /* Hide Meta Promos / Footer links */
        a[href*="about.meta.com"],
        a[href*="threads.net"],
        footer {
            display: none !important;
        }

        /* Custom Top Bar Gear Button Styling */
        #myinsta-topbar-gear-btn {
            background: none;
            border: none;
            color: #ffffff;
            font-size: 20px;
            cursor: pointer;
            padding: 6px 10px;
            margin-left: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;

    // 2. Dynamic DOM Observer for Ads
    function hideAdsDynamic() {
        const spans = document.querySelectorAll('span, div');
        spans.forEach(el => {
            if (el.children.length === 0 && (el.textContent.trim() === 'Sponsored' || el.textContent.trim() === 'إعلان مُموَّل')) {
                const article = el.closest('article');
                if (article) {
                    article.style.display = 'none';
                    article.style.height = '0px';
                }
            }
        });
    }

    const observer = new MutationObserver(hideAdsDynamic);
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    hideAdsDynamic();

    // 3. Inject Settings Gear directly into the Top Header Bar
    function injectTopBarGear() {
        if (document.getElementById('myinsta-topbar-gear-btn')) return;

        // Locate top header bar icons container (near Heart / Direct Messages icons)
        const topHeader = document.querySelector('header') || document.querySelector('nav:has(a[href="/direct/inbox/"])');
        let container = null;

        if (topHeader) {
            container = topHeader.querySelector('div:has(a[href*="/direct/inbox/"])') || topHeader;
        } else {
            // Fallback: look for direct inbox icon
            const directIcon = document.querySelector('a[href*="/direct/inbox/"]');
            if (directIcon && directIcon.parentElement) {
                container = directIcon.parentElement;
            }
        }

        if (container) {
            const gearBtn = document.createElement('button');
            gearBtn.id = 'myinsta-topbar-gear-btn';
            gearBtn.innerHTML = '⚙️';
            gearBtn.title = 'MyInsta Settings';
            gearBtn.addEventListener('click', showSettingsModal);
            container.appendChild(gearBtn);
        }
    }

    // Observe header updates to re-inject gear button if page layout updates
    const topBarObserver = new MutationObserver(injectTopBarGear);
    topBarObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
    injectTopBarGear();

    // 4. Modal Dialog for UI Settings
    function showSettingsModal() {
        const existing = document.getElementById('myinsta-settings-modal');
        if (existing) {
            existing.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'myinsta-settings-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999999;
            backdrop-filter: blur(4px);
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #262626;
            color: #ffffff;
            border-radius: 16px;
            padding: 20px;
            width: 85%;
            max-width: 340px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">MyInsta Settings</h3>
                <button id="myinsta-modal-close" style="background: none; border: none; color: #a8a8a8; font-size: 22px; cursor: pointer;">✕</button>
            </div>
            <div style="padding: 12px 0; border-top: 1px solid #363636;">
                <div style="font-weight: 600; font-size: 14px;">✅ Hide Sponsored Ads</div>
                <div style="font-size: 12px; color: #a8a8a8;">Active (Removes promoted posts from feed)</div>
            </div>
            <div style="padding: 12px 0; border-top: 1px solid #363636;">
                <div style="font-weight: 600; font-size: 14px;">✅ Disable Reels</div>
                <div style="font-size: 12px; color: #a8a8a8;">Active (Hides short videos & navigation)</div>
            </div>
            <div style="padding: 12px 0; border-top: 1px solid #363636;">
                <div style="font-weight: 600; font-size: 14px;">✅ Following Feed Shortcut</div>
                <div style="font-size: 12px; color: #a8a8a8;">Active (Tapping Home opens Following feed)</div>
            </div>
            <div style="padding: 12px 0; border-top: 1px solid #363636;">
                <div style="font-weight: 600; font-size: 14px;">👁️ Anonymous Story Viewer</div>
                <div style="font-size: 12px; color: #a8a8a8;">Active (Story telemetry blocked)</div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('myinsta-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    // 5. Intercept Home icon & logo clicks directly
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        if (anchor) {
            const href = anchor.getAttribute('href');
            if (href === '/' || href === 'https://www.instagram.com/' || href === 'https://www.instagram.com') {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'https://www.instagram.com/?variant=following';
            }
        }
    }, true);
})();
