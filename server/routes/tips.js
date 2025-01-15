const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');
const auth = require('../middleware/auth');

// Get all tips for a user
router.get('/', auth, async (req, res) => {
  try {
    const tips = await Tip.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      tips: tips.map(tip => ({
        id: tip._id,
        time: tip.time,
        location: tip.location,
        status: tip.status
      }))
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tips'
    });
  }
});

// Submit SOS
router.post('/sos', auth, async (req, res) => {
  try {
    const { time, latitude, longitude } = req.body;
    
    const location = `${latitude}, ${longitude}`;
    
    const tip = new Tip({
      userId: req.user.id,
      time,
      location,
      status: 'Pending',
      type: 'SOS'
    });

    await tip.save();

    res.status(201).json({
      success: true,
      message: 'SOS submitted successfully'
    });
  } catch (error) {
    console.error('SOS submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting SOS'
    });
  }
});

module.exports = router;