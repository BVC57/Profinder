const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // User who performed the action
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Admin involved (if applicable)
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminProfile'
  },
  
  // Request involved (if applicable)
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRequest'
  },
  
  // Action type
  actionType: {
    type: String,
    enum: [
      'request_created',
      'request_approved', 
      'request_rejected',
      'request_in_progress',
      'request_completed',
      'admin_verified',
      'admin_rejected'
    ],
    required: true
  },
  
  // Action description
  description: {
    type: String,
    required: true
  },
  
  // Additional details
  details: {
    requestTitle: String,
    adminName: String,
    userName: String,
    status: String,
    notes: String,
    timeline: {
      estimatedDays: Number,
      startDate: Date,
      endDate: Date
    }
  },
  
  // IP address for security tracking
  ipAddress: String,
  
  // User agent for browser info
  userAgent: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
activitySchema.index({ createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ admin: 1, createdAt: -1 });
activitySchema.index({ actionType: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema); 