const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');

// Get all brainstorming sessions
router.get('/', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: {
      sessions: [],
      message: 'Brainstorming module - Coming soon!'
    }
  });
});

// Create new brainstorming session
router.post('/', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Brainstorming session creation - Coming soon!'
    }
  });
});

module.exports = router; 