/* ═══════════════════════════════════════════
   SkillSwap+ — Marketplace Page
   Source: Stitch "Marketplace | Join Session & Refined Footer"
   ═══════════════════════════════════════════ */

import { getFooterHTML } from '../components/footer.js';

export function renderMarketplace(container) {
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
                <button class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm text-headline-sm uppercase px-6 py-2 w-full mt-auto shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="font-family:'Oswald',sans-serif;">View Live Sessions</button>
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
                <input class="w-full bg-paper-base border-2 border-ink-black pl-10 pr-4 py-2 font-label-md text-label-md uppercase focus:outline-none focus:ring-0 focus:border-rust-accent" placeholder="SEARCH SESSIONS..." type="text" />
              </div>
            </div>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            ${['All', 'UI Design', 'React', 'Strategy', 'Marketing', 'Backend'].map((t, i) => `
              <button class="font-label-md text-label-md uppercase border-2 border-ink-black px-2 py-1 ${i === 0 ? 'bg-ink-black text-paper-base' : 'bg-paper-base hover:bg-surface-variant'} whitespace-nowrap">${t}</button>
            `).join('')}
          </div>
          <div class="bg-surface-bright border-dashed border-2 border-ink-black p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div class="relative z-10">
              <span class="material-symbols-outlined text-6xl text-ink-black/20 mb-6 block">event_busy</span>
              <h3 class="font-headline-md text-headline-md uppercase mb-2" style="font-family:'Oswald',sans-serif;">No open sessions right now</h3>
              <p class="font-body-lg text-body-lg text-ink-black/70 max-w-lg mb-8 mx-auto">When mentors publish sessions, they will appear here with real-time booking and secure escrow support.</p>
              <a href="#/create-session" class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm text-headline-sm uppercase px-6 py-2 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all inline-flex items-center gap-2" style="text-decoration:none;font-family:'Oswald',sans-serif;"><span class="material-symbols-outlined text-xl">add</span> CREATE A SESSION</a>
            </div>
          </div>
        </section>
      </main>
      ${getFooterHTML()}
    </div>
  `;
}
