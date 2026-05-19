// ===== HIGH SCORES (Shared via API) =====

const Scores = {
  _cache: null,
  _cacheTime: 0,

  async getAllScores() {
    const now = Date.now();
    if (this._cache && now - this._cacheTime < 5000) return this._cache;
    this._cache = await Api.getScores();
    this._cacheTime = now;
    return this._cache || [];
  },

  async getScoresForGame(game) {
    const scores = await this.getAllScores();
    return scores
      .filter(s => s.game === game)
      .sort((a, b) => b.score - a.score);
  },

  async getScoresSorted() {
    const scores = await this.getAllScores();
    return scores.sort((a, b) => b.score - a.score);
  },

  async addScore(game, score, username) {
    this._cache = null; // invalidate cache
    return await Api.addScore(game, score, username);
  },

  formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};
