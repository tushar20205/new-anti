/* ═══════════════════════════════════════════
   SkillSwap+ — Community Discussion Page
   ═══════════════════════════════════════════ */

import { store } from '../state.js';

const postsData = [
  {
    id: 'p1',
    author: 'Elena Vance',
    authorImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3IJMr_YI6p8moQGbnLySXGdhG1nZ5G06ciRLO9V0DLWITxTLQaE6kQPGLa0vPqayU6OFQcReLvV9xWLBjvAWesloL6qDRwdc6M0re5LwklkQUetVorgcxy6xdL6hNqdbXvBosWiXFh4DT9a584hbdy_yjC1iCSTDTefa4yjO1WEIcdje6j4YakZh38yBeXAT6ncDIF3SCYo-pOkNPfuVYruo2gzZ73Y9WbQEB0f516QGOG_ikNvEZBzxoGvdIfGI2eKUwPY0RhA',
    isMentor: true,
    isPinned: true,
    title: 'Essential Grid Systems for Modern Responsive Design',
    body: "I've compiled a list of the top 5 grid strategies that work for both Figma handoffs and Tailwind implementation. This has saved our team hours of back-and-forth...",
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2vecxP_rEQ3xeHZebnZzXnNQTdVLMZK28fNKsPQctpBmVdP718hQeCGciYonOO9RwZ1VRT2LL0bLb_PCMWlSk9BkojZtMmPGsfeouZdmB0db5-JmH1bc80hSnlrA6AtIb7Dww7IIyqcAHcUJYHg3VfhRRpX6zLtXfS2q8xoeg2YUrDRhqJhi5XXzdR4GXR0HKttWfb4IyRhOTDeShykbOqRc3ok6ylrk_oPJpiU75BRlCWuanE7YSMI6ac-sSB3lmS8akNNw5pA',
    upvotes: 128,
    replies: 24,
    time: '2h ago',
    channel: 'General Discussion'
  },
  {
    id: 'p2',
    author: 'Marcus Chen',
    authorImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF749dFim6lHRyEyOq9Nao64C8jDFT7uwcCNMIjfPpUyY6QkKYQdCoHekPq5tgOJmqPSO4SiLROtBnCxQpnWEhyRDdp5-S-fwh-zPcaT14CpPug27NzPwfN-y8zBJIzW3ahYF6XJ8afcPQf-0IXcyERtTUrVok8w_5i01fEkvyRhABhnncZJB12az96WHSQH1gh_gu1Xb9T8rQCekeTjG4I2ZGIJqVVhRvy0rncKa-kGSmRKTfIkcXcPLpNvgE4siQzaKwqRS7fA',
    isMentor: false,
    isPinned: false,
    title: 'How to manage complex states in React without Redux?',
    body: "I'm building a dashboard that needs to sync filters, user preferences, and real-time data. Is Context API enough or should I jump to Zustand?",
    img: null,
    upvotes: 42,
    replies: 12,
    time: '5h ago',
    channel: 'Frontend Masters',
    solved: {
      author: 'Sophia Ray',
      authorImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ni26Zu6oe-QnDvKKa6OkbFcg_eSn6KkPOCWYjUJpi7SpZ9C2TzQvzbB4kpHzAg5DJet_D_5HKZAGASE-7uszW3mZbkSlGINpwewEXQtmzWLI57E_MJ0roAcxScEUP9AEy03il9LsFqgOJwvqUSaNzmd1qiMNaPc2QZQ5Agmz1wbiH1QjkhtNCMo49ycguaWzDrFvRw8qk-yA7n4qC2xXtUPsMXBZ1hc75eUxaJU-EVlPew79bs6oajSMXaob_y_SMREHeUhLfQ',
      isMentor: true,
      body: "Zustand is definitely the way to go for this scale. Much cleaner than Context and less boilerplate than Redux. I can share a boilerplate if you'd like!",
      helpful: 18,
      time: '2h ago'
    },
    threadReply: {
      author: 'Sarah Jenkins',
      authorImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdCcHllJqp3xFyuoRi42w88uXYaS-PwPEkUL4ELKbaOcozO38AaVvcBRylGZTkFH7_9jq8B5JTKpCcRVmEOptY2y2tNp2WAseHJfCPQYJd5XtxEPWqMPTtYIi8VXuxy3UP_xfM_F1VDmcaIe_ZS282--U98xPpUAFUeY65sa7G1gvx2qnkddiFQnuYdP2rbGu0pVP_vcczawzYCP5Nnyd6xK8RBbN_nr1QuIfRi2eqY1CYGC2W5-8NmAhnk4mRVihNso7Nmo9IYQ',
      body: 'I agree with Sophia. Context is great for static values like themes, but for dynamic dashboard state, Zustand\'s selectors prevent unnecessary re-renders.',
      time: '3h ago'
    }
  }
];

export function renderCommunity(container) {
  container.innerHTML = `
    <div class="pt-8 pb-20 max-w-[1400px] mx-auto px-8 grid grid-cols-12 gap-8">
      <!-- Left Sidebar -->
      <aside class="hidden lg:block col-span-3 h-[calc(100vh-120px)] sticky top-8 overflow-y-auto no-scrollbar">
        <div class="flex flex-col space-y-3 p-1 stagger-children">
          <h3 class="text-[10px] font-bold tracking-[0.2em] text-outline px-4 mb-2 uppercase">Channels</h3>
          ${[
            { icon: 'grid_view', label: 'General Discussion', active: true },
            { icon: 'design_services', label: 'UI/UX Craft', active: false },
            { icon: 'code', label: 'Frontend Masters', active: false },
            { icon: 'analytics', label: 'Product Strategy', active: false },
            { icon: 'psychology', label: 'Soft Skills', active: false }
          ].map(c => `
            <div class="group flex items-center gap-3 ${c.active ? 'bg-white shadow-sm text-violet-600 rounded-full' : 'text-zinc-500 hover:bg-zinc-100/50 hover:translate-x-1 rounded-full'} px-4 py-3 cursor-pointer transition-all">
              <span class="material-symbols-outlined ${c.active ? '' : 'text-outline'}">${c.icon}</span>
              <span class="${c.active ? 'font-semibold' : 'font-medium'} text-sm">${c.label}</span>
            </div>
          `).join('')}

          <div class="pt-8 mb-4">
            <h3 class="text-[10px] font-bold tracking-[0.2em] text-outline px-4 mb-2 uppercase">My Groups</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3 px-4 py-1 text-sm text-zinc-500 hover:text-primary transition-colors cursor-pointer">
                <span class="w-2 h-2 rounded-full bg-secondary"></span>
                <span>Advanced Typography</span>
              </div>
              <div class="flex items-center gap-3 px-4 py-1 text-sm text-zinc-500 hover:text-primary transition-colors cursor-pointer">
                <span class="w-2 h-2 rounded-full bg-primary-container"></span>
                <span>React Ecosystem</span>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-8">
            <a href="#/mentor-apply" class="block w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white text-center font-semibold shadow-lg shadow-primary/20 btn-press">Become a Mentor</a>
          </div>
        </div>
      </aside>

      <!-- Main Feed -->
      <section class="col-span-12 lg:col-span-6 space-y-6 stagger-children">
        <!-- Create Post -->
        <div class="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/15">
          <div class="flex gap-4">
            <img alt="You" class="w-10 h-10 rounded-full" src="${store.getUserSafe().avatar || 'https://ui-avatars.com/api/?name=U'}" />
            <button class="flex-1 text-left px-6 py-3 bg-surface-container-low rounded-full text-zinc-400 text-sm hover:bg-surface-container-high transition-colors">
              Share a resource or ask a question...
            </button>
            <div class="flex items-center gap-1">
              <button class="p-2 text-zinc-500 hover:bg-zinc-100/50 rounded-full transition-colors"><span class="material-symbols-outlined">image</span></button>
              <button class="p-2 text-zinc-500 hover:bg-zinc-100/50 rounded-full transition-colors"><span class="material-symbols-outlined">link</span></button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex gap-4 px-2">
          <button class="tab-item tab-active text-xs font-bold tracking-widest uppercase pb-1">Trending</button>
          <button class="tab-item text-xs font-bold tracking-widest uppercase text-outline pb-1">Newest</button>
          <button class="tab-item text-xs font-bold tracking-widest uppercase text-outline pb-1">Following</button>
        </div>

        <!-- Posts -->
        ${(!postsData || postsData.length === 0) ? `
          <div class="bg-surface-container-lowest rounded-lg border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col items-center justify-center py-16 text-center">
            <div class="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-3xl text-zinc-400">forum</span>
            </div>
            <h4 class="text-lg font-black text-zinc-900 mb-1">No posts yet</h4>
            <p class="text-zinc-500 font-medium text-sm mb-6">Be the first to share something with the community.</p>
            <button class="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 btn-press">Create Post</button>
          </div>
        ` : postsData.map(post => `
          <div class="bg-surface-container-lowest rounded-lg border border-outline-variant/15 shadow-sm overflow-hidden">
            ${post.isPinned ? `
              <div class="bg-violet-50/50 px-6 py-2 flex items-center gap-2 border-b border-violet-100/50">
                <span class="material-symbols-outlined material-fill text-[18px] text-primary">keep</span>
                <span class="text-[10px] font-bold tracking-widest uppercase text-primary">Pinned by Mentor</span>
              </div>
            ` : ''}
            <div class="p-6 flex gap-6">
              <!-- Voting -->
              <div class="flex flex-col items-center gap-1 bg-surface-container-low rounded-full p-1 h-fit">
                <button class="upvote-btn p-1 hover:text-primary transition-colors" data-post-id="${post.id}">
                  <span class="material-symbols-outlined">keyboard_arrow_up</span>
                </button>
                <span class="text-sm font-bold upvote-count" data-post-id="${post.id}">${post.upvotes}</span>
                <button class="p-1 hover:text-error transition-colors">
                  <span class="material-symbols-outlined">keyboard_arrow_down</span>
                </button>
              </div>

              <div class="flex-1">
                <!-- Author -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <img src="${post.authorImg}" class="w-5 h-5 rounded-full" alt="${post.author}" />
                    <span class="font-bold text-sm">${post.author}</span>
                    ${post.isMentor ? '<span class="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">MENTOR</span>' : ''}
                    <span class="text-outline text-xs">• ${post.time}${post.channel ? ` in <span class="text-secondary font-medium">${post.channel}</span>` : ''}</span>
                  </div>
                  <button class="text-outline hover:text-on-surface transition-colors"><span class="material-symbols-outlined">more_horiz</span></button>
                </div>

                <h2 class="text-xl font-bold mb-3 tracking-tight">${post.title}</h2>
                <p class="text-on-surface-variant leading-relaxed mb-4">${post.body}</p>

                ${post.img ? `
                  <div class="relative rounded-xl overflow-hidden mb-4 border border-outline-variant/10">
                    <img alt="${post.title}" class="w-full h-48 object-cover" src="${post.img}" />
                  </div>
                ` : ''}

                <div class="flex gap-6 ${post.solved ? 'mb-6' : ''}">
                  <button class="flex items-center gap-2 text-outline text-sm hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-lg">chat_bubble</span>
                    <span>${post.replies} Replies</span>
                  </button>
                  <button class="flex items-center gap-2 text-outline text-sm hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-lg">share</span>
                    <span>Share</span>
                  </button>
                  <button class="flex items-center gap-2 text-outline text-sm hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-lg">bookmark</span>
                    <span>Save</span>
                  </button>
                </div>

                ${post.solved ? `
                  <div class="mt-4 space-y-4">
                    <!-- Solved Answer -->
                    <div class="relative pl-6 border-l-4 border-green-500 bg-green-50/30 p-4 rounded-r-xl">
                      <div class="absolute -left-[14px] top-4 bg-green-500 text-white rounded-full p-1 flex items-center justify-center">
                        <span class="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-[10px] font-black uppercase tracking-widest text-green-700">Solved Answer</span>
                      </div>
                      <div class="flex gap-3">
                        <img alt="${post.solved.author}" class="w-8 h-8 rounded-full ring-2 ring-white" src="${post.solved.authorImg}" />
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-xs">${post.solved.author}</span>
                            ${post.solved.isMentor ? '<span class="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-black tracking-tighter">MENTOR</span>' : ''}
                            <span class="text-outline text-[10px]">${post.solved.time}</span>
                          </div>
                          <p class="text-xs text-on-surface-variant leading-relaxed">${post.solved.body}</p>
                          <div class="mt-2 flex items-center gap-3">
                            <button class="text-[10px] font-bold text-primary hover:underline">Helpful (${post.solved.helpful})</button>
                            <button class="text-[10px] font-bold text-outline hover:text-on-surface">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    ${post.threadReply ? `
                      <div class="pl-4 border-l-2 border-surface-container">
                        <div class="flex gap-3">
                          <img alt="${post.threadReply.author}" class="w-6 h-6 rounded-full" src="${post.threadReply.authorImg}" />
                          <div class="flex-1 bg-surface-container-low p-3 rounded-xl">
                            <div class="flex items-center gap-2 mb-1">
                              <span class="font-bold text-xs">${post.threadReply.author}</span>
                              <span class="text-outline text-[10px]">${post.threadReply.time}</span>
                            </div>
                            <p class="text-xs text-on-surface-variant">${post.threadReply.body}</p>
                          </div>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </section>

      <!-- Right Sidebar -->
      <aside class="hidden lg:block col-span-3 space-y-6 sticky top-8 h-fit stagger-children">
        <!-- Trending -->
        <div class="bg-surface-container-lowest rounded-lg border border-outline-variant/15 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-surface-container-low"><h3 class="font-bold tracking-tight">Trending Now</h3></div>
          <div class="p-5 space-y-5">
            ${([
              { cat: 'UI Design', title: 'Micro-interactions that increase retention', stats: '458 participants • 2k upvotes' },
              { cat: 'Development', title: 'Next.js 14 App Router: A deep dive', stats: '312 participants • 890 upvotes' },
              { cat: 'Career', title: 'Negotiating your first Senior role', stats: '124 participants • 560 upvotes' }
            ] || []).map(t => `
              <div class="group cursor-pointer">
                <span class="text-[10px] font-bold text-outline uppercase tracking-widest">${t.cat}</span>
                <h4 class="text-sm font-bold group-hover:text-primary transition-colors leading-snug mt-1">${t.title}</h4>
                <p class="text-[10px] text-outline mt-1.5">${t.stats}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Community Stats -->
        <div class="bg-gradient-to-br from-violet-600 to-indigo-500 rounded-lg p-6 text-white shadow-xl shadow-indigo-500/20">
          <h4 class="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-80">Network Reach</h4>
          <div class="flex items-end justify-between">
            <div>
              <span class="text-3xl font-black tracking-tighter">12.4k</span>
              <p class="text-[10px] opacity-70">ACTIVE USERS TODAY</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `;

  // Upvote functionality
  document.querySelectorAll('.upvote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const postId = btn.dataset.postId;
      const countEl = document.querySelector(`.upvote-count[data-post-id="${postId}"]`);
      if (countEl) {
        const current = parseInt(countEl.textContent);
        countEl.textContent = current + 1;
        btn.querySelector('.material-symbols-outlined').classList.add('material-fill', 'text-primary');
      }
    });
  });
}
