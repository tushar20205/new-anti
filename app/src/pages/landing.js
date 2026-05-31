/* ═══════════════════════════════════════════
   SkillSwap+ — Landing Page
   Dark Brutalist Theme with Scroll-Lock Animation
   ═══════════════════════════════════════════ */

import { register, login, googleLogin, isAuthenticated, setTokens } from '../services/auth.service.js';
import { getProfile } from '../services/user.service.js';
import { store } from '../state.js';
import { showToast } from '../components/toast.js';

// Preload animation frames globally
const imageCount = 192;
const images = [];
let preloaded = false;

function preloadFrames() {
  if (preloaded) return;
  preloaded = true;
  for (let i = 1; i <= imageCount; i++) {
    const img = new Image();
    const paddedIndex = String(i).padStart(3, '0');
    img.src = `/assets/animation/ezgif-frame-${paddedIndex}.jpg`;
    images.push(img);
  }
}

export function renderLanding(container) {
  if (isAuthenticated()) {
    window.location.hash = '/dashboard';
    return;
  }

  preloadFrames();

  container.innerHTML = `
    <style>
      .landing-dark { background: #131313; color: #e4e2e1; font-family: 'Inter', sans-serif; }
      .landing-dark .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
      }
      .glass-auth-landing {
        background: rgba(31, 32, 32, 0.7);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .landing-reveal {
        opacity: 0; transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .landing-reveal.active { opacity: 1; transform: translateY(0); }
      .landing-category-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      .landing-category-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); }
      .modal-open { overflow: hidden; }
      .scroll-locked { overflow: hidden !important; height: 100vh !important; }
      @keyframes marquee-landing { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee-landing { animation: marquee-landing 20s linear infinite; }
      /* Progress bar for scroll animation */
      #scroll-progress-bar {
        position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
        width: 200px; height: 4px; background: rgba(255,255,255,0.1); z-index: 20;
        border-radius: 2px; overflow: hidden;
      }
      #scroll-progress-fill {
        height: 100%; width: 0%; background: #ffb599; transition: width 0.1s linear;
        border-radius: 2px;
      }
    </style>

    <div class="landing-dark min-h-screen w-full overflow-x-clip">
      <!-- Navigation -->
      <nav class="fixed top-0 w-full z-[60] h-20 flex items-center transition-all duration-500" id="landing-nav">
        <div class="flex justify-between items-center px-5 md:px-16 w-full max-w-[1280px] mx-auto">
          <div class="text-3xl md:text-4xl text-[#e4e2e1] tracking-tight" style="font-family:'Oswald',sans-serif;">
            SkillSwap<span class="text-[#ffb599]">+</span>
          </div>
          <div class="flex items-center gap-3">
            <button class="border border-[#ffb599]/40 text-[#ffb599] px-6 py-2 rounded-full font-bold text-sm hover:bg-[#ffb599]/10 transition-all" id="landing-demo-nav">
              Demo Login
            </button>
            <button class="bg-[#ffb599] text-[#5a1c00] px-8 py-2.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg" id="landing-get-started-nav">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        <!-- Hero Section -->
        <section class="relative h-screen flex items-center justify-center overflow-hidden">
          <div class="absolute inset-0 bg-[#131313]/40 z-[1]"></div>
          <video autoplay loop muted playsinline class="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 z-0" style="filter: brightness(0.3) contrast(1.1);">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-business-people-working-together-in-a-modern-office-4334-large.mp4" type="video/mp4" />
          </video>
          <div class="relative z-10 text-center px-5 max-w-5xl">
            <div class="landing-reveal active">
              <h1 class="text-5xl md:text-8xl text-[#e4e2e1] leading-[1.1] mb-4" style="font-family:'Oswald',sans-serif;">
                Learn Anything.<br/>
                Teach Everything.<br/>
                <span class="text-[#ffb599]">Earn Credits.</span>
              </h1>
              <p class="text-xl text-[#dfc0b5] max-w-2xl mx-auto mb-8">
                The elite peer-to-peer exchange for high-stakes professional mastery. Trade your expertise for the skills you need.
              </p>
              <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button class="w-full md:w-auto px-10 py-4 bg-[#ffb599] text-[#5a1c00] font-bold rounded-full hover:scale-105 transition-all shadow-xl" id="landing-hero-cta">
                  Launch Your Exchange
                </button>
                <button class="w-full md:w-auto px-10 py-4 border border-[#a68b81]/30 bg-[#131313]/20 backdrop-blur-md text-[#e4e2e1] font-bold rounded-full hover:bg-[#131313]/40 transition-all" id="landing-demo-hero">
                  Try Demo
                </button>
              </div>
            </div>
          </div>
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-50">
            <span class="material-symbols-outlined animate-bounce text-[#e4e2e1]">keyboard_double_arrow_down</span>
          </div>
        </section>

        <!-- Scroll-Locked Animation Section (Native Scroll via Sticky) -->
        <section id="scroll-animation-section" class="relative w-full h-[400vh]" style="background:#0a0a0a;">
          <div class="sticky top-0 w-full h-screen overflow-hidden">
            <canvas id="scroll-canvas" class="absolute inset-0 w-full h-full" style="object-fit:contain;"></canvas>
            <!-- Scroll hint -->
            <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20" id="scroll-hint">
              <span class="text-xs uppercase tracking-[0.2em] font-bold text-white/50" style="font-family:'JetBrains Mono',monospace;">Scroll to Explore</span>
              <span class="material-symbols-outlined text-white/50 animate-bounce">keyboard_double_arrow_down</span>
            </div>
            <!-- Progress bar -->
            <div id="scroll-progress-bar">
              <div id="scroll-progress-fill"></div>
            </div>
          </div>
        </section>

        <!-- Global Network Section -->
        <section class="py-[100px] relative overflow-hidden" style="background:#131313;">
          <div class="px-5 md:px-16 max-w-[1280px] mx-auto">
            <div class="landing-reveal text-center mb-20">
              <h2 class="text-4xl md:text-5xl text-[#e4e2e1] mb-6" style="font-family:'Oswald',sans-serif;">A Global Network of Mastery</h2>
              <p class="text-[#dfc0b5] max-w-2xl mx-auto">Connecting 140,000+ practitioners across 140 countries in real-time knowledge exchange.</p>
            </div>
            <div class="relative rounded-3xl overflow-hidden border border-[#58423a]/30">
              <img alt="Global learning connections map" class="w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ui3c2tE0zLliJuY1ohS3gppqS8TrYcPIu_2PxW-5A0YZpLJWdN9uZxpUxLjbgKcuc_UfAUuO_GO0kiy3Xy4qJpSLbGvefVpW8TPKdKcnqrTsX6y4MEsqGEHGDrqPe8XZLuDNY9TNUhJUY0c4LLDg8MmWWPeq4FGSzn5yb0CtFocQDVLSAD09Lix0Cn47_YVL6qXO0WBMCAQveKCJOHuuRSbjTOf9NeaVTZpmVQnZkR1wTjH8gDIYVMt6g" />
              <div class="absolute inset-0 z-10 pointer-events-none">
                <div class="absolute top-1/4 left-1/4 bg-[#131313]/80 backdrop-blur px-3 py-1 rounded text-xs font-bold border border-[#ffb599]/30" style="font-family:'JetBrains Mono',monospace;">UI/UX DESIGN</div>
                <div class="absolute top-1/2 left-1/3 bg-[#131313]/80 backdrop-blur px-3 py-1 rounded text-xs font-bold border border-[#ffb599]/30" style="font-family:'JetBrains Mono',monospace;">PYTHON</div>
                <div class="absolute top-1/3 right-1/4 bg-[#131313]/80 backdrop-blur px-3 py-1 rounded text-xs font-bold border border-[#ffb599]/30" style="font-family:'JetBrains Mono',monospace;">AI TOOLS</div>
                <div class="absolute bottom-1/3 left-1/2 bg-[#131313]/80 backdrop-blur px-3 py-1 rounded text-xs font-bold border border-[#ffb599]/30" style="font-family:'JetBrains Mono',monospace;">DIGITAL MARKETING</div>
                <div class="absolute top-2/3 right-1/3 bg-[#131313]/80 backdrop-blur px-3 py-1 rounded text-xs font-bold border border-[#ffb599]/30" style="font-family:'JetBrains Mono',monospace;">PUBLIC SPEAKING</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Popular Learning Paths -->
        <section class="py-[100px]" style="background:#131313;">
          <div class="px-5 md:px-16 max-w-[1280px] mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div class="landing-reveal">
                <h2 class="text-4xl md:text-5xl text-[#e4e2e1] mb-4" style="font-family:'Oswald',sans-serif;">Popular Learning Paths</h2>
                <p class="text-[#dfc0b5] max-w-xl">Premium curated masterclasses from our global mastery network.</p>
              </div>
              <button class="text-[#ffb599] font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Explore all categories <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${['UI/UX Design', 'Frontend Engineering', 'Data Science', 'Video Engineering', 'Digital Strategy', 'AI Engineering'].map((title, i) => {
                const levels = ['Mastery Level', 'Architect Level', 'Analyst Level', 'Creative Level', 'Growth Level', 'Emerging Level'];
                const exchanges = ['1.2k+', '2.4k+', '3.1k+', '1.5k+', '1.8k+', '900+'];
                const imgs = [
                  'https://lh3.googleusercontent.com/aida/ADBb0uh2XKqPYpXuU2dg0Bxkq1LhTuPoJSsABsu-84LD6hYb38F2in6TK3nO8jY53UGqdUgiQ8qIKhpXWYnVRFuL7SpDox0k4U8cemWHMmYLsEnbSX2CJIdf0JAAtpU4HsVeWArrdeVFRUYKlBV01zMDMB48pmqL3bZvIYHAOvmg8nguKwPGqILykuetZ0dEk4o0z2eSRWfLhcZzYtvq0rFhTvRICSDPkEaARSstASozW5sPFXzF3a3a8g3GQVY',
                  'https://lh3.googleusercontent.com/aida/ADBb0ug0vFNaTTO0R6nSGCp3tXdp8Rd8um80ZCtnwITVMWaIbX2TvUnav0UQRr0qf-o4A2-ydsgL_QnGDMeP40D0KHffWO8TtXFapiAKsyHE6B2bCXdUfh2rHsRp0uL619xwsHaZfbap1BUIY31o7ARlVfvCSl1U51Yjw3x3VWU0C4jMHVxVN5kDsFY-K_NVmk5W5XOBbrLvGLkCkCdNbQA42v85lEshes_OK80gT3yMRU9nKcs5lprwx8UybAQ',
                  'https://lh3.googleusercontent.com/aida/ADBb0ui-jJKL-jUW3ScXyw_iTCyUlifk5sXINvHr-mWTbP35z7i85thzFch9_L-b0Oz31AYF3vL_ZnC6u-Eiy9hkXxMIKweHKKzawcbZqg7GqLVX854Sx063pYV8GuGaN3OTMT7Mmcw00rJyjhXNkBcmSphVPUM0eB88xkSkNVizm7bo6lmgLY9LeCwAhgUzkoh9XIXCTOaHLo-riaKkH_sZHTpa7RGaL2wpAAaUDlKc_-xPogGNtkfP5aC4VCA',
                  'https://lh3.googleusercontent.com/aida/ADBb0ug32j1jGENGBRXhFe3e6SAP9qG9r5vI40mVBsjwgk7fhHQX09VGJg2EnKCAeHHx9cZnVpkB33W8wNSbxGgFE3SINcc51tyrRH_thMkGGZFrVnf7LMThQZ1Ur68cMiyJ8e2JvYvXBq8PiGML7E0UCkYTPnHzt3sTERCzDR3Xfvnah3x8rMit7Nxv4KV3w2QRlOTEDvEJuaGvSxVZSePDRwYEsCWR5byPtN6w-4KzCu0qX592_gTtsOrHHg',
                  'https://lh3.googleusercontent.com/aida/ADBb0ujNBce69PbDhWt2AqJJm-l4Awk7cCA47pyPhrTVu03huMGXajiYDeGiKDi7L1RnfQ75dxqq4n0_Qh9ZDxrGVp7nRubiYE2_O7uKEwinUxu-OYuDWUUDPY8go84giL47Gh-y6UOZ6ATWfsIg8_OZvG3ntbBQg2SluLtyoMIOC9VSZNjlcGfm_mEvQYn-ofk7MYMvupNi7ONz0rt_JfbuppIXIKguY36b9NSxBzDuIq0Qv1Ko4-EY3AwDk5g',
                  ''
                ];
                const isCodeCard = i === 5;
                return `
                  <div class="landing-reveal landing-category-card bg-[#2a2a2a] rounded-3xl overflow-hidden border border-[#58423a]/30 flex flex-col h-full">
                    <div class="aspect-video overflow-hidden ${isCodeCard ? 'bg-[#1f2020] flex items-center justify-center p-12' : ''}">
                      ${isCodeCard ? `
                        <div class="w-full aspect-video bg-[#131313] rounded-lg border border-[#58423a]/30 p-4 text-xs overflow-hidden opacity-80" style="font-family:'JetBrains Mono',monospace;">
                          <div class="flex gap-2 mb-4">
                            <div class="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div class="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                            <div class="w-2 h-2 rounded-full bg-green-500/50"></div>
                          </div>
                          <span class="text-[#ffb599]">import</span> torch<br/>
                          <span class="text-[#ffb599]">from</span> transformers <span class="text-[#ffb599]">import</span> AutoModel<br/><br/>
                          <span class="text-[#dfc0b5]">// Initialize Prompt Engineering</span><br/>
                          model = AutoModel.from_pretrained(<span class="text-[#b84915]">"gpt-4-mastery"</span>)<br/>
                          <span class="text-[#ffb599]">def</span> optimize_prompt(input):<br/>
                          &nbsp;&nbsp;return model.generate(input)
                        </div>
                      ` : `
                        <img class="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500" src="${imgs[i]}" alt="${title}" />
                      `}
                    </div>
                    <div class="p-8 flex-grow flex flex-col">
                      <div class="flex items-center justify-between mb-4">
                        <span class="text-[#ffb599] text-xs uppercase tracking-widest" style="font-family:'JetBrains Mono',monospace;">${levels[i]}</span>
                        <span class="text-[#dfc0b5] text-xs">${exchanges[i]} Exchanges</span>
                      </div>
                      <h4 class="text-3xl mb-4 text-[#e4e2e1]" style="font-family:'Oswald',sans-serif;">${title}</h4>
                      <p class="text-[#dfc0b5] text-sm mb-6 flex-grow">Premium curated content from industry-leading practitioners.</p>
                      <div class="h-px bg-[#58423a]/20 w-full mb-6"></div>
                      <button class="text-[#e4e2e1] font-bold text-sm flex items-center gap-2 group">
                        View Curriculum <span class="material-symbols-outlined text-[#ffb599] group-hover:translate-x-1 transition-transform">chevron_right</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- How SkillSwap Works -->
        <section class="py-[100px] overflow-hidden relative" style="background:#1b1c1c;">
          <div class="px-5 md:px-16 max-w-[1280px] mx-auto">
            <div class="landing-reveal text-center mb-24">
              <h2 class="text-4xl md:text-5xl text-[#e4e2e1] mb-6" style="font-family:'Oswald',sans-serif;">How SkillSwap Works</h2>
              <p class="text-[#dfc0b5] max-w-2xl mx-auto">A seamless architecture for modern mastery exchange. No currency, just competence.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              ${[
                { title: 'Seamless Entry', desc: 'Instant verification through LinkedIn or GitHub.', icon: 'login' },
                { title: 'Explore Mastery', desc: 'Browse a global marketplace of elite practitioners.', icon: 'explore' },
                { title: 'Smart Matching', desc: 'Our engine finds the perfect expert-peer for your goals.', icon: 'swap_horiz' },
                { title: 'Live Collaboration', desc: 'Interactive high-fidelity sessions in our custom workspace.', icon: 'videocam' },
                { title: 'Mastery Rewards', desc: 'Accumulate credits to unlock new levels of learning.', icon: 'emoji_events' }
              ].map((step) => `
                <div class="landing-reveal flex flex-col items-center">
                  <div class="w-full aspect-[4/3] bg-[#131313] border border-[#58423a]/30 rounded-2xl mb-8 overflow-hidden flex items-center justify-center p-8 hover:border-[#ffb599]/50 transition-colors shadow-2xl">
                    <span class="material-symbols-outlined text-5xl text-[#ffb599]">${step.icon}</span>
                  </div>
                  <h4 class="text-xl mb-2 text-[#e4e2e1]" style="font-family:'Oswald',sans-serif;">${step.title}</h4>
                  <p class="text-[#dfc0b5] text-center text-sm px-4">${step.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Testimonials -->
        <section class="py-[100px]" style="background:#131313;">
          <div class="px-5 md:px-16 max-w-[1280px] mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div class="landing-reveal">
                <h2 class="text-4xl md:text-5xl text-[#e4e2e1] mb-8" style="font-family:'Oswald',sans-serif;">Stories of Growth</h2>
                <div class="space-y-6">
                  <div class="bg-[#1f2020] rounded-2xl p-8 border border-[#58423a]/20 flex gap-6">
                    <img alt="Sarah Chen" class="w-16 h-16 rounded-full object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj2QPMnWjUazf61_pnpASgINW2i9GnStpnzq1Cu8R9T0iZlB_UpSTKXAMNHvv5Ft--L8EVwu2SxFAOUwAHDAvCRTjOLzqeOkw_GPRjw7ycbqgEq1sCat2XBQjC0v8VrdgZN6wCf-KAf1BCo1lHjZhaDfXhrP53walNQFLrtIVPZqYPvaY62oBX0IUp3dykDwqb6vnbjRv9qORWCgBZoxyzOsAI0Dq-1J9uPnRbcfNVmPIh8le8lIoDOcJUOvAYP2iX3ZC2C_jvEW0" />
                    <div>
                      <p class="text-lg italic text-[#e4e2e1] mb-4">"I traded 10 hours of UI/UX mentoring for a React deep-dive. Six months later, I'm a Senior Product Designer with frontend capabilities."</p>
                      <div class="font-bold text-[#ffb599]">Sarah Chen</div>
                      <div class="text-sm text-[#dfc0b5]">Senior Product Designer</div>
                    </div>
                  </div>
                  <div class="bg-[#1f2020] rounded-2xl p-8 border border-[#58423a]/20 flex gap-6">
                    <img alt="Marcus Thorne" class="w-16 h-16 rounded-full object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1wwKJMKplspsqnnKSR8jshd4i6gwTK9QrGoPhApDEui_aGdq-7WnzT_l_swTIGlUJUqSFWQmvF5eU22UH4RC6UoRZ1qe6czmSRgB3JUb2hRGNSP6pH31DBBnAAgr3iTFkabkK8T8m0h5gy0YyiWt5Aa586r2S-t7G0_Fk22TPKQUolvUFeGQVepWWw5e-NAh81DFT1x38aBZCH1ReBZFeYkFJaLB_-axHGG7Xn3c_Xr-3QpSg8SI9BB8Tush1A5KS8nSLy5epjRI" />
                    <div>
                      <p class="text-lg italic text-[#e4e2e1] mb-4">"The credit system is genius. I earn points by teaching Python automation and use them to learn public speaking for my conference talks."</p>
                      <div class="font-bold text-[#ffb599]">Marcus Thorne</div>
                      <div class="text-sm text-[#dfc0b5]">Senior Software Engineer</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="landing-reveal hidden lg:block">
                <div class="relative rounded-3xl overflow-hidden aspect-square">
                  <img alt="Mentoring session" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSsKTRHc8-4x4-cE1jewsDUEO830FJTC_4jsbQz1ZoL9AmPPaynR3_Xjciq6199-HyOClsra1zNo5OlqOE_8JUoIf2rIN2lhNU7ZxxzS--vDmAfUZF_8eAWTNicAwYYFnyskiAcHrjJe64hLyZTdgOlzR4tPxHfyCJPAOqlxewQcNt76Puwq32LHv-IYHFtvirc_-rgJePMBgrWhK6RX_ftp2OtVHMNojB8LBF-ej2qMJe3puBixBcAO_M6zZeRXYbxZaqDmX2IxY" />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Final CTA -->
        <section class="py-[100px]" style="background:#1b1c1c;">
          <div class="px-5 md:px-16 max-w-[1280px] mx-auto text-center">
            <div class="landing-reveal bg-[#2a2a2a] rounded-3xl p-16 border border-[#58423a]/30 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-[#ffb599]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <h2 class="text-4xl md:text-5xl text-[#e4e2e1] mb-6 relative z-10" style="font-family:'Oswald',sans-serif;">Start Learning Without Spending Money</h2>
              <p class="text-[#dfc0b5] max-w-2xl mx-auto mb-10 relative z-10">
                Our credit-based ecosystem ensures that your time and expertise are the only currency you'll ever need.
              </p>
              <div class="flex flex-col items-center gap-6 relative z-10">
                <button class="px-12 py-5 bg-[#ffb599] text-[#5a1c00] font-bold rounded-full text-lg hover:scale-105 transition-all shadow-xl shadow-[#ffb599]/20" id="landing-cta-final">
                  Get Started Now
                </button>
                <p class="text-sm text-[#dfc0b5]" style="font-family:'JetBrains Mono',monospace;">JOIN 140,000+ ELITE PRACTITIONERS</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="border-t border-[#58423a]/30 py-20" style="background:#131313;">
        <div class="px-5 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div class="text-3xl text-[#e4e2e1] mb-6" style="font-family:'Oswald',sans-serif;">SkillSwap<span class="text-[#ffb599]">+</span></div>
            <p class="text-[#dfc0b5] text-sm leading-relaxed">Empowering professionals to trade skills and build the future of peer-to-peer education.</p>
          </div>
          <div>
            <h5 class="text-[#ffb599] font-bold text-xs uppercase tracking-widest mb-6" style="font-family:'JetBrains Mono',monospace;">Platform</h5>
            <ul class="space-y-4 text-[#dfc0b5] text-sm">
              <li><a class="hover:text-[#ffb599] transition-colors" href="#/marketplace">Marketplace</a></li>
              <li><a class="hover:text-[#ffb599] transition-colors" href="#">Credit System</a></li>
              <li><a class="hover:text-[#ffb599] transition-colors" href="#">Mentorship</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-[#ffb599] font-bold text-xs uppercase tracking-widest mb-6" style="font-family:'JetBrains Mono',monospace;">Legal</h5>
            <ul class="space-y-4 text-[#dfc0b5] text-sm">
              <li><a class="hover:text-[#ffb599] transition-colors" href="#">Privacy Policy</a></li>
              <li><a class="hover:text-[#ffb599] transition-colors" href="#">Terms of Service</a></li>
              <li><a class="hover:text-[#ffb599] transition-colors" href="#">Security</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-[#ffb599] font-bold text-xs uppercase tracking-widest mb-6" style="font-family:'JetBrains Mono',monospace;">Status</h5>
            <div class="flex items-center gap-2 text-[10px] text-green-500 mb-6" style="font-family:'JetBrains Mono',monospace;">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              ALL SYSTEMS OPERATIONAL
            </div>
            <p class="text-[#dfc0b5] text-[10px]">© 2026 SkillSwap+. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <!-- Auth Modal -->
      <div class="fixed inset-0 z-[100] hidden items-center justify-center p-4" id="landing-auth-modal">
        <div class="absolute inset-0 bg-[#131313]/60 backdrop-blur-md" id="landing-modal-backdrop"></div>
        <div class="glass-auth-landing w-full max-w-md p-10 rounded-3xl relative z-10 shadow-2xl overflow-hidden">
          <button class="absolute top-6 right-6 text-[#dfc0b5] hover:text-[#ffb599]" id="landing-modal-close">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="mb-10 text-center">
            <h2 class="text-3xl text-[#e4e2e1] mb-2" style="font-family:'Oswald',sans-serif;">Welcome to SkillSwap+</h2>
            <p class="text-[#dfc0b5]">Access the global mastery network.</p>
          </div>
          <div class="flex bg-[#1f2020] rounded-full p-1 mb-6 border border-[#58423a]/30">
            <button class="auth-tab flex-1 py-2.5 rounded-full text-xs font-bold transition-all bg-[#ffb599] text-[#5a1c00]" data-tab="register">Sign Up</button>
            <button class="auth-tab flex-1 py-2.5 rounded-full text-xs font-bold transition-all text-[#dfc0b5]" data-tab="login">Sign In</button>
          </div>
          <form class="space-y-4" id="landing-register-form">
            <input class="w-full bg-[#1f2020]/50 border border-[#58423a]/30 rounded-2xl px-6 py-4 text-[#e4e2e1] focus:ring-1 focus:ring-[#ffb599] outline-none transition-all placeholder:text-[#dfc0b5]/40" placeholder="Full name" type="text" id="landing-reg-name" required />
            <input class="w-full bg-[#1f2020]/50 border border-[#58423a]/30 rounded-2xl px-6 py-4 text-[#e4e2e1] focus:ring-1 focus:ring-[#ffb599] outline-none transition-all placeholder:text-[#dfc0b5]/40" placeholder="Email address" type="email" id="landing-reg-email" required />
            <input class="w-full bg-[#1f2020]/50 border border-[#58423a]/30 rounded-2xl px-6 py-4 text-[#e4e2e1] focus:ring-1 focus:ring-[#ffb599] outline-none transition-all placeholder:text-[#dfc0b5]/40" placeholder="Password (min 6 chars)" type="password" id="landing-reg-password" required minlength="6" />
            <button type="submit" class="w-full py-4 bg-[#ffb599] text-[#5a1c00] font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all" id="landing-register-btn">Create Account</button>
          </form>
          <form class="space-y-4 hidden" id="landing-login-form">
            <input class="w-full bg-[#1f2020]/50 border border-[#58423a]/30 rounded-2xl px-6 py-4 text-[#e4e2e1] focus:ring-1 focus:ring-[#ffb599] outline-none transition-all placeholder:text-[#dfc0b5]/40" placeholder="Email address" type="email" id="landing-login-email" required />
            <input class="w-full bg-[#1f2020]/50 border border-[#58423a]/30 rounded-2xl px-6 py-4 text-[#e4e2e1] focus:ring-1 focus:ring-[#ffb599] outline-none transition-all placeholder:text-[#dfc0b5]/40" placeholder="Password" type="password" id="landing-login-password" required />
            <button type="submit" class="w-full py-4 bg-[#ffb599] text-[#5a1c00] font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all" id="landing-login-btn">Sign In</button>
          </form>
          <div class="flex items-center gap-4 py-4 mt-2">
            <div class="h-px bg-[#58423a]/30 flex-grow"></div>
            <span class="text-[10px] text-[#dfc0b5] uppercase tracking-widest font-bold">or</span>
            <div class="h-px bg-[#58423a]/30 flex-grow"></div>
          </div>
          <button id="landing-google-btn" class="w-full py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition-all mb-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
            Continue with Google
          </button>
          <button id="landing-demo-modal-btn" class="w-full py-4 bg-[#2a2a2a] text-[#ffb599] font-bold rounded-full border border-[#ffb599]/30 flex items-center justify-center gap-3 hover:bg-[#ffb599]/10 transition-all">
            <span class="material-symbols-outlined text-xl">rocket_launch</span>
            Quick Demo Login
          </button>
        </div>
      </div>
    </div>
  `;

  // ═══════════════════════════════════════════════
  //  NATIVE SCROLL ANIMATION ENGINE
  //  Uses CSS sticky to pin the canvas,
  //  and native scroll position to scrub frames.
  // ═══════════════════════════════════════════════
  const canvas = document.getElementById('scroll-canvas');
  const ctx = canvas?.getContext('2d');
  const section = document.getElementById('scroll-animation-section');
  const scrollHint = document.getElementById('scroll-hint');
  const progressFill = document.getElementById('scroll-progress-fill');

  let currentFrame = 0;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrame);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawFrame(index) {
    if (!ctx || !images[index]) return;
    const img = images[index];
    if (!img.complete || !img.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  }

  // Draw first frame when loaded
  if (images[0]) {
    images[0].onload = () => drawFrame(0);
    if (images[0].complete) drawFrame(0);
  }

  function updateProgress() {
    if (progressFill) {
      progressFill.style.width = `${(currentFrame / (imageCount - 1)) * 100}%`;
    }
    if (scrollHint) {
      scrollHint.style.opacity = currentFrame > 5 ? '0' : '1';
    }
  }

  function onScrollAnimation() {
    if (!section) return;
    
    // Get bounding rect of the 400vh section
    const rect = section.getBoundingClientRect();
    
    // Total distance we can scroll while the sticky part is pinned:
    // That's (section height) - (viewport height)
    const scrollDistance = rect.height - window.innerHeight;
    
    // How far the top of the section has gone above the viewport top
    const scrolled = -rect.top;
    
    if (scrolled < 0) {
      // We haven't reached the section yet
      if (currentFrame !== 0) {
        currentFrame = 0;
        drawFrame(currentFrame);
        updateProgress();
      }
    } else if (scrolled > scrollDistance) {
      // We've passed the section
      if (currentFrame !== imageCount - 1) {
        currentFrame = imageCount - 1;
        drawFrame(currentFrame);
        updateProgress();
      }
    } else {
      // We are inside the section — calculate frame
      const progress = scrolled / scrollDistance;
      const targetFrame = Math.min(
        imageCount - 1,
        Math.floor(progress * imageCount)
      );
      
      if (currentFrame !== targetFrame) {
        currentFrame = targetFrame;
        drawFrame(currentFrame);
        updateProgress();
      }
    }
  }

  window.addEventListener('scroll', onScrollAnimation, { passive: true });

  // ─── Nav Scroll Effect ────────────────────────
  const nav = document.getElementById('landing-nav');
  function onNavScroll() {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(19,19,19,0.85)';
      nav.style.backdropFilter = 'blur(20px)';
      nav.style.borderBottom = '1px solid rgba(88,66,58,0.2)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.borderBottom = 'none';
    }
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });

  // ─── Reveal on Scroll ─────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.landing-reveal').forEach(el => observer.observe(el));

  // ─── Auth Modal Logic ─────────────────────────
  const modal = document.getElementById('landing-auth-modal');
  const openModal = () => { modal?.classList.remove('hidden'); modal?.classList.add('flex'); document.body.classList.add('modal-open'); };
  const closeModal = () => { modal?.classList.add('hidden'); modal?.classList.remove('flex'); document.body.classList.remove('modal-open'); };

  document.getElementById('landing-get-started-nav')?.addEventListener('click', openModal);
  document.getElementById('landing-hero-cta')?.addEventListener('click', openModal);
  document.getElementById('landing-cta-final')?.addEventListener('click', openModal);
  document.getElementById('landing-modal-close')?.addEventListener('click', closeModal);
  document.getElementById('landing-modal-backdrop')?.addEventListener('click', closeModal);

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-tab').forEach(t => { t.classList.remove('bg-[#ffb599]', 'text-[#5a1c00]'); t.classList.add('text-[#dfc0b5]'); });
      tab.classList.add('bg-[#ffb599]', 'text-[#5a1c00]'); tab.classList.remove('text-[#dfc0b5]');
      document.getElementById('landing-register-form').classList.toggle('hidden', target !== 'register');
      document.getElementById('landing-login-form').classList.toggle('hidden', target !== 'login');
    });
  });

  // ─── DEMO LOGIN ───────────────────────────────
  async function demoLogin() {
    try {
      showToast('Logging in with demo account...', 'info');
      const res = await login('demo@skillswap.com', 'demo123456');
      if (res.accessToken) {
        showToast('Welcome to the demo!', 'success');
        closeModal();
        await initProfile();
        window.location.hash = '/dashboard';
        return;
      }
    } catch (e) { /* demo user might not exist, try register */ }

    // If demo login fails, try registering the demo user first
    try {
      const res = await register('Demo User', 'demo@skillswap.com', 'demo123456');
      if (res.accessToken) {
        showToast('Demo account created! Welcome!', 'success');
        closeModal();
        await initProfile();
        window.location.hash = '/dashboard';
        return;
      }
    } catch (e) { /* fallback */ }

    // Final fallback: set a fake token for offline demo
    setTokens('demo-token-skillswap-plus', null);
    store.set('user', { name: 'Demo User', email: 'demo@skillswap.com', tier: 'Expert', credits: 1250, skills: ['UI/UX Design', 'React', 'Python'], bio: 'Exploring the SkillSwap+ platform' });
    store.set('credits', 1250);
    showToast('Demo mode activated!', 'success');
    closeModal();
    window.location.hash = '/dashboard';
  }

  document.getElementById('landing-demo-nav')?.addEventListener('click', demoLogin);
  document.getElementById('landing-demo-hero')?.addEventListener('click', demoLogin);
  document.getElementById('landing-demo-modal-btn')?.addEventListener('click', demoLogin);

  // Register
  document.getElementById('landing-register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('landing-register-btn');
    const name = document.getElementById('landing-reg-name').value.trim();
    const email = document.getElementById('landing-reg-email').value.trim();
    const password = document.getElementById('landing-reg-password').value;
    btn.disabled = true; btn.textContent = 'Creating...';
    try {
      const res = await register(name, email, password);
      if (res.accessToken) { showToast('Account created! Welcome to SkillSwap+', 'success'); closeModal(); await initProfile(); window.location.hash = '/dashboard'; }
      else showToast(res.error || 'Registration failed', 'error');
    } catch (err) { showToast(err.message || 'Network error', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Create Account'; }
  });

  // Login
  document.getElementById('landing-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('landing-login-btn');
    const email = document.getElementById('landing-login-email').value.trim();
    const password = document.getElementById('landing-login-password').value;
    btn.disabled = true; btn.textContent = 'Signing in...';
    try {
      const res = await login(email, password);
      if (res.accessToken) { showToast('Welcome back!', 'success'); closeModal(); await initProfile(); window.location.hash = '/dashboard'; }
      else showToast(res.error || 'Login failed', 'error');
    } catch (err) { showToast(err.message || 'Network error', 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Sign In'; }
  });

  // Google Sign-In
  document.getElementById('landing-google-btn')?.addEventListener('click', () => {
    const clientId = window.__GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id) { showToast('Google Sign-In not available. Use email or Demo Login.', 'error'); return; }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const res = await googleLogin(response.credential);
          if (res.accessToken) { showToast('Welcome!', 'success'); closeModal(); await initProfile(); window.location.hash = '/dashboard'; }
          else showToast(res.error || 'Google sign-in failed', 'error');
        } catch (err) { showToast(err.message || 'Error', 'error'); }
      }
    });
    window.google.accounts.id.prompt();
  });

  async function initProfile() {
    try {
      const profileRes = await getProfile();
      if (profileRes && !profileRes.error) { store.set('user', profileRes); store.set('credits', profileRes.credits || 0); }
    } catch (err) { /* ignore */ }
  }

  // ─── Cleanup ──────────────────────────────────
  return () => {
    window.removeEventListener('scroll', onScrollAnimation);
    window.removeEventListener('scroll', onNavScroll);
    window.removeEventListener('resize', resizeCanvas);
    observer.disconnect();
    document.body.classList.remove('modal-open');
  };
}
