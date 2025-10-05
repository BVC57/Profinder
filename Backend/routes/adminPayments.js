const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// make sure any auth & validation middleware you want is applied here
router.post('/savepayments', paymentsController.savePayment);

module.exports = router;