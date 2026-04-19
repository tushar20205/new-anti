/* ═══════════════════════════════════════════
   User Validation Schemas
   ═══════════════════════════════════════════ */

const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),

  bio: Joi.string().max(500).allow('')
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),

  skillsOffered: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      level: Joi.number().min(0).max(100).default(50)
    })
  ).max(20),

  skillsWanted: Joi.array().items(
    Joi.string().trim()
  ).max(20),

  profilePicture: Joi.string().uri().allow('')
}).min(1).messages({
  'object.min': 'Please provide at least one field to update'
});

module.exports = { updateProfileSchema };
