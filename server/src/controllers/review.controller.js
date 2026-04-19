/* ═══════════════════════════════════════════
   Review Controller
   ═══════════════════════════════════════════ */

const Review = require('../models/Review');
const Session = require('../models/Session');
const { SESSION_STATUS, NOTIFICATION_TYPE } = require('../utils/constants');
const reviewService = require('../services/review.service');
const { createNotification } = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * POST /api/reviews
 * Submit a review for a completed session.
 */
const createReview = catchAsync(async (req, res, next) => {
  const { sessionId, rating, feedback } = req.body;
  const reviewerId = req.user._id;

  // Find the session
  const session = await Session.findById(sessionId).populate('host', 'name');
  if (!session) {
    return next(new AppError('Session not found.', 404));
  }

  // Session must be completed
  if (session.status !== SESSION_STATUS.COMPLETED) {
    return next(new AppError('You can only review completed sessions.', 400));
  }

  // Reviewer must be a participant
  const isParticipant = session.participants.some(
    (p) => p.toString() === reviewerId.toString()
  );
  if (!isParticipant) {
    return next(new AppError('You can only review sessions you participated in.', 403));
  }

  // Check for duplicate review
  const existingReview = await Review.findOne({ reviewer: reviewerId, session: sessionId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this session.', 409));
  }

  // Create review
  const review = await Review.create({
    reviewer: reviewerId,
    reviewee: session.host._id,
    session: sessionId,
    rating,
    feedback
  });

  // Recalculate the teacher's rating
  await reviewService.recalculateRating(session.host._id);

  // Notify the teacher
  await createNotification(
    session.host._id,
    NOTIFICATION_TYPE.REVIEW,
    `${req.user.name} gave you a ${rating}-star review for "${session.title}".`,
    'star',
    rating >= 4 ? 'amber' : 'violet'
  );

  res.status(201).json({
    status: 'success',
    message: 'Review submitted successfully',
    data: { review }
  });
});

/**
 * GET /api/reviews/user/:userId
 * Get reviews for a specific user (public).
 */
const getReviewsForUser = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  const result = await reviewService.getUserReviews(req.params.userId, page, limit);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

module.exports = { createReview, getReviewsForUser };
