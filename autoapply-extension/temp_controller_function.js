
// @desc    Get active profile data for autofill
// @route   GET /api/resumes/profile/active
// @access  Private
exports.getActiveProfile = async (req, res, next) => {
  try {
    // Validate user authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated or invalid token'
      });
    }

    // Find the user and get their profile data
    const user = await User.findById(req.user.id).select('profileData subscription credits');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (!user.profileData) {
      return res.status(404).json({
        success: false,
        error: 'No profile data found'
      });
    }
    
    // Check if profile is marked as active
    if (!user.profileData.isActive) {
      return res.status(404).json({
        success: false,
        error: 'No active profile found. Please set a profile as active in the dashboard.'
      });
    }
    
    // Track profile access for analytics
    await User.findByIdAndUpdate(user._id, {
      $inc: { 'analytics.profileAccess': 1 },
      $set: { 'analytics.lastProfileAccess': new Date() }
    }, { new: true });
    
    // Return profile data along with subscription info
    res.status(200).json({
      success: true,
      data: user.profileData,
      meta: {
        subscription: user.subscription?.status || 'free',
        credits: user.credits || 0,
        lastAccessed: new Date()
      }
    });
  } catch (err) {
    console.error('Error fetching active profile:', err);
    
    // Use the global error handler if available
    if (next) {
      return next(err);
    }
    
    // Fallback error response
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
