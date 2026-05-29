/* ═══════════════════════════════════════════
   SkillSwap+ — Profile Page
   ═══════════════════════════════════════════ */
import { store } from '../state.js';
import { getFooterHTML } from '../components/footer.js';

export function renderProfile(container) {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const name = user?.name || 'User';
  const email = user?.email || 'user@example.com';
  const bio = user?.bio || 'No bio set yet.';
  const skills = user?.skills || [];
  const tier = user?.tier || 'Starter';
  const avatar = user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY_tI4gEXrKXB13pAfIYAwxx4cNvjM6o1Io5u7z1fKtStpvdtn0kBkilhBImoJXFnt4Q6_DLzQ_lj3El5aeJZGJIvPSVGYmt70X_RQxhy01typ6nWZR1QmxsXk9I8l7zfuReJDPabj17-czgj5nxpnCPXy7WLqMi2m0OCEol1AQ0-B8-hluIE67CviEoKc-3Acd2mqf8ZQ8vXFHyzUtnmI-MOIXGofzh5Limgui2FmzspmvkpatLkWVxN5cwUVYNp477w_cDNq3us';

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12">
        <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-12" style="font-family:'Oswald',sans-serif;">Your Profile</h1>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <!-- Left: Profile Card -->
          <div class="lg:col-span-4 space-y-gutter">
            <div class="bg-paper-base border-2 border-ink-black shadow-hard overflow-hidden">
              <div class="h-32 bg-rust-accent relative">
                <div class="absolute -bottom-12 left-6">
                  <img alt="${name}" class="w-24 h-24 border-4 border-ink-black object-cover bg-paper-base" src="${avatar}" />
                </div>
              </div>
              <div class="pt-16 p-6 space-y-4">
                <div>
                  <h2 class="font-headline-md text-headline-md uppercase" style="font-family:'Oswald',sans-serif;">${name}</h2>
                  <p class="font-label-md text-label-md text-rust-accent uppercase">${tier} Tier</p>
                </div>
                <p class="text-body-md text-on-surface-variant">${bio}</p>
                <div class="border-t-2 border-ink-black pt-4 flex justify-between text-center">
                  <div><p class="font-headline-sm text-headline-sm" style="font-family:'Oswald',sans-serif;">${credits}</p><p class="font-label-md text-label-md uppercase text-on-surface-variant">Credits</p></div>
                  <div><p class="font-headline-sm text-headline-sm" style="font-family:'Oswald',sans-serif;">0</p><p class="font-label-md text-label-md uppercase text-on-surface-variant">Sessions</p></div>
                  <div><p class="font-headline-sm text-headline-sm" style="font-family:'Oswald',sans-serif;">0</p><p class="font-label-md text-label-md uppercase text-on-surface-variant">Reviews</p></div>
                </div>
              </div>
            </div>
            <a href="#/settings" class="bg-paper-base border-2 border-ink-black p-4 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 w-full" style="text-decoration:none;font-family:'Oswald',sans-serif;">
              <span class="material-symbols-outlined">settings</span> Account Settings
            </a>
          </div>
          <!-- Right: Content -->
          <div class="lg:col-span-8 space-y-gutter">
            <!-- Skills -->
            <section class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed flex justify-between items-center">
                <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Skills</h3>
                <span class="font-label-md text-label-md uppercase text-on-surface-variant">${skills.length} skills added</span>
              </div>
              <div class="p-6">
                ${skills.length > 0 ? `
                  <div class="flex flex-wrap gap-2">${skills.map(s => `<span class="font-label-md text-label-md uppercase border-2 border-ink-black px-3 py-1 bg-secondary-fixed">${s}</span>`).join('')}</div>
                ` : `
                  <div class="border-dashed border-2 border-ink-black p-8 text-center">
                    <span class="material-symbols-outlined text-4xl text-ink-black/20 mb-4 block">psychology</span>
                    <p class="text-body-md text-on-surface-variant mb-4">No skills added yet. Add your expertise to get matched.</p>
                    <button class="bg-rust-accent text-paper-base border-2 border-ink-black font-label-lg uppercase px-4 py-2 shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Add Skills</button>
                  </div>
                `}
              </div>
            </section>
            <!-- Account Info -->
            <section class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
                <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Account Information</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p class="font-label-md text-label-md uppercase text-on-surface-variant mb-1">Full Name</p><p class="font-body-lg border-2 border-ink-black/20 p-3 bg-surface-container-low">${name}</p></div>
                  <div><p class="font-label-md text-label-md uppercase text-on-surface-variant mb-1">Email</p><p class="font-body-lg border-2 border-ink-black/20 p-3 bg-surface-container-low">${email}</p></div>
                </div>
                <div><p class="font-label-md text-label-md uppercase text-on-surface-variant mb-1">Bio</p><p class="font-body-md border-2 border-ink-black/20 p-3 bg-surface-container-low min-h-[80px]">${bio}</p></div>
              </div>
            </section>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;
}
