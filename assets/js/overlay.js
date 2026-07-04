/* ═══════════════════════════════════════════════════════════
   GIRINGO — FULLSCREEN RITUAL OVERLAY
═══════════════════════════════════════════════════════════ */
'use strict';

/**
 * Opens the fullscreen "Oracle" overlay with a title and body text.
 * @param {string} title
 * @param {string} text
 * @param {boolean} [rare] - darker background variant for the rarest events
 */
function triggerRitualOverlay(title, text, rare = false) {
  const titleEl = document.getElementById('overlayTitle');
  const textEl = document.getElementById('overlayText');
  const overlay = document.getElementById('ritual-overlay');
  if (!titleEl || !textEl || !overlay) return;
  titleEl.textContent = title;
  textEl.textContent = text;
  overlay.classList.add('active');
  if (rare) overlay.style.background = 'rgba(20,0,0,.97)';
}

function closeOverlay() {
  const overlay = document.getElementById('ritual-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.style.background = '';
}
