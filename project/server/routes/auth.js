const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'dummysecret', // fallback secret
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

// ======================
// Register a new customer
// ======================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new customer
    const user = new User({
      name,
      email,
      password,
      role: 'customer',
      isActive: true
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ======================
// Login user
// ======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    // If user not found, fallback to dummy data
    if (!user) {
      const dummyUsers = [
        { id: 1, name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin', isActive: true },
        { id: 2, name: 'Technician', email: 'tech1@example.com', password: 'password123', role: 'technician', isActive: true },
        { id: 3, name: 'Customer', email: 'customer1@example.com', password: 'password123', role: 'customer', isActive: true }
      ];
      const dummyUser = dummyUsers.find(u => u.email === email && u.password === password);
      if (!dummyUser) return res.status(401).json({ message: 'Invalid email or password' });

      const token = generateToken(dummyUser.id, dummyUser.role);
      return res.json({ token, user: dummyUser });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ======================
// Get current logged-in user
// ======================
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
