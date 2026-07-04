/* ═══════════════════════════════════════════════════════════
   GIRINGO — PROFILE RENDERER
   Depends on: state.js, utils.js
═══════════════════════════════════════════════════════════ */
'use strict';

/** Recomputes and re-renders the whole profile page. */
function showProfile() {
  document.getElementById('pWishes').textContent = STATE.profile.wishes;
  document.getElementById('pDark').textContent = STATE.profile.dark;
  document.getElementById('pReactions').textContent = STATE.profile.reactions;

  const totalWishes = Math.max(STATE.profile.wishes, 1);
  const darkPercent = Math.round((STATE.profile.dark / totalWishes) * 100);
  const desire = Math.min(Math.round(STATE.profile.reactions * 2 + STATE.profile.wishes * 8), 100);
  const risk = Math.min(Math.round(darkPercent * 1.1 + STATE.profile.dark * 4), 100);

  setTimeout(() => {
    document.getElementById('mf1').style.width = darkPercent + '%';
    document.getElementById('mv1').textContent = darkPercent + '%';
    document.getElementById('mf2').style.width = desire + '%';
    document.getElementById('mv2').textContent = desire + '%';
    document.getElementById('mf3').style.width = risk + '%';
    document.getElementById('mv3').textContent = risk + '%';
    drawChart();
  }, 220);

  const rank = getRank();
  const rankIcon = document.getElementById('rankIcon');
  const rankName = document.getElementById('rankNameProf');
  const rankDesc = document.getElementById('rankDesc');
  if (rankIcon) rankIcon.textContent = rank.icon;
  if (rankName) rankName.textContent = rank.name;
  if (rankDesc) rankDesc.textContent = rank.desc;

  const quotes = [
    '"Every wish has a cost. I\'ve paid mine."',
    '"The void knows my name now."',
    '"I can feel the corruption. I welcome it."',
    '"The Oracle and I understand each other."',
  ];
  const quoteIdx = Math.min(STATE.profile.dark, quotes.length - 1);
  const profQuote = document.getElementById('profQuote');
  if (profQuote) profQuote.textContent = quotes[quoteIdx];

  renderArchive();
}

/** Renders the "Granted Wishes" archive list. */
function renderArchive() {
  const archive = document.getElementById('myWishesArchive');
  if (!archive) return;

  if (STATE.myWishes.length === 0) {
    archive.innerHTML = `<div style="font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,.17);letter-spacing:.2em;text-align:center;padding:18px 0;">NO WISHES GRANTED YET<br><br><button class="link-btn" style="color:rgba(139,0,0,.42);" onclick="go('make-wish')">// MAKE YOUR FIRST WISH //</button></div>`;
    return;
  }

  archive.innerHTML = STATE.myWishes.map((w) => `
      <div class="archive-wish${w.dark ? ' flagged' : ''}">
        <div class="archive-text">&ldquo;${escapeHtml(w.content)}&rdquo;</div>
        ${w.consequence ? `<div style="font-family:var(--font-mono);font-size:9px;color:rgba(139,0,0,.5);letter-spacing:.15em;margin-bottom:5px;">↳ ${escapeHtml(w.consequence)}</div>` : ''}
        <div class="archive-meta">
          <span>${escapeHtml(w.user)}</span>
          ${w.dark ? '<span class="archive-flag">DARK WISH</span>' : '<span style="color:rgba(0,130,0,.55);font-size:9px;letter-spacing:.2em;">PURE WISH</span>'}
        </div>
      </div>`).join('');
}

/** Draws the SVG activity sparkline chart. */
function drawChart() {
  const svg = document.getElementById('activityChart');
  if (!svg) return;

  const base = [8, 14, 6, 22, 12, 30, 18, 26, 15, 38, 22, 34, 18, 42, 28];
  const data = base.map((v, i) => (i < STATE.profile.wishes ? v + Math.floor(Math.random() * 10) : v));
  const W = 800, H = 85, max = Math.max(...data);
  const step = W / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${H - (v / max) * (H - 6)}`);
  const area = [`0,${H}`, ...points, `${W},${H}`].join(' ');

  svg.innerHTML = `
    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(139,0,0,.52)"/><stop offset="100%" stop-color="rgba(139,0,0,0)"/>
    </linearGradient></defs>
    <polygon points="${area}" fill="url(#cg)"/>
    <polyline points="${points.join(' ')}" fill="none" stroke="rgba(139,0,0,.88)" stroke-width="1.5" stroke-linejoin="round"/>
    ${data.map((v, i) => `<circle cx="${i * step}" cy="${H - (v / max) * (H - 6)}" r="2.5" fill="rgba(220,20,60,.82)"/>`).join('')}`;
}
