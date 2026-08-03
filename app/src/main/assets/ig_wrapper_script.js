(function() {
    console.log('[MyInsta Wrapper] Initializing clean CSS-only layout rules...');

    // 1. Pure declarative CSS rules for hiding ads, reels, and footer promos
    // Pure CSS rules never trigger React Fiber JavaScript errors or page crashes
    const styleId = 'myinsta-custom-styles';
    let style = document.getElementById(styleId);
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        (document.head || document.documentElement).appendChild(style);
    }

    style.textContent = `
        /* Hide Reels Navigation & Tab bar items */
        nav a[href*="/reels/"],
        a[href*="/reels/"],
        div[role="tablist"] a[href*="/reels/"] {
            display: none !important;
        }

        /* Hide Reels from Main Feed cleanly */
        main[role="main"] article:has(a[href*="/reel/"]),
        main[role="main"] article:has(a[href*="/reels/"]) {
            display: none !important;
        }

        /* Hide Sponsored Ads from Feed */
        main[role="main"] article:has(a[href*="/explore/ads/"]),
        main[role="main"] article:has(a[href*="/about/ads/"]),
        div[data-testid="sponsored-post"] {
            display: none !important;
        }

        /* Hide Meta Promos / Footer links */
        a[href*="about.meta.com"],
        a[href*="threads.net"],
        footer {
            display: none !important;
        }

        /* Custom MyInsta menu row styling */
        .myinsta-settings-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 14px 16px !important;
            border-bottom: 1px solid #262626 !important;
            cursor: pointer !important;
            color: #f5f5f5 !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
    `;

    // 2. Inject MyInsta Option directly inside Instagram's Settings & Privacy Menu
    function injectIntoSettingsMenu() {
        if (document.getElementById('myinsta-settings-option-item')) return;

        const isSettingsPage = window.location.pathname.includes('/accounts/') || window.location.pathname.includes('/settings/');
        if (!isSettingsPage) return;

        const mainList = document.querySelector('main[role="main"]') || document.querySelector('ul') || document.querySelector('div[role="menu"]');
        if (!mainList) return;

        const firstItem = mainList.querySelector('a') || mainList.querySelector('div[role="button"]') || mainList.children[0];
        if (!firstItem) return;

        const menuItem = document.createElement('div');
        menuItem.id = 'myinsta-settings-option-item';
        menuItem.className = 'myinsta-settings-row';
        menuItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">⚙️</span>
                <span>MyInsta Custom Settings</span>
            </div>
            <span style="color: #a8a8a8; font-size: 18px;">›</span>
        `;

        menuItem.addEventListener('click', showSettingsModal);

        if (mainList.firstChild) {
            mainList.insertBefore(menuItem, mainList.firstChild);
        } else {
            mainList.appendChild(menuItem);
        }
    }

    const settingsObserver = new MutationObserver(injectIntoSettingsMenu);
    settingsObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
    injectIntoSettingsMenu();

    // 3. Modal Dialog for UI Settings
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
                <div style="font-size: 12px; color: #a8a8a8;">Active (Removes promoted posts)</div>
            </div>
            <div style="padding: 12px 0; border-top: 1px solid #363636;">
                <div style="font-weight: 600; font-size: 14px;">✅ Disable Reels</div>
                <div style="font-size: 12px; color: #a8a8a8;">Active (Removes short videos & navigation)</div>
            </div>
            <div style="padding: 12px 0; border-top: 1px solid #363636;">
                <div style="font-weight: 600; font-size: 14px;">✅ Following Feed Shortcut</div>
                <div style="font-size: 12px; color: #a8a8a8;">Active (Tapping Home opens Following feed)</div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('myinsta-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    // 4. Intercept Home icon & logo clicks safely
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
