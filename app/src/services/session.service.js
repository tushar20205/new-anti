/* ═══════════════════════════════════════════
   SkillSwap+ — Session Service
   Sessions CRUD, join requests, and completion
   ═══════════════════════════════════════════ */

import api from './api.js';

/**
 * Create a new session (as host/teacher).
 * @param {Object} data — { title, description, skillCategory, date, startTime, endTime, creditsRequired, maxParticipants, tags }
 */
export async function createSession(data) {
  const res = await api.post('/sessions', data);
  return res.data.session;
}

/**
 * Browse available sessions with optional filters.
 * @param {Object} query — { skillCategory, status, page, limit }
 */
export async function getSessions(query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value);
    }
  });
  const qs = params.toString();
  const res = await api.get(`/sessions${qs ? '?' + qs : ''}`);
  return res.data;
}

/**
 * Get sessions the current user is hosting or attending.
 * @returns {{ hosting: [], attending: [] }}
 */
export async function getMySessions() {
  const res = await api.get('/sessions/mine');
  return res.data;
}

/**
 * Get a single session by ID.
 */
export async function getSessionById(id) {
  const res = await api.get(`/sessions/${id}`);
  return res.data.session;
}

/**
 * Request to join a session (as learner).
 */
export async function requestToJoin(id) {
  const res = await api.post(`/sessions/${id}/request`, {});
  return res.data;
}

/**
 * Respond to a join request (accept/reject) — host only.
 * @param {string} sessionId
 * @param {string} userId
 * @param {'accept'|'reject'} action
 */
export async function respondToRequest(sessionId, userId, action) {
  const res = await api.post(`/sessions/${sessionId}/respond`, { userId, action });
  return res.data;
}

/**
 * Mark a session as completed — host only.
 */
export async function completeSession(id) {
  const res = await api.patch(`/sessions/${id}/complete`, {});
  return res.data;
}
