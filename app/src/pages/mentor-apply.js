/* ═══════════════════════════════════════════
   SkillSwap+ — Mentor Application Page
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export function renderMentorApply(container) {
  const application = store.get('mentorApplication');

  if (application.status === 'pending') {
    container.innerHTML = renderPendingState();
    return;
  }

  if (application.status === 'approved') {
    container.innerHTML = renderApprovedState();
    return;
  }

  let currentStep = application.step || 1;
  renderStep(container, currentStep);
}

function renderPendingState() {
  return `
    <div class="pt-12 px-12 pb-24 max-w-[800px] mx-auto text-center stagger-children">
      <div class="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <span class="material-symbols-outlined text-amber-600 text-5xl">hourglass_top</span>
      </div>
      <h1 class="text-4xl font-black tracking-tight text-zinc-900 mb-4">Application Under Review</h1>
      <p class="text-zinc-500 text-lg max-w-md mx-auto mb-8">Our team is reviewing your mentor application. You'll be notified once a decision is made.</p>
      <div class="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm max-w-md mx-auto">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-bold text-zinc-900">Application Status</span>
          <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">Pending Review</span>
        </div>
        <div class="xp-bar">
          <div class="xp-bar-fill" style="width: 60%"></div>
        </div>
        <p class="text-xs text-zinc-400 mt-3">Estimated review time: 2-3 business days</p>
      </div>
      <a href="#/dashboard" class="inline-block mt-8 px-8 py-3.5 bg-zinc-100 text-zinc-600 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all btn-press">Back to Dashboard</a>
    </div>
  `;
}

function renderApprovedState() {
  return `
    <div class="pt-12 px-12 pb-24 max-w-[800px] mx-auto text-center stagger-children">
      <div class="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <span class="material-symbols-outlined material-fill text-emerald-600 text-5xl">verified</span>
      </div>
      <h1 class="text-4xl font-black tracking-tight text-zinc-900 mb-4">You're Approved! 🎉</h1>
      <p class="text-zinc-500 text-lg max-w-md mx-auto mb-8">Congratulations! You're now a verified mentor on SkillSwap+. Start teaching to earn credits.</p>
      <a href="#/dashboard" class="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 btn-press">Go to Dashboard</a>
    </div>
  `;
}

function renderStep(container, step) {
  container.innerHTML = `
    <div class="pt-12 px-12 pb-24 max-w-[900px] mx-auto">
      <div class="mb-12 stagger-children">
        <nav class="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
          <a href="#/dashboard" class="hover:text-primary transition-colors">Dashboard</a>
          <span class="material-symbols-outlined text-[10px]">chevron_right</span>
          <span class="text-primary">Become a Mentor</span>
        </nav>
        <h1 class="text-4xl font-black tracking-tight text-zinc-900 mb-2">Mentor Application</h1>
        <p class="text-zinc-500 text-lg">Share your expertise with the community and earn credits.</p>
      </div>

      <!-- Steps Progress -->
      <div class="flex items-center gap-6 mb-12 stagger-children">
        ${[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Teaching Experience' },
          { num: 3, label: 'Review & Submit' }
        ].map(s => `
          <div class="flex items-center gap-3 ${s.num < step ? 'step-completed' : s.num === step ? 'step-active' : 'step-pending'}">
            <span class="step-bubble">${s.num < step ? '✓' : s.num}</span>
            <span class="text-xs font-bold uppercase tracking-widest">${s.label}</span>
          </div>
          ${s.num < 3 ? '<div class="w-12 h-px bg-zinc-200"></div>' : ''}
        `).join('')}
      </div>

      <!-- Form Content -->
      <div class="bg-white rounded-2xl border border-zinc-100 p-10 shadow-sm" id="form-content">
        ${step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        ${step > 1 ? `
          <button id="prev-step-btn" class="bg-zinc-100 text-zinc-600 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all btn-press">
            <span class="material-symbols-outlined text-sm align-middle mr-1">arrow_back</span> Previous
          </button>
        ` : '<div></div>'}
        ${step < 3 ? `
          <button id="next-step-btn" class="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 btn-press">
            Next Step <span class="material-symbols-outlined text-sm align-middle ml-1">arrow_forward</span>
          </button>
        ` : `
          <button id="submit-application-btn" class="bg-primary text-white px-10 py-4 rounded-full font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 btn-press flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">send</span>
            Submit Application
          </button>
        `}
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('next-step-btn')?.addEventListener('click', () => {
    step++;
    store.setMentorApplication({ step });
    renderStep(container, step);
  });

  document.getElementById('prev-step-btn')?.addEventListener('click', () => {
    step--;
    store.setMentorApplication({ step });
    renderStep(container, step);
  });

  document.getElementById('submit-application-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('submit-application-btn');
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">refresh</span> Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      store.setMentorApplication({ status: 'pending', step: 1 });
      store.addXP(100);
      store.addCredits(50, 'Mentor Application Bonus');
      showToast('Application submitted! +100 XP, +50 Credits bonus', 'success');
      renderMentorApply(container);
    }, 2000);
  });
}

function renderStep1() {
  return `
    <h2 class="text-2xl font-black text-zinc-900 mb-8">Personal Information & Skills</h2>
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Full Name</label>
          <input class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium" value="${store.get('user').name}" />
        </div>
        <div>
          <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Email</label>
          <input class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium" value="${store.get('user').email}" />
        </div>
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Primary Skill to Teach</label>
        <select class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium">
          <option>UI/UX Design</option>
          <option>Web Development</option>
          <option>Data Science</option>
          <option>Mobile Development</option>
          <option>Public Speaking</option>
          <option>Creative Writing</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Skill Tags (comma separated)</label>
        <input class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium" placeholder="React, Figma, TypeScript" />
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Short Bio</label>
        <textarea class="w-full h-32 p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium resize-none" placeholder="Tell us about your expertise and passion for teaching..."></textarea>
      </div>
    </div>
  `;
}

function renderStep2() {
  return `
    <h2 class="text-2xl font-black text-zinc-900 mb-8">Teaching Experience</h2>
    <div class="space-y-6">
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Years of Experience</label>
        <select class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium">
          <option>1-2 years</option>
          <option>3-5 years</option>
          <option>5-10 years</option>
          <option>10+ years</option>
        </select>
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Previous Teaching Experience</label>
        <textarea class="w-full h-28 p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium resize-none" placeholder="Describe any previous teaching, mentoring, or coaching experience..."></textarea>
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Demo Session Topic</label>
        <input class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium" placeholder="e.g., Introduction to Design Systems" />
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Demo Session Description</label>
        <textarea class="w-full h-28 p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium resize-none" placeholder="Outline what you would cover in a 30-minute demo session..."></textarea>
      </div>
      <div>
        <label class="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-black block mb-2">Portfolio / LinkedIn URL</label>
        <input class="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 focus:border-primary/30 focus:bg-white transition-all outline-none text-sm font-medium" placeholder="https://linkedin.com/in/yourname" />
      </div>
    </div>
  `;
}

function renderStep3() {
  return `
    <h2 class="text-2xl font-black text-zinc-900 mb-8">Review & Submit</h2>
    <div class="space-y-6">
      <div class="bg-violet-50/50 border border-violet-100 rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="material-symbols-outlined text-primary">auto_awesome</span>
          <h3 class="font-black text-primary">What happens next?</h3>
        </div>
        <div class="space-y-3 text-sm text-zinc-600 leading-relaxed">
          <p>1. Our review team will evaluate your application within <strong>2-3 business days</strong>.</p>
          <p>2. You'll receive a notification about your application status.</p>
          <p>3. If approved, you'll get <strong>50 bonus credits</strong> and can start listing sessions immediately.</p>
          <p>4. You earn credits every time a student books your session!</p>
        </div>
      </div>

      <div class="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
        <h3 class="font-bold text-sm text-zinc-900 mb-4">Application Summary</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-zinc-400 text-xs font-bold uppercase">Name</p>
            <p class="font-medium">${store.get('user').name}</p>
          </div>
          <div>
            <p class="text-zinc-400 text-xs font-bold uppercase">Email</p>
            <p class="font-medium">${store.get('user').email}</p>
          </div>
          <div>
            <p class="text-zinc-400 text-xs font-bold uppercase">Role</p>
            <p class="font-medium">${store.get('user').role}</p>
          </div>
          <div>
            <p class="text-zinc-400 text-xs font-bold uppercase">Level</p>
            <p class="font-medium">Level ${store.get('user').level}</p>
          </div>
        </div>
      </div>

      <label class="flex items-start gap-3 p-4 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer">
        <input type="checkbox" class="mt-1 accent-primary" checked />
        <span class="text-sm text-zinc-600">I agree to the SkillSwap+ Mentor Guidelines and commit to providing quality educational experiences.</span>
      </label>
    </div>
  `;
}
