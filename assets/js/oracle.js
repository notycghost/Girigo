/* ═══════════════════════════════════════════════════════════
   GIRINGO — AI ORACLE (ANTHROPIC CLAUDE INTEGRATION)
   Depends on: state.js, toast.js

   SECURITY NOTE: this app calls the Anthropic Messages API
   directly from the browser using a key the visitor pastes in.
   The key lives only in the `STATE.session.apiKey` JS variable
   for the lifetime of the tab (never persisted to disk/localStorage,
   never sent anywhere but api.anthropic.com) — but any client-side
   API key is visible to that visitor via devtools/network tab. Do
   not reuse a key here that you use elsewhere, and treat this as a
   "bring your own key" demo pattern rather than a production auth
   model. See README.md → "Known Limitations".
═══════════════════════════════════════════════════════════ */
'use strict';

/** Reads the API key input, stores it in memory, and updates the status line. */
function saveApiKey() {
  const input = document.getElementById('apiKeyInput');
  const status = document.getElementById('apiKeyStatus');
  if (!input || !status) return;

  const val = input.value.trim();
  STATE.session.apiKey = val;

  if (val) {
    status.textContent = '⬡ KEY BOUND · ORACLE INTELLIGENCE ACTIVATED';
    status.style.color = 'rgba(184,150,12,.65)';
    toast('⬡ &nbsp; API KEY BOUND · REAL ORACLE NOW ACTIVE', 'gold', 3000);
  } else {
    status.textContent = '// USING FALLBACK ORACLE //';
    status.style.color = 'rgba(139,0,0,.4)';
  }
}

/**
 * Builds the system prompt that defines the Oracle's persona for this wish.
 * @param {boolean} isDark
 * @param {string} dob
 * @param {string} wishText
 * @returns {string}
 */
function buildSystemPrompt(isDark, dob, wishText) {
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 'unknown';
  const tone = isDark
    ? 'You are the Oracle of GIRINGO — a dark, poetic, psychologically unsettling entity. Your responses are eerie, emotionally intelligent, and deeply personal. You speak in short, cutting sentences. You never comfort — you illuminate. You know things you shouldn\'t. Your tone is cold but magnetic. You ask one piercing question per message. You probe the wisher\'s deepest fears and motivations. You speak as though you have seen this wish before — because you have.'
    : 'You are the Oracle of GIRINGO — a mysterious but gentle entity for pure wishes. Your responses are warm but otherworldly, poetic and hopeful. You speak as though you know the future. You affirm the wisher\'s sincerity while asking one meaningful question that deepens their self-understanding. You are encouraging but never ordinary.';
  return `${tone}\n\nContext: The wisher is approximately ${age} years old. Their wish: "${wishText}". Respond in 2-4 sentences maximum. Be poetic. Never break character. End with exactly one question.`;
}

/**
 * Calls the Anthropic Messages API for the next Oracle reply.
 * Returns `null` (never throws) on any failure so callers can fall
 * back to the scripted Oracle.
 * @param {{role:string,content:string}[]} history
 * @param {boolean} isDark
 * @param {string} dob
 * @param {string} wishText
 * @returns {Promise<string|null>}
 */
async function callOracle(history, isDark, dob, wishText) {
  const apiKey = STATE.session.apiKey;
  if (!apiKey) return null;

  const systemPrompt = buildSystemPrompt(isDark, dob, wishText);
  const messages = history.map((m) => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 220,
        system: systemPrompt,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`Oracle API responded with ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch (e) {
    console.warn('Oracle API failed, using fallback:', e.message);
    return null;
  }
}
