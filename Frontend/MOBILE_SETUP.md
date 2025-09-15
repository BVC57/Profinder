# Mobile Setup Guide

## Profile Photos Not Loading on Mobile

If profile photos are not loading when accessing the app on mobile devices using IP address, follow these steps:

### 1. Environment Variables

Create a `.env` file in the root directory of your React app with:

```env
REACT_APP_API_URL=http://YOUR_COMPUTER_IP:5000
```

Replace `YOUR_COMPUTER_IP` with your computer's actual IP address (e.g., `192.168.31.3`).

### 2. Backend CORS Configuration

Make sure your backend server allows requests from your mobile device's IP. In your `server/app.js`, ensure CORS is configured to allow your mobile device's IP:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.31.3:3000', // Add your computer's IP
    'http://YOUR_MOBILE_IP:3000' // Add your mobile device's IP if needed
  ],
  credentials: true
}));
```

### 3. Network Configuration

1. Make sure your computer and mobile device are on the same network
2. Ensure your firewall allows connections on port 5000 (backend) and 3000 (frontend)
3. Test the API URL directly in your mobile browser: `http://YOUR_COMPUTER_IP:5000/api/admin/verified`

### 4. Debugging

Check the browser console on your mobile device for:
- Network errors
- CORS errors
- Image loading errors

The app now includes better error logging to help identify issues.

### 5. Alternative Solutions

If images still don't load:

1. **Use a different port**: Try using port 8080 or 3001 for the backend
2. **Use a reverse proxy**: Set up nginx to proxy requests
3. **Use a tunnel service**: Use ngrok or similar to expose your local server

### 6. Testing

To test if the API is accessible:

1. Open your mobile browser
2. Navigate to: `http://YOUR_COMPUTER_IP:5000/api/admin/verified`
3. You should see JSON data if the API is working

### 7. Common Issues

- **Firewall blocking**: Windows Firewall or antivirus software blocking connections
- **Router settings**: Some routers block local network connections
- **Mobile carrier**: Some mobile carriers block local network access

### 8. Quick Fix

If you're still having issues, you can temporarily hardcode the IP in the code:

In `src/utils/apiUtils.js`, change:
```javascript
export const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://YOUR_ACTUAL_IP:5000';
};
```

Replace `YOUR_ACTUAL_IP` with your computer's IP address. 