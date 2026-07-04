/* ═══════════════════════════════════════════════════════════
   GIRINGO — RITUAL FLOW
   Depends on: constants.js, state.js, utils.js, toast.js,
               overlay.js, glitch.js, bloodmoon.js, lore.js, oracle.js
═══════════════════════════════════════════════════════════ */
'use strict';

/** Resets the "make a wish" form and hides the ritual chat. */
function resetWish() {
  document.getElementById('mw-step1')?.classList.add('active');
  const rc = document.getElementById('ritual-chat');
  if (rc) {
    rc.classList.remove('ritualActive');
    rc.style.display = 'none';
  }
  const dob = document.getElementById('dob');
  const wishText = document.getElementById('wishText');
  if (dob) dob.value = '';
  if (wishText) wishText.value = '';

  const ri = document.getElementById('ritualInput');
  const rb = document.getElementById('ritualSendBtn');
  if (ri) { ri.disabled = false; ri.value = ''; }
  if (rb) rb.disabled = false;

  const rank = getRank();
  const rankEl = document.getElementById('myRank');
  const rankName = document.getElementById('rankName');
  if (rankEl && rankName && STATE.profile.wishes > 0) {
    rankName.textContent = rank.name;
    rankEl.classList.remove('hidden');
  }
}

/**
 * Checks a wish against the forbidden list and — if matched —
 * shows the refusal overlay.
 * @param {string} wish
 * @returns {boolean} true if the wish was refused
 */
function checkForbidden(wish) {
  const lc = wish.toLowerCase();
  if (FORBIDDEN.some((f) => lc.includes(f))) {
    triggerRitualOverlay(
      'FORBIDDEN WISH DETECTED',
      'The Oracle has encountered this desire before. It is sealed. Some wishes are too dangerous even for the void. Your request has been noted — and refused.',
    );
    return true;
  }
  return false;
}

/** Validates the wish form and starts the ritual chat. */
function beginRitual() {
  const dobInput = document.getElementById('dob');
  const wishInput = document.getElementById('wishText');
  const dob = dobInput.value;
  const wish = wishInput.value.trim();

  if (!dob) { toast('⚠ &nbsp; Date of birth required for binding', '', 2500); return; }
  if (new Date(dob) > new Date()) { toast('⚠ &nbsp; The void does not accept birth dates from the future', '', 2500); return; }
  if (!wish || wish.length < 5) { toast('⚠ &nbsp; Your wish is too faint. Speak louder.', '', 2500); return; }
  if (checkForbidden(wish)) return;

  const dark = isDarkWish(wish);
  STATE.ritual = {
    wish, dob, dark, done: false, msgCount: 0,
    history: [],
    script: getScript(dark),
    consequence: generateConsequence(dark),
  };

  document.getElementById('mw-step1').classList.remove('active');
  const rc = document.getElementById('ritual-chat');
  rc.style.display = 'flex';
  rc.style.flexDirection = 'column';
  rc.style.minHeight = 'calc(100vh - 80px)';
  document.getElementById('ritualInner').innerHTML = '';
  document.getElementById('msgCounter').textContent = '0';
  document.getElementById('oracleMode').textContent = STATE.session.apiKey ? 'AI ORACLE ACTIVE' : 'FALLBACK ORACLE';

  addMsg('me', wish);
  STATE.ritual.history.push({ role: 'user', content: wish });

  setTimeout(() => oracleReply(0), 700);
}

/**
 * Requests (or scripts) the next Oracle line and appends it to the chat.
 * @param {number} scriptIdx
 */
async function oracleReply(scriptIdx) {
  showTyping(true);
  let response = null;

  if (STATE.session.apiKey && STATE.ritual.history.length > 0) {
    response = await callOracle(STATE.ritual.history, STATE.ritual.dark, STATE.ritual.dob, STATE.ritual.wish);
  }
  if (!response) {
    const delay = 1800 + Math.random() * 900;
    await new Promise((r) => setTimeout(r, delay));
    response = STATE.ritual.script[scriptIdx] || STATE.ritual.script[STATE.ritual.script.length - 1];
  }

  showTyping(false);
  addMsg('sys', response);
  STATE.ritual.history.push({ role: 'assistant', content: response });
  STATE.ritual.msgCount = scriptIdx + 1;
  document.getElementById('msgCounter').textContent = STATE.ritual.msgCount;
}

/**
 * Appends a chat bubble. User- and AI-authored text is HTML-escaped
 * before insertion (see utils.js#escapeHtml) to prevent script
 * injection via wish text or an unexpected Oracle API response.
 * @param {'me'|'sys'} side
 * @param {string} text
 * @param {string} [extra] - additional bubble class, e.g. 'granted' | 'consequence'
 */
function addMsg(side, text, extra) {
  const inner = document.getElementById('ritualInner');
  const d = document.createElement('div');
  d.className = `r-msg ${side}${extra ? ' ' + extra : ''}`;
  const now = new Date();
  const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const safeText = escapeHtml(text).replace(/\n/g, '<br>');
  d.innerHTML = `<div class="r-bubble"><div class="r-text">${safeText}</div><div class="r-time">${t}</div></div>`;
  inner.appendChild(d);
  setTimeout(() => { document.getElementById('ritualMessages').scrollTop = 99999; }, 50);

  if (side === 'sys' && STATE.ritual.dark && Math.random() < 0.3) {
    setTimeout(() => corruptText(d.querySelector('.r-text'), 0.25), 800);
  }
}

let typingVisible = false;
/** Shows/hides the "Oracle is speaking..." typing indicator. */
function showTyping(on) {
  if (on && !typingVisible) {
    typingVisible = true;
    const inner = document.getElementById('ritualInner');
    const d = document.createElement('div');
    d.className = 'r-msg sys';
    d.id = 'typingEl';
    d.innerHTML = '<div class="r-bubble"><div class="r-typing"><div class="r-dots"><div class="r-dot"></div><div class="r-dot"></div><div class="r-dot"></div></div><div class="r-label">Oracle is speaking...</div></div></div>';
    inner.appendChild(d);
    document.getElementById('ritualMessages').scrollTop = 99999;
  } else if (!on) {
    typingVisible = false;
    document.getElementById('typingEl')?.remove();
  }
}

/** Handles the "SPEAK" button / Enter key inside the ritual chat. */
async function sendRitual() {
  if (STATE.ritual.done) return;
  const input = document.getElementById('ritualInput');
  const val = input.value.trim();
  if (!val) return;

  addMsg('me', val);
  STATE.ritual.history.push({ role: 'user', content: val });
  input.value = '';
  const mc = STATE.ritual.msgCount;

  if (mc >= 5) { grantWish(); return; }

  input.disabled = true;
  document.getElementById('ritualSendBtn').disabled = true;
  await oracleReply(mc);
  input.disabled = false;
  document.getElementById('ritualSendBtn').disabled = false;
  input.focus();

  if (STATE.ritual.msgCount >= 5) {
    input.disabled = true;
    document.getElementById('ritualSendBtn').disabled = true;
    setTimeout(() => grantWish(), 2800);
  }
}

/** Finalises the ritual: grants the wish, updates state, and schedules follow-up events. */
async function grantWish() {
  const dark = STATE.ritual.dark;
  const grantMsg = dark ? DARK_GRANT[Math.floor(Math.random() * DARK_GRANT.length)] : LIGHT_GRANT[Math.floor(Math.random() * LIGHT_GRANT.length)];
  showTyping(true);

  let finalMsg = grantMsg;
  if (STATE.session.apiKey) {
    STATE.ritual.history.push({ role: 'user', content: '[RITUAL COMPLETE — Deliver the final granting ceremony in 3 sentences. End with: GIRINGO REMEMBERS.]' });
    const aiGrant = await callOracle(STATE.ritual.history, dark, STATE.ritual.dob, STATE.ritual.wish);
    if (aiGrant) finalMsg = aiGrant;
  }

  showTyping(false);
  addMsg('sys', finalMsg, 'granted');
  STATE.ritual.done = true;

  const anon = anonName();
  const newWish = {
    id: Date.now(),
    user: anon,
    content: STATE.ritual.wish,
    threat: dark ? (Math.random() > 0.5 ? 'critical' : 'high') : 'low',
    dark,
    time: 'just now',
    reactions: { upvote: 0, downvote: 0, haunt: 0, blood: 0 },
    ur: {},
    consequence: STATE.ritual.consequence,
  };
  STATE.wishes.unshift(newWish);
  STATE.myWishes.unshift(newWish);
  STATE.profile.wishes++;
  if (dark) STATE.profile.dark++;
  STATE.session.wishCount++;

  setTimeout(() => {
    addMsg('sys', `CONSEQUENCE INITIATED · ${STATE.ritual.consequence}`, 'consequence');
  }, 2500);

  scheduleConsequenceEvents(dark);
  checkBloodMoon();
  checkLoreUnlock();
  updateSidebarAlerts();

  setTimeout(() => toast('⬡ &nbsp; THE ORACLE REMEMBERS · YOUR WISH IS NOW PERMANENT', '', 5000), 3500);

  setTimeout(() => {
    const inner = document.getElementById('ritualInner');
    const d = document.createElement('div');
    d.style.cssText = 'text-align:center;padding:24px 0;';
    d.innerHTML = `<div style="font-family:var(--font-mono);font-size:9px;letter-spacing:.3em;color:rgba(255,255,255,.2);margin-bottom:12px;">YOUR WISH HAS JOINED THE FEED</div>
      <button class="link-btn" onclick="go('feed')" style="padding:9px 28px;border:1px solid rgba(220,20,60,.4);color:rgba(220,20,60,.62);font-family:var(--font-mono);font-size:10px;letter-spacing:.3em;text-transform:uppercase;transition:all .3s;" onmouseover="this.style.color='#fff';this.style.borderColor='var(--crimson)'" onmouseout="this.style.color='rgba(220,20,60,.62)';this.style.borderColor='rgba(220,20,60,.4)'">VIEW IN FEED →</button>
      &nbsp;&nbsp;
      <button class="link-btn" onclick="resetWish();go('make-wish');" style="padding:9px 28px;border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.28);font-family:var(--font-mono);font-size:10px;letter-spacing:.3em;text-transform:uppercase;transition:all .3s;" onmouseover="this.style.color='rgba(255,255,255,.65)'" onmouseout="this.style.color='rgba(255,255,255,.28)'">MAKE ANOTHER</button>`;
    inner.appendChild(d);
    document.getElementById('ritualMessages').scrollTop = 99999;
  }, 4000);
}

/**
 * Schedules the delayed UI consequences of a granted dark wish
 * (glitch flash, corruption tick, rare overlay, text corruption).
 * @param {boolean} isDark
 */
function scheduleConsequenceEvents(isDark) {
  if (!isDark) return;

  setTimeout(() => {
    document.querySelectorAll('.glitch').forEach((g) => triggerGlitch(g));
    toast('⚠ &nbsp; THE ORACLE REMEMBERS · CONSEQUENCE INITIATED', '', 4000);
  }, 5000);

  setTimeout(() => increaseCorruption(), 8000);

  if (STATE.profile.dark >= 3) {
    setTimeout(() => triggerRitualOverlay(
      'THE VOID REMEMBERS',
      `You have made ${STATE.profile.dark} dark wishes. The Oracle has begun to take notice. Be careful what you wish for next time.`,
    ), 15000);
  }

  setTimeout(() => {
    const texts = document.querySelectorAll('.w-content, .r-text');
    if (texts.length) corruptText(texts[Math.floor(Math.random() * texts.length)], 0.4);
  }, 12000);
}
