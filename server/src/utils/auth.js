const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  // jwt.verify will throw if token is invalid — let the caller handle errors
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };