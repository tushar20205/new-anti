/* ═══════════════════════════════════════════
   SkillSwap+ — Mentor Marketplace + Booking
   Loads real sessions from API alongside
   showcase mentor cards
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { showToast } from '../components/toast.js';
import { showModal, closeModal } from '../components/modal.js';

// Showcase mentor cards (kept for visual richness)
const mentors = [
  {
    id: 'm1',
    name: 'Elena Rossi',
    role: 'Senior Product Designer @ Meta',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNcHLIaprmlB4LUtlk1fJUsBuM0xQNxyoK56r4cIs7zlqyIUkNb6WFUUlhkcN9kVy2r36mWlXh_S0LR2dLNzYEzrf20ScK9cknry8cYdTZI6uiDDke_3cwgEN4pMbIhEqYlOL9V15PtYRJl9ec0Pao8rPEQedoFRrl38YLbKMzj-cS1n-6t60kKbzG9s2KrDlFI1PY8fc67LPcEN3Np9bSRoeavCZzR7Yg_aP7v3wGopX4ssgPVyLwJA8xZrqMntHOpm-Vtp3qyQ',
    students: '1.2k', repeat: '84%', rating: '4.9', reviews: 342,
    badge: 'Top Rated',
    ai: '"Ideal for scaling UI architectures at Meta scale."',
    skills: ['Spatial Design', 'Systems'],
    credits: 45,
    slots: {
      today: [
        { time: '14:00 - 15:00', available: true },
        { time: '16:30 - 17:30', available: true },
        { time: '18:00 - 19:00', available: false }
      ],
      tomorrow: [
        { time: '09:00 - 10:00', available: true },
        { time: '15:00 - 16:00', available: true }
      ]
    }
  },
  {
    id: 'm2',
    name: 'Marcus Thorne',
    role: 'Lead Dev @ Vercel',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe_bEMQZDgZWZ6Vr_ftlHCAtKKchcbS6yP8uTXl-JK9T7oNAs_ZtzHC2y4-Bd166YgjDJtp9eK-rR88NeRi9YNPsNyn0SzK2gJXH5nA1nY8WF7nVj0Iyy0agVSdsdHTlIj9JdUn1-uWNlE_td4YPPd4wcqOsvP5bHe5jAxN3_SrKiIz426h0gakQGRbwkcqYWNRb80TGqmX1HAISbYe0lZvYgX6ykcdEBOI6EiQvoQRIDBGqa7zoU3TQUY-BOWz6ucX7VAVstLDg',
    students: '840', repeat: '92%', rating: '4.8', reviews: 218,
    badge: null,
    ai: '"Performance expert for React and Edge architectures."',
    skills: ['React', 'DevOps'],
    credits: 30,
    slots: {
      today: [
        { time: '10:00 - 11:00', available: true },
        { time: '13:00 - 14:00', available: true }
      ],
      tomorrow: [
        { time: '11:00 - 12:00', available: true },
        { time: '14:00 - 15:00', available: true },
        { time: '17:00 - 18:00', available: true }
      ]
    }
  },
  {
    id: 'm3',
    name: 'Sarah Jenkins',
    role: 'Founder @ Stealth',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi11intXJ13P7crFzmrzE6RK77jHvzOkUI-1OTpNRAXXfVHcSxu5y1QsUOnC6XgTpj2y8JDI3n2R-n5lz3yu9KxbjHpxLFxI5VAIF5gyj3ENIBQNyGPZ00BcOfVjIsLDXcUJ-DOOt-LgFNEs8fzIG1kIQdrQJ9bNriqOGj9Oul1ZZdFQ_HBMDHRe-FEkBjqW6zzQChEHnRY-4BOCAuIPJK64jzvrg4hSg1kvXLbx-ljfiR_EuINg6d9lYHJsoKl4K1ysDlpbznKw',
    students: '2.1k', repeat: '76%', rating: '4.7', reviews: 156,
    badge: 'Master',
    ai: '"Series A expert focusing on narrative and clarity."',
    skills: ['Fundraising', 'Scaling'],
    credits: 60,
    slots: {
      today: [
        { time: '15:00 - 16:00', available: true }
      ],
      tomorrow: [
        { time: '10:00 - 11:00', available: true },
        { time: '16:00 - 17:00', available: true }
      ]
    }
  }
];

let selectedMentor = null;
let selectedSlot = null;
let currentStep = 1;
let apiSessions = [];

function renderMentorCard(m) {
  return `
    <div class="group relative rounded-[2.5rem] bg-white border border-zinc-100 p-8 transition-all hover:border-primary/20 hover:shadow-[0_32px_64px_rgba(80,0,200,0.06)] flex flex-col card-hover" data-mentor="${m.id}">
      ${m.badge ? `<div class="absolute top-6 right-6"><span class="bg-${m.badge === 'Top Rated' ? 'amber-100 text-amber-700' : 'zinc-900 text-white'} text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">${m.badge}</span></div>` : ''}
      <div class="flex gap-6 mb-6">
        <div class="relative flex-shrink-0">
          <div class="w-24 h-24 rounded-3xl overflow-hidden bg-zinc-100">
            <img alt="${m.name}" class="w-full h-full object-cover" src="${m.avatar}" />
          </div>
          <div class="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-lg">
            <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-sm">verified</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="font-black text-xl text-zinc-900">${m.name}</h3>
          <p class="text-zinc-500 font-medium text-sm mb-3">${m.role}</p>
          <div class="flex gap-4">
            <div class="flex flex-col">
              <span class="text-zinc-900 font-bold text-xs">${m.students}</span>
              <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Students</span>
            </div>
            <div class="flex flex-col border-l border-zinc-100 pl-4">
              <span class="text-primary font-bold text-xs">${m.repeat}</span>
              <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Repeat</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 space-y-4">
        <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex gap-3">
          <span class="material-symbols-outlined text-primary text-lg">auto_awesome</span>
          <div>
            <p class="text-[10px] font-black uppercase text-zinc-400 mb-1 tracking-widest">AI Insight</p>
            <p class="text-xs text-zinc-600 leading-relaxed italic">${m.ai}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          ${m.skills.map(s => `<span class="px-2.5 py-1 rounded-lg bg-zinc-100 text-[10px] text-zinc-600 font-bold uppercase">${s}</span>`).join('')}
        </div>
      </div>
      <div class="flex items-center justify-between pt-6 mt-6 border-t border-zinc-50">
        <div class="flex flex-col">
          <span class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Standard rate</span>
          <span class="text-xl font-black text-zinc-900">${m.credits} Credits</span>
        </div>
        <button class="book-now-btn bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(80,0,200,0.2)] hover:scale-105 btn-press" data-mentor-id="${m.id}">Book Now</button>
      </div>
    </div>
  `;
}

function renderApiSessionCard(s) {
  const hostName = s.host?.name || 'Instructor';
  const hostAvatar = s.host?.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(hostName) + '&background=6927ef&color=fff';
  const sessionDate = s.date ? new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '';

  return `
    <div class="group rounded-2xl bg-white border border-zinc-100 p-6 transition-all hover:border-primary/20 hover:shadow-xl card-hover">
      <div class="flex items-center gap-4 mb-4">
        <img class="w-12 h-12 rounded-xl object-cover" src="${hostAvatar}" alt="${hostName}" />
        <div class="flex-1">
          <h4 class="font-bold text-zinc-900">${s.title}</h4>
          <p class="text-xs text-zinc-500">${hostName} • ${s.skillCategory || 'General'}</p>
        </div>
        <span class="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 rounded-full uppercase">${s.status}</span>
      </div>
      ${s.description ? `<p class="text-xs text-zinc-500 mb-4 line-clamp-2">${s.description}</p>` : ''}
      <div class="flex flex-wrap gap-2 mb-4">
        ${(s.tags || []).map(t => `<span class="px-2 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-600 font-bold">${t}</span>`).join('')}
      </div>
      <div class="flex items-center justify-between pt-4 border-t border-zinc-50">
        <div class="flex items-center gap-4 text-xs text-zinc-500">
          <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">calendar_today</span> ${sessionDate}</span>
          <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">schedule</span> ${s.startTime} - ${s.endTime}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-primary font-black text-sm">${s.creditsRequired} Credits</span>
          <button class="join-session-btn bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 btn-press" data-session-id="${s._id}">Join</button>
        </div>
      </div>
    </div>
  `;
}

function renderBookingPanel(mentor) {
  const credits = store.get('credits');
  const hasEnough = credits >= mentor.credits;
  const remaining = credits - mentor.credits;

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  return `
    <div class="p-8 border-b border-zinc-100 flex justify-between items-center bg-white">
      <div class="flex items-center gap-4">
        <button id="close-booking" class="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-all">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div>
          <h2 class="text-xl font-black text-zinc-900">Session Booking</h2>
          <p class="text-[10px] font-bold text-primary uppercase tracking-[0.2em]" id="panel-step">Step 2 of 3: Schedule</p>
        </div>
      </div>
      <div class="hidden sm:flex items-center gap-2">
        <div class="flex -space-x-2">
          <div class="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black">1</div>
          <div class="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black">2</div>
          <div class="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 text-zinc-400 flex items-center justify-center text-[10px] font-black">3</div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
      <!-- Mentor Summary -->
      <div class="flex items-center gap-6 p-6 rounded-3xl bg-white border border-zinc-100">
        <div class="w-20 h-20 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
          <img alt="${mentor.name}" class="w-full h-full object-cover" src="${mentor.avatar}" />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-black text-zinc-900">${mentor.name}</h3>
              <p class="text-xs text-primary font-bold">${mentor.role}</p>
            </div>
            <div class="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <span class="material-symbols-outlined material-fill text-amber-400 text-xs">star</span>
              <span class="text-[10px] font-black text-amber-700">${mentor.rating} (${mentor.reviews})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Why this mentor -->
      <div class="space-y-3">
        <p class="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Why this mentor?</p>
        <p class="text-sm text-zinc-600 leading-relaxed italic bg-primary/5 p-4 rounded-2xl border-l-4 border-primary">
          ${mentor.ai}
        </p>
      </div>

      <!-- Slot Selection -->
      <div class="space-y-6">
        <div class="flex justify-between items-end">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Slots</h4>
          <span class="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">public</span> GMT+5:30
          </span>
        </div>
        <div class="space-y-8">
          <div>
            <p class="text-xs font-black text-zinc-900 mb-4 ml-1">Today, ${todayDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
            <div class="grid grid-cols-2 gap-3">
              ${mentor.slots.today.map((s, i) => `
                <button class="slot-btn p-4 rounded-2xl border ${s.available ? 'border-zinc-100 bg-white hover:border-primary' : 'border-zinc-100 bg-zinc-50 opacity-30 cursor-not-allowed'} text-center transition-all group" data-slot="today-${i}" ${!s.available ? 'disabled' : ''}>
                  <span class="block text-sm ${s.available ? 'font-bold text-zinc-600 group-hover:text-primary' : 'font-medium text-zinc-400 line-through'}">${s.time}</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div>
            <p class="text-xs font-black text-zinc-900 mb-4 ml-1">Tomorrow, ${tomorrowDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
            <div class="grid grid-cols-2 gap-3">
              ${mentor.slots.tomorrow.map((s, i) => `
                <button class="slot-btn p-4 rounded-2xl border border-zinc-100 bg-white hover:border-primary text-center transition-all group" data-slot="tomorrow-${i}">
                  <span class="block text-sm font-bold text-zinc-600 group-hover:text-primary">${s.time}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Footer -->
    <div class="p-8 lg:p-10 bg-zinc-900 text-white rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
      <div class="flex flex-col gap-6 mb-8">
        <div class="flex justify-between items-center pb-4 border-b border-white/10">
          <span class="text-zinc-400 font-bold text-sm">Session Fee</span>
          <span class="text-2xl font-black">${mentor.credits} Credits</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-zinc-500 font-bold uppercase tracking-widest">Balance Preview</span>
          <div class="flex items-center gap-3">
            <span class="text-zinc-400 line-through">${credits}</span>
            <span class="material-symbols-outlined text-zinc-600 text-[10px]">arrow_forward</span>
            <span class="${hasEnough ? 'text-primary-container' : 'text-red-400'} font-black">${hasEnough ? remaining + ' Credits' : 'Insufficient'}</span>
          </div>
        </div>
      </div>
      <button id="confirm-booking-btn" class="w-full py-6 rounded-2xl ${hasEnough ? 'bg-primary hover:scale-[1.02]' : 'bg-zinc-700 cursor-not-allowed'} text-white font-black text-lg shadow-2xl shadow-primary/40 btn-press flex items-center justify-center gap-3" ${!hasEnough ? 'disabled' : ''}>
        <span class="material-symbols-outlined">verified</span>
        ${hasEnough ? 'Confirm & Deduct Credits' : 'Not Enough Credits'}
      </button>
      <p class="text-center text-[10px] mt-6 text-zinc-500 font-bold uppercase tracking-[0.2em]">Zero hidden fees • Cancel up to 24h before</p>
    </div>
  `;
}

export async function renderMarketplace(container) {
  const credits = store.get('credits');
  selectedMentor = null;
  selectedSlot = null;
  currentStep = 1;

  container.innerHTML = `
    <div class="flex min-h-screen relative">
      <!-- Main Content -->
      <div class="flex-1 p-12 transition-all duration-500" id="marketplace-content">
        <header class="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <nav class="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
              <span>Marketplace</span>
              <span class="material-symbols-outlined text-[10px]">chevron_right</span>
              <span class="text-primary">Find Mentors</span>
            </nav>
            <h1 class="text-5xl font-black tracking-tight text-zinc-900 mb-4">Learn from the best.</h1>
            <p class="text-zinc-500 text-lg max-w-2xl leading-relaxed">Access verified industry masters for direct live exchange. SkillSwap+ credits power your peer-to-peer growth journey.</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="bg-white px-6 py-4 rounded-3xl shadow-sm border border-zinc-100 flex items-center gap-4">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Available Balance</span>
                <span class="text-xl font-black text-zinc-900" id="marketplace-credits">${credits} Credits</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Step Indicators -->
        <div class="mb-12 flex items-center gap-8" id="step-indicators">
          <div class="flex items-center gap-3 step-active" data-step="1">
            <span class="step-bubble">1</span>
            <span class="text-xs font-black uppercase tracking-widest">Select Mentor</span>
          </div>
          <div class="w-12 h-px bg-zinc-200"></div>
          <div class="flex items-center gap-3 step-pending" data-step="2">
            <span class="step-bubble">2</span>
            <span class="text-xs font-bold uppercase tracking-widest">Choose Slot</span>
          </div>
          <div class="w-12 h-px bg-zinc-200"></div>
          <div class="flex items-center gap-3 step-pending" data-step="3">
            <span class="step-bubble">3</span>
            <span class="text-xs font-bold uppercase tracking-widest">Confirm Booking</span>
          </div>
        </div>

        <!-- Mentor Grid (showcase) -->
        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8" id="mentor-grid">
          ${mentors.map(m => renderMentorCard(m)).join('')}
        </div>

        <!-- Available Sessions from API -->
        <div class="mt-16" id="api-sessions-section">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-black tracking-tight text-zinc-900">Available Sessions</h2>
            <span class="text-xs text-zinc-400 font-bold" id="sessions-count">Loading...</span>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="api-sessions-grid">
            <div class="h-40 bg-zinc-100 rounded-2xl animate-pulse"></div>
            <div class="h-40 bg-zinc-100 rounded-2xl animate-pulse"></div>
            <div class="h-40 bg-zinc-100 rounded-2xl animate-pulse"></div>
            <div class="h-40 bg-zinc-100 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Booking Panel -->
      <aside class="booking-panel w-full lg:w-[600px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] flex flex-col" id="booking-panel">
      </aside>

      <!-- Overlay -->
      <div class="booking-overlay" id="booking-overlay"></div>
    </div>
  `;

  // Attach event listeners for mentor cards
  initMarketplace();

  // Fetch real sessions from API
  loadApiSessions();

  // Live credit updates
  return store.on('credits', (c) => {
    const el = document.getElementById('marketplace-credits');
    if (el) el.textContent = `${c} Credits`;
  });
}

async function loadApiSessions() {
  const grid = document.getElementById('api-sessions-grid');
  const countEl = document.getElementById('sessions-count');

  try {
    const { getSessions } = await import('../services/session.service.js');
    const data = await getSessions({ status: 'open' });
    apiSessions = data?.sessions || data || [];

    if (countEl) countEl.textContent = `${apiSessions.length} session${apiSessions.length !== 1 ? 's' : ''} available`;

    if (grid) {
      if (apiSessions.length === 0) {
        grid.innerHTML = `
          <div class="col-span-2 text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center justify-center">
            <div class="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-3xl text-zinc-400">group_off</span>
            </div>
            <h4 class="text-lg font-black text-zinc-900 mb-1">No mentors available right now</h4>
            <p class="text-zinc-500 font-medium text-sm mb-6">There are no open sessions in the market. Why not host one?</p>
            <a href="#/mentor-apply" class="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 btn-press">Start Teaching</a>
          </div>
        `;
      } else {
        grid.innerHTML = apiSessions.map(s => renderApiSessionCard(s)).join('');
        // Attach join buttons
        document.querySelectorAll('.join-session-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const sessionId = e.currentTarget.dataset.sessionId;
            await handleJoinSession(sessionId, e.currentTarget);
          });
        });
      }
    }
  } catch (err) {
    console.warn('Failed to load sessions:', err);
    if (grid) {
      grid.innerHTML = `
        <div class="col-span-2 text-center py-12 flex flex-col items-center">
          <span class="material-symbols-outlined text-red-500 text-4xl mb-4">wifi_off</span>
          <p class="text-zinc-600 font-bold">Unable to fetch mentors</p>
          <p class="text-zinc-400 text-sm">Please check your network connection and try again.</p>
        </div>
      `;
    }
    if (countEl) countEl.textContent = 'Error loading';
  }
}

async function handleJoinSession(sessionId, btn) {
  btn.disabled = true;
  btn.textContent = 'Joining...';

  try {
    const { requestToJoin } = await import('../services/session.service.js');
    await requestToJoin(sessionId);
    showToast('Join request sent! The host will review your request.', 'success');
    btn.textContent = 'Requested';
    btn.classList.remove('bg-primary');
    btn.classList.add('bg-zinc-300', 'cursor-not-allowed');

    // Refresh user profile to update credits
    try {
      const { fetchProfile } = await import('../services/data.layer.js');
      await fetchProfile();
    } catch (e) {}
  } catch (err) {
    showToast(err.message || 'Failed to join session', 'error');
    btn.disabled = false;
    btn.textContent = 'Join';
  }
}

function initMarketplace() {
  // Book Now buttons for showcase mentors
  document.querySelectorAll('.book-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mentorId = e.currentTarget.dataset.mentorId;
      const mentor = mentors.find(m => m.id === mentorId);
      if (mentor) openBookingPanel(mentor);
    });
  });
}

function openBookingPanel(mentor) {
  selectedMentor = mentor;
  selectedSlot = null;
  currentStep = 2;

  const panel = document.getElementById('booking-panel');
  const overlay = document.getElementById('booking-overlay');
  const marketplace = document.getElementById('marketplace-content');

  if (!panel || !overlay) return;

  panel.innerHTML = renderBookingPanel(mentor);
  panel.classList.add('open');
  overlay.classList.add('open');
  if (marketplace) {
    marketplace.style.transform = 'scale(0.98)';
    marketplace.style.opacity = '0.6';
    marketplace.style.filter = 'blur(2px)';
  }
  document.body.style.overflow = 'hidden';

  updateSteps(2);

  // Close button
  document.getElementById('close-booking')?.addEventListener('click', closeBookingPanel);
  overlay.addEventListener('click', closeBookingPanel);

  // Slot selection
  document.querySelectorAll('.slot-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.slot-btn').forEach(b => {
        b.classList.remove('border-primary', 'bg-primary/5', 'border-2');
        b.classList.add('border-zinc-100');
        const span = b.querySelector('span');
        if (span) { span.classList.remove('text-primary', 'font-black'); span.classList.add('text-zinc-600', 'font-bold'); }
      });
      const clicked = e.currentTarget;
      clicked.classList.remove('border-zinc-100');
      clicked.classList.add('border-primary', 'bg-primary/5', 'border-2');
      const span = clicked.querySelector('span');
      if (span) { span.classList.remove('text-zinc-600', 'font-bold'); span.classList.add('text-primary', 'font-black'); }

      selectedSlot = clicked.dataset.slot;
      updateSteps(3);
    });
  });

  // Confirm booking
  document.getElementById('confirm-booking-btn')?.addEventListener('click', () => {
    if (!store.hasEnoughCredits(mentor.credits)) {
      showToast('Not enough credits to book this session', 'error');
      return;
    }
    if (!selectedSlot) {
      showToast('Please select a time slot first', 'warning');
      return;
    }
    confirmBooking(mentor);
  });
}

function closeBookingPanel() {
  const panel = document.getElementById('booking-panel');
  const overlay = document.getElementById('booking-overlay');
  const marketplace = document.getElementById('marketplace-content');

  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (marketplace) {
    marketplace.style.transform = '';
    marketplace.style.opacity = '';
    marketplace.style.filter = '';
  }
  document.body.style.overflow = '';
  selectedMentor = null;
  selectedSlot = null;
  updateSteps(1);
}

function updateSteps(step) {
  currentStep = step;
  document.querySelectorAll('[data-step]').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.className = el.className.replace(/step-\w+/g, '');
    if (s < step) el.classList.add('step-completed');
    else if (s === step) el.classList.add('step-active');
    else el.classList.add('step-pending');
  });
}

function confirmBooking(mentor) {
  const btn = document.getElementById('confirm-booking-btn');
  if (!btn) return;

  // Processing state
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Booking...';
  btn.classList.add('opacity-80', 'cursor-wait');
  btn.disabled = true;

  setTimeout(async () => {
    // Determine session date/time from selected slot
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isToday = selectedSlot.startsWith('today');
    const slotIndex = parseInt(selectedSlot.split('-')[1]);
    const slotData = isToday ? mentor.slots.today[slotIndex] : mentor.slots.tomorrow[slotIndex];
    const sessionDate = isToday ? today : tomorrow;

    const timeStr = slotData.time.split(' - ')[0];
    const endTimeStr = slotData.time.split(' - ')[1];

    // Deduct credits locally (showcase booking — the real credits live on the server)
    const success = store.deductCredits(mentor.credits);

    if (success) {
      // Add session to local state
      store.bookSession({
        mentor: mentor.name,
        mentorAvatar: mentor.avatar,
        title: `${mentor.skills[0]} Mastery with ${mentor.name}`,
        date: sessionDate.toISOString().split('T')[0],
        time: timeStr,
        startTime: timeStr,
        endTime: endTimeStr,
        credits: mentor.credits
      });

      closeBookingPanel();

      // Show success modal
      showModal(`
        <div class="text-center py-4">
          <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined material-fill text-emerald-600 text-4xl">check_circle</span>
          </div>
          <h3 class="text-2xl font-black text-zinc-900 mb-2">Session Booked Successfully!</h3>
          <p class="text-zinc-500 mb-4">Your session with <strong>${mentor.name}</strong> has been confirmed.</p>
          <div class="bg-zinc-50 rounded-2xl p-4 mb-6 text-left">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-zinc-500">Credits Deducted</span>
              <span class="font-black text-zinc-900">${mentor.credits}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-zinc-500">Remaining Balance</span>
              <span class="font-black text-primary">${store.get('credits')}</span>
            </div>
          </div>
          <p class="text-xs text-zinc-400">Redirecting to dashboard...</p>
        </div>
      `, { showCloseBtn: false });

      store.addXP(25);
      showToast('Session booked! +25 XP earned', 'success');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        closeModal();
        window.location.hash = '#/dashboard';
      }, 2000);
    } else {
      showToast('Not enough credits to book this session', 'error');
      btn.innerHTML = '<span class="material-symbols-outlined">verified</span> Confirm & Deduct Credits';
      btn.classList.remove('opacity-80', 'cursor-wait');
      btn.disabled = false;
    }
  }, 2000);
}
