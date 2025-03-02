// This script reads the .env file and creates the env-config.js file for local development
const fs = require('fs');
const path = require('path');

// Function to read the .env file
function readEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse the .env file content
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        // Join all parts after the first '=' in case the value contains '='
        const value = parts.slice(1).join('=').trim();
        // Remove any surrounding quotes
        envVars[key] = value.replace(/^['"](.*)['"]$/, '$1');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

// Get environment variables
const envVars = readEnvFile();
const apiKey = envVars.GEMINI_API_KEY || '';

console.log('API Key found:', apiKey ? 'Yes' : 'No');

// Create the env-config.js content
const envConfigContent = `// This file is generated for local development
window.ENV = {
  GEMINI_API_KEY: '${apiKey}'
};`;

// Write to the js directory
const jsDir = path.join(__dirname, '..', 'js');
fs.writeFileSync(path.join(jsDir, 'env-config.js'), envConfigContent);

console.log('Local environment variables loaded successfully!');
