// d:\projects\personal-projects\to-do-list\server\src\middleware\auth.middleware.js
// Protects routes by ensuring a valid JWT is present in the Authorization header
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const authMiddleware = (req, res, next) => {
  // Read the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // Extract the token string (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user info (the payload of the JWT) to the request object
    // This makes req.user.id available to all protected controllers
    req.user = decoded;
    
    next(); // Move on to the controller
  } catch (error) {
    // ⚠️ Token verification failed (expired, invalid signature, etc.)
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;

// ✅ DONE
