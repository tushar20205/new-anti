/* ═══════════════════════════════════════════
   SkillSwap+ — Credit Service
   Balance and transaction history
   ═══════════════════════════════════════════ */

import api from './api.js';

/**
 * Get the current user's credit balance.
 * @returns {Object} { credits }
 */
export async function getCredits() {
  const res = await api.get('/credits');
  return res.data;
}

/**
 * Get the current user's credit transaction history.
 * @returns {Array} transactions
 */
export async function getTransactions() {
  const res = await api.get('/credits/transactions');
  return res.data.transactions || res.data || [];
}
