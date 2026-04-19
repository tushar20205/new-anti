/* ═══════════════════════════════════════════
   Review Model
   ═══════════════════════════════════════════ */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reviewer']
    },

    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reviewee (teacher)']
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Review must be associated with a session']
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },

    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// ─── Indexes ───────────────────────────────

// One review per (reviewer, session) pair
reviewSchema.index({ reviewer: 1, session: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
