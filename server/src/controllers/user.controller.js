/* ═══════════════════════════════════════════
   User Controller
   ═══════════════════════════════════════════ */

const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * GET /api/users/profile
 * Get the current authenticated user's full profile.
 */
const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * PUT /api/users/profile
 * Update the current user's profile.
 */
const updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = ['name', 'bio', 'skillsOffered', 'skillsWanted', 'profilePicture'];

  // Build update object from allowed fields only
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: { user }
  });
});

/**
 * GET /api/users/:id
 * Get a user's public profile by ID.
 */
const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('name bio skillsOffered skillsWanted rating ratingCount profilePicture role createdAt');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**
 * POST /api/users/profile/avatar
 * Upload a profile picture.
 */
const uploadProfilePicture = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image file.', 400));
  }

  // Build the URL path
  const pictureUrl = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: pictureUrl },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile picture updated',
    data: {
      profilePicture: user.profilePicture
    }
  });
});

module.exports = { getProfile, updateProfile, getUserById, uploadProfilePicture };
