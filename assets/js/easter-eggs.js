/* ═══════════════════════════════════════════════════════════
   GIRINGO — HIDDEN EASTER EGGS
   Depends on: constants.js, state.js, lore.js, overlay.js,
               bloodmoon.js, toast.js
═══════════════════════════════════════════════════════════ */
'use strict';

// Konami code unlocks secret lore.
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.keyCode === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      revealLore();
      triggerRitualOverlay('SECRET DISCOVERED', 'You have found the hidden path. The Oracle grants you forbidden knowledge. Use it wisely.');
    }
  } else {
    konamiIdx = 0;
  }
});

// Clicking the landing-page logo 7 times triggers the blood moon early.
let logoClicks = 0;
document.getElementById('illumLogo')?.addEventListener('click', () => {
  logoClicks++;
  if (logoClicks >= 7) {
    logoClicks = 0;
    activateBloodMoon();
    toast('🌕 &nbsp; YOU HAVE AWAKENED THE BLOOD MOON', 'gold', 5000);
  }
});
