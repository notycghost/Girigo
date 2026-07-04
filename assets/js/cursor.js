/* ═══════════════════════════════════════════════════════════
   GIRINGO — CUSTOM CURSOR & CURSOR-REACTIVE EYE
   Depends on: state.js
═══════════════════════════════════════════════════════════ */
'use strict';

/**
 * Moves the landing-page eye's pupil to look toward the pointer.
 * @param {number} mx
 * @param {number} my
 */
function trackEye(mx, my) {
  const logo = document.getElementById('illumLogo');
  if (!logo) return;
  const rect = logo.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = mx - cx;
  const dy = my - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxMove = 5;
  const angle = Math.atan2(dy, dx);
  const move = Math.min(dist / 60, 1) * maxMove;
  const pupil = document.getElementById('eyePupil');
  if (pupil) {
    pupil.setAttribute('cx', 100 + Math.cos(angle) * move);
    pupil.setAttribute('cy', 108 + Math.sin(angle) * move);
  }
}

(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return; // defensive: never crash the rest of the app

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    if (STATE.currentPage === 'landing') trackEye(cx, cy);
  });

  // Trail lerp — smoothly chases the real cursor position.
  function animTrail() {
    tx += (cx - tx) * 0.12;
    ty += (cy - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  /*
   * BUG FIX: the original implementation queried every interactive
   * element once at load time and attached mouseenter/mouseleave
   * listeners directly to each of them. Any element created later
   * (feed cards, reaction buttons, ritual bubbles, archive entries —
   * all rendered via innerHTML after this ran) never received the
   * "hovering" cursor effect. Event delegation on `document` fixes
   * this for elements added at any point in the app's lifecycle.
   */
  const INTERACTIVE_SELECTOR = 'button, input, textarea, a, [onclick]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTIVE_SELECTOR)) cursor.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    const stillInteractive = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(INTERACTIVE_SELECTOR);
    if (e.target.closest(INTERACTIVE_SELECTOR) && !stillInteractive) cursor.classList.remove('hovering');
  });
})();
