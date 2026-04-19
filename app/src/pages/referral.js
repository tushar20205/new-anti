/* ═══════════════════════════════════════════
   SkillSwap+ — Refer & Earn Page
   Frontend demo with localStorage, backend-ready
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { showToast } from '../components/toast.js';
import { getReferralCode, getReferralStats, simulateReferral } from '../services/data.layer.js';

export function renderReferral(container) {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const code = getReferralCode();
  const statsRes = getReferralStats();
  const stats = statsRes.data || { count: 0, totalRewards: 0, referrals: [] };
  const referralLink = `${window.location.origin}${window.location.pathname}#/?ref=${code}`;

  container.innerHTML = `
    <div class="pt-12 px-12 pb-24 max-w-[1000px] mx-auto">
      <div class="mb-12 stagger-children">
        <nav class="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
          <a href="#/dashboard" class="hover:text-primary transition-colors">Dashboard</a>
          <span class="material-symbols-outlined text-[10px]">chevron_right</span>
          <span class="text-primary">Refer & Earn</span>
        </nav>
        <h1 class="text-4xl font-black tracking-tight text-zinc-900 mb-2">Refer & Earn</h1>
        <p class="text-zinc-500 text-lg">Invite friends and earn <strong>25 credits</strong> for each successful referral.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-children">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Referral Card -->
          <div class="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl">card_giftcard</span>
                </div>
                <div>
                  <h2 class="text-xl font-black">Your Referral Code</h2>
                  <p class="text-white/70 text-xs">Share this code with friends</p>
                </div>
              </div>
              
              <!-- Code Display -->
              <div class="bg-white/15 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between mb-6">
                <code class="text-2xl font-black tracking-widest" id="referral-code">${code}</code>
                <button id="copy-code-btn" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">content_copy</span>
                  Copy
                </button>
              </div>

              <!-- Link Display -->
              <div class="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <span class="material-symbols-outlined text-white/60 text-sm">link</span>
                <code class="text-xs text-white/80 truncate flex-1" id="referral-link">${referralLink}</code>
                <button id="copy-link-btn" class="text-xs font-bold text-white/80 hover:text-white transition-colors">Copy Link</button>
              </div>

              <!-- Share Buttons -->
              <div class="flex gap-3 mt-6">
                <button id="share-native-btn" class="flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-sm">share</span>
                  Share
                </button>
                <button id="share-whatsapp-btn" class="flex-1 bg-emerald-500/30 hover:bg-emerald-500/40 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-sm">chat</span>
                  WhatsApp
                </button>
                <button id="share-twitter-btn" class="flex-1 bg-blue-500/30 hover:bg-blue-500/40 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-sm">tag</span>
                  Twitter
                </button>
              </div>
            </div>
          </div>

          <!-- How It Works -->
          <div class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
            <h3 class="text-lg font-black text-zinc-900 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">info</span>
              How It Works
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${[
                { step: '1', icon: 'share', title: 'Share Your Code', desc: 'Send your unique referral code to friends via any channel.' },
                { step: '2', icon: 'person_add', title: 'Friend Signs Up', desc: 'They register using your referral link or code.' },
                { step: '3', icon: 'generating_tokens', title: 'Earn Credits', desc: 'You get 25 credits instantly when they join!' }
              ].map(s => `
                <div class="text-center">
                  <div class="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-primary text-2xl">${s.icon}</span>
                  </div>
                  <div class="bg-primary text-white w-6 h-6 rounded-full text-xs font-black flex items-center justify-center mx-auto mb-3">${s.step}</div>
                  <h4 class="font-bold text-sm text-zinc-900 mb-1">${s.title}</h4>
                  <p class="text-xs text-zinc-500 leading-relaxed">${s.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Referral History -->
          <div class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-black text-zinc-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">group</span>
                Referral History
              </h3>
              <button id="simulate-referral-btn" class="bg-violet-50 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-violet-100 transition-all flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs">add</span>
                Simulate Referral
              </button>
            </div>
            <div id="referral-list" class="space-y-3">
              ${stats.referrals.length > 0 ? stats.referrals.map(r => `
                <div class="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
                      <span class="material-symbols-outlined text-primary text-sm">person</span>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-zinc-900">${r.name}</p>
                      <p class="text-[10px] text-zinc-400">${new Date(r.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <span class="text-emerald-600 font-black text-sm">+${r.reward} credits</span>
                </div>
              `).join('') : `
                <div class="text-center py-8">
                  <span class="material-symbols-outlined text-3xl text-zinc-300 mb-2">group</span>
                  <p class="text-zinc-400 text-sm">No referrals yet. Share your code to get started!</p>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Right Column — Stats -->
        <div class="space-y-6">
          <!-- Stats Cards -->
          <div class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
            <h3 class="text-lg font-black text-zinc-900 mb-6">Your Stats</h3>
            <div class="space-y-6">
              <div class="text-center">
                <p class="text-5xl font-black text-primary">${stats.count}</p>
                <p class="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Total Referrals</p>
              </div>
              <div class="h-px bg-zinc-100"></div>
              <div class="text-center">
                <p class="text-3xl font-black text-emerald-600">+${stats.totalRewards}</p>
                <p class="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Credits Earned</p>
              </div>
              <div class="h-px bg-zinc-100"></div>
              <div class="text-center">
                <p class="text-3xl font-black text-zinc-900">${credits}</p>
                <p class="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Current Balance</p>
              </div>
            </div>
          </div>

          <!-- Milestone Tracker -->
          <div class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
            <h3 class="text-lg font-black text-zinc-900 mb-4">Milestones</h3>
            <div class="space-y-4">
              ${[
                { count: 3, reward: '🥉 Bronze Referrer', done: stats.count >= 3 },
                { count: 10, reward: '🥈 Silver Referrer', done: stats.count >= 10 },
                { count: 25, reward: '🥇 Gold Referrer', done: stats.count >= 25 },
                { count: 50, reward: '💎 Diamond Referrer', done: stats.count >= 50 }
              ].map(m => `
                <div class="flex items-center gap-3 p-3 rounded-xl ${m.done ? 'bg-emerald-50 border border-emerald-100' : 'bg-zinc-50 border border-zinc-100 opacity-60'}">
                  <span class="material-symbols-outlined ${m.done ? 'material-fill text-emerald-500' : 'text-zinc-300'}">${m.done ? 'check_circle' : 'radio_button_unchecked'}</span>
                  <div class="flex-1">
                    <p class="text-xs font-bold ${m.done ? 'text-emerald-700' : 'text-zinc-600'}">${m.reward}</p>
                    <p class="text-[10px] text-zinc-400">${m.count} referrals</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Quick Links -->
          <div class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
            <h3 class="text-lg font-black text-zinc-900 mb-4">Quick Links</h3>
            <div class="space-y-2">
              <a href="#/marketplace" class="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                <span class="material-symbols-outlined text-primary">explore</span>
                <span class="text-sm font-medium">Browse Mentors</span>
              </a>
              <a href="#/dashboard" class="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                <span class="material-symbols-outlined text-primary">dashboard</span>
                <span class="text-sm font-medium">Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // ─── Event Handlers ─────────────────────

  // Copy code
  document.getElementById('copy-code-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Referral code copied!', 'success');
      const btn = document.getElementById('copy-code-btn');
      if (btn) { btn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!'; }
      setTimeout(() => {
        if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> Copy';
      }, 2000);
    });
  });

  // Copy link
  document.getElementById('copy-link-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      showToast('Referral link copied!', 'success');
    });
  });

  // Native share
  document.getElementById('share-native-btn')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join SkillSwap+',
        text: `Join SkillSwap+ with my referral code ${code} and start learning!`,
        url: referralLink
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(referralLink).then(() => {
        showToast('Link copied to clipboard!', 'success');
      });
    }
  });

  // WhatsApp share
  document.getElementById('share-whatsapp-btn')?.addEventListener('click', () => {
    const text = encodeURIComponent(`Join me on SkillSwap+! Learn without money, teach to earn. Use my code: ${code}\n${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  });

  // Twitter share
  document.getElementById('share-twitter-btn')?.addEventListener('click', () => {
    const text = encodeURIComponent(`I'm learning and teaching on @SkillSwapPlus! Join with my code: ${code}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
  });

  // Simulate referral
  document.getElementById('simulate-referral-btn')?.addEventListener('click', () => {
    const names = ['Jordan Lee', 'Priya Sharma', 'Alex Chen', 'Maria Gonzalez', 'Sam Wilson', 'Yuki Tanaka', 'Omar Hassan'];
    const name = names[Math.floor(Math.random() * names.length)];
    
    const res = simulateReferral(name);
    if (!res.error) {
      showToast(`🎉 ${name} joined via your referral! +25 credits`, 'success');
      // Re-render to update stats
      renderReferral(container);
    }
  });
}
