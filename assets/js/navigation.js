/* ═══════════════════════════════════════════════════════════
   GIRINGO — NAVIGATION
   Depends on: state.js, glitch.js, feed.js, profile.js, ritual.js, lore.js
═══════════════════════════════════════════════════════════ */
'use strict';

/**
 * Switches the visible `.page` section and runs any page-specific
 * setup (feed refresh, profile recompute, wish form reset, ...).
 * @param {'landing'|'make-wish'|'feed'|'profile'} id
 */
function go(id) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');
  window.scrollTo(0, 0);
  STATE.currentPage = id;

  document.querySelectorAll('.glitch').forEach((g) => triggerGlitch(g));

  if (id === 'feed') { renderFeed(); updateSidebarAlerts(); }
  if (id === 'profile') showProfile();
  if (id === 'make-wish') resetWish();
  if (id === 'landing') {
    setTimeout(() => { document.getElementById('landingLore')?.classList.add('revealed'); }, 6000);
  }
  if (id === 'feed' && STATE.session.loreUnlocked) revealLore();
}
