const { clerkClient, getAuth, requireAuth } = require('@clerk/express');

/**
 * Clerk Authentication middleware using official Clerk Express SDK
 * This middleware validates Clerk JWT tokens and provides user information
 */

// Development fallback when Clerk is not properly configured
const isDevelopment = process.env.NODE_ENV === 'development';
const hasValidClerkKey = process.env.CLERK_SECRET_KEY && process.env.CLERK_SECRET_KEY.startsWith('sk_');

// Development authentication fallback
function developmentAuth(req, res, next) {
  console.warn('⚠️ Using development authentication fallback');
  
  // Check for custom dev auth header
  const devUserId = req.header('x-dev-user-id') || 'dev-user-123';
  
  req.user = {
    id: devUserId,
    clerkId: devUserId,
    email: 'dev@autoapplypro.com',
    firstName: 'Dev',
    lastName: 'User'
  };
  
  req.auth = {
    userId: devUserId,
    user: req.user
  };
  
  next();
}

// Clerk authentication middleware
function clerkAuth(req, res, next) {
  // Use development fallback if Clerk is not properly configured
  if (isDevelopment && !hasValidClerkKey) {
    return developmentAuth(req, res, next);
  }

  try {
    // Get authentication information from Clerk
    const auth = getAuth(req);
    
    if (!auth.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'auth_required',
        message: 'Authentication required. Please log in.'
      });
    }

    // Set user info on request object
    req.auth = auth;
    req.user = {
      id: auth.userId,
      clerkId: auth.userId,
      email: auth.sessionClaims?.email || null,
      firstName: auth.sessionClaims?.firstName || null,
      lastName: auth.sessionClaims?.lastName || null
    };
    
    console.log('Clerk Auth: Authenticated user:', req.user.id);
    next();
  } catch (error) {
    console.error('Clerk Auth error:', error.message);
    
    // Fallback to development auth in development
    if (isDevelopment) {
      console.warn('⚠️ Clerk auth failed, falling back to development auth');
      return developmentAuth(req, res, next);
    }
    
    return res.status(401).json({ 
      success: false,
      error: 'invalid_token',
      message: 'Invalid authentication token.'
    });
  }
}

module.exports = clerkAuth;
