/* ═══════════════════════════════════════════
   SkillSwap+ — Shared Header Component
   Brutalist craft design — top nav bar
   ═══════════════════════════════════════════ */

import { store } from '../state.js';

/**
 * Renders the persistent top header bar with secondary navigation.
 * Used on all internal (authenticated) pages.
 */
export function renderHeader(headerEl, activeRoute = '/dashboard') {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const userName = user?.name?.split(' ')[0] || 'User';
  const tier = user?.tier || 'Starter';
  const avatar = user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY_tI4gEXrKXB13pAfIYAwxx4cNvjM6o1Io5u7z1fKtStpvdtn0kBkilhBImoJXFnt4Q6_DLzQ_lj3El5aeJZGJIvPSVGYmt70X_RQxhy01typ6nWZR1QmxsXk9I8l7zfuReJDPabj17-czgj5nxpnCPXy7WLqMi2m0OCEol1AQ0-B8-hluIE67CviEoKc-3Acd2mqf8ZQ8vXFHyzUtnmI-MOIXGofzh5Limgui2FmzspmvkpatLkWVxN5cwUVYNp477w_cDNq3us';

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
          <button class="p-2 border-2 border-ink-black hover:bg-surface-container-highest transition-colors" id="header-notif-btn">
            <span class="material-symbols-outlined">notifications</span>
          </button>
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
            <button class="flex items-center gap-3 px-4 py-3 hover:bg-error-container transition-colors w-full text-left text-error" id="header-sign-out-btn">
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
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', () => { dropdown?.classList.add('hidden'); });

  // Sign out handler
  document.getElementById('header-sign-out-btn')?.addEventListener('click', async () => {
    try {
      const { logout } = await import('../services/auth.service.js');
      await logout();
    } catch (e) {
      // Fallback: clear tokens manually
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('skillswap_state');
      window.location.hash = '/';
    }
  });
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
