/* ═══════════════════════════════════════════
   SkillSwap+ — Assignments Module
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { showToast } from '../components/toast.js';

const statusConfig = {
  pending: { label: 'Pending', color: 'amber', icon: 'schedule' },
  submitted: { label: 'Submitted', color: 'blue', icon: 'upload_file' },
  reviewed: { label: 'Reviewed', color: 'emerald', icon: 'check_circle' }
};

export function renderAssignments(container) {
  const assignments = store.get('assignments') || [];

  container.innerHTML = `
    <div class="pt-12 px-12 pb-24 max-w-[1200px] mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 stagger-children">
        <div>
          <nav class="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            <a href="#/dashboard" class="hover:text-primary transition-colors">Dashboard</a>
            <span class="material-symbols-outlined text-[10px]">chevron_right</span>
            <span class="text-primary">Assignments</span>
          </nav>
          <h1 class="text-4xl font-black tracking-tight text-zinc-900 mb-2">Your Assignments</h1>
          <p class="text-zinc-500 text-lg">Complete your assignments to earn XP and build your portfolio.</p>
        </div>
        <div class="flex gap-3">
          <div class="bg-amber-50 border border-amber-100 px-4 py-2 rounded-full flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-600 text-sm">schedule</span>
            <span class="text-xs font-bold text-amber-700">${assignments.filter(a => a.status === 'pending').length} Pending</span>
          </div>
          <div class="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
            <span class="text-xs font-bold text-emerald-700">${assignments.filter(a => a.status === 'reviewed').length} Reviewed</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 stagger-children" id="assignments-list">
        ${assignments.length === 0 ? `
          <div class="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center">
            <div class="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-3xl text-zinc-400">assignment</span>
            </div>
            <h4 class="text-lg font-black text-zinc-900 mb-1">No assignments yet</h4>
            <p class="text-zinc-500 font-medium text-sm mb-6">Complete a session to receive your first assignment.</p>
            <a href="#/marketplace" class="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 btn-press">Browse Sessions</a>
          </div>
        ` : assignments.map(a => {
          const cfg = statusConfig[a.status] || statusConfig.pending;
          return `
            <div class="bg-white rounded-2xl border border-zinc-100 p-8 hover:shadow-xl hover:shadow-zinc-200/30 transition-all group" data-assignment-id="${a.id}">
              <div class="flex flex-col md:flex-row justify-between gap-6">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span style="background-color: ${cfg.color === 'amber' ? '#fffbeb' : cfg.color === 'blue' ? '#eff6ff' : '#ecfdf5'}; color: ${cfg.color === 'amber' ? '#d97706' : cfg.color === 'blue' ? '#2563eb' : '#059669'}" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">${cfg.icon}</span>
                      ${cfg.label}
                    </span>
                    <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">${a.sessionTitle}</span>
                  </div>
                  <h3 class="text-xl font-black text-zinc-900 mb-2 group-hover:text-primary transition-colors">${a.title}</h3>
                  <p class="text-zinc-500 leading-relaxed mb-4">${a.description}</p>
                  <div class="flex items-center gap-4 text-xs text-zinc-400">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">calendar_today</span>
                      Due: ${new Date(a.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    ${a.grade ? `<span class="text-emerald-600 font-bold">Grade: ${a.grade}</span>` : ''}
                  </div>
                  ${a.feedback ? `
                    <div class="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                      <p class="text-[10px] font-black uppercase text-emerald-700 tracking-widest mb-1">Mentor Feedback</p>
                      <p class="text-sm text-emerald-800 italic">${a.feedback}</p>
                    </div>
                  ` : ''}
                </div>
                <div class="flex flex-col gap-3 min-w-[160px]">
                  ${a.status === 'pending' ? `
                    <button class="submit-assignment-btn bg-primary text-white py-3 px-6 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 btn-press flex items-center justify-center gap-2" data-id="${a.id}">
                      <span class="material-symbols-outlined text-sm">upload</span>
                      Upload Submission
                    </button>
                    <p class="text-[10px] text-zinc-400 text-center">PDF, DOCX, or ZIP</p>
                  ` : a.status === 'submitted' ? `
                    <div class="bg-blue-50 text-blue-600 py-3 px-6 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-sm">hourglass_top</span>
                      Under Review
                    </div>
                  ` : `
                    <div class="bg-emerald-50 text-emerald-600 py-3 px-6 rounded-full font-bold text-sm text-center flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined material-fill text-sm">verified</span>
                      Completed
                    </div>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Upload handlers
  document.querySelectorAll('.submit-assignment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      // Simulate file upload
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">refresh</span> Uploading...';
      btn.disabled = true;
      btn.classList.add('opacity-70');

      setTimeout(() => {
        store.submitAssignment(id);
        store.addXP(50);
        showToast('Assignment submitted successfully! +50 XP', 'success');

        // Re-render
        renderAssignments(container);
      }, 1500);
    });
  });
}
