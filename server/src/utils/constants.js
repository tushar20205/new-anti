/* ═══════════════════════════════════════════
   Application Constants
   ═══════════════════════════════════════════ */

module.exports = {
  // User roles
  ROLES: {
    USER: 'user',
    MENTOR: 'mentor',
    ADMIN: 'admin'
  },

  // Session statuses
  SESSION_STATUS: {
    OPEN: 'open',
    FULL: 'full',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Request statuses
  REQUEST_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
  },

  // Transaction types
  TRANSACTION_TYPE: {
    EARN: 'earn',
    SPEND: 'spend',
    BONUS: 'bonus',
    REFUND: 'refund'
  },

  // Notification types
  NOTIFICATION_TYPE: {
    SESSION: 'session',
    CREDIT: 'credit',
    REVIEW: 'review',
    SYSTEM: 'system'
  },

  // Skill categories
  SKILL_CATEGORIES: [
    'Programming',
    'Design',
    'Marketing',
    'Data Science',
    'Languages',
    'Music',
    'Writing',
    'Business',
    'Photography',
    'Cooking',
    'Fitness',
    'Finance',
    'Public Speaking',
    'Leadership',
    'Other'
  ],

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50
  }
};
