/* ═══════════════════════════════════════════
   SkillSwap+ — Shared Header Component
   Brutalist craft design — top nav bar
   ═══════════════════════════════════════════ */

import { store } from '../state.js';
import { getNotifications, markAllAsRead, markAsRead } from '../services/notification.service.js';
import { getCredits } from '../services/credit.service.js';
import { showToast } from '../components/toast.js';

/**
 * Renders the persistent top header bar with secondary navigation.
 * Used on all internal (authenticated) pages.
 */
export function renderHeader(headerEl, activeRoute = '/dashboard') {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const userName = user?.name?.split(' ')[0] || 'User';
  const tier = user?.tier || 'Starter';
  const avatar = user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=6927ef&color=fff';

  const navLinks = [
    { href: '#/dashboard', icon: 'dashboard', label: 'Overview' },
    { href: '#/marketplace', icon: 'storefront', label: 'Marketplace' },
    { href: '#/create-session', icon: 'add_circle', label: 'Create Session' },
    { href: '#/session', icon: 'calendar_today', label: 'Sessions' },
    { href: '#/community', icon: 'groups', label: 'Community' },
    { href: '#/assignments', icon: 'assignment', label: 'Assignments' },
  ];

  headerEl.innerHTML = `
    <!-- Primary Header Row -->
    <div class="px-margin-desktop py-4 flex justify-between items-center w-full">
      <div class="flex items-center gap-8">
        <a href="#/dashboard" class="text-headline-md font-headline-md font-bold text-ink-black uppercase tracking-tighter" style="text-decoration:none;font-family:'Oswald',sans-serif;">SkillSwap+</a>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <!-- Credit Wallet -->
          <div class="hidden xl:flex items-center gap-2 bg-rust-accent text-paper-base px-4 py-2 border-2 border-ink-black font-label-md text-label-md uppercase mr-2">
            <span class="material-symbols-outlined !text-[18px]" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
            <span class="leading-none" id="header-credits">${credits.toLocaleString()} Credits</span>
          </div>
          <!-- Notifications Bell container -->
          <div class="relative">
            <button class="p-2 border-2 border-ink-black hover:bg-surface-container-highest transition-colors relative" id="header-notif-btn">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-rust-accent rounded-full border border-paper-base hidden" id="header-notif-badge"></span>
            </button>
            <!-- Notification Dropdown Menu -->
            <div class="absolute top-full right-0 mt-2 w-80 bg-paper-base border-2 border-ink-black shadow-hard z-50 hidden flex flex-col max-h-[400px] overflow-hidden" id="header-notif-dropdown">
              <div class="p-3 border-b-2 border-ink-black bg-tertiary-fixed flex justify-between items-center">
                <span class="font-headline-sm uppercase text-label-md font-bold" style="font-family:'Oswald',sans-serif;">Notifications</span>
                <button class="text-rust-accent font-label-md text-label-md uppercase font-bold hover:underline" id="header-mark-all-read-btn">Clear All</button>
              </div>
              <div class="overflow-y-auto divide-y divide-ink-black/10 flex-grow" id="header-notif-list">
                <div class="p-4 text-center text-on-surface-variant font-label-md">No new notifications</div>
              </div>
            </div>
          </div>
        </div>
        <!-- User Section with Dropdown -->
        <div class="relative flex items-center gap-3 pl-4 border-l-2 border-ink-black/10" id="user-menu-container">
          <div class="text-right hidden sm:block">
            <p class="font-label-lg text-label-lg uppercase leading-none" id="header-username">${userName}</p>
            <p class="text-label-md text-rust-accent uppercase text-[10px]" id="header-tier">${tier} Tier</p>
          </div>
          <button class="flex items-center gap-1 cursor-pointer" id="user-menu-toggle">
            <img alt="User Profile" class="w-10 h-10 border-2 border-ink-black object-cover" id="header-avatar" src="${avatar}" />
            <span class="material-symbols-outlined text-[16px] text-ink-black/50">expand_more</span>
          </button>
          <!-- Dropdown Menu -->
          <div class="absolute top-full right-0 mt-2 w-56 bg-paper-base border-2 border-ink-black shadow-hard z-50 hidden" id="user-dropdown">
            <a href="#/profile" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-ink-black/10" style="text-decoration:none;color:inherit;">
              <span class="material-symbols-outlined text-[18px]">person</span>
              <span class="font-label-md text-label-md uppercase">My Profile</span>
            </a>
            <a href="#/settings" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-ink-black/10" style="text-decoration:none;color:inherit;">
              <span class="material-symbols-outlined text-[18px]">settings</span>
              <span class="font-label-md text-label-md uppercase">Settings</span>
            </a>
            <a href="#/referral" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-ink-black/10" style="text-decoration:none;color:inherit;">
              <span class="material-symbols-outlined text-[18px]">share</span>
              <span class="font-label-md text-label-md uppercase">Refer & Earn</span>
            </a>
            <button class="flex items-center gap-3 px-4 py-3 hover:bg-error-container transition-colors w-full text-left text-error border-none bg-transparent" id="header-sign-out-btn">
              <span class="material-symbols-outlined text-[18px]">logout</span>
              <span class="font-label-md text-label-md uppercase font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Secondary Nav Row -->
    <nav class="bg-paper-base border-t border-ink-black/10 px-margin-desktop flex gap-8 flex-wrap justify-start overflow-x-auto no-scrollbar">
      ${navLinks.map(link => {
        const isActive = '#' + activeRoute === link.href;
        return `
          <a class="py-4 ${isActive ? 'text-rust-accent font-bold active-nav-border' : 'text-ink-black font-medium hover:text-rust-accent transition-colors'} font-label-lg text-label-lg uppercase whitespace-nowrap flex items-center gap-2 nav-link" href="${link.href}" data-route="${link.href.slice(1)}">
            <span class="material-symbols-outlined text-[18px]">${link.icon}</span>
            ${link.label}
          </a>
        `;
      }).join('')}
    </nav>
  `;

  // Toggle user dropdown
  const toggle = document.getElementById('user-menu-toggle');
  const dropdown = document.getElementById('user-dropdown');
  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('hidden');
    notifDropdown?.classList.add('hidden');
  });

  // Toggle notification dropdown
  const notifBtn = document.getElementById('header-notif-btn');
  const notifDropdown = document.getElementById('header-notif-dropdown');
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
    dropdown?.classList.add('hidden');
    if (!notifDropdown?.classList.contains('hidden')) {
      loadHeaderNotifications();
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    dropdown?.classList.add('hidden');
    notifDropdown?.classList.add('hidden');
  });

  // Sign out handler
  document.getElementById('header-sign-out-btn')?.addEventListener('click', async () => {
    try {
      const { logout } = await import('../services/auth.service.js');
      await logout();
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('skillswap_state');
      window.location.hash = '/';
    }
  });

  // Clear all notifications
  document.getElementById('header-mark-all-read-btn')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      await markAllAsRead();
      showToast('Notifications cleared!', 'success');
      loadHeaderNotifications();
    } catch (err) {
      showToast(err.message || 'Failed to clear', 'error');
    }
  });

  // Load unread count initially
  async function loadInitialUnread() {
    try {
      const { notifications, unreadCount } = await getNotifications();
      const badge = document.getElementById('header-notif-badge');
      if (badge) {
        const hasUnread = unreadCount > 0 || notifications.some(n => !n.read);
        if (hasUnread) {
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
    } catch (e) {
      console.warn('[Header] Failed to check notifications:', e);
    }
  }

  // Load notifications log list
  async function loadHeaderNotifications() {
    const listEl = document.getElementById('header-notif-list');
    if (!listEl) return;

    try {
      const { notifications } = await getNotifications();
      const badge = document.getElementById('header-notif-badge');

      if (notifications.length > 0) {
        badge?.classList.add('hidden'); // Clear badge once list is viewed
        listEl.innerHTML = notifications.map(notif => `
          <div class="p-4 hover:bg-surface-container-low transition-colors flex gap-3 cursor-pointer notif-item-click ${notif.read ? 'opacity-60' : 'bg-surface-bright border-l-4 border-rust-accent'}" data-id="${notif._id}">
            <span class="material-symbols-outlined text-[20px] text-rust-accent mt-0.5">${notif.icon || 'notifications'}</span>
            <div>
              <p class="text-body-md text-ink-black leading-tight">${notif.message}</p>
              <p class="text-label-md text-on-surface-variant mt-1">${notif.time || new Date(notif.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        `).join('');

        // Attach click listeners to individual notifications to mark as read
        listEl.querySelectorAll('.notif-item-click').forEach(item => {
          item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const notifId = item.getAttribute('data-id');
            try {
              await markAsRead(notifId);
              loadHeaderNotifications();
            } catch (err) {
              console.warn('[Header] Failed to mark read:', err);
            }
          });
        });
      } else {
        listEl.innerHTML = `<div class="p-8 text-center text-on-surface-variant font-label-md">No notifications yet</div>`;
      }
    } catch (e) {
      listEl.innerHTML = `<div class="p-4 text-center text-rust-accent font-label-md">Failed to load</div>`;
    }
  }

  // Fetch real credits periodically or on mount
  async function syncCredits() {
    try {
      const { credits } = await getCredits();
      store.setCredits(credits);
      const creditsEl = document.getElementById('header-credits');
      if (creditsEl) creditsEl.textContent = `${credits.toLocaleString()} Credits`;
    } catch (e) {
      console.warn('[Header] Failed to sync credits:', e);
    }
  }

  // Invoke initial checks
  loadInitialUnread();
  syncCredits();
}

/**
 * Updates header data (credits, name, etc) without full re-render.
 */
export function updateHeaderData() {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;

  const creditsEl = document.getElementById('header-credits');
  if (creditsEl) creditsEl.textContent = `${credits.toLocaleString()} Credits`;

  const nameEl = document.getElementById('header-username');
  if (nameEl) nameEl.textContent = user?.name?.split(' ')[0] || 'User';

  const tierEl = document.getElementById('header-tier');
  if (tierEl) tierEl.textContent = `${user?.tier || 'Starter'} Tier`;
}

/**
 * Updates the active nav link highlight.
 */
export function setActiveNavLink(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkRoute = link.getAttribute('data-route');
    if (linkRoute === route) {
      link.classList.add('text-rust-accent', 'font-bold', 'active-nav-border');
      link.classList.remove('text-ink-black', 'font-medium', 'hover:text-rust-accent');
    } else {
      link.classList.remove('text-rust-accent', 'font-bold', 'active-nav-border');
      link.classList.add('text-ink-black', 'font-medium', 'hover:text-rust-accent');
    }
  });
}
