/* ═══════════════════════════════════════════
   SkillSwap+ — Create Session Page
   Source: Stitch "Create Session | SkillSwap+"
   ═══════════════════════════════════════════ */

import { getFooterHTML } from '../components/footer.js';
import { showToast } from '../components/toast.js';

export function renderCreateSession(container) {
  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12">
        <div class="flex flex-col md:flex-row justify-between items-end gap-gutter mb-12">
          <div class="max-w-2xl">
            <h1 class="font-display-lg text-headline-lg uppercase mb-4 leading-tight" style="font-family:'Oswald',sans-serif;">Create a real <span class="text-rust-accent">session.</span></h1>
            <p class="font-body-lg text-on-surface-variant">Publish a session to the marketplace. Learners can request a booking, credits are reserved in escrow, and you get paid after completion.</p>
          </div>
          <a href="#/marketplace" class="bg-paper-base border-2 border-ink-black px-6 py-3 font-headline-sm uppercase shadow-hard hover:bg-surface-container transition-all flex items-center gap-2" style="text-decoration:none;font-family:'Oswald',sans-serif;">VIEW MARKETPLACE <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div class="lg:col-span-8 bg-paper-base border-2 border-ink-black shadow-hard">
            <div class="bg-tertiary border-b-2 border-ink-black p-4">
              <h2 class="font-label-lg text-paper-base uppercase tracking-widest">Session Details</h2>
            </div>
            <form class="p-8 space-y-gutter" id="create-session-form">
              <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Session Title</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" placeholder="e.g. Masterclass in Industrial Design Systems" required type="text" id="cs-title" /></div>
              <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Description</label><textarea class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" placeholder="Describe what learners will achieve..." required rows="6" id="cs-desc"></textarea></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Skill Category</label><select class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md" id="cs-category"><option value="Design">Design</option><option value="Programming">Programming</option><option value="Marketing">Marketing</option><option value="Business">Business</option><option value="Other">Other</option></select></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Credits Required</label><div class="relative"><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md pr-12 focus:border-rust-accent focus:outline-none" placeholder="100" type="number" id="cs-credits" /><span class="absolute right-4 top-1/2 -translate-y-1/2 font-label-md opacity-50">CR</span></div></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Date</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" type="date" id="cs-date" /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Start Time</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" type="time" id="cs-time" /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Duration</label><select class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md" id="cs-duration"><option value="60">60 Mins</option><option value="90">90 Mins</option><option value="120">2 Hours</option><option value="240">Half Day</option></select></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Max Participants</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" type="number" value="1" id="cs-max" /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Tags (Comma separated)</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" placeholder="industrial, drafting, cad" type="text" id="cs-tags" /></div>
              </div>
              <div class="pt-8 border-t-2 border-ink-black flex justify-between items-center">
                <p class="text-label-md font-label-md max-w-xs opacity-70 italic">By publishing, you agree to the SkillSwap Expert Guidelines.</p>
                <button class="bg-rust-accent text-paper-base border-2 border-ink-black px-10 py-4 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 transition-all" type="submit" id="cs-submit-btn" style="font-family:'Oswald',sans-serif;">PUBLISH SESSION</button>
              </div>
            </form>
          </div>
          <div class="lg:col-span-4 space-y-gutter">
            <div class="bg-paper-base border-2 border-ink-black shadow-hard overflow-hidden">
              <div class="h-48 bg-surface-variant relative">
                <img alt="Session preview" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Eyc_dBAun3g_yuFj3c0z9XfnsF5nhcImg3X4_skfK9uKqbYjQljTFu1l-Cnv7q49Z_oKHAneWDRh5yRjNfY7X3edBu53R5Tq8FMfMSSRpZ4n_fwjvZooqGPc_aMYwwgRoNZuhSvpjat7VtY_cP3SE6_0RdUehltaRUtimojA6yokNnIZ8cnThu7vWF0oAtzAbEvQm2dp8E7ezHe_KAmFycGA1lubX2wJ306_v6r9l3kgXk4UBG9n4-FaWRo5F-EaCkCtRtcnxY0" />
                <div class="absolute top-4 right-4 bg-rust-accent text-paper-base px-3 py-1 font-label-md border-2 border-ink-black">PREVIEW</div>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex gap-2"><span class="bg-primary-fixed border border-ink-black px-2 py-0.5 text-label-md font-label-md uppercase">Design</span><span class="bg-secondary-fixed border border-ink-black px-2 py-0.5 text-label-md font-label-md uppercase">Expert</span></div>
                <h3 class="font-headline-sm uppercase leading-tight" id="cs-preview-title" style="font-family:'Oswald',sans-serif;">Session Preview Title</h3>
                <div class="flex items-center gap-2 text-label-lg font-label-lg border-y border-ink-black py-3"><span class="material-symbols-outlined">schedule</span><span>PENDING TIME</span><span class="mx-auto"></span><span class="text-rust-accent font-bold" id="cs-preview-credits">100 CREDITS</span></div>
                <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full border-2 border-ink-black bg-surface-container"></div><span class="font-label-lg">YOU (EXPERT)</span></div>
              </div>
              <div class="bg-tertiary-fixed border-t-2 border-ink-black p-4"><div class="flex justify-between items-center text-label-md font-label-md"><span>REVENUE POTENTIAL</span><span class="font-bold">85 - 850 TKN</span></div></div>
            </div>
            <div class="bg-paper-base border-2 border-ink-black p-6 space-y-4">
              <h4 class="font-headline-sm uppercase border-b-2 border-ink-black pb-2" style="font-family:'Oswald',sans-serif;">Session Tips</h4>
              <ul class="space-y-3 font-body-md">
                <li class="flex gap-3"><span class="w-2 h-2 bg-rust-accent mt-2 shrink-0"></span><span>Keep your title descriptive but concise (under 60 characters).</span></li>
                <li class="flex gap-3"><span class="w-2 h-2 bg-rust-accent mt-2 shrink-0"></span><span>Upload a high-quality thumbnail image to increase click-through by 40%.</span></li>
                <li class="flex gap-3"><span class="w-2 h-2 bg-rust-accent mt-2 shrink-0"></span><span>Clearly state the prerequisites in the description.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  // Live preview sync
  const titleInput = document.getElementById('cs-title');
  const previewTitle = document.getElementById('cs-preview-title');
  const creditsInput = document.getElementById('cs-credits');
  const previewCredits = document.getElementById('cs-preview-credits');

  titleInput?.addEventListener('input', (e) => { if (previewTitle) previewTitle.textContent = e.target.value || 'Session Preview Title'; });
  creditsInput?.addEventListener('input', (e) => { if (previewCredits) previewCredits.textContent = (e.target.value || '100') + ' CREDITS'; });

  // Form submit
  document.getElementById('create-session-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('cs-submit-btn');
    btn.disabled = true; btn.textContent = 'PUBLISHING...';
    try {
      const { createSession } = await import('../services/session.service.js');
      
      const startTimeVal = document.getElementById('cs-time').value;
      const durationVal = Number(document.getElementById('cs-duration').value);
      const [hours, minutes] = startTimeVal.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + durationVal;
      const endHours = Math.floor(endMinutes / 60) % 24;
      const endMins = endMinutes % 60;
      const endTimeVal = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      const res = await createSession({
        title: titleInput.value,
        description: document.getElementById('cs-desc').value,
        skillCategory: document.getElementById('cs-category').value,
        creditsRequired: Number(creditsInput.value),
        date: document.getElementById('cs-date').value,
        startTime: startTimeVal,
        endTime: endTimeVal,
        maxParticipants: Number(document.getElementById('cs-max').value),
        tags: document.getElementById('cs-tags').value.split(',').map(t => t.trim()).filter(Boolean)
      });
      showToast('Session published!', 'success');
      window.location.hash = '/marketplace';
    } catch (err) {
      showToast(err.message || 'Failed to create session', 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'PUBLISH SESSION';
    }
  });

  // Label focus effect
  container.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => { const label = input.closest('.space-y-2')?.querySelector('label'); if (label) label.classList.add('text-rust-accent'); });
    input.addEventListener('blur', () => { const label = input.closest('.space-y-2')?.querySelector('label'); if (label) label.classList.remove('text-rust-accent'); });
  });
}
