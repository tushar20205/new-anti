/* ═══════════════════════════════════════════
   Global Error Handler
   ═══════════════════════════════════════════ */

const env = require('../config/env');

/**
 * Handle Mongoose CastError (invalid ObjectId).
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, status: 'fail', message };
};

/**
 * Handle Mongoose duplicate key error.
 */
const handleDuplicateKey = (err) => {
  if (!err.keyValue || Object.keys(err.keyValue).length === 0) {
    return { statusCode: 409, status: 'fail', message: 'Duplicate value detected.' };
  }
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for "${field}". This ${field} is already in use.`;
  return { statusCode: 409, status: 'fail', message };
};

/**
 * Handle Mongoose validation error.
 */
const handleValidationError = (err) => {
  if (!err.errors || Object.keys(err.errors).length === 0) {
    return { statusCode: 400, status: 'fail', message: 'Validation failed.' };
  }
  const messages = Object.values(err.errors).map((e) => e.message);
  const message = `Validation failed: ${messages.join('. ')}`;
  return { statusCode: 400, status: 'fail', message };
};

/**
 * Handle JWT errors.
 */
const handleJWTError = () => ({
  statusCode: 401,
  status: 'fail',
  message: 'Invalid token. Please log in again.'
});

const handleJWTExpired = () => ({
  statusCode: 401,
  status: 'fail',
  message: 'Your token has expired. Please log in again.'
});

// ─── Main Error Handler ────────────────────

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Something went wrong';

  // Handle specific Mongoose/JWT errors
  if (err.name === 'CastError') {
    const handled = handleCastError(err);
    statusCode = handled.statusCode;
    status = handled.status;
    message = handled.message;
  }

  if (err.code === 11000) {
    const handled = handleDuplicateKey(err);
    statusCode = handled.statusCode;
    status = handled.status;
    message = handled.message;
  }

  if (err.name === 'ValidationError') {
    const handled = handleValidationError(err);
    statusCode = handled.statusCode;
    status = handled.status;
    message = handled.message;
  }

  if (err.name === 'JsonWebTokenError') {
    const handled = handleJWTError();
    statusCode = handled.statusCode;
    status = handled.status;
    message = handled.message;
  }

  if (err.name === 'TokenExpiredError') {
    const handled = handleJWTExpired();
    statusCode = handled.statusCode;
    status = handled.status;
    message = handled.message;
  }

  // Development: send full error
  if (env.NODE_ENV === 'development') {
    console.error('🔴 ERROR:', err);
    return res.status(statusCode).json({
      status,
      message,
      error: err,
      stack: err.stack
    });
  }

  // Production: send clean error
  if (err.isOperational) {
    return res.status(statusCode).json({ status, message });
  }

  // Unknown errors in production — don't leak details
  console.error('🔴 UNEXPECTED ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.'
  });
};

module.exports = errorHandler;
