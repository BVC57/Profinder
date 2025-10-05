const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profession: String,
  experience: String,
  city: String,
  pincode: String,
  mobile: Number,
  email: String,
  latitude: Number,
  longitude: Number,
  panCard: String,
  aadharCard: String,
  voterId: String,
  gender: String,
  address: String,
  state: String,
  profilePhoto: String,
  skills: [{ type: String }],     
  specializations: [{ type: String }],  
  completedRequests: { type: Number, default: 0 },
  subscriptionActive: { type: Boolean, default: false },
  subscriptionPlan: { type: String, enum: ["basic", "pro", "unlimited"], default: "basic" },
  subscriptionExpiry: { type: Date }, 
  // Unified subscription object used by routes/controllers and frontend
  subscription: {
    plan: { type: String, enum: ['trial', 'pro'], default: 'trial' },
    usage: { type: Number, default: 0 },
    renewalDate: { type: Date }
  },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }

}, { timestamps: true });

module.exports = mongoose.model('AdminProfile', adminSchema);
