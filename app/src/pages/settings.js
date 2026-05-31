/* ═══════════════════════════════════════════
   SkillSwap+ — Settings Page
   ═══════════════════════════════════════════ */
import { store } from '../state.js';
import { getFooterHTML } from '../components/footer.js';
import { showToast } from '../components/toast.js';

export function renderSettings(container) {
  const user = store.getUserSafe();
  const name = user?.name || '';
  const email = user?.email || '';
  const bio = user?.bio || '';

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Account Settings</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">Manage your account details, notification preferences, and privacy settings.</p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div class="lg:col-span-8 space-y-gutter">
            <!-- Account Info -->
            <section class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
                <h2 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Account Information</h2>
              </div>
              <form class="p-6 space-y-gutter" id="settings-form">
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Full Name</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" type="text" value="${name}" id="settings-name" /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Email (Read Only)</label><input class="w-full bg-surface-container-low border-2 border-ink-black/30 p-4 font-body-md cursor-not-allowed" type="email" value="${email}" readonly /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Bio</label><textarea class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" rows="4" id="settings-bio">${bio}</textarea></div>
                <div class="flex justify-end"><button type="submit" class="bg-rust-accent text-paper-base border-2 border-ink-black px-8 py-3 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="font-family:'Oswald',sans-serif;">Save Changes</button></div>
              </form>
            </section>

            <!-- Notifications -->
            <section class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
                <h2 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Notification Preferences</h2>
              </div>
              <div class="p-6 space-y-6">
                ${[
                  { label: 'Session Reminders', desc: 'Get notified 30 minutes before a session starts', checked: true },
                  { label: 'Booking Updates', desc: 'Receive alerts when learners request or cancel bookings', checked: true },
                  { label: 'Community Activity', desc: 'Notifications for replies and mentions', checked: false },
                  { label: 'Credit Transactions', desc: 'Alerts when credits are earned or spent', checked: true }
                ].map((pref, i) => `
                  <div class="flex justify-between items-center pb-4 ${i < 3 ? 'border-b border-ink-black/10' : ''}">
                    <div>
                      <p class="font-body-md font-medium text-ink-black">${pref.label}</p>
                      <p class="font-label-md text-label-md text-on-surface-variant">${pref.desc}</p>
                    </div>
                    <div class="toggle-switch ${pref.checked ? 'on' : ''}" data-pref="${pref.label}" style="border-radius:0;"></div>
                  </div>
                `).join('')}
              </div>
            </section>
          </div>

          <!-- Right Side -->
          <div class="lg:col-span-4 space-y-gutter">
            <!-- Quick Links -->
            <div class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
                <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Quick Links</h3>
              </div>
              <div class="divide-y-2 divide-ink-black/10">
                ${[
                  { label: 'View Profile', href: '#/profile', icon: 'person' },
                  { label: 'Referral Program', href: '#/referral', icon: 'share' },
                  { label: 'Become a Mentor', href: '#/mentor-apply', icon: 'school' }
                ].map(link => `
                  <a href="${link.href}" class="p-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors" style="text-decoration:none;color:inherit;">
                    <span class="material-symbols-outlined text-rust-accent">${link.icon}</span>
                    <span class="font-label-lg text-label-lg uppercase">${link.label}</span>
                    <span class="material-symbols-outlined ml-auto text-on-surface-variant text-[16px]">chevron_right</span>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="bg-paper-base border-2 border-error shadow-hard">
              <div class="p-4 border-b-2 border-error bg-error-container">
                <h3 class="font-headline-sm text-headline-sm uppercase text-on-error-container" style="font-family:'Oswald',sans-serif;">Danger Zone</h3>
              </div>
              <div class="p-6 space-y-4">
                <p class="text-body-md text-on-surface-variant">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button class="bg-error text-on-error border-2 border-ink-black px-6 py-2 font-label-lg text-label-lg uppercase w-full hover:opacity-90 transition-opacity">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  // Toggle switches
  container.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      showToast('Preference updated', 'success');
    });
  });

  // Save form
  document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const { updateProfile } = await import('../services/user.service.js');
      const { fetchProfile } = await import('../services/data.layer.js');
      await updateProfile({ name: document.getElementById('settings-name').value, bio: document.getElementById('settings-bio').value });
      await fetchProfile();
      showToast('Settings saved!', 'success');
    } catch (err) { showToast(err.message || 'Failed to save', 'error'); }
  });
}
