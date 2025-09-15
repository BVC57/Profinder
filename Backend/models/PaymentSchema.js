const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminProfile',
    required: false, // Optional for initial payments
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRequest',
    required: false, // Optional for initial payments
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: false,
  },
  razorpaySignature: {
    type: String,
    required: false,
  },
  paymentMethod: {
    type: String,
    default: 'Razorpay',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Cancelled', 'Refunded'],
    default: 'Pending',
  },
  paymentType: {
    type: String,
    enum: ['ServiceRequest', 'VerificationFee', 'Other', 'ProPlanUpgrade'],
    default: 'ServiceRequest',
  },
  description: {
    type: String,
    default: 'Service Request Payment',
  },
  failureReason: {
    type: String,
    required: false,
  },
  refundAmount: {
    type: Number,
    default: 0,
  },
  refundDate: {
    type: Date,
    required: false,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
