/* ═══════════════════════════════════════════════════════════
   GIRINGO — ATMOSPHERE / LIGHT STREAKS
═══════════════════════════════════════════════════════════ */
'use strict';

/** Spawns one transient light streak and removes it once its animation ends. */
function mkStreak() {
  const container = document.getElementById('streaks');
  if (!container) return;
  const s = document.createElement('div');
  s.className = 'streak';
  const duration = 2.5 + Math.random() * 4;
  const delay = Math.random() * 4;
  s.style.cssText = `top:${Math.random() * 100}%;width:${80 + Math.random() * 200}px;animation-duration:${duration}s;animation-delay:${delay}s;opacity:0;`;
  container.appendChild(s);
  setTimeout(() => s.remove(), (duration + delay) * 1000 + 800);
}

setInterval(mkStreak, 1000);
for (let i = 0; i < 5; i++) setTimeout(mkStreak, i * 400);
