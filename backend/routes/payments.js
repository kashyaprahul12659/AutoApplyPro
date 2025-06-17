const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const clerkAuth = require('../middleware/clerkAuth');

// @route   POST /api/payments/order
// @desc    Create a new Razorpay order
// @access  Private
router.post('/order', clerkAuth, createOrder);

// @route   POST /api/payments/verify
// @desc    Verify payment and upgrade to Pro
// @access  Private
router.post('/verify', clerkAuth, verifyPayment);

module.exports = router;
