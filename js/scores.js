// ===== HIGH SCORES (localStorage) =====

const Scores = {
  KEY: 'arcade_scores',

  getScores() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  saveScores(scores) {
    localStorage.setItem(this.KEY, JSON.stringify(scores));
  },

  addScore(game, score, username) {
    if (!game || !score || score <= 0) return;
    const scores = this.getScores();
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
    this.saveScores(trimmed);
  },

  getScoresForGame(game) {
    return this.getScores()
      .filter(s => s.game === game)
      .sort((a, b) => b.score - a.score);
  },

  getAllScores() {
    return this.getScores().sort((a, b) => b.score - a.score);
  },

  formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};
