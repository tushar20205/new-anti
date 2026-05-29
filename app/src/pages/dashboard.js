/* ═══════════════════════════════════════════
   SkillSwap+ — Dashboard Page
   Source: Stitch "Dashboard | Annotated Layout Updates"
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { getFooterHTML } from '../components/footer.js';

export function renderDashboard(container) {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const userName = user?.name?.split(' ')[0] || 'Tushar';

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1440px] mx-auto p-margin-desktop space-y-12">
        <!-- Header & XP Section -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end stagger-children">
          <div class="lg:col-span-7">
            <h1 class="font-headline-lg text-headline-lg text-ink-black mb-2">Welcome back, ${userName}</h1>
            <p class="text-body-lg text-on-surface-variant">You've mastered 3 new skills this week. Ready to level up your expertise further?</p>
          </div>
          <div class="lg:col-span-5">
            <div class="border-2 border-ink-black p-4 bg-tertiary-fixed shadow-hard">
              <div class="flex justify-between items-center mb-2">
                <span class="font-label-lg text-label-lg uppercase text-ink-black">Level 12</span>
                <span class="font-label-md text-label-md text-rust-accent font-bold">850 / 1000 XP</span>
              </div>
              <div class="w-full h-4 bg-paper-base border-2 border-ink-black overflow-hidden">
                <div class="h-full bg-rust-accent" style="width: 85%"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats Row -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter stagger-children">
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Skill Points</p>
            <p class="font-headline-md text-headline-md text-ink-black">29%</p>
            <div class="mt-4 flex items-center text-deep-forest">
              <span class="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span class="text-label-md">+4% this month</span>
            </div>
          </div>
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Projects</p>
            <p class="font-headline-md text-headline-md text-ink-black">08</p>
            <p class="mt-4 text-label-md text-on-surface-variant">2 Ongoing</p>
          </div>
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Resumes</p>
            <p class="font-headline-md text-headline-md text-ink-black">12</p>
            <p class="mt-4 text-label-md text-on-surface-variant">Tailored variations</p>
          </div>
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Credit Flow</p>
            <p class="font-headline-md text-headline-md text-ink-black">+120 / -40</p>
            <p class="mt-4 text-label-md text-on-surface-variant">Weekly delta</p>
          </div>
        </section>

        <!-- Main Body Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <!-- Left Side -->
          <div class="lg:col-span-8 space-y-gutter">
            <!-- Recommended -->
            <section>
              <div class="flex justify-between items-center mb-6 border-b-2 border-ink-black pb-4">
                <h2 class="font-headline-sm text-headline-sm uppercase text-ink-black">Recommended For You</h2>
                <a class="text-rust-accent font-label-lg text-label-lg uppercase font-bold hover:underline" href="#/marketplace">See All</a>
              </div>
              <div class="border-2 border-ink-black border-dashed p-12 bg-surface-container-low flex flex-col items-center justify-center text-center">
                <div class="w-20 h-20 bg-tertiary-fixed border-2 border-ink-black flex items-center justify-center mb-6">
                  <span class="material-symbols-outlined text-4xl text-rust-accent">psychology</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-ink-black mb-2">No personalized sessions yet</h3>
                <p class="text-body-md text-on-surface-variant max-w-md mb-8">Add skills to your profile or complete a booking, and matching sessions will appear here.</p>
                <div class="flex justify-center">
                  <a href="#/marketplace" class="bg-rust-accent text-paper-base px-8 py-3 border-2 border-ink-black font-headline-sm text-headline-sm uppercase shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-block" style="text-decoration:none;">
                    Browse Sessions
                  </a>
                </div>
              </div>
            </section>

            <!-- Upcoming Sessions -->
            <section>
              <div class="flex justify-between items-center mb-6 border-b-2 border-ink-black pb-4">
                <h2 class="font-headline-sm text-headline-sm uppercase text-ink-black">Upcoming Sessions</h2>
              </div>
              <div class="border-2 border-ink-black p-12 bg-paper-base flex flex-col items-center justify-center text-center">
                <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">event_busy</span>
                <p class="text-body-lg font-medium text-ink-black mb-6">Your schedule is completely clear.</p>
                <div class="flex justify-center">
                  <a href="#/create-session" class="bg-ink-black text-paper-base px-6 py-2 border-2 border-ink-black font-label-lg text-label-lg uppercase hover:bg-rust-accent transition-colors inline-block" style="text-decoration:none;">
                    Schedule a Session
                  </a>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Side -->
          <div class="lg:col-span-4 space-y-gutter">
            <!-- Credit Balance Card -->
            <div class="border-2 border-ink-black bg-rust-accent p-6 shadow-hard text-paper-base relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-paper-base opacity-10 rotate-45 translate-x-10 -translate-y-10"></div>
              <p class="font-label-md text-label-md uppercase mb-2">Credit Balance</p>
              <div class="flex items-baseline gap-2 mb-6">
                <span class="font-display-lg text-display-lg">${credits.toLocaleString() || '1,250'}</span>
                <span class="font-headline-sm text-headline-sm uppercase">TKN</span>
              </div>
              <p class="font-label-md text-label-md mb-8 opacity-90">Available for immediate bookings</p>
              <div class="grid grid-cols-2 gap-4">
                <a href="#/marketplace" class="bg-paper-base text-ink-black py-2 border-2 border-ink-black font-label-lg text-label-lg uppercase hover:bg-surface-container-highest transition-colors text-center" style="text-decoration:none;">Spend</a>
                <a href="#/create-session" class="border-2 border-paper-base text-paper-base py-2 font-label-lg text-label-lg uppercase hover:bg-paper-base hover:text-ink-black transition-colors text-center" style="text-decoration:none;">Earn More</a>
              </div>
            </div>

            <!-- Activity Feed -->
            <div class="border-2 border-ink-black bg-paper-base shadow-hard flex flex-col">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed flex justify-between items-center">
                <h3 class="font-headline-sm text-headline-sm uppercase text-ink-black">Activity</h3>
                <span class="bg-rust-accent text-paper-base text-label-md px-2 py-0.5 border-2 border-ink-black font-bold">1 NEW</span>
              </div>
              <div class="divide-y-2 divide-ink-black/10">
                <div class="p-4 hover:bg-surface-container-low transition-colors flex gap-4">
                  <div class="bg-secondary-container border-2 border-ink-black w-10 h-10 flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-secondary">celebration</span>
                  </div>
                  <div>
                    <p class="text-body-md font-medium text-ink-black">Welcome to SkillSwapPlus!</p>
                    <p class="text-label-md text-on-surface-variant">You start with 10 credits. Start learning or teaching today!</p>
                    <p class="text-label-md text-rust-accent mt-1 font-bold">${new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div class="p-4 hover:bg-surface-container-low transition-colors flex gap-4 opacity-60">
                  <div class="bg-tertiary-fixed border-2 border-ink-black w-10 h-10 flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-tertiary">person_add</span>
                  </div>
                  <div>
                    <p class="text-body-md font-medium text-ink-black">Profile Created</p>
                    <p class="text-label-md text-on-surface-variant">Your journey as a Master has begun.</p>
                    <p class="text-label-md text-rust-accent mt-1 font-bold">${new Date(Date.now() - 86400000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      ${getFooterHTML()}
    </div>
  `;

  // Shadow-hard press effect
  const cards = container.querySelectorAll('.shadow-hard');
  cards.forEach(card => {
    card.addEventListener('mousedown', () => {
      card.style.transform = 'translate(2px, 2px)';
      card.style.boxShadow = '2px 2px 0px 0px rgba(26,17,8,1)';
    });
    card.addEventListener('mouseup', () => { card.style.transform = ''; card.style.boxShadow = ''; });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.boxShadow = ''; });
  });
}
