require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/profinder',
  PORT: process.env.PORT || 5000,
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
}; 