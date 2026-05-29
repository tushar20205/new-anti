/* ═══════════════════════════════════════════
   SkillSwap+ — Sessions Page
   ═══════════════════════════════════════════ */
import { getFooterHTML } from '../components/footer.js';

export function renderSession(container) {
  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Your Sessions</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">View your upcoming, completed, and cancelled sessions. Join a live session when it's time.</p>
        </section>
        <!-- Tabs -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button class="font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 bg-ink-black text-paper-base whitespace-nowrap">Upcoming</button>
          <button class="font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 bg-paper-base hover:bg-surface-variant whitespace-nowrap">Completed</button>
          <button class="font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 bg-paper-base hover:bg-surface-variant whitespace-nowrap">Cancelled</button>
        </div>
        <!-- Join Session Readiness -->
        <section class="bg-tertiary-fixed border-2 border-ink-black p-6">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-deep-forest text-3xl" style="font-variation-settings:'FILL' 1;">videocam</span>
              <h3 class="font-headline-sm text-headline-sm text-deep-forest uppercase" style="font-family:'Oswald',sans-serif;">Session Readiness Check</h3>
            </div>
            <div class="hidden md:block flex-grow border-t-2 border-dashed border-deep-forest/50 mx-4"></div>
            <div class="font-label-md text-label-md uppercase text-ink-black flex items-center gap-4">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">mic</span> Mic OK</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">videocam</span> Camera OK</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">wifi</span> Connection OK</span>
            </div>
          </div>
        </section>
        <!-- Empty State -->
        <div class="bg-paper-base border-dashed border-2 border-ink-black p-16 flex flex-col items-center justify-center text-center">
          <span class="material-symbols-outlined text-6xl text-ink-black/20 mb-6">event_busy</span>
          <h3 class="font-headline-md text-headline-md uppercase mb-2" style="font-family:'Oswald',sans-serif;">No upcoming sessions</h3>
          <p class="font-body-lg text-ink-black/70 max-w-lg mb-8">Book a session from the marketplace or create one to start teaching.</p>
          <div class="flex gap-4 flex-wrap justify-center">
            <a href="#/marketplace" class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm uppercase px-6 py-3 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="text-decoration:none;font-family:'Oswald',sans-serif;">Browse Marketplace</a>
            <a href="#/create-session" class="bg-paper-base text-ink-black border-2 border-ink-black font-headline-sm uppercase px-6 py-3 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="text-decoration:none;font-family:'Oswald',sans-serif;">Create Session</a>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;
}
