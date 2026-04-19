/* ═══════════════════════════════════════════
   Rate Limiting Configuration
   ═══════════════════════════════════════════ */

const rateLimit = require('express-rate-limit');

// General API limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Auth limiter: 10 attempts per 15 minutes (prevents brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

module.exports = { generalLimiter, authLimiter };
