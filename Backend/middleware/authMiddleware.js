// 📁 server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // Ensure we have the user ID in the expected format
    req.user = {
      id: decoded.userId || decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
