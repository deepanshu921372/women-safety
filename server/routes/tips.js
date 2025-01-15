const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');

router.post('/submit', async (req, res) => {
  try {
    const { name, phone, time, location, title, description, media } = req.body;

    const tip = new Tip({
      name,
      phone,
      time,
      location,
      title,
      description,
      media
    });

    await tip.save();

    res.status(201).json({
      success: true,
      message: 'Tip submitted successfully'
    });
  } catch (error) {
    console.error('Tip submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting tip'
    });
  }
});

module.exports = router;