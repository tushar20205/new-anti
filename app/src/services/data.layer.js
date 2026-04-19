/* ═══════════════════════════════════════════
   SkillSwap+ — Data Abstraction Layer
   
   ALL data access flows through this module.
   In demo mode: returns mock data, ZERO network calls.
   In live mode: delegates to real API services.
   
   This is the ONLY file pages should import
   for data operations.
   ═══════════════════════════════════════════ */

import { store } from '../state.js';

// ─── Mode Detection ─────────────────────────
export function isDemoMode() {
  return localStorage.getItem('demo_mode') === 'true';
}

// ─── Standardized Response Shape ─────────────
// Every method returns: { data, error, message }
function ok(data) {
  return { data, error: false, message: 'Success' };
}
function fail(message) {
  return { data: null, error: true, message };
}

// ═══════════════════════════════════════════
//  USER / PROFILE
// ═══════════════════════════════════════════

export async function fetchProfile() {
  if (isDemoMode()) {
    return ok(store.getUserSafe());
  }
  try {
    const { getProfile } = await import('./user.service.js');
    const user = await getProfile();
    if (user) {
      store.setUserFromAPI(user);
      return ok(user);
    }
    return fail('Failed to load profile');
  } catch (e) {
    return fail(e.message || 'Profile fetch error');
  }
}

export async function saveProfile(data) {
  if (isDemoMode()) {
    const current = store.getUserSafe();
    store.setUserFromAPI({
      ...current,
      ...data,
      profilePicture: current.avatar
    });
    return ok(store.getUserSafe());
  }
  try {
    const { updateProfile } = await import('./user.service.js');
    const updated = await updateProfile(data);
    if (updated) {
      store.setUserFromAPI(updated);
      return ok(updated);
    }
    return fail('Failed to update profile');
  } catch (e) {
    return fail(e.message || 'Profile update error');
  }
}

// ═══════════════════════════════════════════
//  SESSIONS
// ═══════════════════════════════════════════

export async function fetchMySessions() {
  if (isDemoMode()) {
    return ok({
      hosting: (store.get('sessions') || []).filter(s => s.role === 'hosting'),
      attending: (store.get('sessions') || []).filter(s => s.role !== 'hosting')
    });
  }
  try {
    const { getMySessions } = await import('./session.service.js');
    const result = await getMySessions();
    return ok(result || { hosting: [], attending: [] });
  } catch (e) {
    return fail(e.message || 'Sessions fetch error');
  }
}

// ═══════════════════════════════════════════
//  CREDITS / TRANSACTIONS
// ═══════════════════════════════════════════

export async function fetchTransactions() {
  if (isDemoMode()) {
    // Return demo transaction history
    return ok([
      { description: 'Session: Advanced Prompt Engineering', amount: -12, createdAt: '2026-04-10T10:00:00Z', type: 'booking' },
      { description: 'Teaching: React Performance Mastery', amount: +15, createdAt: '2026-04-08T14:00:00Z', type: 'earning' },
      { description: 'Referral bonus', amount: +25, createdAt: '2026-04-05T09:00:00Z', type: 'referral' },
      { description: 'Welcome bonus', amount: +50, createdAt: '2026-04-01T00:00:00Z', type: 'bonus' }
    ]);
  }
  try {
    const { getTransactions } = await import('./credit.service.js');
    const transactions = await getTransactions();
    return ok(transactions || []);
  } catch (e) {
    return fail(e.message || 'Transactions fetch error');
  }
}

// ═══════════════════════════════════════════
//  REFERRALS
// ═══════════════════════════════════════════

const REFERRAL_STORAGE_KEY = 'skillswap_referrals';

function _loadReferrals() {
  try {
    return JSON.parse(localStorage.getItem(REFERRAL_STORAGE_KEY)) || { referrals: [], totalRewards: 0 };
  } catch { return { referrals: [], totalRewards: 0 }; }
}

function _saveReferrals(data) {
  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
}

export function getReferralCode() {
  const user = store.getUserSafe();
  const id = user._id || 'demo';
  return 'SKILL-' + id.slice(-6).toUpperCase();
}

export function getReferralStats() {
  const data = _loadReferrals();
  return ok({
    code: getReferralCode(),
    count: data.referrals.length,
    totalRewards: data.totalRewards,
    referrals: data.referrals
  });
}

export function simulateReferral(name) {
  const data = _loadReferrals();
  const reward = 25;
  data.referrals.push({
    id: 'ref-' + Date.now(),
    name: name || 'Anonymous User',
    date: new Date().toISOString(),
    reward,
    status: 'completed'
  });
  data.totalRewards += reward;
  _saveReferrals(data);
  store.addCredits(reward, `Referral: ${name}`);
  return ok({ reward, newBalance: store.get('credits') });
}

// ═══════════════════════════════════════════
//  AUTH (thin pass-through, keeps existing logic)
// ═══════════════════════════════════════════

export async function performLogin(email, password) {
  if (isDemoMode()) {
    return fail('Demo mode does not support login');
  }
  try {
    const { login } = await import('./auth.service.js');
    return await login(email, password);
  } catch (e) {
    return fail(e.message || 'Login failed');
  }
}

export async function performRegister(name, email, password) {
  if (isDemoMode()) {
    return fail('Demo mode does not support registration');
  }
  try {
    const { register } = await import('./auth.service.js');
    return await register(name, email, password);
  } catch (e) {
    return fail(e.message || 'Registration failed');
  }
}

export async function performLogout() {
  const { logout } = await import('./auth.service.js');
  return await logout();
}
