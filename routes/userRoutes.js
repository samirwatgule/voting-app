const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
router.post('/signup', async (req, res) => {
  const { aadharCardNumber, password } = req.body;

  try {
    const userExists = await User.findOne({ aadharCardNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this Aadhar number' });
    }

    const user = await User.create({
      aadharCardNumber,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        aadharCardNumber: user.aadharCardNumber,
        role: user.role,
        isVoted: user.isVoted,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/signin
// @access  Public
router.post('/signin', async (req, res) => {
  const { aadharCardNumber, password } = req.body;

  try {
    const user = await User.findOne({ aadharCardNumber });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        aadharCardNumber: user.aadharCardNumber,
        role: user.role,
        isVoted: user.isVoted,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid Aadhar credentials or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { oldPassword, newPassword } = req.body;
      if (await user.comparePassword(oldPassword)) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(401).json({ message: 'Old password does not match' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
