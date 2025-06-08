const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: { message: 'Code generation module - Coming soon!' }
  });
});

module.exports = router; 