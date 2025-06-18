// Admin authentication middleware
// This middleware checks if the authenticated user has admin privileges

const adminAuth = (req, res, next) => {
  // Ensure user is authenticated first
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  // List of admin emails (in production, this should be in environment variables or database)
  const adminEmails = [
    'admin@autoapplypro.tech',
    'dev@autoapplypro.tech',
    process.env.ADMIN_EMAIL,
    process.env.DEV_EMAIL
  ].filter(Boolean); // Remove undefined values

  // Check if user email is in admin list
  const userEmail = req.user.email || req.user.primaryEmailAddress?.emailAddress;
  
  // For development mode, also allow emails ending with @autoapplypro.tech
  const isAdmin = adminEmails.includes(userEmail) || 
                  (process.env.NODE_ENV === 'development' && userEmail?.endsWith('@autoapplypro.tech'));

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.',
      debug: process.env.NODE_ENV === 'development' ? {
        userEmail,
        adminEmails: adminEmails.filter(email => !email.includes('undefined'))
      } : undefined
    });
  }

  // Add admin flag to request for use in controllers
  req.isAdmin = true;
  next();
};

module.exports = adminAuth;
