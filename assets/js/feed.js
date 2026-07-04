/* ═══════════════════════════════════════════════════════════
   GIRINGO — FEED RENDERER
   Depends on: state.js, utils.js, lore.js
═══════════════════════════════════════════════════════════ */
'use strict';

/** Re-renders every wish card in the feed from STATE.wishes. */
function renderFeed() {
  const container = document.getElementById('feedCards');
  if (!container) return;
  container.innerHTML = '';

  STATE.wishes.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'wcard'
      + (w.dark && w.threat === 'critical' ? ' threat-critical' : '')
      + (i === 0 && STATE.session.wishCount > 0 ? ' new-wish' : '');
    card.style.animationDelay = `${i * 0.065}s`;

    const threatBadge = (w.threat === 'critical' || w.threat === 'high') && w.dark
      ? `<div class="threat-badge"><div style="width:11px;height:11px;border:1px solid var(--blood);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:bold;color:var(--blood)" aria-hidden="true">!</div>${w.threat.toUpperCase()}</div>`
      : '';
    const threatBar = w.threat === 'critical' && w.dark
      ? '<div class="w-threat-bar">⚠ &nbsp; THIS WISH CARRIES UNRESOLVABLE CONSEQUENCES</div>'
      : '';
    const consequence = w.consequence
      ? `<div class="w-consequence">⟳ CONSEQUENCE · ${escapeHtml(w.consequence)}</div>`
      : '';

    card.innerHTML = `
      <div class="w-header">
        <div class="w-user">
          <div class="w-avatar" aria-hidden="true"><div class="w-avatar-inner"></div></div>
          <div><div class="w-name">${escapeHtml(w.user)}</div><div class="w-time">${escapeHtml(w.time)}</div></div>
        </div>${threatBadge}
      </div>
      <div class="w-content">&ldquo;${escapeHtml(w.content)}&rdquo;</div>
      <div class="w-reactions" id="rxn-${w.id}"></div>
      ${threatBar}${consequence}`;
    container.appendChild(card);
    renderRxn(w.id);
  });
}

/** Renders the reaction button row for a single wish. */
function renderRxn(id) {
  const w = STATE.wishes.find((x) => x.id === id);
  if (!w) return;
  const container = document.getElementById(`rxn-${id}`);
  if (!container) return;

  const defs = [
    { k: 'upvote', e: '▲', l: 'RESONATE', cls: 'upvote' },
    { k: 'downvote', e: '▼', l: 'REJECT', cls: 'downvote' },
    { k: 'haunt', e: '👁', l: 'HAUNTED', cls: 'haunt' },
    { k: 'blood', e: '🩸', l: 'FEEL THIS', cls: 'blood' },
  ];
  const total = Object.values(w.reactions).reduce((a, b) => a + b, 0);

  container.innerHTML = defs.map((r) => {
    const active = w.ur[r.k] ? ' active' : '';
    return `<button class="react-btn ${r.cls}${active}" aria-pressed="${!!w.ur[r.k]}" onclick="reactTo(${w.id},'${r.k}')">${r.e} <span>${fmt(w.reactions[r.k])}</span> <span style="font-size:9px;opacity:.55">${r.l}</span></button>`;
  }).join('') + `<span class="react-score">${fmt(total)} total</span>`;
}

/**
 * Toggles the current user's reaction on a wish.
 * @param {number} id
 * @param {'upvote'|'downvote'|'haunt'|'blood'} key
 */
function reactTo(id, key) {
  const w = STATE.wishes.find((x) => x.id === id);
  if (!w) return;

  if (w.ur[key]) {
    w.reactions[key]--;
    delete w.ur[key];
  } else {
    w.reactions[key]++;
    w.ur[key] = true;
    STATE.profile.reactions++;
  }
  renderRxn(id);
  updateSidebarAlerts();

  if (key === 'haunt' && STATE.profile.reactions >= 3 && !STATE.session.loreUnlocked) revealLore();
}

/** Refreshes the "Live Alerts" sidebar counters. */
function updateSidebarAlerts() {
  const aw = document.getElementById('alertWishes');
  const ar = document.getElementById('alertReactions');
  const ad = document.getElementById('alertDark');
  if (aw) aw.textContent = `${STATE.profile.wishes} wishes manifested`;
  if (ar) ar.textContent = `${STATE.profile.reactions} reactions given`;
  if (ad) ad.textContent = `${STATE.profile.dark} dark wishes active`;
}
