/* ═══════════════════════════════════════════════════════════
   GIRINGO — STATE MANAGER
   Single source of truth for the whole application. Every
   module reads/writes this object rather than keeping its own
   copies of data.

   NOTE: state is intentionally in-memory only (no localStorage).
   A page refresh resets the feed/profile back to the seed data.
   See README.md → "Known Limitations" for the rationale.
═══════════════════════════════════════════════════════════ */
'use strict';

const STATE = {
  wishes: [
    { id: 1, user: 'void_seeker_77', content: 'I wish I could erase the memories that haunt me at night...', threat: 'high', dark: true, time: '2h', reactions: { upvote: 247, downvote: 12, haunt: 88, blood: 34 }, ur: {}, consequence: 'Sleep no longer comes. The silence you wanted became the loudest thing.' },
    { id: 2, user: 'crimson_ghost_42', content: 'What if the life I\'m living is just a simulation of someone else\'s desires?', threat: 'medium', dark: false, time: '4h', reactions: { upvote: 892, downvote: 7, haunt: 203, blood: 111 }, ur: {}, consequence: null },
    { id: 3, user: 'shadow_trader_x', content: 'I wish I could sell my tomorrow for one more yesterday.', threat: 'critical', dark: true, time: '6h', reactions: { upvote: 456, downvote: 45, haunt: 319, blood: 201 }, ur: {}, consequence: 'Tomorrow has stopped arriving. You bargained well. Too well.' },
    { id: 4, user: 'null_entity_9', content: 'The price of my wish was paid in blood. Was it worth it?', threat: 'high', dark: true, time: '8h', reactions: { upvote: 1203, downvote: 55, haunt: 444, blood: 320 }, ur: {}, consequence: 'The question is the punishment.' },
    { id: 5, user: 'light_seeker_3', content: 'I wish my family could be healthy and whole again. That\'s all I want.', threat: 'low', dark: false, time: '10h', reactions: { upvote: 3201, downvote: 2, haunt: 14, blood: 5 }, ur: {}, consequence: null },
  ],
  myWishes: [],
  ritual: { wish: '', dob: '', dark: false, done: false, msgCount: 0, history: [], script: null, consequence: '' },
  profile: { wishes: 0, dark: 0, reactions: 0 },
  session: { apiKey: '', corruptionLevel: 0, wishCount: 0, bloodMoon: false, loreUnlocked: false },
  currentPage: 'landing',
};
