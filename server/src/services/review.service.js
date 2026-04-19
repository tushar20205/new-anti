/* ═══════════════════════════════════════════
   Review Service — Rating Calculations
   ═══════════════════════════════════════════ */

const Review = require('../models/Review');
const User = require('../models/User');

/**
 * Recalculate a user's average rating from all their reviews.
 * Called after a new review is created.
 */
const recalculateRating = async (userId) => {
  const result = await Review.aggregate([
    { $match: { reviewee: userId } },
    {
      $group: {
        _id: '$reviewee',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    const { avgRating, count } = result[0];
    await User.findByIdAndUpdate(userId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      ratingCount: count
    });
  }
};

/**
 * Get paginated reviews for a user.
 */
const getUserReviews = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ reviewee: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('reviewer', 'name profilePicture')
      .populate('session', 'title skillCategory')
      .lean(),
    Review.countDocuments({ reviewee: userId })
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = { recalculateRating, getUserReviews };
