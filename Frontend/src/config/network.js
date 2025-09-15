// Network configuration for different environments
const config = {
  // Development - Local network access
  development: {
    apiUrl: 'http://192.168.31.3:5000',
    socketUrl: 'http://192.168.31.3:5000',
    frontendUrl: 'http://192.168.31.3:3000'
  },
  // Local development
  local: {
    apiUrl: 'http://localhost:5000',
    socketUrl: 'http://localhost:5000',
    frontendUrl: 'http://localhost:3000'
  },
  // Production (when deployed)
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
    frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'
  }
};

// Get current environment
const getEnvironment = () => {
  if (window.location.hostname === '192.168.31.3') {
    return 'development';
  } else if (window.location.hostname === 'localhost') {
    return 'local';
  } else {
    return 'production';
  }
};

// Export current configuration
export const currentConfig = config[getEnvironment()];

// Helper function to get API URL
export const getApiUrl = () => currentConfig.apiUrl;

// Helper function to get Socket URL
export const getSocketUrl = () => currentConfig.socketUrl;

export default currentConfig;
