const User = require('../models/User');
const { generateToken } = require('../utils/auth');

const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          error: existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken'
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
      });

      const savedUser = await user.save();

      // Generate token
      const token = generateToken(savedUser);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
        token,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      res.status(500).json({ error: 'Server error during registration' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        message: 'Login successful',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error during login' });
    }
  },

   async logout(req, res) {
    try {
      // In a real app, you might want to blacklist the token
      // For now, we'll just return success since JWT is stateless
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: 'Server error during logout' });
    }
  },

  async getCurrentUser(req, res) {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ error: 'Server error while fetching user data' });
    }
  },
};

module.exports = authController;