const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Police = require('../../models/Police');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, badgeNumber, password } = req.body;

    // Check if police officer already exists
    const existingPolice = await Police.findOne({ 
      $or: [{ email }, { badgeNumber }] 
    });
    
    if (existingPolice) {
      return res.status(400).json({
        success: false,
        message: 'Email or badge number already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new police officer
    const police = new Police({
      fullName,
      email,
      badgeNumber,
      password: hashedPassword,
      isPolice: true,
    });

    await police.save();

    res.status(201).json({
      success: true,
      message: 'Police officer registered successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if police officer exists
    const police = await Police.findOne({ email });
    if (!police || !police.isPolice) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, police.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token with isPolice in payload
    const token = jwt.sign(
      { 
        id: police._id,
        isPolice: true,
        badgeNumber: police.badgeNumber 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      isPolice: true,
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
