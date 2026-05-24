/**
 * Robust Visitor Analytics for soueuroya.github.io
 * Calls a Supabase Edge Function to capture IP, Geo, and UTM sources.
 */

const FUNCTION_URL = 'https://ysytccmmoagkkzxrwnnu.supabase.co/functions/v1/record-visitor';

async function trackVisitor() {
    try {
        // 1. Parse UTM parameters from the URL
        const urlParams = new URLSearchParams(window.location.search);
        
        // 2. Prepare payload with browser-available data
        const payload = {
            page_url: window.location.href,
            referrer: document.referrer || 'Direct',
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            // UTM Tracking
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign')
        };
        
        // Debug: Log payload before sending
        console.log('[Analytics] Visitor payload:', payload);
        
        // 3. Send to Edge Function (Server handles IP and Geo)
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            mode: 'cors'
        });
        
        if (!response.ok) {
            console.error('Visitor tracking failed:', response.status, await response.text());
        } else {
            console.log('[Analytics] Visitor tracking succeeded, status:', response.status);
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
