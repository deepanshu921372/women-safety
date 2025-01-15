const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all citizens
router.get('/citizens', auth, async (req, res) => {
  try {
    const citizens = await User.find({ isPolice: { $ne: true } }).select('-password');
    res.json({
      success: true,
      citizens
    });
  } catch (error) {
    console.error('Error fetching citizens:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching citizens'
    });
  }
});

// Get logged in user profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Fetching user with ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', user);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

module.exports = router; 