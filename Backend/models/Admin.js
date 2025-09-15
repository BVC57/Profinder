const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profession: String,
  experience: String,
  city: String,
  pincode: String,
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
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
}

);
module.exports = mongoose.models.AdminProfile || mongoose.model('AdminProfile', adminSchema);