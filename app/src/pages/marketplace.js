/* ═══════════════════════════════════════════
   SkillSwap+ — Marketplace Page
   Source: Stitch "Marketplace | Join Session & Refined Footer"
   ═══════════════════════════════════════════ */

import { getFooterHTML } from '../components/footer.js';
import { getSessions, requestToJoin } from '../services/session.service.js';
import { showToast } from '../components/toast.js';
import { store } from '../state.js';

let currentCategory = '';
let currentSearch = '';

export function renderMarketplace(container) {
  const user = store.getUserSafe();

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-16">
        <!-- Hero -->
        <section class="flex flex-col gap-6">
          <div class="flex items-center gap-2 font-label-md text-label-md uppercase text-rust-accent">
            <span>Marketplace</span>
            <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            <span>Real Bookings</span>
          </div>
          <h1 class="font-display-lg text-display-lg uppercase border-b-2 border-ink-black pb-4" style="font-family:'Oswald',sans-serif;">Book real skill sessions.</h1>
          <p class="font-body-lg text-body-lg max-w-3xl">Credits are reserved in escrow when you request a session and released to the mentor only after completion. Secure, vetted, and built for professionals.</p>
        </section>

        <!-- Booking Lifecycle -->
        <section class="bg-tertiary-fixed border-2 border-ink-black p-6">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-deep-forest text-3xl" style="font-variation-settings:'FILL' 1;">verified_user</span>
              <h3 class="font-headline-sm text-headline-sm text-deep-forest uppercase">Backend-driven booking lifecycle</h3>
            </div>
            <div class="hidden md:block flex-grow border-t-2 border-dashed border-deep-forest/50 mx-4"></div>
            <div class="font-label-md text-label-md uppercase text-ink-black flex flex-wrap items-center gap-2">
              <span>Request</span> <span class="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              <span>Escrow reserved</span> <span class="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              <span>Mentor accepts</span> <span class="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              <span>Jitsi link generated</span> <span class="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              <span class="text-deep-forest font-bold">Completion releases credits</span>
            </div>
          </div>
        </section>

        <!-- Mentor Highlights -->
        <section class="flex flex-col gap-8">
          <div class="flex justify-between items-end border-b-2 border-ink-black pb-2">
            <h2 class="font-headline-md text-headline-md uppercase" style="font-family:'Oswald',sans-serif;">Mentor Highlights</h2>
            <span class="font-label-md text-label-md uppercase text-surface-variant bg-ink-black px-2 py-1">Book from live sessions below</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            ${[
              { initials: 'ER', name: 'Elena Rossi', role: 'Product Design Mentor', skills: ['Design Systems', 'Figma'], bg: 'bg-primary-fixed' },
              { initials: 'MT', name: 'Marcus Thorne', role: 'Full-Stack Mentor', skills: ['React', 'DevOps'], bg: 'bg-tertiary-fixed' },
              { initials: 'SJ', name: 'Sarah Jenkins', role: 'Startup Mentor', skills: ['Fundraising', 'Product Strategy'], bg: 'bg-primary-fixed' }
            ].map(m => `
              <div class="bg-paper-base border-2 border-ink-black flex flex-col p-6 gap-6">
                <div class="flex items-center gap-4 border-b-2 border-ink-black pb-4">
                  <div class="w-16 h-16 rounded-full border-2 border-ink-black overflow-hidden ${m.bg} flex items-center justify-center font-headline-md text-headline-md" style="font-family:'Oswald',sans-serif;">${m.initials}</div>
                  <div>
                    <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">${m.name}</h3>
                    <p class="font-body-md text-body-md">${m.role}</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  ${m.skills.map((s, i) => `<span class="font-label-md text-label-md uppercase border-2 border-ink-black px-2 py-1 ${i === 0 ? 'bg-secondary-fixed' : 'bg-surface-variant'}">${s}</span>`).join('')}
                </div>
                <button class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm text-headline-sm uppercase px-6 py-2 w-full mt-auto shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all highlight-mentor-btn" style="font-family:'Oswald',sans-serif;">View Live Sessions</button>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Available Sessions -->
        <section class="flex flex-col gap-8 mb-12">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-ink-black pb-2 gap-4">
            <h2 class="font-headline-md text-headline-md uppercase" style="font-family:'Oswald',sans-serif;">Available Sessions</h2>
            <div class="flex items-center gap-4 w-full md:w-auto">
              <div class="relative flex-grow md:w-64">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-black/50">search</span>
                <input class="w-full bg-paper-base border-2 border-ink-black pl-10 pr-4 py-2 font-label-md text-label-md uppercase focus:outline-none focus:ring-0 focus:border-rust-accent" placeholder="SEARCH SESSIONS..." type="text" id="marketplace-search" value="${currentSearch}" />
              </div>
            </div>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-4 no-scrollbar" id="category-filters-container">
            ${['All', 'Design', 'Programming', 'Marketing', 'Business', 'Other'].map(t => {
              const matches = (t === 'All' && !currentCategory) || (currentCategory === t);
              return `<button class="filter-tab-btn font-label-md text-label-md uppercase border-2 border-ink-black px-2 py-1 ${matches ? 'bg-ink-black text-paper-base' : 'bg-paper-base hover:bg-surface-variant'} whitespace-nowrap" data-category="${t === 'All' ? '' : t}">${t}</button>`;
            }).join('')}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter" id="sessions-grid-container">
            <div class="col-span-3 text-center py-12 text-on-surface-variant font-label-lg">Loading available sessions...</div>
          </div>
        </section>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  // Render sessions grid based on current filters
  async function loadSessions() {
    const grid = document.getElementById('sessions-grid-container');
    if (!grid) return;

    try {
      const result = await getSessions({
        category: currentCategory,
        search: currentSearch,
        status: 'open'
      });

      const sessions = result?.sessions || [];

      if (sessions.length > 0) {
        grid.innerHTML = sessions.map(session => {
          const isHost = user && session.host && String(session.host._id) === String(user._id);
          const isAttending = user && session.participants && session.participants.some(p => String(p._id) === String(user._id));
          const hasRequested = user && session.requests && session.requests.some(r => String(r.user) === String(user._id));

          let buttonText = 'Book Session';
          let buttonClass = 'bg-rust-accent text-paper-base shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none';
          let isDisabled = false;

          if (isHost) {
            buttonText = 'Hosting';
            buttonClass = 'bg-surface-variant text-ink-black opacity-50 cursor-not-allowed';
            isDisabled = true;
          } else if (isAttending) {
            buttonText = 'Attending';
            buttonClass = 'bg-deep-forest text-paper-base opacity-75 cursor-not-allowed';
            isDisabled = true;
          } else if (hasRequested) {
            buttonText = 'Requested';
            buttonClass = 'bg-tertiary-fixed text-ink-black opacity-75 cursor-not-allowed';
            isDisabled = true;
          }

          const hostInitials = session.host?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'M';

          return `
            <div class="bg-paper-base border-2 border-ink-black flex flex-col p-6 gap-6 shadow-hard hover:-translate-y-0.5 transition-transform">
              <div class="flex justify-between items-start border-b border-ink-black/10 pb-2">
                <span class="bg-primary-fixed border border-ink-black px-2 py-0.5 text-label-md font-label-md uppercase font-bold">${session.skillCategory}</span>
                <span class="text-rust-accent font-bold font-label-md">${session.creditsRequired} CREDITS</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-headline-sm uppercase font-bold line-clamp-1 mb-2" style="font-family:'Oswald',sans-serif;">${session.title}</h3>
                <p class="font-body-md text-body-md line-clamp-3 text-on-surface-variant">${session.description}</p>
              </div>
              <div class="flex flex-wrap gap-1">
                ${(session.tags || []).slice(0, 3).map(tag => `<span class="bg-surface-variant/40 text-label-md font-label-md border border-ink-black/20 px-2 py-0.5 uppercase">${tag}</span>`).join('')}
              </div>
              <div class="flex items-center gap-4 mt-auto border-t border-ink-black/10 pt-4">
                <div class="w-10 h-10 rounded-full border-2 border-ink-black overflow-hidden bg-primary-fixed flex items-center justify-center font-label-lg font-bold" style="font-family:'Oswald',sans-serif;">${hostInitials}</div>
                <div>
                  <h4 class="font-label-lg text-label-lg uppercase leading-none font-bold">${session.host?.name || 'Vetted Mentor'}</h4>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">${new Date(session.date).toLocaleDateString()} @ ${session.startTime}</p>
                </div>
              </div>
              <button class="border-2 border-ink-black font-headline-sm text-headline-sm uppercase px-6 py-3 w-full transition-all book-session-btn" data-id="${session._id}" ${isDisabled ? 'disabled' : ''} class="${buttonClass}" style="font-family:'Oswald',sans-serif; background-color:${isDisabled ? '#e0dcd3' : '#db5824'}; color: ${isDisabled ? '#1a1108' : '#faf6f0'}; opacity: ${isDisabled ? '0.7' : '1'};">
                ${buttonText}
              </button>
            </div>
          `;
        }).join('');

        // Attach click listeners to book buttons
        grid.querySelectorAll('.book-session-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            btn.disabled = true;
            btn.textContent = 'BOOKING...';
            try {
              await requestToJoin(id);
              showToast('Booking request sent successfully!', 'success');
              loadSessions();
            } catch (err) {
              showToast(err.message || 'Failed to request booking', 'error');
              btn.disabled = false;
              btn.textContent = 'Book Session';
            }
          });
        });
      } else {
        grid.innerHTML = `
          <div class="col-span-3 bg-surface-bright border-dashed border-2 border-ink-black p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div class="relative z-10">
              <span class="material-symbols-outlined text-6xl text-ink-black/20 mb-6 block">event_busy</span>
              <h3 class="font-headline-md text-headline-md uppercase mb-2" style="font-family:'Oswald',sans-serif;">No matching sessions right now</h3>
              <p class="font-body-lg text-body-lg text-ink-black/70 max-w-lg mb-8 mx-auto">Try clearing search filters or check back later.</p>
              <a href="#/create-session" class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm text-headline-sm uppercase px-6 py-2 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all inline-flex items-center gap-2" style="text-decoration:none;font-family:'Oswald',sans-serif;"><span class="material-symbols-outlined text-xl">add</span> CREATE A SESSION</a>
            </div>
          </div>
        `;
      }
    } catch (e) {
      grid.innerHTML = `
        <div class="col-span-3 text-center py-12 text-rust-accent font-label-lg">Failed to retrieve sessions: ${e.message}</div>
      `;
    }
  }

  // Bind filter button clicks
  container.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-tab-btn').forEach(b => {
        b.classList.remove('bg-ink-black', 'text-paper-base');
        b.classList.add('bg-paper-base', 'hover:bg-surface-variant');
      });
      btn.classList.add('bg-ink-black', 'text-paper-base');
      btn.classList.remove('bg-paper-base', 'hover:bg-surface-variant');

      currentCategory = btn.getAttribute('data-category');
      loadSessions();
    });
  });

  // Bind highlights button click to scroll down to Available Sessions
  container.querySelectorAll('.highlight-mentor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('marketplace-search')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Bind search input events
  const searchInput = document.getElementById('marketplace-search');
  let searchTimeout;
  searchInput?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadSessions, 300);
  });

  // Initial load
  loadSessions();
}
