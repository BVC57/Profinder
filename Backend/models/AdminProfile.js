const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profession: String,
  experience: String,
  city: String,
  pincode: String,
  mobile: String,
  email: String,
  latitude: Number,
  longitude: Number,
  panCard: String,
  aadharCard: String,
  voterId: String,
  gender: String,
  mobile_number: Number,
  address: String,
  state: String,
  profilePhoto: String,
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  // Subscription fields
  subscription: {
    plan: { type: String, enum: ['trial', 'pro'], default: 'trial' },
    usage: { type: Number, default: 0 },
    renewalDate: { type: Date },
  },
}, { timestamps: true });

module.exports = mongoose.model('AdminProfile', adminSchema);
