# Mamidi HealthTech Solutions Website

This repository contains the website for Mamidi HealthTech Solutions, featuring an AI-powered chatbot using the Gemini API.

## Local Development

To run this website locally with the chatbot functionality:

1. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. Run the script to load your API key for local development:
   ```
   node scripts/load-env-local.js
   ```

3. Open the website in your browser.

## GitHub Pages Deployment

This website is configured to deploy to GitHub Pages with the chatbot functionality. To set up:

1. Go to your GitHub repository settings.
2. Navigate to "Secrets and variables" > "Actions".
3. Add a new repository secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

The GitHub Actions workflow will automatically inject your API key during the build process.

### How the Build Process Works

The GitHub Actions workflow uses two methods to ensure the API key is properly injected:

1. **Pre-build Method**: Creates an `env-config.js` file before Jekyll builds the site, which gets copied to the `_site` directory during the build.
2. **Post-build Method**: Attempts to inject the API key into the `_site` directory after Jekyll builds the site (as a backup).

This dual approach ensures that the API key is available even if one method fails.

## How It Works

- For local development, the API key is loaded from your `.env` file into `js/env-config.js`.
- For GitHub Pages deployment, the API key is loaded from GitHub Secrets into `js/env-config.js` during the build process.
- The chatbot uses this API key to authenticate with the Gemini API.

## Security Notes

- The `.env` file and `js/env-config.js` are gitignored to prevent accidentally committing your API key.
- The API key is injected during the build process for GitHub Pages, so it's not exposed in your repository.
- The GitHub Secret is securely stored and only accessible during the build process.
