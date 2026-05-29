/* ═══════════════════════════════════════════
   SkillSwap+ — Mentor Application Page
   ═══════════════════════════════════════════ */
import { getFooterHTML } from '../components/footer.js';
import { showToast } from '../components/toast.js';

export function renderMentorApply(container) {
  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Become a Mentor</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">Share your expertise, earn credits, and help others master new skills. Apply to become a verified mentor in the SkillSwap+ network.</p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div class="lg:col-span-8">
            <!-- Application Form -->
            <div class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
                <h2 class="font-label-lg text-paper-base uppercase tracking-widest">Mentor Application</h2>
              </div>
              <form class="p-8 space-y-gutter" id="mentor-apply-form">
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Areas of Expertise</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" placeholder="e.g. UI/UX Design, React, Python" required type="text" id="ma-expertise" /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Years of Experience</label><select class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md" id="ma-experience"><option>1-3 years</option><option>3-5 years</option><option>5-10 years</option><option>10+ years</option></select></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Portfolio / LinkedIn URL</label><input class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" placeholder="https://your-portfolio.com" type="url" id="ma-portfolio" /></div>
                <div class="space-y-2"><label class="font-label-md text-ink-black uppercase block">Why do you want to mentor?</label><textarea class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" rows="5" placeholder="Tell us about your motivation and teaching style..." required id="ma-motivation"></textarea></div>
                <div class="pt-8 border-t-2 border-ink-black flex justify-between items-center">
                  <p class="text-label-md font-label-md max-w-xs opacity-70 italic">Applications are reviewed within 48 hours.</p>
                  <button type="submit" class="bg-rust-accent text-paper-base border-2 border-ink-black px-10 py-4 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" id="ma-submit-btn" style="font-family:'Oswald',sans-serif;">Submit Application</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Benefits Sidebar -->
          <div class="lg:col-span-4 space-y-gutter">
            <div class="bg-rust-accent text-paper-base border-2 border-ink-black p-8 shadow-hard relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-paper-base opacity-10 rotate-45 translate-x-10 -translate-y-10"></div>
              <h3 class="font-headline-sm text-headline-sm uppercase mb-6" style="font-family:'Oswald',sans-serif;">Why Mentor?</h3>
              <ul class="space-y-4">
                ${[
                  { icon: 'toll', text: 'Earn 85-850 credits per session' },
                  { icon: 'trending_up', text: 'Boost your professional reputation' },
                  { icon: 'groups', text: 'Join a network of 140,000+ practitioners' },
                  { icon: 'verified', text: 'Get a verified mentor badge' },
                  { icon: 'star', text: 'Priority listing in the marketplace' }
                ].map(b => `
                  <li class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-paper-base/80">${b.icon}</span>
                    <span class="font-body-md">${b.text}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="bg-paper-base border-2 border-ink-black p-6 space-y-4">
              <h4 class="font-headline-sm uppercase border-b-2 border-ink-black pb-2" style="font-family:'Oswald',sans-serif;">Requirements</h4>
              <ul class="space-y-3 font-body-md">
                ${['At least 1 year of professional experience', 'Active portfolio or LinkedIn profile', 'Commitment to at least 2 sessions per month', 'Positive attitude and willingness to teach'].map(r => `
                  <li class="flex gap-3"><span class="w-2 h-2 bg-deep-forest mt-2 shrink-0"></span><span>${r}</span></li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  // Form submit
  document.getElementById('mentor-apply-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('ma-submit-btn');
    btn.disabled = true; btn.textContent = 'SUBMITTING...';
    try {
      const { applyMentor } = await import('../services/user.service.js');
      await applyMentor({
        expertise: document.getElementById('ma-expertise').value,
        experience: document.getElementById('ma-experience').value,
        portfolio: document.getElementById('ma-portfolio').value,
        motivation: document.getElementById('ma-motivation').value
      });
      showToast('Application submitted! We\'ll review within 48 hours.', 'success');
      window.location.hash = '/dashboard';
    } catch (err) { showToast(err.message || 'Failed to submit', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'SUBMIT APPLICATION'; }
  });

  // Label focus effect
  container.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => { const label = input.closest('.space-y-2')?.querySelector('label'); if (label) label.classList.add('text-rust-accent'); });
    input.addEventListener('blur', () => { const label = input.closest('.space-y-2')?.querySelector('label'); if (label) label.classList.remove('text-rust-accent'); });
  });
}
