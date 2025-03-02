require('dotenv').config();

// Check if required environment variables are set
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is not set');
  console.error('Please create a .env file with your API key');
  process.exit(1);
}

// Configuration for API access
const CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};
