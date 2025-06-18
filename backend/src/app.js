const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { body, validationResult } = require('express-validator');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const logger = require('./utils/logger');

// Import route modules
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const chatgptRoutes = require('./routes/chatgpt');

// Create Express app
const app = express();

// Trust proxy (for rate limiting behind proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.anthropic.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'https://proverse.vercel.app',
      'https://proverse.com',
      'https://www.proverse.com',
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API-specific rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 API requests per windowMs
  message: {
    error: 'Too many API requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
});

app.use('/api/', apiLimiter);
app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'ProVerse API',
    version: '1.0.0',
    description: 'AI-powered product management platform API',
    endpoints: {
      auth: '/api/auth/*',
      brainstorming: '/api/brainstorming/*',
      wireframes: '/api/wireframes/*',
      figma: '/api/figma/*',
      code: '/api/code/*',
      qa: '/api/qa/*',
      analytics: '/api/analytics/*',
      bugs: '/api/bugs/*',
      health: '/health',
    },
    documentation: 'https://docs.proverse.com',
  });
});

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chatgpt', chatgptRoutes);

// Brainstorming module routes
app.use('/api/brainstorming', require('./modules/brainstorming/controller'));

// Wireframes module routes
app.use('/api/wireframes', require('./modules/wireframes/controller'));

// Figma integration routes
app.use('/api/figma', require('./modules/figma-integration/controller'));

// Code generation routes
app.use('/api/code', require('./modules/code-generation/controller'));

// QA module routes
app.use('/api/qa', require('./modules/qa-module/controller'));

// Analytics routes
app.use('/api/analytics', require('./modules/analytics/controller'));

// Bug tracking routes
app.use('/api/bugs', require('./modules/bug-tracking/controller'));

// Google services routes
app.use('/api/google/meetings', require('./routes/google/meetingRoutes'));
app.use('/api/google/drive', require('./routes/google/driveRoutes'));

// JIRA routes
app.use('/api/jira', require('./routes/jira/bugRoutes'));

// Vector search routes
app.use('/api/vector', require('./routes/vector/searchRoutes'));

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`,
    availableRoutes: [
      '/api/auth',
      '/api/brainstorming',
      '/api/wireframes',
      '/api/figma',
      '/api/code',
      '/api/qa',
      '/api/analytics',
      '/api/bugs',
      '/health',
      '/api/docs',
    ],
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app; 