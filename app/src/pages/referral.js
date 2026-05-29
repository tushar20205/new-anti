/* ═══════════════════════════════════════════
   SkillSwap+ — Referral Page
   ═══════════════════════════════════════════ */
import { getFooterHTML } from '../components/footer.js';
import { showToast } from '../components/toast.js';

export function renderReferral(container) {
  const referralCode = 'SKILL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://skillswapplus.com/ref/${referralCode}`;

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Refer & Earn</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">Invite friends to SkillSwap+ and earn bonus credits when they complete their first session.</p>
        </section>

        <!-- Referral Link -->
        <section class="bg-rust-accent border-2 border-ink-black p-8 shadow-hard text-paper-base">
          <h2 class="font-headline-sm text-headline-sm uppercase mb-6" style="font-family:'Oswald',sans-serif;">Your Referral Link</h2>
          <div class="flex gap-4 flex-col sm:flex-row">
            <div class="flex-grow bg-paper-base/10 border-2 border-paper-base/30 p-4 font-label-lg text-label-lg overflow-hidden text-ellipsis" id="referral-link">${referralLink}</div>
            <button class="bg-paper-base text-ink-black border-2 border-ink-black px-8 py-4 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 whitespace-nowrap" id="copy-referral-btn" style="font-family:'Oswald',sans-serif;">
              <span class="material-symbols-outlined">content_copy</span> Copy Link
            </button>
          </div>
          <p class="font-label-md text-label-md mt-4 opacity-80">Share this link via email, social media, or messaging apps.</p>
        </section>

        <!-- Stats -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          ${[
            { label: 'Total Referrals', value: '0', icon: 'group_add' },
            { label: 'Credits Earned', value: '0', icon: 'toll' },
            { label: 'Pending', value: '0', icon: 'hourglass_top' }
          ].map(s => `
            <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-rust-accent">${s.icon}</span>
                <p class="font-label-md text-label-md uppercase text-on-surface-variant">${s.label}</p>
              </div>
              <p class="font-headline-md text-headline-md text-ink-black" style="font-family:'Oswald',sans-serif;">${s.value}</p>
            </div>
          `).join('')}
        </section>

        <!-- History -->
        <section class="bg-paper-base border-2 border-ink-black shadow-hard">
          <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
            <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Referral History</h3>
          </div>
          <div class="p-16 text-center">
            <span class="material-symbols-outlined text-5xl text-ink-black/20 mb-4 block">group_off</span>
            <h4 class="font-headline-sm text-headline-sm uppercase mb-2" style="font-family:'Oswald',sans-serif;">No referrals yet</h4>
            <p class="text-body-md text-on-surface-variant">Share your link with friends. When they sign up and complete a session, you both earn 50 credits!</p>
          </div>
        </section>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  document.getElementById('copy-referral-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      showToast('Referral link copied!', 'success');
    }).catch(() => {
      const el = document.getElementById('referral-link');
      if (el) { el.focus(); document.execCommand('copy'); }
      showToast('Copied!', 'success');
    });
  });
}
