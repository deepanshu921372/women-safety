const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Citizen = require('../../models/Citizen');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await Citizen.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const citizen = new Citizen({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword
    });

    await citizen.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const citizen = await Citizen.findOne({ email });
    if (!citizen) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: citizen._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      message: 'Logged in successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
});

module.exports = router;