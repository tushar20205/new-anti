/* ═══════════════════════════════════════════
   Express Application Setup
   ═══════════════════════════════════════════ */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');


// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const sessionRoutes = require('./routes/session.routes');
const creditRoutes = require('./routes/credit.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const bookingRoutes = require('./routes/booking.routes');
const projectResourceRoutes = require('./routes/projectResource.routes');
const resumeRoutes = require('./routes/resume.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const activityRoutes = require('./routes/activity.routes');
const profileCompletionRoutes = require('./routes/profileCompletion.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const communityRoutes = require('./routes/community.routes');

const app = express();

// ─── Global Middleware ─────────────────────

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files (profile pictures)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
app.use('/api', generalLimiter);

// ─── Health Check ──────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SkillSwap+ API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
  });
});

// ─── API Routes ────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/projects', projectResourceRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/profile-completion', profileCompletionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/community', communityRoutes);

// ─── 404 Handler ───────────────────────────

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ─── Global Error Handler ──────────────────

app.use(errorHandler);

module.exports = app;
