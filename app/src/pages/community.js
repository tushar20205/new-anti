/* ═══════════════════════════════════════════
   SkillSwap+ — Community Page
   ═══════════════════════════════════════════ */
import { getFooterHTML } from '../components/footer.js';

export function renderCommunity(container) {
  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Connect with the Community</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">Share knowledge, showcase projects, and engage with fellow practitioners in the SkillSwap+ network.</p>
        </section>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          ${['All', 'Discussions', 'Show & Tell', 'Resources', 'Events'].map((t, i) => `
            <button class="font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 ${i === 0 ? 'bg-ink-black text-paper-base' : 'bg-paper-base hover:bg-surface-variant'} whitespace-nowrap">${t}</button>
          `).join('')}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          ${[
            { title: 'Best Practices for Design Systems', user: 'Elena R.', tag: 'Discussion', icon: 'forum', replies: 24 },
            { title: 'My Portfolio Redesign Journey', user: 'Marcus T.', tag: 'Show & Tell', icon: 'palette', replies: 18 },
            { title: 'Free Resources for React Devs', user: 'Sarah J.', tag: 'Resources', icon: 'library_books', replies: 42 },
            { title: 'Upcoming AI Workshop — Join!', user: 'Admin', tag: 'Events', icon: 'event', replies: 8 },
            { title: 'How I Landed My Dream Job', user: 'Priya K.', tag: 'Discussion', icon: 'work', replies: 31 },
            { title: 'Code Review Best Practices', user: 'Alex M.', tag: 'Resources', icon: 'code', replies: 15 }
          ].map(post => `
            <div class="bg-paper-base border-2 border-ink-black shadow-hard flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed flex justify-between items-center">
                <span class="font-label-md text-label-md uppercase text-ink-black">${post.tag}</span>
                <span class="material-symbols-outlined text-[18px]">${post.icon}</span>
              </div>
              <div class="p-6 flex-grow flex flex-col gap-4">
                <h3 class="font-headline-sm text-headline-sm uppercase leading-tight" style="font-family:'Oswald',sans-serif;">${post.title}</h3>
                <p class="text-body-md text-on-surface-variant flex-grow">Join the conversation and share your insights with the community.</p>
                <div class="flex justify-between items-center pt-4 border-t border-ink-black/10">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full border-2 border-ink-black bg-surface-container flex items-center justify-center text-[10px] font-bold">${post.user.slice(0,2).toUpperCase()}</div>
                    <span class="font-label-md text-label-md">${post.user}</span>
                  </div>
                  <div class="flex items-center gap-1 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[16px]">chat_bubble</span>
                    <span class="text-label-md font-label-md">${post.replies}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;
}
