/* ═══════════════════════════════════════════
   Multer File Upload Configuration
   ═══════════════════════════════════════════ */

const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `user-${req.user._id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter — only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only .jpg, .png, and .webp images are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = upload;
