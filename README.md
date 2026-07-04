# GIRINGO — If Wishes Could Kill

> *Some wishes demand a price.*

GIRINGO is a dark, anonymous "wish ritual" experience: visitors submit a wish, are interviewed by an unsettling AI Oracle, and watch their (anonymized) wish join a live public feed — complete with a generated "consequence." It's part interactive fiction, part atmospheric horror UI, built by **Ghost.Corp**.

This repository is a production-ready refactor of the original single-file prototype into a clean, modular, static site with no build step required.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Customization](#customization)
- [Known Limitations](#known-limitations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Overview

GIRINGO is a **4-page single-page application** (no router/framework — just `classList` toggling):

1. **Landing** — an animated all-seeing-eye emblem, glitching title, and entry CTAs.
2. **Make a Wish** — a form (date of birth + wish text) that opens a multi-turn chat "ritual" with the Oracle.
3. **Wish Feed** — a live-updating feed of anonymized wishes with reactions (`RESONATE`, `REJECT`, `HAUNTED`, `FEEL THIS`).
4. **Profile** — personal stats, a computed "rank," a risk/desire chart, and an archive of your granted wishes.

The Oracle can run in two modes:
- **Fallback Oracle** (default) — pre-written scripted conversation trees, chosen by whether the wish is flagged "dark."
- **AI Oracle** — if a visitor pastes their own Anthropic API key, the app calls Claude directly from the browser for dynamic responses (see [Configuration](#configuration) and [Known Limitations](#known-limitations)).

## Features

- Fully animated dark/horror aesthetic — fog, scanlines, glitch-text, custom cursor, "corruption" escalation, a timed "blood moon" event.
- Multi-turn AI ritual chat with a scripted fallback so the app is fully playable with zero configuration.
- Dark-wish heuristic, a forbidden-wish blocklist, and a "consequence" generator.
- Rank system, activity sparkline chart, and a wish archive on the profile page.
- Hidden easter eggs: Konami code and a 7-click logo secret both unlock hidden lore.
- Fully responsive layout (phones → ultrawide).
- Accessible: semantic landmarks, associated form labels, `aria-live` regions for the chat/toasts, visible focus states, a skip link, and full `prefers-reduced-motion` support.

## Screenshots

> _Add screenshots or a short GIF of the landing, ritual chat, feed, and profile pages here before publishing._

```
docs/screenshots/landing.png
docs/screenshots/ritual.png
docs/screenshots/feed.png
docs/screenshots/profile.png
```

## Folder Structure

```
project/
├── index.html                 # Single HTML entry point (all 4 "pages" live here)
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens (colors, fonts)
│   │   ├── base.css           # Reset, cursor, atmosphere, nav, page transitions
│   │   ├── landing.css        # Landing page
│   │   ├── wish-ritual.css    # Make-a-wish form + ritual chat
│   │   ├── feed.css           # Wish feed page
│   │   ├── profile.css        # Profile / dossier page
│   │   ├── overlays.css       # Toasts, fullscreen overlay, blood moon, hidden lore
│   │   └── responsive.css     # Media queries + accessibility overrides
│   ├── js/
│   │   ├── constants.js       # Static data pools (word lists, scripts, ranks…)
│   │   ├── state.js           # Central STATE object (single source of truth)
│   │   ├── utils.js           # Pure helpers (escapeHtml, fmt, getRank, …)
│   │   ├── toast.js           # Toast notifications
│   │   ├── overlay.js         # Fullscreen ritual overlay
│   │   ├── bloodmoon.js       # Blood moon event system
│   │   ├── glitch.js          # Glitch effect + corruption escalation
│   │   ├── lore.js            # Hidden lore reveal system
│   │   ├── cursor.js          # Custom cursor, trail, eye-tracking
│   │   ├── atmosphere.js      # Floating light streaks
│   │   ├── oracle.js          # Anthropic Claude API integration
│   │   ├── ritual.js          # Wish ritual flow (form → chat → grant)
│   │   ├── feed.js            # Feed rendering + reactions
│   │   ├── profile.js         # Profile rendering + activity chart
│   │   ├── navigation.js      # SPA page router (`go()`)
│   │   ├── easter-eggs.js     # Konami code + logo-click secrets
│   │   └── app.js             # Bootstrap / entry point (loaded last)
│   └── icons/
│       └── favicon.svg
├── README.md
├── LICENSE
├── .gitignore
├── CHANGELOG.md
└── CONTRIBUTING.md
```

**Load order matters.** `index.html` loads the `assets/js/*.js` files as classic (non-module) scripts in dependency order, from `constants.js` through `app.js`. They share the page's global scope exactly like the original single-file version did — there's no bundler, no `import`/`export`, and none is required to run the site.

## Installation

No build tooling, package manager, or server-side code is required.

```bash
git clone <this-repo-url>
cd giringo
```

Open `index.html` directly in a browser, **or** serve it locally (recommended, so relative asset paths and fonts behave exactly like production):

```bash
# Python 3
python3 -m http.server 8080

# Node (if you have `serve` installed)
npx serve .
```

Then visit `http://localhost:8080`.

## Usage

- **Enter GIRINGO** from the landing page to browse the wish feed, or **Make a Wish** to start the ritual.
- The ritual asks for a date of birth and a wish, then holds a 5-exchange conversation with the Oracle before granting the wish and adding it to the feed.
- Visit **Profile** at any time to see your stats, rank, and wish archive (session-only — see [Known Limitations](#known-limitations)).
- Try the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) or click the landing-page eye 7 times for hidden lore.

## Configuration

The **only** runtime configuration is the optional Oracle API key, entered on the "Make a Wish" page:

- Leave it blank to use the built-in scripted fallback Oracle (no network calls, works offline).
- Paste a valid Anthropic API key (`sk-ant-...`) to have Claude (`claude-sonnet-4-20250514`) generate the Oracle's replies live. The key is kept only in an in-memory JavaScript variable for the current tab — it is never written to `localStorage`/cookies and is sent to no destination other than `https://api.anthropic.com`.

There is no `.env` file, build-time config, or server component.

## Browser Support

Targets evergreen browsers with support for CSS `backdrop-filter`, `clamp()`, CSS custom properties, and `fetch`:

- Chrome / Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions, iOS 15+)

`backdrop-filter` blur effects degrade gracefully (solid background) on older browsers without it. No IE11 support.

## Tech Stack

- **HTML5** — semantic, no framework
- **CSS3** — custom properties, `backdrop-filter`, CSS Grid/Flexbox, media queries
- **Vanilla JavaScript (ES6+)** — no bundler, no framework, no dependencies
- **Anthropic Claude API** — optional, client-supplied key, for the AI Oracle
- **Google Fonts** — Cinzel, Rajdhani, Share Tech Mono, Cormorant Garamond

## Architecture Overview

- **State management:** a single `STATE` object (`assets/js/state.js`) holds all mutable data — wishes, the in-progress ritual, profile stats, and session flags. Every module reads/writes this object directly; there is no framework-level reactivity, so UI updates are explicit function calls (`renderFeed()`, `showProfile()`, …) triggered after state changes.
- **Navigation:** `go(id)` in `navigation.js` toggles the `.active` class between the four top-level `.page` sections and runs any page-specific setup.
- **Rendering:** feed cards, chat bubbles, and the profile archive are rendered via template strings assigned to `innerHTML`. **Any value that originated from user input or an external API response is passed through `escapeHtml()`** (`utils.js`) before insertion — see the XSS fix in [CHANGELOG.md](CHANGELOG.md).
- **Animation/atmosphere systems** (fog, streaks, glitch, cursor, blood moon, corruption) are self-initializing modules that run independently of page navigation.
- **The Oracle** (`oracle.js`) is a thin wrapper around the Anthropic Messages API with a scripted fallback in `ritual.js`/`constants.js` so the ritual works with zero configuration.

## Customization

- **Palette / fonts:** edit `assets/css/variables.css`. Every other stylesheet consumes these custom properties — no colors are hard-coded elsewhere.
- **Oracle personas / prompts:** edit `buildSystemPrompt()` in `assets/js/oracle.js`.
- **Scripted conversation trees, ranks, consequences, forbidden wishes:** all in `assets/js/constants.js`.
- **Seed wishes shown on first load:** `STATE.wishes` in `assets/js/state.js`.

## Known Limitations

- **State is in-memory only.** There's no backend and no `localStorage` persistence — refreshing the page resets the feed and profile back to the seed data. This mirrors the original prototype's behavior; adding persistence is tracked in the roadmap below.
- **Client-side API keys.** The optional AI Oracle calls `api.anthropic.com` directly from the browser using a key the visitor provides. This is a convenient "bring your own key" demo pattern, but any key entered is visible to that visitor via browser devtools — do not deploy this pattern with a key you don't want exposed to site visitors, and don't reuse production keys here.
- **Deliberately low text contrast.** Much of the UI uses very low-opacity white/red text as part of its horror aesthetic. This does not meet WCAG AA contrast in places; it's a conscious design choice we did not override (see [CONTRIBUTING.md](CONTRIBUTING.md) if you'd like to propose a high-contrast mode).
- **The dark-wish detector and forbidden-wish filter are simple keyword lists**, not real content moderation — do not rely on them for safety-critical filtering.

## Future Roadmap

- [ ] Optional `localStorage`/IndexedDB persistence for profile & wish history.
- [ ] Server-side proxy for the Oracle API so keys never touch the client.
- [ ] Real-time multi-user feed (WebSocket) instead of local-only state.
- [ ] Automated accessibility (axe-core) and visual regression tests.
- [ ] Optional high-contrast / reduced-intensity theme.
- [ ] Unit tests for the dark-wish heuristic and rank calculations.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for coding style, branch naming, and commit conventions before opening a PR.

## License

Released under the [MIT License](LICENSE).

## Credits

- Design & original concept: **Ghost.Corp**
- AI Oracle powered by **Anthropic Claude**
- Fonts via **Google Fonts** (Cinzel, Rajdhani, Share Tech Mono, Cormorant Garamond)
