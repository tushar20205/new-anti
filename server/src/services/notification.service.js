/* ═══════════════════════════════════════════
   Notification Service
   ═══════════════════════════════════════════ */

const Notification = require('../models/Notification');

/**
 * Create a notification for a user.
 */
const createNotification = async (userId, type, message, icon = 'info', color = 'violet', link = '') => {
  const notification = await Notification.create({
    user: userId,
    type,
    message,
    icon,
    color,
    link
  });

  return notification;
};

/**
 * Get paginated notifications for a user.
 */
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, read: false })
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Mark a notification as read.
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  return notification;
};

/**
 * Mark all notifications as read for a user.
 */
const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, read: false },
    { read: true }
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};
