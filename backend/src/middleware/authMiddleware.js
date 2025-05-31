// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // Verify token
  try {
    // It's important that JWT_SECRET is loaded before this line executes
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined. Ensure .env is loaded and JWT_SECRET is set.");
      return res.status(500).json({ message: 'Server configuration error.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add payload to request object (e.g., req.user.userId)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};
