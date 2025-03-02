// Configuration for API access
const CONFIG = {
    // In production, this will be injected during build by Jekyll
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '{{ site.env.GEMINI_API_KEY }}',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// For local development with a .env file, uncomment and use this code
// (This won't work in production, only for local testing)
/*
if (CONFIG.GEMINI_API_KEY.includes('{{')) {
    // If running locally and using a .env.js file (which you'd need to create)
    try {
        if (typeof loadEnv !== 'undefined') {
            const env = loadEnv();
            CONFIG.GEMINI_API_KEY = env.GEMINI_API_KEY;
        }
    } catch (e) {
        console.error('Error loading environment variables:', e);
    }
}
*/

// Validate the API key
if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.includes('{{')) {
    console.error('Error: GEMINI_API_KEY is not properly configured');
}
