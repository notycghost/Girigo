/* ═══════════════════════════════════════════════════════════
   GIRINGO — UTILITIES
   Small, dependency-free helper functions shared by other
   modules. Depends only on constants.js.
═══════════════════════════════════════════════════════════ */
'use strict';

/**
 * Escapes a string for safe insertion into innerHTML.
 * BUG FIX: previously user-supplied wish text was interpolated
 * directly into template strings assigned to `innerHTML` (feed
 * cards, profile archive, ritual chat bubbles). That allowed a
 * wish like `<img src=x onerror=alert(1)>` to execute arbitrary
 * script. Every dynamic string that ends up in innerHTML must be
 * passed through this function first.
 * @param {unknown} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

/**
 * Formats a number the way the UI expects (1234 -> "1.2k").
 * @param {number} n
 * @returns {string}
 */
function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

/**
 * Very small heuristic used to flag a wish as "dark" before the
 * ritual begins. Not a real NLP model — just a keyword count.
 * @param {string} text
 * @returns {boolean}
 */
function isDarkWish(text) {
  const lc = text.toLowerCase();
  const score = DARK_WORDS.filter((w) => lc.includes(w)).length;
  return score >= 1;
}

/**
 * Generates a random anonymous handle, e.g. "void_seeker_412".
 * @returns {string}
 */
function anonName() {
  const p = ANON_PREFIXES[Math.floor(Math.random() * ANON_PREFIXES.length)];
  const s = ANON_SUFFIXES[Math.floor(Math.random() * ANON_SUFFIXES.length)];
  return `${p}_${s}_${Math.floor(Math.random() * 999)}`;
}

/**
 * Returns the highest rank the user currently qualifies for.
 * @returns {{min:number,name:string,icon:string,desc:string}}
 */
function getRank() {
  const w = STATE.profile.wishes;
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (w >= r.min) rank = r;
  }
  return rank;
}

/**
 * Picks a random consequence line for a granted wish.
 * @param {boolean} isDark
 * @returns {string}
 */
function generateConsequence(isDark) {
  const pool = isDark ? DARK_CONSEQUENCES : LIGHT_CONSEQUENCES;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Picks a random scripted conversation tree for the fallback Oracle.
 * @param {boolean} isDark
 * @returns {string[]}
 */
function getScript(isDark) {
  const pool = isDark ? DARK_SCRIPTS : LIGHT_SCRIPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
