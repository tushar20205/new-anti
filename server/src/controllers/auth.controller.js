/* ═══════════════════════════════════════════
   Auth Controller
   ═══════════════════════════════════════════ */

const User = require('../models/User');
const { generateTokenPair, verifyRefreshToken, generateAccessToken } = require('../services/auth.service');
const { verifyGoogleToken } = require('../services/google.service');
const { createNotification } = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const env = require('../config/env');

/**
 * POST /api/auth/register
 * Register a new user account.
 */
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  // Create user with default credits
  const user = await User.create({
    name,
    email,
    password,
    authProvider: 'local',
    credits: env.DEFAULT_CREDITS
  });

  // Generate tokens
  const tokens = generateTokenPair(user._id);

  // Store refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  // Welcome notification
  await createNotification(
    user._id,
    'system',
    `Welcome to SkillSwap+! You start with ${env.DEFAULT_CREDITS} credits. Start learning or teaching today!`,
    'celebration',
    'emerald'
  );

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        role: user.role
      },
      ...tokens
    }
  });
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens.
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.password || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // Generate tokens
  const tokens = generateTokenPair(user._id);

  // Store refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        role: user.role,
        profilePicture: user.profilePicture
      },
      ...tokens
    }
  });
});

/**
 * POST /api/auth/google
 * Authenticate or register a user via Google OAuth.
 * Accepts { credential } — the Google ID token from frontend GIS.
 */
const googleAuth = catchAsync(async (req, res, next) => {
  const { credential } = req.body;

  if (!credential) {
    return next(new AppError('Google credential token is required.', 400));
  }

  // Verify the Google ID token
  let googleUser;
  try {
    googleUser = await verifyGoogleToken(credential);
  } catch (err) {
    return next(new AppError('Invalid Google token. Please try again.', 401));
  }

  const { googleId, email, name, picture } = googleUser;

  // Check if user exists by googleId or email
  let user = await User.findOne({ $or: [{ googleId }, { email }] });
  let isNewUser = false;

  if (!user) {
    // Create new user from Google profile
    isNewUser = true;
    user = await User.create({
      name,
      email,
      googleId,
      authProvider: 'google',
      profilePicture: picture || '',
      credits: env.DEFAULT_CREDITS
    });

    // Welcome notification for new Google users
    await createNotification(
      user._id,
      'system',
      `Welcome to SkillSwap+! You start with ${env.DEFAULT_CREDITS} credits. Start learning or teaching today!`,
      'celebration',
      'emerald'
    );
  } else if (!user.googleId) {
    // Existing email user — link their Google account
    user.googleId = googleId;
    user.authProvider = user.authProvider || 'local';
    if (!user.profilePicture && picture) {
      user.profilePicture = picture;
    }
    await user.save({ validateBeforeSave: false });
  }

  // Generate tokens
  const tokens = generateTokenPair(user._id);

  // Store refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(isNewUser ? 201 : 200).json({
    status: 'success',
    message: isNewUser ? 'Account created with Google' : 'Logged in with Google',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        role: user.role,
        profilePicture: user.profilePicture
      },
      ...tokens
    }
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token using a valid refresh token.
 */
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
  }

  // Find user and verify stored refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    return next(new AppError('Invalid refresh token. Please log in again.', 401));
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: newAccessToken
    }
  });
});

/**
 * POST /api/auth/logout
 * Clear refresh token.
 */
const logout = catchAsync(async (req, res, next) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

module.exports = { register, login, googleAuth, refreshToken, logout };
