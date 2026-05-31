/* ═══════════════════════════════════════════
   SkillSwap+ — Community Page
   ═══════════════════════════════════════════ */

import { getFooterHTML } from '../components/footer.js';
import { getCommunityPosts, createCommunityPost, togglePostVote } from '../services/community.service.js';
import { showToast } from '../components/toast.js';
import { store } from '../state.js';

let activeCategory = '';

export function renderCommunity(container) {
  const user = store.getUserSafe();

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col gap-12">
        <section>
          <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-6" style="font-family:'Oswald',sans-serif;">Connect with the Community</h1>
          <p class="font-body-lg text-on-surface-variant max-w-2xl">Share knowledge, showcase projects, and engage with fellow practitioners in the SkillSwap+ network.</p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <!-- Main Posts Feed -->
          <div class="lg:col-span-8 space-y-8">
            <div class="flex gap-2 overflow-x-auto no-scrollbar" id="community-tabs-container">
              ${['All', 'General Discussion', 'UI/UX Craft', 'Frontend Masters', 'Product Strategy', 'Soft Skills', 'Career'].map(t => {
                const matches = (t === 'All' && !activeCategory) || (activeCategory === t);
                return `<button class="community-tab-btn font-label-md text-label-md uppercase border-2 border-ink-black px-4 py-2 ${matches ? 'bg-ink-black text-paper-base' : 'bg-paper-base hover:bg-surface-variant'} whitespace-nowrap" data-category="${t === 'All' ? '' : t}">${t}</button>`;
              }).join('')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="community-posts-feed">
              <div class="col-span-2 text-center py-12 text-on-surface-variant font-label-lg">Loading discussions...</div>
            </div>
          </div>

          <!-- Sidebar Create Post Form -->
          <div class="lg:col-span-4 space-y-gutter">
            <div class="bg-paper-base border-2 border-ink-black shadow-hard p-6 space-y-6">
              <h3 class="font-headline-sm text-headline-sm uppercase border-b-2 border-ink-black pb-2" style="font-family:'Oswald',sans-serif;">Start a Discussion</h3>
              <form id="create-post-form" class="space-y-4">
                <div class="space-y-1">
                  <label class="font-label-md text-ink-black uppercase block font-bold">Category</label>
                  <select class="w-full bg-paper-base border-2 border-ink-black p-3 font-body-md" id="cp-category">
                    <option value="General Discussion">General Discussion</option>
                    <option value="UI/UX Craft">UI/UX Craft</option>
                    <option value="Frontend Masters">Frontend Masters</option>
                    <option value="Product Strategy">Product Strategy</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Career">Career</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="font-label-md text-ink-black uppercase block font-bold">Title</label>
                  <input class="w-full bg-paper-base border-2 border-ink-black p-3 font-body-md focus:border-rust-accent focus:outline-none" placeholder="Keep it concise..." required type="text" id="cp-title" />
                </div>
                <div class="space-y-1">
                  <label class="font-label-md text-ink-black uppercase block font-bold">Body Content</label>
                  <textarea class="w-full bg-paper-base border-2 border-ink-black p-3 font-body-md focus:border-rust-accent focus:outline-none" placeholder="Describe your topic..." required rows="4" id="cp-body"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="font-label-md text-ink-black uppercase block font-bold">Tags (comma separated)</label>
                  <input class="w-full bg-paper-base border-2 border-ink-black p-3 font-body-md focus:border-rust-accent focus:outline-none" placeholder="figma, react, careers" type="text" id="cp-tags" />
                </div>
                <button type="submit" class="bg-rust-accent text-paper-base border-2 border-ink-black w-full py-3 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all" style="font-family:'Oswald',sans-serif;">Publish Discussion</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  // Fetch and render community posts
  async function loadPosts() {
    const feed = document.getElementById('community-posts-feed');
    if (!feed) return;

    try {
      const res = await getCommunityPosts({
        category: activeCategory
      });
      const posts = res?.posts || [];

      if (posts.length > 0) {
        feed.innerHTML = posts.map(post => {
          const authorInitials = post.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
          const upvotes = post.upvoteCount || 0;
          const comments = post.commentCount || 0;

          return `
            <div class="bg-paper-base border-2 border-ink-black shadow-hard flex flex-col hover:-translate-y-0.5 transition-transform">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed flex justify-between items-center">
                <span class="font-label-md text-label-md uppercase text-ink-black font-bold">${post.category}</span>
                <span class="material-symbols-outlined text-[18px]">forum</span>
              </div>
              <div class="p-6 flex-grow flex flex-col gap-4">
                <h3 class="font-headline-sm text-headline-sm uppercase leading-tight font-bold line-clamp-2" style="font-family:'Oswald',sans-serif;">${post.title}</h3>
                <p class="text-body-md text-on-surface-variant flex-grow line-clamp-3">${post.body}</p>
                
                <div class="flex flex-wrap gap-1">
                  ${(post.tags || []).slice(0, 3).map(tag => `<span class="bg-surface-variant/40 text-label-md font-label-md border border-ink-black/20 px-2 py-0.5 uppercase">${tag}</span>`).join('')}
                </div>

                <div class="flex justify-between items-center pt-4 border-t border-ink-black/10">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full border-2 border-ink-black bg-primary-fixed flex items-center justify-center text-[10px] font-bold" style="font-family:'Oswald',sans-serif;">${authorInitials}</div>
                    <span class="font-label-md text-label-md font-bold">${post.author?.name || 'Practitioner'}</span>
                  </div>
                  
                  <div class="flex items-center gap-4 text-on-surface-variant">
                    <button class="flex items-center gap-1 hover:text-rust-accent vote-post-btn" data-id="${post._id}">
                      <span class="material-symbols-outlined text-[18px]">thumb_up</span>
                      <span class="text-label-md font-label-md font-bold">${upvotes}</span>
                    </button>
                    <div class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-[18px]">chat_bubble</span>
                      <span class="text-label-md font-label-md font-bold">${comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Attach vote listeners
        feed.querySelectorAll('.vote-post-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            try {
              await togglePostVote(id);
              loadPosts();
            } catch (err) {
              showToast(err.message || 'Failed to toggle vote', 'error');
            }
          });
        });
      } else {
        feed.innerHTML = `
          <div class="col-span-2 bg-surface-bright border-dashed border-2 border-ink-black p-12 flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-5xl text-ink-black/20 mb-4">forum</span>
            <p class="text-body-lg font-medium text-ink-black mb-2">No discussions here yet.</p>
            <p class="text-body-md text-on-surface-variant">Be the first to start a conversation in this category!</p>
          </div>
        `;
      }
    } catch (e) {
      feed.innerHTML = `
        <div class="col-span-2 text-center py-12 text-rust-accent font-label-lg">Failed to retrieve discussions: ${e.message}</div>
      `;
    }
  }

  // Handle post creation submission
  document.getElementById('create-post-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'PUBLISHING...';

    const tagsVal = document.getElementById('cp-tags').value;

    try {
      await createCommunityPost({
        title: document.getElementById('cp-title').value,
        body: document.getElementById('cp-body').value,
        category: document.getElementById('cp-category').value,
        tags: tagsVal ? tagsVal.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
      });

      showToast('Discussion published successfully!', 'success');
      document.getElementById('create-post-form').reset();
      loadPosts();
    } catch (err) {
      showToast(err.message || 'Failed to publish post', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Publish Discussion';
    }
  });

  // Handle tab filter clicks
  container.querySelectorAll('.community-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.community-tab-btn').forEach(b => {
        b.classList.remove('bg-ink-black', 'text-paper-base');
        b.classList.add('bg-paper-base', 'hover:bg-surface-variant');
      });
      btn.classList.add('bg-ink-black', 'text-paper-base');
      btn.classList.remove('bg-paper-base', 'hover:bg-surface-variant');

      activeCategory = btn.getAttribute('data-category');
      loadPosts();
    });
  });

  // Initial load
  loadPosts();
}
