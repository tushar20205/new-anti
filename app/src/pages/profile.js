/* ═══════════════════════════════════════════
   SkillSwap+ — Profile Page
   ═══════════════════════════════════════════ */
import { store } from '../state.js';
import { getFooterHTML } from '../components/footer.js';
import { showToast } from '../components/toast.js';
import { updateProfile, uploadProfilePicture } from '../services/user.service.js';
import { fetchProfile } from '../services/data.layer.js';

export function renderProfile(container) {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  const name = user?.name || 'User';
  const email = user?.email || 'user@example.com';
  const bio = user?.bio || 'No bio set yet.';
  const skills = user?.skills || [];
  const tier = user?.tier || 'Starter';
  const avatar = user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=6927ef&color=fff';

  // Compute total sessions
  const taught = user?.stats?.sessionsTaught || 0;
  const attended = user?.stats?.sessionsAttended || 0;
  const totalSessions = taught + attended;

  container.innerHTML = `
    <div class="bg-surface text-ink-black font-body-md">
      <main class="max-w-[1280px] mx-auto px-margin-desktop py-12">
        <h1 class="font-display-lg text-headline-lg uppercase border-b-2 border-ink-black pb-4 mb-12" style="font-family:'Oswald',sans-serif;">Your Profile</h1>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <!-- Left: Profile Card -->
          <div class="lg:col-span-4 space-y-gutter">
            <div class="bg-paper-base border-2 border-ink-black shadow-hard overflow-hidden">
              <div class="h-32 bg-rust-accent relative">
                <div class="absolute -bottom-12 left-6 group cursor-pointer" id="avatar-container">
                  <img alt="${name}" id="profile-avatar-img" class="w-24 h-24 border-4 border-ink-black object-cover bg-paper-base" src="${avatar}" />
                  <div class="absolute inset-0 bg-ink-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-paper-base transition-opacity border-4 border-ink-black">
                    <span class="material-symbols-outlined text-2xl">upload</span>
                  </div>
                  <input type="file" id="avatar-file-input" accept="image/jpeg,image/png,image/webp" class="hidden" />
                </div>
              </div>
              <div class="pt-16 p-6 space-y-4">
                <div>
                  <h2 class="font-headline-md text-headline-md uppercase" style="font-family:'Oswald',sans-serif;">${name}</h2>
                  <p class="font-label-md text-label-md text-rust-accent uppercase">${tier} Tier</p>
                </div>
                <p class="text-body-md text-on-surface-variant">${bio || 'Tell us about yourself...'}</p>
                <div class="border-t-2 border-ink-black pt-4 flex justify-between text-center">
                  <div><p class="font-headline-sm text-headline-sm" style="font-family:'Oswald',sans-serif;">${credits}</p><p class="font-label-md text-label-md uppercase text-on-surface-variant">Credits</p></div>
                  <div><p class="font-headline-sm text-headline-sm" style="font-family:'Oswald',sans-serif;">${totalSessions}</p><p class="font-label-md text-label-md uppercase text-on-surface-variant">Sessions</p></div>
                  <div><p class="font-headline-sm text-headline-sm" style="font-family:'Oswald',sans-serif;">${user.ratingCount || 0}</p><p class="font-label-md text-label-md uppercase text-on-surface-variant">Reviews</p></div>
                </div>
              </div>
            </div>
            <a href="#/settings" class="bg-paper-base border-2 border-ink-black p-4 font-headline-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 w-full" style="text-decoration:none;font-family:'Oswald',sans-serif;">
              <span class="material-symbols-outlined">settings</span> Account Settings
            </a>
          </div>

          <!-- Right: Content -->
          <div class="lg:col-span-8 space-y-gutter">
            <!-- Skills -->
            <section class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed flex justify-between items-center">
                <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Your Skills</h3>
                <span class="font-label-md text-label-md uppercase text-on-surface-variant">${skills.length} skills listed</span>
              </div>
              <div class="p-6 space-y-6">
                <!-- Manage skills -->
                <div class="flex gap-4 items-end flex-wrap bg-surface p-4 border border-ink-black/10">
                  <div class="flex-grow space-y-1">
                    <label class="font-label-md text-label-md uppercase font-bold text-on-surface-variant">Add a Skill</label>
                    <input class="w-full bg-paper-base border-2 border-ink-black px-3 py-2 font-body-md focus:border-rust-accent focus:outline-none" placeholder="e.g. Figma, React, Python..." type="text" id="new-skill-input" />
                  </div>
                  <div class="w-32 space-y-1">
                    <label class="font-label-md text-label-md uppercase font-bold text-on-surface-variant">Level %</label>
                    <input class="w-full bg-paper-base border-2 border-ink-black px-3 py-2 font-body-md focus:border-rust-accent" type="number" min="1" max="100" value="80" id="new-skill-level" />
                  </div>
                  <button class="bg-rust-accent text-paper-base border-2 border-ink-black font-label-lg uppercase px-6 py-2 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap" id="add-skill-btn">Add</button>
                </div>

                <div id="skills-list-container">
                  ${skills.length > 0 ? `
                    <div class="flex flex-wrap gap-3">
                      ${skills.map(s => `
                        <div class="flex items-center gap-2 border-2 border-ink-black px-3 py-1 bg-secondary-fixed font-label-md text-label-md uppercase font-bold">
                          <span>${s.name} (${s.level}%)</span>
                          <button class="text-rust-accent font-bold hover:text-ink-black remove-skill-btn" data-skill="${s.name}">×</button>
                        </div>
                      `).join('')}
                    </div>
                  ` : `
                    <div class="border-dashed border-2 border-ink-black p-8 text-center" id="empty-skills-view">
                      <span class="material-symbols-outlined text-4xl text-ink-black/20 mb-4 block">psychology</span>
                      <p class="text-body-md text-on-surface-variant">No skills listed yet. Add your expertise to get booked!</p>
                    </div>
                  `}
                </div>
              </div>
            </section>

            <!-- Account Info -->
            <section class="bg-paper-base border-2 border-ink-black shadow-hard">
              <div class="p-4 border-b-2 border-ink-black bg-tertiary-fixed">
                <h3 class="font-headline-sm text-headline-sm uppercase" style="font-family:'Oswald',sans-serif;">Account Information</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p class="font-label-md text-label-md uppercase text-on-surface-variant mb-1">Full Name</p><p class="font-body-lg border-2 border-ink-black/20 p-3 bg-surface-container-low font-bold">${name}</p></div>
                  <div><p class="font-label-md text-label-md uppercase text-on-surface-variant mb-1">Email</p><p class="font-body-lg border-2 border-ink-black/20 p-3 bg-surface-container-low">${email}</p></div>
                </div>
                <div><p class="font-label-md text-label-md uppercase text-on-surface-variant mb-1">Bio</p><p class="font-body-md border-2 border-ink-black/20 p-3 bg-surface-container-low min-h-[80px]">${bio || 'No bio written yet.'}</p></div>
              </div>
            </section>
          </div>
        </div>
      </main>
      ${getFooterHTML()}
    </div>
  `;

  // Handle avatar upload click
  const avatarContainer = document.getElementById('avatar-container');
  const fileInput = document.getElementById('avatar-file-input');

  avatarContainer?.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate loading toast
    showToast('Uploading profile picture...', 'info');

    try {
      const pictureUrl = await uploadProfilePicture(file);
      document.getElementById('profile-avatar-img').src = pictureUrl;
      showToast('Profile picture updated successfully!', 'success');
      // Sync state from server profile
      await fetchProfile();
    } catch (err) {
      showToast(err.message || 'Failed to upload profile picture', 'error');
    }
  });

  // Handle skill adding
  document.getElementById('add-skill-btn')?.addEventListener('click', async () => {
    const skillInput = document.getElementById('new-skill-input');
    const skillLevel = document.getElementById('new-skill-level');
    const skillName = skillInput.value.trim();

    if (!skillName) {
      showToast('Please type a skill name', 'error');
      return;
    }

    const currentSkills = [...user.skills];
    if (currentSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      showToast('Skill already exists', 'error');
      return;
    }

    const newSkillObj = { name: skillName, level: Number(skillLevel.value) };
    const apiSkillsOffered = [...skills, newSkillObj];

    try {
      showToast('Adding skill...', 'info');
      await updateProfile({
        skillsOffered: apiSkillsOffered
      });
      showToast('Skill added!', 'success');
      // Refresh profile data
      await fetchProfile();
      renderProfile(container);
    } catch (err) {
      showToast(err.message || 'Failed to add skill', 'error');
    }
  });

  // Handle skill deletion
  container.querySelectorAll('.remove-skill-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const skillName = btn.getAttribute('data-skill');
      const apiSkillsOffered = skills.filter(s => s.name !== skillName);

      try {
        showToast('Removing skill...', 'info');
        await updateProfile({
          skillsOffered: apiSkillsOffered
        });
        showToast('Skill removed!', 'success');
        await fetchProfile();
        renderProfile(container);
      } catch (err) {
        showToast(err.message || 'Failed to remove skill', 'error');
      }
    });
  });
}
