/* ═══════════════════════════════════════════
   SkillSwap+ — Auth Service
   Register, login, logout, and token management
   ═══════════════════════════════════════════ */

import api from './api.js';

/* ─── Token Helpers ──────────────────────── */

const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refreshToken';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }
}

export function removeTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

/* ─── Auth API Calls ─────────────────────── */

/**
 * Register a new user.
 * @returns {{ user, accessToken, refreshToken }}
 */
export async function register(name, email, password) {
  const res = await api.post('/auth/register', { name, email, password });
  if (res.error) return { error: res.message };

  const { accessToken, refreshToken, user } = res.data;

  // Store tokens
  setTokens(accessToken, refreshToken);

  return { user, accessToken, refreshToken };
}

/**
 * Login with email and password.
 * @returns {{ user, accessToken, refreshToken }}
 */
export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  if (res.error) return { error: res.message };

  const { accessToken, refreshToken, user } = res.data;

  // Store tokens
  setTokens(accessToken, refreshToken);

  return { user, accessToken, refreshToken };
}

/**
 * Logout — clear all tokens and redirect to landing.
 */
export async function logout() {
  try {
    // Attempt server-side logout (clear refresh token)
    await api.post('/auth/logout', {});
  } catch (e) {
    // Ignore errors — we're logging out anyway
    console.warn('Server logout failed:', e.message);
  }

  // Always clear local tokens
  removeTokens();
  localStorage.removeItem('skillswap_state');
  localStorage.removeItem('demo_mode');

  // Redirect to landing page
  window.location.hash = '/';
}

/**
 * Refresh the access token using the stored refresh token.
 * @returns {string} new access token
 */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const res = await api.post('/auth/refresh', { refreshToken });
  if (res.error) throw new Error(res.message);

  const { accessToken } = res.data;

  localStorage.setItem(TOKEN_KEY, accessToken);
  return accessToken;
}
