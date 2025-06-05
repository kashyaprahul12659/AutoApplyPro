const User = require('../models/User');

// @desc    Get user's AI credits and Pro status
// @route   GET /api/users/ai-status
// @access  Private
exports.getAIStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('aiCredits isPro');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        aiCredits: user.aiCredits,
        isPro: user.isPro
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : undefined;

  try {
    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (normalizedEmail) userFields.email = normalizedEmail;

    // Update user
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If user is updating email, check if it already exists
    if (normalizedEmail && normalizedEmail !== user.email) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Get user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Upgrade user to Pro (temporary admin route)
// @route   POST /api/users/upgrade
// @access  Private
exports.upgradeUser = async (req, res) => {
  try {
    // Find user and toggle Pro status
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Toggle isPro status
    user.isPro = !user.isPro;
    await user.save();
    
    res.json({
      success: true,
      data: {
        isPro: user.isPro,
        message: user.isPro ? 'Upgraded to Pro successfully' : 'Downgraded from Pro'
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get user data for extension
// @route   GET /api/users/data
// @access  Private
exports.getUserData = async (req, res) => {
  try {
    // Find the user but exclude sensitive information
    const user = await User.findById(req.user.id)
      .select('name email subscription credits aiCredits isPro -_id');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Return user data with subscription info
    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        subscription: {
          status: user.isPro ? 'active' : 'inactive',
          plan: user.isPro ? 'pro' : 'free'
        },
        credits: user.aiCredits || 0
      }
    });
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Add AI credits to user account (temporary admin route)
// @route   POST /api/users/add-credits
// @access  Private
exports.addAICredits = async (req, res) => {
  try {
    const { credits } = req.body;
    
    if (!credits || !Number.isInteger(credits) || credits <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid positive integer for credits'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    user.aiCredits += credits;
    await user.save();
    
    res.json({
      success: true,
      data: {
        aiCredits: user.aiCredits,
        message: `Added ${credits} AI credits to your account`
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
