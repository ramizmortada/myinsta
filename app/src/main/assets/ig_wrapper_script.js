(function() {
    console.log('[MyInsta Wrapper] Initializing complete Instagram tweaks...');

    // 1. Inject Comprehensive CSS rules for hiding ads, sponsored posts, reels, and promo footers
    const styleId = 'myinsta-custom-styles';
    let style = document.getElementById(styleId);
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        (document.head || document.documentElement).appendChild(style);
    }

    style.textContent = `
        /* Comprehensive Ad & Sponsored Content Hiding for Web & Mobile Layouts */
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

        /* Hide Reels from Main Feed */
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
    `;

    // 2. Dynamic DOM Observer for Ads rendered dynamically via JS
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

    // 3. Inject Floating Settings Gear Button into the Mobile UI
    function injectSettingsButton() {
        if (document.getElementById('myinsta-floating-settings-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'myinsta-floating-settings-btn';
        btn.innerHTML = '⚙️';
        btn.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 16px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #0095f6;
            color: white;
            border: none;
            font-size: 22px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            z-index: 999999;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        btn.addEventListener('click', showSettingsModal);
        (document.body || document.documentElement).appendChild(btn);
    }

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSettingsButton);
    } else {
        injectSettingsButton();
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
