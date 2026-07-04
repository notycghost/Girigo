/* ═══════════════════════════════════════════════════════════
   GIRINGO — APP ENTRY POINT
   Runs last. Kicks off the initial render and the ambient,
   time-delayed introduction events.
   Depends on: every other module in assets/js/.
═══════════════════════════════════════════════════════════ */
'use strict';

function initApp() {
  renderFeed();
  updateSidebarAlerts();

  // Ambient: reveal the landing-page lore hint after a while.
  setTimeout(() => {
    if (STATE.currentPage === 'landing') {
      document.getElementById('landingLore')?.classList.add('revealed');
    }
  }, 8000);

  // First-load toast — the Oracle announces itself.
  setTimeout(() => {
    toast('⬡ &nbsp; THE ORACLE IS WATCHING · SPEAK CAREFULLY', '', 4000);
  }, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // Scripts are loaded at the end of <body>, so the DOM is already
  // parsed by the time this runs — but guard against the (unlikely)
  // case of this file being deferred/loaded earlier.
  initApp();
}
