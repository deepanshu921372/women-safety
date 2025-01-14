const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Crime', 'Suspicious Activity', 'Traffic', 'Other'],
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Under Investigation', 'Resolved', 'Dismissed'],
  },
  attachments: [{
    type: String, // URLs to uploaded files
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tip', tipSchema);