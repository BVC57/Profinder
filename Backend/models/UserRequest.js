const mongoose = require('mongoose');

const userRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminProfile',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in_progress', 'completed'],
    default: 'pending'
  },
  timeline: {
    estimatedDays: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  adminNotes: {
    type: String
  },
  userNotes: {
    type: String
  },
  adminRating: {
    stars: { type: Number, min: 1, max: 5 },
    feedback: { type: String }
  },
  userRating: {
    stars: { type: Number, min: 1, max: 5 },
    feedback: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserRequest', userRequestSchema); 