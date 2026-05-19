// ===== SHARED DATA API (jsonblob) =====
// All users see the same scores & messages across devices!

const Api = {
  SCORES_URL: 'https://jsonblob.com/api/jsonBlob/019e415d-64bc-73a7-84e2-cc40c3efd552',
  MESSAGES_URL: 'https://jsonblob.com/api/jsonBlob/019e415d-65f4-729b-a7b5-d983b7cbdd48',

  async _get(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      console.error('Api._get error:', e);
      return null;
    }
  },

  async _put(url, data) {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Put failed');
      return true;
    } catch (e) {
      console.error('Api._put error:', e);
      return false;
    }
  },

  // === SCORES ===

  async getScores() {
    const data = await this._get(this.SCORES_URL);
    return Array.isArray(data) ? data : [];
  },

  async addScore(game, score, username) {
    if (!game || !score || score <= 0) return false;
    const scores = await this.getScores();
    scores.push({
      game,
      score: Math.floor(score),
      username: username || 'anonymous',
      date: Date.now()
    });
    // Keep top 100 per game
    const byGame = {};
    scores.forEach(s => {
      if (!byGame[s.game]) byGame[s.game] = [];
      byGame[s.game].push(s);
    });
    const trimmed = [];
    Object.values(byGame).forEach(arr => {
      arr.sort((a, b) => b.score - a.score);
      trimmed.push(...arr.slice(0, 100));
    });
    return await this._put(this.SCORES_URL, trimmed);
  },

  // === MESSAGES ===

  async getMessages() {
    const data = await this._get(this.MESSAGES_URL);
    return Array.isArray(data) ? data : [];
  },

  async addMessage(username, text) {
    if (!text || !text.trim()) return false;
    const messages = await this.getMessages();
    messages.push({
      username: username || 'anonymous',
      text: text.trim(),
      date: Date.now()
    });
    // Keep last 200 messages
    const trimmed = messages.slice(-200);
    return await this._put(this.MESSAGES_URL, trimmed);
  }
};
