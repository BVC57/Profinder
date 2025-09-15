const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  profession: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  // Subscription fields
  subscription: {
    plan: { type: String, enum: ['trial', 'pro'], default: 'trial' },
    usage: { type: Number, default: 0 },
    renewalDate: { type: Date },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Admin', adminSchema);
