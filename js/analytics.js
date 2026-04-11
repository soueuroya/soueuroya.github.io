/**
 * Simple Visitor Analytics for soueuroya.github.io
 * Captures device info, referrer, and location data.
 */

const SUPABASE_URL = 'https://ysytccmmoagkkzxrwnnu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pFWE0wQoTnSmqKCHhqnDPg_8l2aCbP9';

async function trackVisitor() {
    try {
        // 1. Get location data (City, Country)
        let location = { city: 'Unknown', country_name: 'Unknown' };
        try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            if (geoResponse.ok) {
                location = await geoResponse.json();
            }
        } catch (e) {
            console.warn('Geolocation failed:', e);
        }

        // 2. Prepare payload
        const payload = {
            page_url: window.location.href,
            referrer: document.referrer || 'Direct',
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            platform: navigator.platform,
            country: location.country_name,
            city: location.city
        };

        // 3. Send to Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/visitor_logs`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Supabase logging failed:', error);
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
