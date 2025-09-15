const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'admin_verification_request', 
      'admin_verified', 
      'admin_rejected',
      'user_request',
      'user_request_created',
      'request_approved',
      'request_rejected',
      'request_status_updated'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedAdminProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminProfile'
  },
  relatedUserRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRequest'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema); 