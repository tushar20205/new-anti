/* ═══════════════════════════════════════════
   Review Validation Schemas
   ═══════════════════════════════════════════ */

const Joi = require('joi');

const createReviewSchema = Joi.object({
  sessionId: Joi.string().hex().length(24).required()
    .messages({
      'any.required': 'Session ID is required',
      'string.hex': 'Invalid session ID format',
      'string.length': 'Invalid session ID format'
    }),

  rating: Joi.number().integer().min(1).max(5).required()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),

  feedback: Joi.string().trim().max(1000).allow('').default('')
    .messages({
      'string.max': 'Feedback cannot exceed 1000 characters'
    })
});

module.exports = { createReviewSchema };
