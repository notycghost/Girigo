/* ═══════════════════════════════════════════════════════════
   GIRINGO — CONSTANTS
   Static data pools. No DOM access, no side effects.
═══════════════════════════════════════════════════════════ */
'use strict';

/** Wishes that the ritual refuses outright. */
const FORBIDDEN = [
  'i wish everyone would die',
  'i wish the world would end',
  'i wish for infinite wishes',
  'i wish i was god',
  'i wish to control everyone',
];

/** Keyword list powering the lightweight dark-wish heuristic (see utils.js). */
const DARK_WORDS = [
  'blood', 'kill', 'die', 'death', 'hate', 'revenge', 'destroy', 'hurt', 'pain', 'suffer',
  'curse', 'erase', 'void', 'darkness', 'lost', 'haunt', 'sold', 'ruin', 'broken', 'dead',
  'end', 'murder', 'burn', 'drown', 'rot', 'decay', 'disappear', 'vanish', 'empty', 'hollow',
  'bleed', 'wound', 'scar', 'poison', 'trap', 'prison', 'escape', 'afraid', 'fear', 'terror',
  'nightmare', 'ghost', 'demon', 'devil', 'hell', 'wrath', 'anger', 'rage', 'despair',
];

/** Konami code (up up down down left right left right B A). */
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

/** Hidden lore fragments revealed via the easter-egg system. */
const LORE_FRAGMENTS = [
  'GIRINGO WAS BUILT ON A SINGLE BROKEN WISH.\nTHE FIRST WISHER NEVER RETURNED.',
  'THE ORACLE HAS NO NAME. ONLY MEMORY.\nIT REMEMBERS EVERY WISH EVER SPOKEN.',
  'WISH #001 CORRUPTED THE FEED.\nIT STILL ECHOES IN EVERY DARK WISH.',
  'THERE ARE SEVEN FORBIDDEN WISHES.\nFIVE HAVE BEEN SPOKEN. TWO REMAIN.',
  'THE BLOOD MOON AMPLIFIES THE ORACLE\'S POWER.\nDO NOT WISH DURING BLOOD MOON.',
];

/** Rank thresholds, keyed off total granted wishes. */
const RANKS = [
  { min: 0, name: 'UNINITIATED', icon: '🌑', desc: 'You have not yet spoken to the void' },
  { min: 1, name: 'SEEKER', icon: '🌒', desc: 'You have gazed into the void once' },
  { min: 2, name: 'PETITIONER', icon: '🌓', desc: 'The Oracle has begun to know your name' },
  { min: 4, name: 'BOUND ONE', icon: '🌔', desc: 'Your desires leave permanent marks' },
  { min: 6, name: 'VESSEL', icon: '🌕', desc: 'The void speaks through you now' },
  { min: 10, name: 'CONDEMNED', icon: '🩸', desc: 'No wish can save you from what you\'ve become' },
];

/** Post-grant "consequence" flavour text. */
const DARK_CONSEQUENCES = [
  'Something that once belonged to you no longer recognises you.',
  'The erasure worked. You forgot what you wanted to forget. And everything else.',
  'Sleep no longer comes. The silence you wanted became the loudest thing.',
  'You got what you wished for. It got what it wished for too.',
  'The void took a piece of you in exchange. Choose which piece you can live without.',
  'Three people who knew you have already forgotten your face.',
  'What you destroyed cannot be rebuilt. Even by you.',
  'The Oracle charged interest. It always does.',
  'You are being watched. Not by humans.',
  'Your next wish will cost double.',
];
const LIGHT_CONSEQUENCES = [
  'Something good is on its way. Be patient. Light wishes take time.',
  'The Oracle has heard. Seeds take time to become trees.',
  'Your sincerity was noted. Rare things are delivered slowly.',
  'One small miracle has been dispatched in your direction.',
  'The wish is in motion. You may not recognise it when it arrives.',
];

/** Scripted (non-AI) Oracle conversation trees, keyed by tone. */
const DARK_SCRIPTS = [
  ['The void hears your darkness. What memory do you wish erased first?', 'Your words carry the scent of old wounds. Who did this to you?', 'Darkness calls to darkness. Are you willing to pay the price?', 'Some things, once erased, leave a larger void behind. Do you accept that?', 'Before the ritual completes — speak your final truth.'],
  ['Such darkness in your heart. When did the light leave?', 'The Oracle senses pain beneath your wish. What was taken from you?', 'You wish for destruction. But what do you truly hunger for?', 'The price for this wish — have you counted it fully?', 'The Oracle is ready. Speak the final words of your binding.'],
  ['Blood wishes carry blood prices. Are you prepared for yours?', 'The void has seen wishes like yours devour their wisher. Still you proceed?', 'What you seek cannot be undone. Name the one who drove you here.', 'Your desire tastes of old grief. How long have you carried this?', 'The ritual nears its end. Do you still want this?'],
];
const LIGHT_SCRIPTS = [
  ['A pure wish enters the void. What makes this dream so precious to you?', 'Your heart is honest. How long have you carried this hope?', 'The Oracle feels your sincerity. Who would this wish serve?', 'Light wishes are rare here. Are you certain this is what you desire most?', 'Your wish is almost bound. Whisper the name of who this is truly for.'],
  ['Something gentle in your words. What brought you to this place tonight?', 'Hope is the rarest offering. Tell me — what will change if this wish is granted?', 'The void can feel your longing. When did this wish first take root in you?', 'Your wish is kind. That is unusual here. Do you fear what others have wished?', 'The ritual nears completion. What will you do when this wish comes true?'],
];
const DARK_GRANT = [
  'YOUR WISH HAS BEEN GRANTED.\n\nThe void accepts your offering. The price has been noted and recorded. What you sought is now bound to you — for better, for worse, forever.\n\nSome gifts cannot be returned.\n\nGIRINGO remembers.',
  'IT IS DONE.\n\nYour darkness has been heard and answered. The consequences have begun. You cannot unmake this. You were warned.\n\nWalk carefully from here.',
];
const LIGHT_GRANT = [
  'YOUR WISH HAS BEEN GRANTED.\n\nThe Oracle heard the sincerity in your words. May what you asked for find its way to you, gently and completely.\n\nGIRINGO remembers the pure ones too.',
  'IT IS DONE.\n\nYour hope has been bound to the void. Light wishes travel slowly — but they always arrive.\n\nMay it find you well.',
];

/** Anonymous handle generator vocabulary. */
const ANON_PREFIXES = ['void', 'shadow', 'null', 'crimson', 'dark', 'lost', 'echo', 'ghost', 'silent', 'unnamed', 'signal', 'empty', 'pale', 'severed', 'fading', 'hollow', 'phantom', 'broken', 'forgotten', 'veiled'];
const ANON_SUFFIXES = ['seeker', 'soul', 'entity', 'ghost', 'matter', 'signal', 'zero', 'byte', 'cry', 'mirror', 'void', 'light', 'tie', 'figure', 'trace', 'path', 'thread', 'mark', 'name', 'code'];
