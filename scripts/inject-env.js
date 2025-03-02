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

try {
  // Make sure the directory exists
  if (!fs.existsSync(jsDir)) {
    console.log(`Creating directory: ${jsDir}`);
    fs.mkdirSync(jsDir, { recursive: true });
  }

  // Write the file to the build directory
  console.log(`Writing env-config.js to: ${path.join(jsDir, 'env-config.js')}`);
  fs.writeFileSync(path.join(jsDir, 'env-config.js'), envConfigContent);

  console.log('Environment variables injected successfully!');
} catch (error) {
  console.error('Error injecting environment variables:', error);
  console.log('This is expected if using the pre-build method. The pre-built env-config.js should be used instead.');
}
