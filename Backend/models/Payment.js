const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
  adminName: { type: String, required: true },
  adminProfession: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userName: { type: String },
  userEmail: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['success','failed','pending'], required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRequest', required: false },
  error: { type: String },
  backendError: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);