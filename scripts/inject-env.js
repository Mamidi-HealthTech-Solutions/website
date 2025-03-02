const fs = require('fs');
const path = require('path');

// Get the API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Create the env-config.js content
const envConfigContent = `// This file is generated during the build process
window.ENV = {
  GEMINI_API_KEY: '${GEMINI_API_KEY}'
};
console.log('API Key loaded:', GEMINI_API_KEY ? 'Yes (key is present)' : 'No (key is missing)');`;

// Ensure the js directory exists
const jsDir = path.join(__dirname, '..', '_site', 'js');
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}

// Write the file to the build directory
fs.writeFileSync(path.join(jsDir, 'env-config.js'), envConfigContent);

console.log('Environment variables injected successfully!');
