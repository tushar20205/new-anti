/* ═══════════════════════════════════════════
   Review Routes
   ═══════════════════════════════════════════ */

const express = require('express');
const router = express.Router();

const { createReview, getReviewsForUser } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createReviewSchema } = require('../validators/review.validator');

// Protected routes
router.post('/', protect, validate(createReviewSchema), createReview);

// Public routes
router.get('/user/:userId', getReviewsForUser);

module.exports = router;
