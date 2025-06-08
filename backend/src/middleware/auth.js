const jwt = require('jsonwebtoken');

// Initialize Supabase client only if credentials are available
let supabase = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const authMiddleware = async (req, res, next) => {
  try {
    // If no Supabase client, create a mock user for development
    if (!supabase) {
      req.user = {
        id: 'dev-user-123',
        email: 'dev@proverse.com',
        user_metadata: { name: 'Development User', role: 'admin' }
      };
      return next();
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided' }
      });
    }

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid or expired token' }
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication failed' }
    });
  }
};

// Optional authentication - continues if no token
const optionalAuth = async (req, res, next) => {
  try {
    // If no Supabase client, create a mock user for development
    if (!supabase) {
      req.user = {
        id: 'dev-user-123',
        email: 'dev@proverse.com',
        user_metadata: { name: 'Development User', role: 'admin' }
      };
      return next();
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without user if authentication fails
    next();
  }
};

// Role-based authentication
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const userRole = req.user.user_metadata?.role || 'user';
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuth,
  requireRole
}; 