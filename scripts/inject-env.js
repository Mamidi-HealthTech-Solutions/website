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
    fs.mkdirSync(jsDir, { recursive: true, mode: 0o755 });
  }

  // Write the file to the build directory
  console.log(`Writing env-config.js to: ${path.join(jsDir, 'env-config.js')}`);
  fs.writeFileSync(path.join(jsDir, 'env-config.js'), envConfigContent, { mode: 0o644 });

  console.log('Environment variables injected successfully!');
} catch (error) {
  console.error('Error injecting environment variables:', error);
  
  // Try an alternative approach if the first one fails
  try {
    console.log('Trying alternative approach...');
    
    // Create a temporary file in the current directory
    const tempFile = path.join(__dirname, 'temp-env-config.js');
    fs.writeFileSync(tempFile, envConfigContent);
    
    // Use shell command to move the file with proper permissions
    const { execSync } = require('child_process');
    execSync(`mkdir -p ${jsDir} && cp ${tempFile} ${path.join(jsDir, 'env-config.js')} && chmod 644 ${path.join(jsDir, 'env-config.js')}`);
    
    // Clean up the temporary file
    fs.unlinkSync(tempFile);
    
    console.log('Alternative approach successful!');
  } catch (altError) {
    console.error('Alternative approach failed:', altError);
    process.exit(1);
  }
}
