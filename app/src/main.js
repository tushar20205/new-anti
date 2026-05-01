/* ═══════════════════════════════════════════
   SkillSwap+ — Main Application Entry
   With API-first initialization
   ═══════════════════════════════════════════ */

import { router } from './router.js';
import { store } from './state.js';
import { isAuthenticated } from './services/auth.service.js';
import { fetchProfile, performLogout } from './services/data.layer.js';
import { renderSidebar, initSidebar } from './components/sidebar.js';
import { initChatbot } from './components/chatbot.js';
import { renderLanding } from './pages/landing.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderMarketplace } from './pages/marketplace.js';
import { renderSession } from './pages/session.js';
import { renderCommunity } from './pages/community.js';
import { renderAssignments } from './pages/assignments.js';
import { renderProfile } from './pages/profile.js';
import { renderSettings } from './pages/settings.js';
import { renderMentorApply } from './pages/mentor-apply.js';
import { renderReferral } from './pages/referral.js';
import { showToast } from './components/toast.js';

// Pages that use the sidebar layout
const sidebarPages = ['/dashboard', '/marketplace', '/session', '/community', '/assignments', '/profile', '/settings', '/mentor-apply', '/referral'];

/**
 * Fetch the user profile from API and populate state.
 * Called on app init if a token exists.
 */
async function initUserFromAPI() {
  if (!isAuthenticated()) return false;

  // Data layer handles demo vs live mode internally
  const res = await fetchProfile();
  return !res.error;
}

// Router setup
router.onBeforeNavigate = (hash) => {
  const needsSidebar = sidebarPages.includes(hash);
  const sidebarEl = document.getElementById('app-sidebar') || document.getElementById('sidebar');
  const mainEl = document.getElementById('page-content');
  const headerEl = document.getElementById('persistent-header');
  
  if (sidebarEl) {
    if (needsSidebar) {
      sidebarEl.classList.remove('-translate-x-full');
      sidebarEl.classList.add('translate-x-0');

      // Update sidebar credits + tier from latest state
      const user = store.getUserSafe();
      const credits = store.get('credits') || 0;
      const tierEl = document.getElementById('sidebar-tier');
      if (tierEl) tierEl.textContent = `${user?.tier || 'Starter'} Tier`;
      const creditsEl = document.getElementById('sidebar-credits');
      if (creditsEl) creditsEl.textContent = `${credits} Credits`;

      // Update sidebar active state
      document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href') || link.getAttribute('data-nav');
        if (href === '#' + hash) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      if(mainEl) {
        mainEl.classList.add('lg:ml-72');
      }

      // Show and update persistent header
      if (headerEl) {
        headerEl.classList.remove('hidden');
        headerEl.classList.add('lg:ml-72');
        updateHeaderContent();
      }
    } else {
      sidebarEl.classList.remove('translate-x-0');
      sidebarEl.classList.add('-translate-x-full');
      if(mainEl) {
        mainEl.classList.remove('lg:ml-72');
      }
      // Hide header on non-sidebar pages (landing)
      if (headerEl) {
        headerEl.classList.add('hidden');
        headerEl.classList.remove('lg:ml-72');
      }
    }
  }
};

// Register routes
router
  .register('/', (c) => {
    renderLanding(c);
  })
  .register('/dashboard', (c) => {
    return renderDashboard(c);
  })
  .register('/marketplace', (c) => {
    return renderMarketplace(c);
  })
  .register('/session', (c) => {
    return renderSession(c);
  })
  .register('/community', (c) => {
    renderCommunity(c);
  })
  .register('/assignments', (c) => {
    renderAssignments(c);
  })
  .register('/profile', (c) => {
    renderProfile(c);
  })
  .register('/settings', (c) => {
    renderSettings(c);
  })
  .register('/mentor-apply', (c) => {
    renderMentorApply(c);
  })
  .register('/referral', (c) => {
    renderReferral(c);
  });

/**
 * Update persistent header content with latest user data.
 * Called once on route change — no DOM churn.
 */
function updateHeaderContent() {
  const headerEl = document.getElementById('persistent-header');
  if (!headerEl) return;

  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const avatar = user?.avatar || 'https://ui-avatars.com/api/?name=U&background=6927ef&color=fff';

  headerEl.innerHTML = `
    <div class="relative max-w-md w-full">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-400 text-lg">search</span>
      <input class="bg-surface-container-low border-none rounded-full pl-10 pr-6 py-2 w-full text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Search skills, mentors..." type="text" />
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-full border border-violet-100 tooltip relative">
        <span class="material-symbols-outlined material-fill text-violet-600 text-sm">generating_tokens</span>
        <span class="text-violet-700 font-bold text-sm" id="header-credits">${credits} Credits</span>
      </div>
      <button class="p-2 text-zinc-500 hover:bg-neutral-100 rounded-full transition-colors relative">
        <span class="material-symbols-outlined">notifications</span>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div class="h-9 w-9 rounded-full overflow-hidden border border-zinc-200">
        <img alt="User avatar" class="w-full h-full object-cover" src="${avatar}" />
      </div>
    </div>
  `;

  // Listen for credit updates
  store.on('credits', (c) => {
    const el = document.getElementById('header-credits');
    if (el) el.textContent = `${c} Credits`;
  });
}

// ─── Bootstrap ──────────────────────────────
(async function bootstrap() {
  // If user has a token, init user data from API
  if (isAuthenticated()) {
    const success = await initUserFromAPI();
    if (!success) {
      // Token invalid or API error — clear and stay on landing
      localStorage.removeItem('token');
    }
  }
  // Render sidebar once
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) {
    sidebarEl.outerHTML = renderSidebar();
    initSidebar();
  }

  // Initialize router (renders the current hash)
  const pageContainer = document.getElementById('page-content');
  if(pageContainer) {
    router.init(pageContainer);
  } else {
    router.init(document.getElementById('app'));
  }

  // Initialize AI chatbot on authenticated pages
  if (isAuthenticated()) {
    initChatbot();
  }
})();
