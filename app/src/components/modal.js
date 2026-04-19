/* ═══════════════════════════════════════════
   SkillSwap+ — Modal Component
   ═══════════════════════════════════════════ */

export function showModal(content, options = {}) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const { onClose, showCloseBtn = true, maxWidth = 'max-w-lg' } = options;

  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="modal-content bg-white rounded-3xl p-8 shadow-2xl ${maxWidth} w-full relative" id="modal-body">
          ${showCloseBtn ? `
            <button id="modal-close-btn" class="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          ` : ''}
          ${content}
        </div>
      </div>
    </div>
  `;

  const closeModal = () => {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.style.animation = 'fadeOut 200ms ease-in forwards';
      setTimeout(() => {
        container.innerHTML = '';
        if (onClose) onClose();
      }, 200);
    }
  };

  // Close on backdrop click
  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop' || e.target.closest('#modal-backdrop') === e.target) {
      closeModal();
    }
  });

  // Close button
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

  return closeModal;
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    const backdrop = container.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.style.animation = 'fadeOut 200ms ease-in forwards';
      setTimeout(() => { container.innerHTML = ''; }, 200);
    }
  }
}
