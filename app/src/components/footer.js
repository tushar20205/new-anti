/* ═══════════════════════════════════════════
   SkillSwap+ — Shared Footer Component
   Brutalist craft design — dark footer + marquee
   ═══════════════════════════════════════════ */

/**
 * Returns the shared footer HTML string.
 * Used on all pages for consistency.
 */
export function getFooterHTML() {
  return `
    <footer class="w-full bg-[#1a1108] text-[#F4EBD7]">
      <div class="max-w-[1280px] mx-auto px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col gap-1 text-center md:text-left">
          <span class="font-headline-md text-headline-md font-bold tracking-tighter">SkillSwap+</span>
          <p class="font-label-md text-label-md opacity-60 uppercase">© 2024 SKILLSWAP+. FORGED IN CRAFT.</p>
        </div>
        <nav class="flex flex-wrap justify-center gap-8">
          <a class="font-label-lg text-label-lg uppercase border-b-2 border-[#F4EBD7] hover:text-rust-accent hover:border-rust-accent transition-colors" href="#">PRIVACY POLICY</a>
          <a class="font-label-lg text-label-lg uppercase border-b-2 border-[#F4EBD7] hover:text-rust-accent hover:border-rust-accent transition-colors" href="#">TERMS OF SERVICE</a>
          <a class="font-label-lg text-label-lg uppercase border-b-2 border-[#F4EBD7] hover:text-rust-accent hover:border-rust-accent transition-colors" href="#">SUPPORT</a>
        </nav>
      </div>
      <!-- Marquee Bar -->
      <div class="bg-[#b84915] overflow-hidden whitespace-nowrap border-t border-paper-base/10 py-1.5">
        <div class="flex animate-marquee gap-8 items-center">
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">BOOK A SESSION</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">SHARE YOUR CRAFT</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">EARN CREDITS</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">BUILD THE FUTURE</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">BOOK A SESSION</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">SHARE YOUR CRAFT</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">EARN CREDITS</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
          <span class="uppercase font-bold text-[#F4EBD7] font-label-lg text-label-lg">BUILD THE FUTURE</span>
          <span class="material-symbols-outlined text-[16px] text-[#F4EBD7]">radio_button_unchecked</span>
        </div>
      </div>
    </footer>
  `;
}
