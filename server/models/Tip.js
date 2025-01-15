const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Solved'],
    default: 'Pending'
  },
  type: {
    type: String,
    enum: ['Regular', 'SOS'],
    default: 'Regular'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tip', tipSchema);