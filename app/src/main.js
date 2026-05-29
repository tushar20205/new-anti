/* ═══════════════════════════════════════════
   SkillSwap+ — Main Application Entry
   Brutalist Craft Design — Top Nav Layout
   ═══════════════════════════════════════════ */

import { router } from './router.js';
import { store } from './state.js';
import { isAuthenticated } from './services/auth.service.js';
import { fetchProfile } from './services/data.layer.js';
import { renderHeader } from './components/header.js';
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
import { renderCreateSession } from './pages/create-session.js';
import { renderReferral } from './pages/referral.js';

// Pages that use the persistent header
const headerPages = ['/dashboard', '/marketplace', '/session', '/community', '/assignments', '/profile', '/settings', '/mentor-apply', '/create-session', '/referral'];

/**
 * Fetch the user profile from API and populate state.
 */
async function initUserFromAPI() {
  if (!isAuthenticated()) return false;
  const res = await fetchProfile();
  return !res.error;
}

// Router setup
router.onBeforeNavigate = (hash) => {
  // CRITICAL: Always remove scroll-lock from landing page animation
  document.documentElement.classList.remove('scroll-locked');
  document.body.classList.remove('scroll-locked');
  document.body.classList.remove('modal-open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';

  const needsHeader = headerPages.includes(hash);
  const headerEl = document.getElementById('persistent-header');

  if (headerEl) {
    if (needsHeader) {
      headerEl.classList.remove('hidden');
      renderHeader(headerEl, hash);
    } else {
      headerEl.classList.add('hidden');
      headerEl.innerHTML = '';
    }
  }
};

// Register routes
router
  .register('/', (c) => {
    return renderLanding(c);
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
    return renderCommunity(c);
  })
  .register('/assignments', (c) => {
    return renderAssignments(c);
  })
  .register('/profile', (c) => {
    return renderProfile(c);
  })
  .register('/settings', (c) => {
    return renderSettings(c);
  })
  .register('/mentor-apply', (c) => {
    return renderMentorApply(c);
  })
  .register('/create-session', (c) => {
    return renderCreateSession(c);
  })
  .register('/referral', (c) => {
    return renderReferral(c);
  });

// ─── Bootstrap ──────────────────────────────
(async function bootstrap() {
  // If user has a token, init user data from API
  if (isAuthenticated()) {
    const success = await initUserFromAPI();
    if (!success) {
      localStorage.removeItem('token');
    }
  }

  // Initialize router (renders the current hash)
  const pageContainer = document.getElementById('page-content');
  if (pageContainer) {
    router.init(pageContainer);
  } else {
    router.init(document.getElementById('app'));
  }

  // Initialize AI chatbot on authenticated pages
  if (isAuthenticated()) {
    initChatbot();
  }
})();
