const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Razorpay is only usable when real credentials are configured; a silent test-key
// fallback here would let production take orders no one can pay for.
const razorpayConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET);
const razorpay = razorpayConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    })
  : null;

/**
 * Create a new Razorpay order
 * @route   POST /api/payments/order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  if (!razorpayConfigured) {
    return res.status(503).json({
      success: false,
      error: 'Payments are not configured on this server'
    });
  }
  try {
    // Create order options
    const options = {
      amount: 29900, // Amount in paise (₹299)
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${req.user.id}`,
      notes: {
        userId: req.user.id,
        planType: 'pro'
      }
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
};

/**
 * Verify Razorpay payment and upgrade user to Pro
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
  if (!razorpayConfigured) {
    return res.status(503).json({
      success: false,
      error: 'Payments are not configured on this server'
    });
  }
  try {
    const { payment_id, order_id, signature } = req.body;

    // Verify payment signature
    const body = order_id + '|' + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }

    // Update user to Pro
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Set user as Pro and grant plenty of credits
    user.isPro = true;
    user.aiCredits = 9999; // Practically unlimited
    await user.save();
    
    // Create payment record (you could add a payment model later)
    
    res.status(200).json({
      success: true,
      data: {
        isPro: true,
        message: 'Upgraded to Pro successfully!'
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
};
