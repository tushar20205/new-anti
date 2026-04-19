/* ═══════════════════════════════════════════
   Notification Routes
   ═══════════════════════════════════════════ */

const express = require('express');
const router = express.Router();

const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

// All notification routes require auth
router.get('/',              protect, getNotifications);
router.patch('/read-all',    protect, markAllAsRead);
router.patch('/:id/read',   protect, markAsRead);

module.exports = router;
