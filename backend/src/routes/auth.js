const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Initialize Supabase client only if credentials are available
let supabase = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Register user
router.post('/register', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({
        success: true,
        data: {
          message: 'Registration is available when Supabase is configured. Check environment variables.',
          user: { email: req.body.email, id: 'dev-user-' + Date.now() }
        }
      });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email, password, and name are required' }
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: { message: error.message }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        user: data.user,
        message: 'User registered successfully. Please check your email for verification.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({
        success: true,
        data: {
          message: 'Login is available when Supabase is configured. Using development mode.',
          user: { email: req.body.email, id: 'dev-user-123' },
          session: { access_token: 'dev-token-123' }
        }
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: { message: error.message }
      });
    }

    res.json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// Logout user
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    if (!supabase) {
      return res.json({
        success: true,
        message: 'Logged out successfully (development mode)'
      });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: { message: error.message }
        });
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({
        success: true,
        data: { 
          message: 'Google OAuth is available when Supabase is configured.',
          url: 'https://example.com/oauth/google'
        }
      });
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: { message: error.message }
      });
    }

    res.json({
      success: true,
      data: { url: data.url }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

module.exports = router; 