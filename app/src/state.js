/* ═══════════════════════════════════════════
   SkillSwap+ — Global State Management
   API-first state: populated from backend,
   localStorage used only for UI preferences.
   ═══════════════════════════════════════════ */

const STORAGE_KEY = 'skillswap_state';
const DEBUG = true;

// ─── Default Hardened State ─────────────────
const DEFAULT_USER = {
  _id: 'default_guest_01',
  name: 'Demo User',
  email: 'demo@skillswap.user',
  role: 'user',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6927ef&color=fff',
  bio: 'This is a fallback generated profile. Connect your API to load live data.',
  level: 1,
  xp: 0,
  xpMax: 1000,
  tier: 'Starter',
  streak: 0,
  badges: [],
  skills: [],
  skillsWanted: [],
  rating: 0,
  ratingCount: 0,
  stats: {
    sessionsTaught: 0,
    sessionsAttended: 0,
    creditsEarned: 0,
    communityPosts: 0
  }
};

const defaultState = {
  user: { ...DEFAULT_USER },
  credits: 0,
  sessions: [],
  assignments: [],
  notifications: [],
  mentorApplication: {
    status: 'none',
    step: 1
  },
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    communityDigest: false,
    marketingEmails: false
  }
};

class StateManager {
  constructor() {
    this.listeners = {};
    this.state = this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed = {};
        try {
          parsed = JSON.parse(saved);
        } catch(e) {
          if (DEBUG) console.warn('[State] LocalStorage parse invalid, resetting state.');
        }
        
        return {
          ...JSON.parse(JSON.stringify(defaultState)),
          settings: { ...defaultState.settings, ...(parsed.settings || {}) },
          mentorApplication: { ...defaultState.mentorApplication, ...(parsed.mentorApplication || {}) }
        };
      }
    } catch (e) {
      if (DEBUG) console.warn('[State] Failed to load state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: this.state.settings,
        mentorApplication: this.state.mentorApplication
      }));
    } catch (e) {
      if (DEBUG) console.warn('[State] Failed to save state to localStorage:', e);
    }
  }

  get(key) {
    return key ? this.state[key] : this.state;
  }

  // ─── Safe Getters ─────────────────────────
  getUserSafe() {
    return this.state.user || { ...DEFAULT_USER };
  }

  getSessionsSafe() {
    return this.state.sessions || [];
  }

  set(key, value) {
    if (DEBUG) console.log(`[State] Update -> ${key}:`, value);
    this.state[key] = value;
    this._save();
    this._emit(key, value);
    this._emit('*', this.state);
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  _emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }

  /* ─── API Integration Methods ──────────── */

  /**
   * Populate state from API user profile response.
   * Called after login or on app init.
   */
  setUserFromAPI(userData) {
    if (!userData) {
      if (DEBUG) console.warn('[State] setUserFromAPI called with null data, keeping safe default user.');
      this.state.user = { ...DEFAULT_USER };
      return;
    }

    this.state.user = {
      _id: userData?._id || DEFAULT_USER._id,
      name: userData?.name || DEFAULT_USER.name,
      email: userData?.email || DEFAULT_USER.email,
      role: userData?.role || DEFAULT_USER.role,
      avatar: userData.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name || 'U') + '&background=6927ef&color=fff',
      bio: userData.bio || '',
      level: userData.level || 1,
      xp: userData.xp || 0,
      xpMax: userData.xpMax || 1000,
      tier: userData.tier || 'Starter',
      streak: userData.streak || 0,
      badges: userData.badges || [],
      skills: (userData.skillsOffered || []).map(s => ({ name: s.name, level: s.level || 50 })),
      skillsWanted: userData.skillsWanted || [],
      rating: userData.rating || 0,
      ratingCount: userData.ratingCount || 0,
      stats: userData.stats || {
        sessionsTaught: 0,
        sessionsAttended: 0,
        creditsEarned: 0,
        communityPosts: 0
      }
    };
    this.state.credits = userData.credits || 0;
    this._emit('user', this.state.user);
    this._emit('credits', this.state.credits);
    this._emit('*', this.state);
  }

  /**
   * Set sessions from API.
   */
  setSessionsFromAPI(sessions) {
    this.state.sessions = sessions;
    this._emit('sessions', sessions);
    this._emit('*', this.state);
  }

  /**
   * Set notifications from API.
   */
  setNotificationsFromAPI(notifications) {
    this.state.notifications = notifications;
    this._emit('notifications', notifications);
    this._emit('*', this.state);
  }

  /**
   * Update credits from API.
   */
  setCredits(amount) {
    this.state.credits = amount;
    this._emit('credits', amount);
    this._emit('*', this.state);
  }

  // ─── Credit Methods (keep for local UI updates) ──
  addCredits(amount, reason = '') {
    this.state.credits += amount;
    this._emit('credits', this.state.credits);
    this._emit('*', this.state);
  }

  deductCredits(amount) {
    if (this.state.credits < amount) return false;
    this.state.credits -= amount;
    this._emit('credits', this.state.credits);
    this._emit('*', this.state);
    return true;
  }

  hasEnoughCredits(amount) {
    return this.state.credits >= amount;
  }

  // ─── Notification Methods (for local additions) ──
  _addNotification(type, message, icon, color) {
    const notification = {
      _id: 'n' + Date.now(),
      type,
      message,
      time: 'Just now',
      icon: icon || 'info',
      color: color || 'violet'
    };
    this.state.notifications = [notification, ...this.state.notifications];
    this._emit('notifications', this.state.notifications);
  }

  addNotification(type, message, icon, color) {
    this._addNotification(type, message, icon, color);
    this._emit('*', this.state);
  }

  // ─── Session Methods (for local UI updates) ──────
  bookSession(session) {
    const newSession = {
      ...session,
      _id: 's' + Date.now(),
      status: 'upcoming'
    };
    this.state.sessions = [newSession, ...this.state.sessions];
    this._emit('sessions', this.state.sessions);
    this._emit('*', this.state);
    return true;
  }

  // ─── Assignment Methods ───────────────────
  submitAssignment(assignmentId) {
    const assignment = this.state.assignments.find(a => a.id === assignmentId || a._id === assignmentId);
    if (assignment) {
      assignment.status = 'submitted';
      this._addNotification('assignment', `Assignment "${assignment.title}" submitted!`, 'task_alt', 'emerald');
      this._emit('assignments', this.state.assignments);
      this._emit('*', this.state);
    }
  }

  // ─── Mentor Application ───────────────────
  setMentorApplication(data) {
    this.state.mentorApplication = { ...this.state.mentorApplication, ...data };
    this._save();
    this._emit('mentorApplication', this.state.mentorApplication);
    this._emit('*', this.state);
  }

  // ─── Settings ─────────────────────────────
  updateSettings(key, value) {
    this.state.settings[key] = value;
    this._save();
    this._emit('settings', this.state.settings);
  }

  // ─── XP Methods ───────────────────────────
  addXP(amount) {
    if (!this.state.user) return;
    this.state.user.xp += amount;
    if (this.state.user.xp >= this.state.user.xpMax) {
      this.state.user.level += 1;
      this.state.user.xp = this.state.user.xp - this.state.user.xpMax;
      this._addNotification('level', `🎉 Level Up! You're now Level ${this.state.user.level}!`, 'military_tech', 'amber');
    }
    this._emit('user', this.state.user);
    this._emit('*', this.state);
  }

  // ─── Reset ────────────────────────────────
  reset() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this._save();
    this._emit('*', this.state);
  }
}

export const store = new StateManager();
