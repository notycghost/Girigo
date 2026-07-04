/* ═══════════════════════════════════════════════════════════
   GIRINGO — GLITCH ENGINE & CORRUPTION SYSTEM
   Depends on: state.js, toast.js, overlay.js
═══════════════════════════════════════════════════════════ */
'use strict';

/** Briefly applies the RGB-split glitch effect to an element. */
function triggerGlitch(el) {
  el.classList.add('gon');
  setTimeout(() => el.classList.remove('gon'), 180);
}

// Ambient random glitch on any `.glitch` element in the document.
setInterval(() => {
  const glitchEls = document.querySelectorAll('.glitch');
  if (glitchEls.length) triggerGlitch(glitchEls[Math.floor(Math.random() * glitchEls.length)]);
}, 3400);

/**
 * Scrambles an element's text into block-drawing characters for a short
 * "corrupted terminal" effect, then restores the original text.
 * Uses `textContent` (not innerHTML), so this is inherently XSS-safe.
 * @param {HTMLElement|null} el
 * @param {number} [intensity] - 0-1, probability of corrupting each frame
 */
function corruptText(el, intensity = 0.3) {
  if (!el) return;
  const original = el.textContent;
  const chars = '░▒▓█▄▀▐▌│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';
  const interval = setInterval(() => {
    if (Math.random() > intensity) {
      clearInterval(interval);
      el.textContent = original;
      return;
    }
    el.textContent = original
      .split('')
      .map((c) => (Math.random() < 0.15 ? chars[Math.floor(Math.random() * chars.length)] : c))
      .join('');
  }, 80);
  setTimeout(() => {
    clearInterval(interval);
    el.textContent = original;
  }, 1200);
}

/** Advances the global corruption level (0-3) and applies its visual effects. */
function increaseCorruption() {
  STATE.session.corruptionLevel = Math.min(STATE.session.corruptionLevel + 1, 3);
  const lvl = STATE.session.corruptionLevel;

  document.body.className = document.body.className.replace(/corrupted-\d/g, '').trim();
  if (lvl > 0) document.body.classList.add(`corrupted-${lvl}`);

  const intensity = lvl * 0.15;
  document.querySelectorAll('.corner-tl, .corner-tr, .corner-bl, .corner-br').forEach((c) => {
    c.style.borderColor = `rgba(220,20,60,${0.4 + intensity})`;
  });

  if (lvl >= 2) {
    document.querySelectorAll('.glitch').forEach((g) => {
      setTimeout(() => triggerGlitch(g), Math.random() * 2000);
    });
  }

  if (lvl === 3) {
    toast('⚠ &nbsp; CORRUPTION CRITICAL · THE VOID HAS TAKEN ROOT', '', 6000);
    setTimeout(
      () => triggerRitualOverlay(
        'YOU ARE CORRUPTED',
        'Too many dark wishes have passed through you. The void no longer requires your permission.',
        true,
      ),
      3000,
    );
  }
}
