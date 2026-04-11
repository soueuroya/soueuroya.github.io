/**
 * Robust Visitor Analytics for soueuroya.github.io
 * Calls a Supabase Edge Function to capture IP and Geolocation server-side.
 */

const FUNCTION_URL = 'https://ysytccmmoagkkzxrwnnu.supabase.co/functions/v1/record-visitor';

async function trackVisitor() {
    try {
        // 1. Prepare payload with browser-available data
        const payload = {
            page_url: window.location.href,
            referrer: document.referrer || 'Direct',
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // 2. Send to Edge Function (Server handles IP and Geo)
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Visitor tracking failed:', await response.text());
        }
    } catch (err) {
        console.error('Visitor tracking error:', err);
    }
}

// Execute tracking
if (document.readyState === 'complete') {
    trackVisitor();
} else {
    window.addEventListener('load', trackVisitor);
}
