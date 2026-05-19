/* ═══════════════════════════════════════════
   SkillSwap+ — Notification Service
   Fetch and manage notifications
   ═══════════════════════════════════════════ */

import api from './api.js';

/**
 * Get the current user's notifications.
 * @returns {Array} notifications
 */
export async function getNotifications() {
  const res = await api.get('/notifications');
  if (res.error) return [];
  const payload = res.data?.data;
  // Handle both { notifications: [...] } and direct array formats
  if (Array.isArray(payload)) return payload;
  return payload?.notifications || [];
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(id) {
  const res = await api.patch(`/notifications/${id}/read`, {});
  return res;
}

/**
 * Mark all notifications as read.
 */
export async function markAllAsRead() {
  const res = await api.patch('/notifications/read-all', {});
  return res;
}

