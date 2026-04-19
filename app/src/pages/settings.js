/* ═══════════════════════════════════════════
   SkillSwap+ — Settings & Growth Page
   Connected to API for profile updates,
   logout, and credit transactions
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { showToast } from '../components/toast.js';
import { fetchTransactions, saveProfile, performLogout } from '../services/data.layer.js';

export async function renderSettings(container) {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const settings = store.get('settings') || {};
  const userName = user?.name || 'User';
  const userEmail = user?.email || 'guest@example.com';
  const userRole = user?.role || 'user';
  const userLevel = user?.level || 1;
  const userXp = user?.xp || 0;
  const userXpMax = user?.xpMax || 1000;

  // Fetch transactions through data layer (safe in demo mode)
  let transactions = [];
  const txRes = await fetchTransactions();
  if (!txRes.error) transactions = txRes.data || [];

  container.innerHTML = `
    <div class="pt-12 px-12 pb-24 max-w-[1000px] mx-auto">
      <div class="mb-12 stagger-children">
        <h1 class="text-4xl font-black tracking-tight text-zinc-900 mb-2">Settings & Growth</h1>
        <p class="text-zinc-500 text-lg">Manage your account, notifications, and track your progress.</p>
      </div>

      <div class="space-y-10 stagger-children">
        <!-- XP Level System -->
        <section class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
          <h2 class="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">military_tech</span>
            XP Level System
          </h2>
          <div class="flex items-center gap-8 mb-8">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
              <span class="text-white text-3xl font-black">${userLevel}</span>
            </div>
            <div class="flex-1">
              <div class="flex justify-between mb-2">
                <span class="font-black text-zinc-900">Level ${userLevel} — ${userLevel < 5 ? 'Intermediate' : userLevel < 10 ? 'Advanced' : 'Master'}</span>
                <span class="text-sm text-zinc-400 font-bold">${userXp} / ${userXpMax} XP</span>
              </div>
              <div class="xp-bar">
                <div class="xp-bar-fill" style="width: ${(userXp / userXpMax) * 100}%"></div>
              </div>
              <p class="text-xs text-zinc-400 mt-2">${userXpMax - userXp} XP until Level ${userLevel + 1}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${[
              { label: 'Complete Session', xp: '+25 XP', icon: 'school' },
              { label: 'Submit Assignment', xp: '+50 XP', icon: 'assignment_turned_in' },
              { label: 'Teach a Session', xp: '+75 XP', icon: 'record_voice_over' },
              { label: 'Community Answer', xp: '+10 XP', icon: 'chat' }
            ].map(item => `
              <div class="bg-zinc-50 rounded-xl p-4 border border-zinc-100 text-center">
                <span class="material-symbols-outlined text-primary text-lg mb-2">${item.icon}</span>
                <p class="text-xs font-bold text-zinc-900">${item.label}</p>
                <p class="text-[10px] font-black text-primary mt-1">${item.xp}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Notification Settings -->
        <section class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
          <h2 class="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">notifications</span>
            Notification Preferences
          </h2>
          <div class="space-y-6">
            ${[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive session reminders and updates via email' },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get real-time alerts in your browser' },
              { key: 'sessionReminders', label: 'Session Reminders', desc: 'Get notified 15 minutes before a session' },
              { key: 'communityDigest', label: 'Community Digest', desc: 'Weekly summary of trending discussions' },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Product updates and feature announcements' }
            ].map(item => `
              <div class="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 transition-colors">
                <div>
                  <p class="font-bold text-sm text-zinc-900">${item.label}</p>
                  <p class="text-xs text-zinc-400 mt-0.5">${item.desc}</p>
                </div>
                <div class="toggle-switch ${settings[item.key] ? 'on' : ''}" data-setting="${item.key}"></div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Credit Management -->
        <section class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
          <h2 class="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
            Credit Management
          </h2>
          <div class="flex items-center gap-6 p-6 bg-gradient-to-br from-primary to-primary-container rounded-2xl text-white mb-6">
            <div>
              <p class="text-xs opacity-70 font-bold uppercase tracking-wider">Current Balance</p>
              <p class="text-4xl font-black" id="settings-credits">${credits}</p>
            </div>
            <div class="flex-1"></div>
            <a href="#/mentor-apply" class="bg-white/20 px-6 py-3 rounded-full font-bold text-sm hover:bg-white/30 transition-all btn-press">
              Earn Credits
            </a>
          </div>
          <div class="space-y-4">
            <h3 class="text-sm font-black text-zinc-500 uppercase tracking-wider">Recent Transactions</h3>
            ${transactions.length > 0 ? transactions.slice(0, 5).map(t => `
              <div class="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl">
                <div>
                  <p class="font-bold text-sm">${t.description || t.type || 'Transaction'}</p>
                  <p class="text-[10px] text-zinc-400 font-bold uppercase">${t.createdAt ? new Date(t.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</p>
                </div>
                <p class="${t.amount > 0 ? 'text-emerald-600' : 'text-red-500'} font-black">${t.amount > 0 ? '+' : ''}${t.amount}</p>
              </div>
            `).join('') : `
              <div class="text-center py-6 bg-zinc-50 rounded-2xl">
                <p class="text-zinc-400 text-sm">No transactions yet. Start teaching or learning to see your history!</p>
              </div>
            `}
          </div>
        </section>

        <!-- Account Settings -->
        <section class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
          <h2 class="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">person</span>
            Account Settings
          </h2>
          <div class="space-y-6">
            <div>
              <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Display Name</label>
              <input id="settings-name" class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium" value="${userName}" />
            </div>
            <div>
              <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Email</label>
              <input id="settings-email" class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-medium text-zinc-400 cursor-not-allowed" value="${userEmail}" disabled />
              <p class="text-[10px] text-zinc-400 mt-1 px-1">Email cannot be changed</p>
            </div>
            <div>
              <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Role</label>
              <input class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-medium text-zinc-400 cursor-not-allowed" value="${userRole}" disabled />
            </div>
            <div class="flex gap-4 pt-4">
              <button id="save-settings-btn" class="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 btn-press flex items-center justify-center gap-2">Save Changes</button>
              <button id="cancel-settings-btn" class="bg-zinc-100 text-zinc-600 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all">Cancel</button>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="bg-white rounded-2xl border border-red-100 p-8">
          <h2 class="text-lg font-black text-red-600 mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">warning</span>
            Danger Zone
          </h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-sm text-zinc-900">Sign Out</p>
              <p class="text-xs text-zinc-400">Sign out of your account on this device</p>
            </div>
            <button id="signout-settings-btn" class="bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-red-100 transition-all btn-press">Sign Out</button>
          </div>
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-red-50">
            <div>
              <p class="font-bold text-sm text-zinc-900">Reset Local Data</p>
              <p class="text-xs text-zinc-400">Clear local preferences and sign out</p>
            </div>
            <button id="reset-data-btn" class="bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-red-100 transition-all btn-press">Reset</button>
          </div>
        </section>
      </div>
    </div>
  `;

  // Toggle switches
  document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const key = toggle.dataset.setting;
      toggle.classList.toggle('on');
      store.updateSettings(key, toggle.classList.contains('on'));
      showToast(`${key === 'emailNotifications' ? 'Email notifications' : key.replace(/([A-Z])/g, ' $1').trim()} ${toggle.classList.contains('on') ? 'enabled' : 'disabled'}`, 'info');
    });
  });

  // Save settings — routes through data layer
  document.getElementById('save-settings-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('save-settings-btn');
    const name = document.getElementById('settings-name').value.trim();

    if (!name) {
      showToast('Name cannot be empty', 'warning');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">refresh</span> Saving...';

    const res = await saveProfile({ name });
    if (res.error) {
      showToast(res.message || 'Failed to save settings', 'error');
    } else {
      showToast('Settings saved successfully!', 'success');
    }

    btn.disabled = false;
    btn.innerHTML = 'Save Changes';
  });

  // Cancel
  document.getElementById('cancel-settings-btn')?.addEventListener('click', () => {
    document.getElementById('settings-name').value = userName;
    showToast('Changes discarded', 'info');
  });

  // Sign out — through data layer
  document.getElementById('signout-settings-btn')?.addEventListener('click', async () => {
    await performLogout();
  });

  // Reset
  document.getElementById('reset-data-btn')?.addEventListener('click', async () => {
    store.reset();
    showToast('Local data has been reset', 'info');
    await performLogout();
  });

  // Live credit updates
  store.on('credits', (c) => {
    const el = document.getElementById('settings-credits');
    if (el) el.textContent = c;
  });
}
