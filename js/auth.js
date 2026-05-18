// ===== AUTH SYSTEM (localStorage) =====

const Auth = {
  KEY: 'arcade_users',
  SESSION_KEY: 'arcade_session',

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || {};
    } catch { return {}; }
  },

  saveUsers(users) {
    localStorage.setItem(this.KEY, JSON.stringify(users));
  },

  // Simple hash for demo (NOT secure, just for school project)
  hashPassword(pw) {
    let hash = 0;
    for (let i = 0; i < pw.length; i++) {
      const char = pw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'h_' + Math.abs(hash).toString(36);
  },

  register(username, password) {
    if (!username || !password) return { ok: false, error: 'Fill in all fields' };
    if (username.length < 2 || username.length > 20) return { ok: false, error: 'Username: 2-20 chars' };
    if (password.length < 3) return { ok: false, error: 'Password: 3+ chars' };
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return { ok: false, error: 'Letters, numbers, underscores only' };

    const users = this.getUsers();
    const lowerName = username.toLowerCase();
    if (users[lowerName]) return { ok: false, error: 'Username taken' };

    users[lowerName] = {
      username: username,
      passwordHash: this.hashPassword(password),
      created: Date.now()
    };
    this.saveUsers(users);
    this.login(username, password);
    return { ok: true };
  },

  login(username, password) {
    if (!username || !password) return { ok: false, error: 'Fill in all fields' };
    const users = this.getUsers();
    const lowerName = username.toLowerCase();
    const user = users[lowerName];
    if (!user) return { ok: false, error: 'User not found' };
    if (user.passwordHash !== this.hashPassword(password)) return { ok: false, error: 'Wrong password' };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify({
      username: user.username,
      loggedAt: Date.now()
    }));
    return { ok: true };
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_KEY));
    } catch { return null; }
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};
