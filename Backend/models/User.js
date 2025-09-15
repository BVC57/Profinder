const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'user'], default: 'user' },

  // Admin fields
  profession: String,
  experience: String,
  city: String,
  pincode: String,
  mobile: String,
  latitude: Number,
  longitude: Number,
  verified: { type: Boolean, default: false },

  // Identity documents for verification
  aadharCard: String,
  voterId: String,

  gender: String,
  profilePhoto: String,

  isRootSuperAdmin: { type: Boolean, default: false },

  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
