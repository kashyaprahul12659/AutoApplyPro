const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// @route   POST /api/payments/order
// @desc    Create a new Razorpay order
// @access  Private
router.post('/order', auth, createOrder);

// @route   POST /api/payments/verify
// @desc    Verify payment and upgrade to Pro
// @access  Private
router.post('/verify', auth, verifyPayment);

module.exports = router;
