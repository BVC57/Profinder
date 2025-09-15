# Google Maps API Setup Guide

## Overview
The enhanced AdminForm now includes a location picker using Google Maps API. Follow these steps to set up the API key.

## Step 1: Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookup)
4. Go to "Credentials" and create an API key
5. Restrict the API key to your domain for security

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory of your project:

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

## Step 3: Security Best Practices

1. **Restrict API Key**: In Google Cloud Console, restrict your API key to:
   - HTTP referrers (your domain)
   - Specific APIs (Maps JavaScript API)
2. **Environment Variables**: Never commit your API key to version control
3. **Rate Limiting**: Monitor your API usage in Google Cloud Console

## Features

The location picker includes:
- Interactive map for location selection
- "Use Current Location" button (requires HTTPS in production)
- Draggable marker
- Coordinates display
- Form validation integration

## Troubleshooting

- **Map not loading**: Check if API key is correctly set in environment variables
- **Current location not working**: Ensure you're using HTTPS in production
- **API quota exceeded**: Check your Google Cloud Console usage

## Cost

Google Maps API has a generous free tier:
- $200 monthly credit
- Typically covers thousands of map loads
- Monitor usage in Google Cloud Console 