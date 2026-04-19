/* ═══════════════════════════════════════════
   SkillSwap+ — AI Chatbot Widget
   Gemini API integration with pattern fallback
   ═══════════════════════════════════════════ */

import { store } from '../state.js';

const BOT_NAME = 'SkillBot';
const BOT_AVATAR = '🤖';
const GEMINI_MODEL = 'gemini-2.0-flash';
const API_KEY_STORAGE = 'skillswap_gemini_key';

// ─── Gemini API Key Management ──────────────
function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

function hasApiKey() {
  return !!getApiKey();
}

// ─── Gemini API Integration ─────────────────
const SYSTEM_PROMPT = `You are SkillBot, the AI assistant for SkillSwap+, a peer-to-peer skill exchange platform.

Platform context:
- Users earn credits by teaching and spend credits to learn
- Sessions are live 1-on-1 video calls via Google Meet
- Users have profiles with skills, badges, XP levels
- The marketplace lets users browse and book mentors
- Assignments are given after sessions for practice

Your role:
- Help users navigate the platform
- Answer questions about credits, sessions, badges, etc.
- Be concise, friendly, and helpful
- Use markdown formatting (bold, lists) when useful
- Keep responses under 150 words unless the user needs detail`;

let conversationHistory = [];

async function callGemini(userMessage) {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  // Build conversation with system context
  const contents = [];
  
  // Add system prompt as first user turn
  if (conversationHistory.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT + '\n\nUser context: ' + getUserContext() }]
    });
    contents.push({
      role: 'model', 
      parts: [{ text: 'Understood! I\'m SkillBot, ready to help with SkillSwap+. How can I assist you?' }]
    });
  }

  // Add conversation history
  for (const msg of conversationHistory) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // Add current message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    if (response.status === 400 || response.status === 403) {
      throw new Error('INVALID_KEY');
    }
    throw new Error(errData?.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  // Update conversation history
  conversationHistory.push({ role: 'user', text: userMessage });
  conversationHistory.push({ role: 'model', text });

  return text;
}

function getUserContext() {
  const user = store.getUserSafe();
  const credits = store.get('credits') || 0;
  return `Name: ${user.name}, Credits: ${credits}, Level: ${user.level}, Tier: ${user.tier}`;
}

// ─── Pattern-Matching Fallback ──────────────
const responses = {
  greet: [
    `Hey there! 👋 I'm ${BOT_NAME}. How can I help you today?`,
    `Welcome! I'm here to help you navigate SkillSwap+. What would you like to know?`,
  ],
  credits: [
    `💰 **Credits** are the currency of SkillSwap+!\n\n• Start with **10 free credits** on signup\n• **Earn** by teaching sessions\n• **Spend** to book sessions\n\nYour current balance: **{credits} credits**`,
  ],
  booking: [
    `📅 **How to book a session:**\n\n1. Go to **Marketplace**\n2. Pick a mentor\n3. Click **"Book Now"**\n4. Select a time slot\n5. Confirm — credits are deducted\n\nYou'll see it in your **Dashboard** with a Google Meet link!`,
  ],
  badges: [
    `🏅 **Badge System:**\n\n• **Quick Learner** — 5 sessions in a week\n• **Community Contributor** — Help 10+ users\n• **Teaching Pro** — Host 25+ sessions\n• **Top Rated** — 4.8+ rating\n\nCheck your **Profile** to see progress!`,
  ],
  help: [
    `Here's what I can help with:\n\n• 💰 **"credits"** — How credits work\n• 📅 **"booking"** — How to book sessions\n• 🏅 **"badges"** — Badge system\n• 📚 **"sessions"** — About sessions\n• 🎓 **"teach"** — Start teaching\n\nOr just ask me anything!`,
  ],
  unknown: [
    `I'm not sure about that. Try asking about **credits**, **booking**, **badges**, or type **"help"** to see all topics!`,
  ]
};

function getPatternResponse(input) {
  const lower = input.toLowerCase().trim();
  const credits = store.get('credits') || 0;

  if (/^(hi|hello|hey|sup|yo)/i.test(lower)) return pick(responses.greet);
  if (/credit|balance|money|earn|spend/i.test(lower)) return pick(responses.credits).replace('{credits}', credits);
  if (/book|reserve|schedule|slot/i.test(lower)) return pick(responses.booking);
  if (/badge|achievement|reward/i.test(lower)) return pick(responses.badges);
  if (/help|what can|how to|guide/i.test(lower)) return pick(responses.help);
  return pick(responses.unknown);
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function formatMessage(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ─── State ──────────────────────────────────
let isOpen = false;

// ─── Init ───────────────────────────────────
export function initChatbot() {
  if (document.getElementById('chatbot-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'chatbot-widget';
  widget.innerHTML = `
    <!-- Floating Button -->
    <button id="chatbot-toggle" class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-full shadow-2xl shadow-purple-500/30 flex items-center justify-center z-[9999] hover:scale-110 transition-all duration-300" aria-label="Open AI Chat">
      <span class="material-symbols-outlined text-xl" id="chatbot-icon">smart_toy</span>
    </button>

    <!-- Chat Window -->
    <div id="chatbot-window" class="fixed bottom-24 right-6 w-[380px] max-h-[560px] bg-white rounded-2xl shadow-2xl shadow-zinc-900/15 z-[9999] flex flex-col overflow-hidden border border-zinc-100 transition-all duration-300 scale-0 origin-bottom-right opacity-0">
      <!-- Header -->
      <div class="bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-base">${BOT_AVATAR}</div>
        <div class="flex-1">
          <h4 class="text-white font-bold text-sm">${BOT_NAME}</h4>
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span class="text-white/70 text-[10px] font-medium" id="chatbot-mode-label">${hasApiKey() ? 'Gemini AI' : 'Pattern mode'}</span>
          </div>
        </div>
        <button id="chatbot-settings-btn" class="text-white/60 hover:text-white transition-colors p-1" title="API Settings">
          <span class="material-symbols-outlined text-sm">settings</span>
        </button>
        <button id="chatbot-close" class="text-white/60 hover:text-white transition-colors p-1">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- API Key Setup (hidden by default) -->
      <div id="chatbot-api-setup" class="hidden px-5 py-4 bg-violet-50 border-b border-violet-100">
        <p class="text-xs font-bold text-violet-800 mb-2">Gemini API Key</p>
        <p class="text-[10px] text-violet-600 mb-3 leading-relaxed">Enter your Google AI Studio key for real AI responses. Without it, I'll use pattern matching.</p>
        <div class="flex gap-2">
          <input id="chatbot-api-key-input" type="password" class="flex-1 px-3 py-2 bg-white rounded-lg border border-violet-200 text-xs focus:ring-2 focus:ring-violet-300 outline-none" placeholder="AIza..." value="${getApiKey()}" />
          <button id="chatbot-save-key" class="px-3 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors">Save</button>
        </div>
        ${hasApiKey() ? '<button id="chatbot-clear-key" class="text-[10px] text-red-500 mt-2 hover:underline">Remove key</button>' : ''}
      </div>

      <!-- Messages -->
      <div id="chatbot-messages" class="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px] min-h-[200px]" style="scroll-behavior:smooth"></div>

      <!-- Quick Actions -->
      <div class="px-4 pb-2 flex flex-wrap gap-1.5" id="chatbot-quick-actions">
        <button class="quick-action-btn text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2.5 py-1.5 rounded-full hover:bg-violet-50 hover:text-violet-700 transition-all" data-msg="How do credits work?">💰 Credits</button>
        <button class="quick-action-btn text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2.5 py-1.5 rounded-full hover:bg-violet-50 hover:text-violet-700 transition-all" data-msg="How do I book a session?">📅 Booking</button>
        <button class="quick-action-btn text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2.5 py-1.5 rounded-full hover:bg-violet-50 hover:text-violet-700 transition-all" data-msg="Tell me about badges">🏅 Badges</button>
      </div>

      <!-- Input -->
      <div class="p-3 border-t border-zinc-100 bg-zinc-50/50">
        <form id="chatbot-form" class="flex items-center gap-2">
          <input id="chatbot-input" class="flex-1 px-4 py-2.5 bg-white rounded-full border border-zinc-200 text-sm focus:ring-2 focus:ring-violet-200 focus:border-violet-300 outline-none transition-all" placeholder="Ask me anything..." autocomplete="off" />
          <button type="submit" class="w-9 h-9 bg-violet-600 text-white rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors shrink-0">
            <span class="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  // Welcome message
  addBotMessage(pick(responses.greet));

  // Show API key setup on first open if no key
  if (!hasApiKey()) {
    // Will show setup on first toggle
  }

  // ─── Event Listeners ────────────────────
  document.getElementById('chatbot-toggle').addEventListener('click', toggleChat);
  document.getElementById('chatbot-close').addEventListener('click', toggleChat);

  document.getElementById('chatbot-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    handleUserMessage(msg);
  });

  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => handleUserMessage(btn.dataset.msg));
  });

  // Settings toggle
  document.getElementById('chatbot-settings-btn').addEventListener('click', () => {
    const panel = document.getElementById('chatbot-api-setup');
    panel.classList.toggle('hidden');
  });

  // Save API key
  document.getElementById('chatbot-save-key').addEventListener('click', () => {
    const input = document.getElementById('chatbot-api-key-input');
    const key = input.value.trim();
    if (key) {
      setApiKey(key);
      conversationHistory = []; // Reset conversation on key change
      document.getElementById('chatbot-api-setup').classList.add('hidden');
      document.getElementById('chatbot-mode-label').textContent = 'Gemini AI';
      addBotMessage('✅ API key saved! I\'m now powered by Gemini AI. Ask me anything!');
    }
  });

  // Clear API key
  document.getElementById('chatbot-clear-key')?.addEventListener('click', () => {
    clearApiKey();
    conversationHistory = [];
    document.getElementById('chatbot-api-key-input').value = '';
    document.getElementById('chatbot-mode-label').textContent = 'Pattern mode';
    addBotMessage('API key removed. I\'ll use pattern matching now. Type **"help"** to see what I can do!');
  });
}

function toggleChat() {
  const chatWindow = document.getElementById('chatbot-window');
  const icon = document.getElementById('chatbot-icon');
  isOpen = !isOpen;

  if (isOpen) {
    chatWindow.classList.remove('scale-0', 'opacity-0');
    chatWindow.classList.add('scale-100', 'opacity-100');
    icon.textContent = 'close';
    document.getElementById('chatbot-input')?.focus();
    
    // Show API setup on first open if no key
    if (!hasApiKey()) {
      document.getElementById('chatbot-api-setup')?.classList.remove('hidden');
    }
  } else {
    chatWindow.classList.remove('scale-100', 'opacity-100');
    chatWindow.classList.add('scale-0', 'opacity-0');
    icon.textContent = 'smart_toy';
  }
}

async function handleUserMessage(text) {
  addUserMessage(text);

  if (hasApiKey()) {
    // ─── Gemini AI Mode ───────────────────
    const typingEl = showTypingIndicator();

    try {
      const reply = await callGemini(text);
      typingEl?.remove();
      if (reply) {
        addBotMessage(reply);
      } else {
        addBotMessage(getPatternResponse(text));
      }
    } catch (err) {
      typingEl?.remove();
      if (err.message === 'INVALID_KEY') {
        clearApiKey();
        document.getElementById('chatbot-mode-label').textContent = 'Pattern mode';
        addBotMessage('⚠️ Your API key is invalid. Please check it in settings. Using pattern matching for now.');
      } else {
        addBotMessage(`⚠️ AI error: ${err.message}. Using fallback response.\n\n${getPatternResponse(text)}`);
      }
    }
  } else {
    // ─── Pattern Matching Fallback ────────
    const typingEl = showTypingIndicator();
    setTimeout(() => {
      typingEl?.remove();
      addBotMessage(getPatternResponse(text));
    }, 400 + Math.random() * 400);
  }
}

function addUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'flex justify-end';
  msgEl.innerHTML = `
    <div class="max-w-[80%] bg-violet-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm">
      <p class="text-sm leading-relaxed">${escapeHtml(text)}</p>
    </div>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function addBotMessage(text) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'flex gap-2.5';
  msgEl.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-sm">${BOT_AVATAR}</div>
    <div class="max-w-[80%] bg-zinc-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
      <p class="text-sm text-zinc-800 leading-relaxed">${formatMessage(text)}</p>
    </div>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatbot-messages');
  if (!container) return null;

  const el = document.createElement('div');
  el.className = 'flex gap-2.5 chatbot-typing';
  el.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-sm">${BOT_AVATAR}</div>
    <div class="bg-zinc-100 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
      <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
      <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
    </div>
  `;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
