/* ═══════════════════════════════════════════
   SkillSwap+ — Dashboard Page
   Source: Stitch "Dashboard | Annotated Layout Updates"
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { getFooterHTML } from '../components/footer.js';
import { fetchDashboardAnalytics, fetchMySessions } from '../services/data.layer.js';

export function renderDashboard(container) {
  const user = store.getUserSafe();
  const initialCredits = store.get('credits') || 0;
  const userName = user?.name?.split(' ')[0] || 'User';

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1440px] mx-auto p-margin-desktop space-y-12">
        <!-- Header & XP Section -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end stagger-children">
          <div class="lg:col-span-7">
            <h1 class="font-headline-lg text-headline-lg text-ink-black mb-2" id="welcome-title">Welcome back, ${userName}</h1>
            <p class="text-body-lg text-on-surface-variant" id="welcome-subtitle">Ready to level up your expertise today?</p>
          </div>
          <div class="lg:col-span-5">
            <div class="border-2 border-ink-black p-4 bg-tertiary-fixed shadow-hard">
              <div class="flex justify-between items-center mb-2">
                <span class="font-label-lg text-label-lg uppercase text-ink-black" id="xp-label">Level 1</span>
                <span class="font-label-md text-label-md text-rust-accent font-bold" id="xp-val">0 / 100 XP</span>
              </div>
              <div class="w-full h-4 bg-paper-base border-2 border-ink-black overflow-hidden">
                <div class="h-full bg-rust-accent transition-all duration-500" id="xp-bar" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats Row -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter stagger-children">
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Profile Completion</p>
            <p class="font-headline-md text-headline-md text-ink-black" id="stat-profile">0%</p>
            <div class="mt-4 flex items-center text-deep-forest">
              <span class="material-symbols-outlined text-sm mr-1">check_circle</span>
              <span class="text-label-md">Verified status</span>
            </div>
          </div>
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Sessions Hosted</p>
            <p class="font-headline-md text-headline-md text-ink-black" id="stat-sessions-hosted">00</p>
            <p class="mt-4 text-label-md text-on-surface-variant">As Host</p>
          </div>
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Sessions Attended</p>
            <p class="font-headline-md text-headline-md text-ink-black" id="stat-sessions-attended">00</p>
            <p class="mt-4 text-label-md text-on-surface-variant">As Learner</p>
          </div>
          <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
            <p class="font-label-md text-label-md uppercase text-on-surface-variant mb-4">Credit Delta</p>
            <p class="font-headline-md text-headline-md text-ink-black" id="stat-credit-flow">+0 / -0</p>
            <p class="mt-4 text-label-md text-on-surface-variant">Earned vs Spent</p>
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter" id="upcoming-sessions-container">
                <div class="border-2 border-ink-black p-12 bg-paper-base flex flex-col items-center justify-center text-center col-span-2">
                  <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">event_busy</span>
                  <p class="text-body-lg font-medium text-ink-black mb-6">Loading schedule...</p>
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
                <span class="font-display-lg text-display-lg" id="credits-balance">${initialCredits.toLocaleString()}</span>
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
                <span class="bg-rust-accent text-paper-base text-label-md px-2 py-0.5 border-2 border-ink-black font-bold" id="activity-badge">0 NEW</span>
              </div>
              <div class="divide-y-2 divide-ink-black/10" id="activity-feed-container">
                <div class="p-8 text-center text-on-surface-variant font-label-md">Loading activities...</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      ${getFooterHTML()}
    </div>
  `;

  // Dynamic async updating
  (async () => {
    try {
      const { data: analytics } = await fetchDashboardAnalytics();
      if (analytics) {
        // Update stats
        const summary = analytics.summary || {};
        document.getElementById('stat-profile').textContent = `${summary.profileCompletion || 0}%`;
        document.getElementById('stat-sessions-hosted').textContent = String(summary.sessionsTaught || 0).padStart(2, '0');
        document.getElementById('stat-sessions-attended').textContent = String(summary.sessionsAttended || 0).padStart(2, '0');
        document.getElementById('stat-credit-flow').textContent = `+${summary.creditsEarned || 0} / -${summary.creditsSpent || 0}`;

        // Update Level and XP based on profile completion
        const completionPct = summary.profileCompletion || 0;
        const level = Math.floor(completionPct / 10) + 1;
        const currentXp = (completionPct % 10) * 100;
        const nextXp = 1000;

        document.getElementById('xp-label').textContent = `Level ${level}`;
        document.getElementById('xp-val').textContent = `${currentXp} / ${nextXp} XP`;
        document.getElementById('xp-bar').style.width = `${(currentXp / nextXp) * 100}%`;

        // Update welcome subtitle based on completion
        if (completionPct < 100) {
          document.getElementById('welcome-subtitle').innerHTML = `Your profile is <span class="text-rust-accent font-bold">${completionPct}%</span> complete. Fill in details to unlock full access.`;
        } else {
          document.getElementById('welcome-subtitle').textContent = `Your profile is fully complete and verified! You are ready to host/attend sessions.`;
        }

        // Update activity feed
        const activities = analytics.recentActivity || [];
        const activityContainer = document.getElementById('activity-feed-container');
        document.getElementById('activity-badge').textContent = `${activities.length} LOGS`;

        if (activities.length > 0) {
          activityContainer.innerHTML = activities.map(act => `
            <div class="p-4 hover:bg-surface-container-low transition-colors flex gap-4">
              <div class="bg-secondary-container border-2 border-ink-black w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-secondary">${act.icon || 'info'}</span>
              </div>
              <div class="flex-grow">
                <p class="text-body-md font-medium text-ink-black">${act.title}</p>
                <p class="text-label-md text-on-surface-variant">${act.message}</p>
                <p class="text-label-md text-rust-accent mt-1 font-bold">${new Date(act.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          `).join('');
        } else {
          activityContainer.innerHTML = `
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
          `;
        }
      }
    } catch (e) {
      console.warn('[Dashboard] Analytics load failed:', e);
    }
  })();

  (async () => {
    try {
      const { data: schedule } = await fetchMySessions();
      const upcomingContainer = document.getElementById('upcoming-sessions-container');

      const hosting = schedule?.hosting || [];
      const attending = schedule?.attending || [];
      const allSessions = [...hosting, ...attending]
        .filter(s => s.status === 'open' || s.status === 'full' || s.status === 'in-progress')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (allSessions.length > 0) {
        upcomingContainer.innerHTML = allSessions.map(session => {
          const isHost = hosting.some(h => h._id === session._id);
          return `
            <div class="border-2 border-ink-black p-6 bg-paper-base shadow-hard flex flex-col gap-4">
              <div class="flex justify-between items-start border-b border-ink-black/10 pb-2">
                <span class="bg-primary-fixed border border-ink-black px-2 py-0.5 text-label-md font-label-md uppercase font-bold">${session.skillCategory}</span>
                <span class="text-rust-accent font-bold font-label-md">${session.creditsRequired} CREDITS</span>
              </div>
              <h3 class="font-headline-sm uppercase leading-tight font-bold" style="font-family:'Oswald',sans-serif;">${session.title}</h3>
              <div class="flex items-center gap-2 text-label-md font-label-md opacity-70">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span>${new Date(session.date).toLocaleDateString()} @ ${session.startTime} - ${session.endTime}</span>
              </div>
              <p class="text-body-md line-clamp-2 text-on-surface-variant">${session.description}</p>
              <div class="flex items-center justify-between pt-2 border-t border-ink-black/10 mt-auto">
                <span class="text-label-md uppercase font-bold text-deep-forest">${isHost ? 'Hosting (Teacher)' : 'Attending (Learner)'}</span>
                <a href="#/session" class="bg-ink-black text-paper-base px-4 py-2 border-2 border-ink-black text-label-md uppercase hover:bg-rust-accent hover:text-paper-base transition-colors" style="text-decoration:none;">Manage</a>
              </div>
            </div>
          `;
        }).join('');
      } else {
        upcomingContainer.innerHTML = `
          <div class="border-2 border-ink-black p-12 bg-paper-base flex flex-col items-center justify-center text-center col-span-2">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">event_busy</span>
            <p class="text-body-lg font-medium text-ink-black mb-6">Your schedule is completely clear.</p>
            <div class="flex justify-center">
              <a href="#/create-session" class="bg-ink-black text-paper-base px-6 py-2 border-2 border-ink-black font-label-lg text-label-lg uppercase hover:bg-rust-accent transition-colors inline-block" style="text-decoration:none;">
                Schedule a Session
              </a>
            </div>
          </div>
        `;
      }
    } catch (e) {
      console.warn('[Dashboard] Sessions load failed:', e);
      document.getElementById('upcoming-sessions-container').innerHTML = `
        <div class="border-2 border-ink-black p-12 bg-paper-base flex flex-col items-center justify-center text-center col-span-2">
          <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">error</span>
          <p class="text-body-lg font-medium text-ink-black mb-6">Failed to load schedule.</p>
        </div>
      `;
    }
  })();

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
