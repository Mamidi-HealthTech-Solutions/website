// Configuration for API access
const CONFIG = {
    // API key will be injected during build or loaded from env-config.js
    GEMINI_API_KEY: window.ENV?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || envVars.GEMINI_API_KEY || '',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Validate the API key
if (!CONFIG.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not properly configured');
    // Display a more visible error in the console
    console.log('%c API KEY MISSING! ', 'background: #ff0000; color: white; font-size: 16px;');
    console.log('Please make sure you have:');
    console.log('1. Added your API key to js/env-config.js for local development');
    console.log('2. Added your API key to GitHub Secrets for deployment');
} else {
    console.log('%c API KEY LOADED SUCCESSFULLY! ', 'background: #00ff00; color: black; font-size: 16px;');
}
