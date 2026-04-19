/* ═══════════════════════════════════════════
   SkillSwap+ — API Service Layer
   Reusable fetch wrapper with auth & error handling
   ═══════════════════════════════════════════ */

const API_BASE = '/api';

/**
 * Core fetch wrapper.
 * - Attaches Authorization header if token exists
 * - Parses JSON responses
 * - Handles 401 → auto logout + redirect
 * - Throws enriched errors with server messages
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Attach Bearer token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  // If body is an object, stringify it
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    // Handle 401 — token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.hash = '/';
      return { data: null, error: true, status: 401, message: 'Session expired. Please log in again.' };
    }

    // Parse response body
    const data = await response.json().catch(() => null);

    // Handle non-success responses
    if (!response.ok) {
      const message = data?.message || data?.error || `Request failed (${response.status})`;
      console.warn(`[API] Expected error on ${endpoint}:`, message);
      return { data: null, error: true, status: response.status, message };
    }

    // Return safely structured success
    return { data, error: false, status: response.status, message: 'Success' };
  } catch (error) {
    console.error(`[API] Fatal Network Error on ${endpoint}:`, error);
    // Return absolutely safe null object on complete network failure
    return { data: null, error: true, status: 0, message: 'Network error. Please check your connection.' };
  }
}

/**
 * Custom error class with status code and server data
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/* ─── Convenience Methods ────────────────── */

const api = {
  get:    (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post:   (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: 'POST', body }),
  put:    (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: 'PUT', body }),
  patch:  (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: 'DELETE' })
};

export { api, apiFetch, ApiError };
export default api;
