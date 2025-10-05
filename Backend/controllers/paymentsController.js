const Payment = require('../models/Payment');

// POST /api/admin/savepayments
exports.savePayment = async (req, res) => {
  try {
    const body = req.body || {};

    // normalize fields
    const {
      adminId,
      adminName,
      adminProfession,
      userId,
      userName,
      userEmail,
      amount,
      currency = 'INR',
      status,
      paymentDate,
      paymentDetails,
      requestId,
      error,
      backendError
    } = body;

    if (!adminName) {
      return res.status(400).json({ success: false, message: 'adminName is required' });
    }

    // coerce amount to number
    const amt = typeof amount === 'string' ? Number(amount) : amount;
    if (!amt || Number.isNaN(amt)) {
      return res.status(400).json({ success: false, message: 'amount is required and must be a number' });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: 'status is required' });
    }

    // parse paymentDetails if JSON string
    let parsedPaymentDetails = paymentDetails;
    if (typeof paymentDetails === 'string') {
      try {
        parsedPaymentDetails = JSON.parse(paymentDetails);
      } catch (e) {
        parsedPaymentDetails = paymentDetails;
      }
    }

    const payment = new Payment({
      adminId: adminId || null,
      adminName,
      adminProfession: adminProfession || '',
      userId: userId || null,
      userName: userName || '',
      userEmail: userEmail || '',
      amount: amt,
      currency,
      status,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      paymentDetails: parsedPaymentDetails,
      requestId: requestId || null,
      error: error || null,
      backendError: backendError || null
    });

    const saved = await payment.save();
    return res.status(201).json({ success: true, payment: saved });
  } catch (err) {
    console.error('savePayment error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving payment', error: err.message || err });
  }
};

// add to your backend entry file (e.g., app.js or server.js)
app.use('/api/admin', require('./routes/adminPayments'));