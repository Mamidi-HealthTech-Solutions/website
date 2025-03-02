// This script creates a pre-built env-config.js file that will be copied by Jekyll
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

// Write the file to the js directory so Jekyll will copy it
const jsDir = path.join(__dirname, '..', 'js');
fs.writeFileSync(path.join(jsDir, 'env-config.build.js'), envConfigContent);

console.log('Pre-built env-config.js created successfully!');
