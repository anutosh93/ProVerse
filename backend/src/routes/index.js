const express = require('express');
const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ProVerse API! 🚀',
    version: '1.0.0',
    description: 'AI-powered product management platform',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      docs: '/api/docs',
      auth: '/api/auth',
      modules: {
        brainstorming: '/api/brainstorming',
        wireframes: '/api/wireframes',
        figma: '/api/figma',
        code: '/api/code',
        qa: '/api/qa',
        analytics: '/api/analytics',
        bugs: '/api/bugs'
      },
      integrations: {
        google: '/api/google',
        jira: '/api/jira',
        vector: '/api/vector'
      }
    },
    features: [
      'AI-powered brainstorming and ideation',
      'Wireframe generation and management',
      'Figma to PRD conversion',
      'Automated code generation',
      'QA test case generation',
      'Product analytics and insights',
      'Intelligent bug tracking',
      'Google Meet integration',
      'JIRA synchronization',
      'Vector-based context search'
    ]
  });
});

// API status route
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router; 