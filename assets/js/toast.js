/* ═══════════════════════════════════════════════════════════
   GIRINGO — TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════ */
'use strict';

/**
 * Shows a transient toast notification.
 * @param {string} msg - may contain a small amount of trusted markup (e.g. "&nbsp;", emoji); never pass raw user input here.
 * @param {''|'gold'|'good'} [type]
 * @param {number} [duration] - ms before the toast auto-dismisses
 */
function toast(msg, type = '', duration = 4500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.setAttribute('role', 'status');
  t.innerHTML = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut .4s ease-out both';
    setTimeout(() => t.remove(), 450);
  }, duration);
}
