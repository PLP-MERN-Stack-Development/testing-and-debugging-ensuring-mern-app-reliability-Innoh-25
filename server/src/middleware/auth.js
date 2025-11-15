const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    // This handles database errors and other unexpected errors
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

// Optional authenticate: if token is present, try to authenticate and set req.user;
// if no token present, simply continue with req.user = null.
const authenticateOptional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    req.user = user || null;
    return next();
  } catch (error) {
    // For optional auth, don't block on invalid token; just clear user and continue
    req.user = null;
    return next();
  }
};

module.exports = { authenticate, authenticateOptional };