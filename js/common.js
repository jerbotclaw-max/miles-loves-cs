// ===== COMMON UTILITIES =====

function buildNav() {
  const user = Auth.getCurrentUser();
  const userHtml = user
    ? `<span class="nav-user">${user.username} <a onclick="Auth.logout();location.reload();">[logout]</a></span>`
    : `<a href="login.html" class="btn btn-small btn-primary">LOGIN</a>`;

  document.querySelector('nav').innerHTML = `
    <a href="index.html" class="nav-brand">👾 ARCADE ZONE</a>
    <div class="nav-links">
      <a href="index.html">HOME</a>
      <a href="games.html">GAMES</a>
      <a href="scores.html">SCORES</a>
      <a href="board.html">BOARD</a>
      ${userHtml}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', buildNav);

function requireLoginToast() {
  if (!Auth.isLoggedIn()) {
    alert('You need to log in first!');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
