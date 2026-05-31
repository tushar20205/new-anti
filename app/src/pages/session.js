/* ═══════════════════════════════════════════
   SkillSwap+ — Sessions Page
   ═══════════════════════════════════════════ */

import { getFooterHTML } from '../components/footer.js';
import { fetchMySessions } from '../services/data.layer.js';
import { completeSession, respondToRequest } from '../services/session.service.js';
import { createReview } from '../services/platform.service.js';
import { showToast } from '../components/toast.js';
import { store } from '../state.js';

let activeTab = 'Upcoming';

export function renderSession(container) {
  const user = store.getUserSafe();

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Your Sessions</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">View your upcoming, completed, and cancelled sessions. Join a live video call or manage participant requests when it's time.</p>
        </section>

        <!-- Tabs -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar" id="sessions-tabs-container">
          ${['Upcoming', 'Completed', 'Cancelled'].map(t => {
            const matches = activeTab === t;
            return `<button class="session-tab-btn font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 ${matches ? 'bg-ink-black text-paper-base' : 'bg-paper-base hover:bg-surface-variant'} whitespace-nowrap" data-tab="${t}">${t}</button>`;
          }).join('')}
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
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-deep-forest">mic</span> Mic OK</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-deep-forest">videocam</span> Camera OK</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-deep-forest">wifi</span> Connection OK</span>
            </div>
          </div>
        </section>

        <!-- Sessions Container -->
        <div class="grid grid-cols-1 gap-6" id="sessions-list-container">
          <div class="text-center py-12 text-on-surface-variant font-label-lg">Loading your sessions...</div>
        </div>
      </main>

      <!-- Review Modal -->
      <div id="review-modal" class="fixed inset-0 z-50 bg-ink-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div class="bg-paper-base border-2 border-ink-black shadow-hard max-w-md w-full p-8 space-y-6">
          <h3 class="font-headline-sm text-headline-sm uppercase border-b-2 border-ink-black pb-2" style="font-family:'Oswald',sans-serif;">Submit Session Review</h3>
          <form id="session-review-form" class="space-y-4">
            <input type="hidden" id="review-session-id" />
            <div class="space-y-2">
              <label class="font-label-md text-ink-black uppercase block font-bold">Rating</label>
              <div class="flex gap-2 text-3xl text-rust-accent cursor-pointer" id="rating-stars">
                ${[1, 2, 3, 4, 5].map(num => `<span class="material-symbols-outlined star-icon" data-rating="${num}">star_border</span>`).join('')}
              </div>
              <input type="hidden" id="review-rating-val" required />
            </div>
            <div class="space-y-2">
              <label class="font-label-md text-ink-black uppercase block font-bold">Feedback</label>
              <textarea class="w-full bg-paper-base border-2 border-ink-black p-4 font-body-md focus:border-rust-accent focus:outline-none" rows="4" placeholder="Describe your experience with the session..." required id="review-feedback"></textarea>
            </div>
            <div class="flex justify-end gap-4 pt-4 border-t-2 border-ink-black">
              <button type="button" class="bg-paper-base text-ink-black border-2 border-ink-black px-4 py-2 font-label-lg uppercase" id="close-review-modal">Cancel</button>
              <button type="submit" class="bg-rust-accent text-paper-base border-2 border-ink-black px-6 py-2 font-label-lg uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Submit</button>
            </div>
          </form>
        </div>
      </div>

      ${getFooterHTML()}
    </div>
  `;

  // Modal handlers
  let selectedRating = 0;
  const reviewModal = document.getElementById('review-modal');
  const ratingStarsContainer = document.getElementById('rating-stars');
  const ratingValInput = document.getElementById('review-rating-val');

  if (ratingStarsContainer) {
    const stars = Array.from(ratingStarsContainer.querySelectorAll('.star-icon'));
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = Number(star.getAttribute('data-rating'));
        selectedRating = rating;
        ratingValInput.value = rating;
        stars.forEach((s, idx) => {
          s.textContent = idx < rating ? 'star' : 'star_border';
        });
      });
    });
  }

  document.getElementById('close-review-modal')?.addEventListener('click', () => {
    reviewModal.classList.add('hidden');
    document.getElementById('session-review-form').reset();
    selectedRating = 0;
    ratingStarsContainer.querySelectorAll('.star-icon').forEach(s => s.textContent = 'star_border');
  });

  document.getElementById('session-review-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sessionId = document.getElementById('review-session-id').value;
    const rating = Number(document.getElementById('review-rating-val').value);
    const feedback = document.getElementById('review-feedback').value;

    if (!rating) {
      showToast('Please select a rating star', 'error');
      return;
    }

    try {
      await createReview({ sessionId, rating, feedback });
      showToast('Thank you! Review submitted successfully.', 'success');
      reviewModal.classList.add('hidden');
      loadUserSessions();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    }
  });

  // Main rendering logic
  async function loadUserSessions() {
    const containerEl = document.getElementById('sessions-list-container');
    if (!containerEl) return;

    try {
      const { data: schedule } = await fetchMySessions();
      const hosting = schedule?.hosting || [];
      const attending = schedule?.attending || [];

      // Combine and add properties
      const allSessions = [
        ...hosting.map(s => ({ ...s, isHost: true })),
        ...attending.map(s => ({ ...s, isHost: false }))
      ];

      // Filter by activeTab
      let filtered = [];
      if (activeTab === 'Upcoming') {
        filtered = allSessions.filter(s => s.status === 'open' || s.status === 'full' || s.status === 'in-progress');
      } else if (activeTab === 'Completed') {
        filtered = allSessions.filter(s => s.status === 'completed');
      } else if (activeTab === 'Cancelled') {
        filtered = allSessions.filter(s => s.status === 'cancelled');
      }

      // Sort by date ascending
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

      if (filtered.length > 0) {
        containerEl.innerHTML = filtered.map(session => {
          const isHost = session.isHost;
          const participantList = session.participants || [];
          const pendingRequests = session.requests?.filter(r => r.status === 'pending') || [];
          const formattedDate = new Date(session.date).toLocaleDateString();

          // Video call URL
          const meetingUrl = session.meetingUrl || `https://meet.jit.si/skillswap-${session._id}`;

          return `
            <div class="bg-paper-base border-2 border-ink-black p-8 shadow-hard flex flex-col gap-6">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-ink-black/10 pb-4">
                <div>
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="bg-secondary-fixed border border-ink-black px-2 py-0.5 text-label-md font-label-md uppercase font-bold">${session.skillCategory}</span>
                    <span class="text-label-md font-label-md uppercase font-bold ${isHost ? 'text-rust-accent' : 'text-deep-forest'}">${isHost ? 'Hosting (Teacher)' : 'Attending (Learner)'}</span>
                  </div>
                  <h3 class="font-headline-sm text-headline-sm uppercase font-bold mt-2" style="font-family:'Oswald',sans-serif;">${session.title}</h3>
                </div>
                <div class="text-right">
                  <span class="text-rust-accent font-display-md text-headline-sm">${session.creditsRequired} TKN</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-body-md">
                <div class="space-y-2 border-r border-ink-black/10 pr-6">
                  <p class="font-label-md text-label-md uppercase text-on-surface-variant font-bold">Schedule</p>
                  <p class="font-medium">${formattedDate}</p>
                  <p class="text-on-surface-variant font-label-md text-label-md">${session.startTime} - ${session.endTime} (${session.duration} mins)</p>
                </div>
                <div class="space-y-2 border-r border-ink-black/10 pr-6">
                  <p class="font-label-md text-label-md uppercase text-on-surface-variant font-bold">${isHost ? 'Learners' : 'Host'}</p>
                  ${isHost ? `
                    <p class="font-medium">${participantList.length} / ${session.maxParticipants} Registered</p>
                    <p class="text-on-surface-variant font-label-md text-label-md">${participantList.map(p => p.name).join(', ') || 'No learners joined yet'}</p>
                  ` : `
                    <p class="font-medium">${session.host?.name || 'Vetted Mentor'}</p>
                    <p class="text-on-surface-variant font-label-md text-label-md">${session.host?.skillsOffered?.slice(0, 3).join(', ') || 'Professional Instruction'}</p>
                  `}
                </div>
                <div class="space-y-2 flex flex-col justify-center">
                  ${activeTab === 'Upcoming' ? `
                    <a href="${meetingUrl}" target="_blank" class="bg-rust-accent text-paper-base border-2 border-ink-black py-3 font-headline-sm uppercase text-center shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2" style="text-decoration:none;font-family:'Oswald',sans-serif;">
                      <span class="material-symbols-outlined">videocam</span> JOIN JITSI CALL
                    </a>
                  ` : activeTab === 'Completed' && !isHost ? `
                    <button class="bg-ink-black text-paper-base border-2 border-ink-black py-3 font-headline-sm uppercase text-center shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 open-review-btn" data-id="${session._id}" style="font-family:'Oswald',sans-serif;">
                      <span class="material-symbols-outlined">star</span> LEAVE A REVIEW
                    </button>
                  ` : `
                    <p class="font-label-lg text-label-lg uppercase opacity-60 text-center">${activeTab === 'Completed' ? 'Completed Session' : 'Cancelled'}</p>
                  `}
                </div>
              </div>

              ${isHost && activeTab === 'Upcoming' ? `
                <div class="border-t border-ink-black/10 pt-4 flex flex-col gap-4">
                  <!-- Booking Requests -->
                  ${pendingRequests.length > 0 ? `
                    <div class="bg-surface-variant/40 border-2 border-ink-black p-4 space-y-4">
                      <h4 class="font-headline-sm text-headline-sm uppercase text-rust-accent leading-none" style="font-family:'Oswald',sans-serif;">Pending Booking Requests</h4>
                      <div class="divide-y divide-ink-black/10">
                        ${pendingRequests.map(reqItem => `
                          <div class="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-primary-fixed border border-ink-black flex items-center justify-center text-label-md font-bold">${reqItem.user?.name?.[0] || 'L'}</div>
                              <div>
                                <p class="font-label-lg text-label-lg uppercase font-bold">${reqItem.user?.name || 'Learner'}</p>
                                <p class="text-body-sm text-on-surface-variant">Requested at ${new Date(reqItem.requestedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <button class="bg-deep-forest text-paper-base border-2 border-ink-black px-4 py-1 font-label-md uppercase respond-btn hover:bg-emerald-800 transition-colors" data-id="${session._id}" data-user="${reqItem.user?._id}" data-action="accept">Accept</button>
                              <button class="bg-paper-base text-ink-black border border-ink-black px-4 py-1 font-label-md uppercase respond-btn hover:bg-surface-variant transition-colors" data-id="${session._id}" data-user="${reqItem.user?._id}" data-action="reject">Reject</button>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}

                  <!-- Complete Action -->
                  <div class="flex justify-between items-center gap-4">
                    <p class="text-body-sm text-on-surface-variant">After holding the session, mark it complete to release funds.</p>
                    <button class="bg-ink-black text-paper-base border-2 border-ink-black px-6 py-2 font-label-lg uppercase complete-session-btn hover:bg-rust-accent transition-colors" data-id="${session._id}">
                      Mark Completed
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        // Attach review trigger
        containerEl.querySelectorAll('.open-review-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            document.getElementById('review-session-id').value = id;
            reviewModal.classList.remove('hidden');
          });
        });

        // Attach complete call
        containerEl.querySelectorAll('.complete-session-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            btn.disabled = true;
            btn.textContent = 'COMPLETING...';
            try {
              await completeSession(id);
              showToast('Session completed successfully!', 'success');
              loadUserSessions();
            } catch (err) {
              showToast(err.message || 'Failed to complete session', 'error');
              btn.disabled = false;
              btn.textContent = 'Mark Completed';
            }
          });
        });

        // Attach request response
        containerEl.querySelectorAll('.respond-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const userId = btn.getAttribute('data-user');
            const action = btn.getAttribute('data-action');
            btn.disabled = true;
            btn.textContent = action === 'accept' ? 'ACCEPTING...' : 'REJECTING...';
            try {
              await respondToRequest(id, userId, action);
              showToast(`Request ${action}ed successfully!`, 'success');
              loadUserSessions();
            } catch (err) {
              showToast(err.message || 'Failed to respond', 'error');
              btn.disabled = false;
              btn.textContent = action === 'accept' ? 'Accept' : 'Reject';
            }
          });
        });
      } else {
        containerEl.innerHTML = `
          <div class="bg-paper-base border-dashed border-2 border-ink-black p-16 flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-6xl text-ink-black/20 mb-6">event_busy</span>
            <h3 class="font-headline-md text-headline-md uppercase mb-2" style="font-family:'Oswald',sans-serif;">No ${activeTab.toLowerCase()} sessions</h3>
            <p class="font-body-lg text-ink-black/70 max-w-lg mb-8">Book a session from the marketplace or create one to start teaching.</p>
            <div class="flex gap-4 flex-wrap justify-center">
              <a href="#/marketplace" class="bg-rust-accent text-paper-base border-2 border-ink-black font-headline-sm uppercase px-6 py-3 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="text-decoration:none;font-family:'Oswald',sans-serif;">Browse Marketplace</a>
              <a href="#/create-session" class="bg-paper-base text-ink-black border-2 border-ink-black font-headline-sm uppercase px-6 py-3 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="text-decoration:none;font-family:'Oswald',sans-serif;">Create Session</a>
            </div>
          </div>
        `;
      }
    } catch (e) {
      containerEl.innerHTML = `
        <div class="text-center py-12 text-rust-accent font-label-lg">Failed to retrieve sessions: ${e.message}</div>
      `;
    }
  }

  // Bind tab clicks
  container.querySelectorAll('.session-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.session-tab-btn').forEach(b => {
        b.classList.remove('bg-ink-black', 'text-paper-base');
        b.classList.add('bg-paper-base', 'hover:bg-surface-variant');
      });
      btn.classList.add('bg-ink-black', 'text-paper-base');
      btn.classList.remove('bg-paper-base', 'hover:bg-surface-variant');

      activeTab = btn.getAttribute('data-tab');
      loadUserSessions();
    });
  });

  // Initial load
  loadUserSessions();
}
