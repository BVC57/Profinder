# Network Access Setup

This guide explains how to access your Profinder app from mobile devices on the same WiFi network.

## Quick Start

1. **Run the network start script:**
   ```bash
   start-network.bat
   ```

2. **Access from mobile device:**
   - Open your mobile browser
   - Go to: `http://192.168.31.3:3000`
   - Login and register should now work properly

## Manual Setup

If you prefer to start servers manually:

### 1. Start Backend Server
```bash
cd server
npm start
```
Backend will run on: `http://192.168.31.3:5000`

### 2. Start Frontend Server
```bash
npm start
```
Frontend will run on: `http://192.168.31.3:3000`

## Configuration Changes Made

The following files were updated to support network access:

1. **`src/api/axios.js`** - Updated API base URL
2. **`src/hooks/useNotifications.js`** - Updated Socket.IO connection
3. **`src/pages/SuperAdminPanel.js`** - Updated image URLs
4. **`server/app.js`** - Updated CORS configuration

## Troubleshooting

### Firewall Issues
If you can't access the app from mobile:
1. Open Windows Firewall settings
2. Allow Node.js through firewall
3. Or temporarily disable firewall for testing

### Port Issues
If ports 3000 or 5000 are in use:
1. Check what's running on these ports
2. Kill the processes or change ports in configuration

### IP Address Changes
If your computer's IP address changes:
1. Update the IP address in the configuration files
2. Or use environment variables:
   ```
   REACT_APP_API_URL=http://YOUR_NEW_IP:5000
   REACT_APP_SOCKET_URL=http://YOUR_NEW_IP:5000
   ```

## Environment Variables

You can create a `.env` file in the root directory with:
```
REACT_APP_API_URL=http://192.168.31.3:5000
REACT_APP_SOCKET_URL=http://192.168.31.3:5000
```

This makes it easier to change the IP address when needed. 