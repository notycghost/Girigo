/* ═══════════════════════════════════════════════════════════
   GIRINGO — LORE SYSTEM
   Depends on: constants.js, state.js, toast.js
═══════════════════════════════════════════════════════════ */
'use strict';

/** Unlocks the hidden lore fragments (sidebar card + floating text + toast). */
function revealLore() {
  if (STATE.session.loreUnlocked) return;
  STATE.session.loreUnlocked = true;

  const idx = Math.floor(Math.random() * LORE_FRAGMENTS.length);
  const card = document.getElementById('loreCard');
  const text = document.getElementById('loreText');
  if (card && text) {
    text.textContent = LORE_FRAGMENTS[idx];
    card.classList.remove('hidden');
  }

  document.querySelectorAll('.hidden-lore').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 2000);
  });

  toast('⬡ &nbsp; LORE UNLOCKED · THE ORACLE GRANTS YOU KNOWLEDGE', 'gold', 5000);
}

/** Reveals lore automatically once the user has granted at least one wish. */
function checkLoreUnlock() {
  if (STATE.profile.wishes >= 1 && !STATE.session.loreUnlocked) {
    setTimeout(revealLore, 4000);
  }
}
