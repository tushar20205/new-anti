/* ═══════════════════════════════════════════
   SkillSwap+ — Assignments Page
   ═══════════════════════════════════════════ */
import { getFooterHTML } from '../components/footer.js';

export function renderAssignments(container) {
  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Your Assignments</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">Track assignments from your sessions. Submit work, get reviews, and level up your mastery.</p>
        </section>
        <!-- Stats Row -->
        <section class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          ${[
            { label: 'Total', value: '0', icon: 'assignment' },
            { label: 'Pending', value: '0', icon: 'pending_actions' },
            { label: 'Submitted', value: '0', icon: 'upload_file' },
            { label: 'Graded', value: '0', icon: 'grading' }
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
        <!-- Tabs -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          ${['All', 'To Review', 'Submitted', 'Graded'].map((t, i) => `
            <button class="font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 ${i === 0 ? 'bg-ink-black text-paper-base' : 'bg-paper-base hover:bg-surface-variant'} whitespace-nowrap">${t}</button>
          `).join('')}
        </div>
        <!-- Empty State -->
        <div class="bg-paper-base border-dashed border-2 border-ink-black p-16 flex flex-col items-center justify-center text-center">
          <div class="w-20 h-20 bg-tertiary-fixed border-2 border-ink-black flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-4xl text-rust-accent">assignment</span>
          </div>
          <h3 class="font-headline-md text-headline-md uppercase mb-2" style="font-family:'Oswald',sans-serif;">No assignments yet</h3>
          <p class="font-body-lg text-ink-black/70 max-w-lg mb-8">Join sessions to receive assignments from mentors. Complete them to earn bonus credits and level up.</p>
          <a href="#/marketplace" class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm uppercase px-8 py-3 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="text-decoration:none;font-family:'Oswald',sans-serif;">Browse Sessions</a>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;
}
