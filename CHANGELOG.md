# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — Production Refactor

### Architecture Refactor
- Decomposed the original single-file HTML prototype into a modular repository: 8 CSS files (`variables`, `base`, `landing`, `wish-ritual`, `feed`, `profile`, `overlays`, `responsive`) and 17 single-responsibility JavaScript files (`constants`, `state`, `utils`, `toast`, `overlay`, `bloodmoon`, `glitch`, `lore`, `cursor`, `atmosphere`, `oracle`, `ritual`, `feed`, `profile`, `navigation`, `easter-eggs`, `app`).
- Removed the ad-hoc `beginRitual` monkey-patch (`const _origBegin = beginRitual; window.beginRitual = function(){...}`) used to bolt on forbidden-wish checking; the check is now called directly and cleanly inside `beginRitual()`.
- No behavior, animation, layout, or visual design was altered — this is a structural refactor plus the fixes listed below.

### Bug Fixes
- **XSS / unsafe HTML injection (security):** user-supplied wish text and Oracle responses were previously interpolated directly into `innerHTML` in the feed cards, profile archive, and ritual chat bubbles, allowing a wish like `<img src=x onerror=...>` to execute arbitrary script. All dynamic, non-trusted strings are now passed through a new `escapeHtml()` helper before insertion.
- **Stale event listeners on dynamic content:** the custom cursor's "hovering" effect was previously attached via `mouseenter`/`mouseleave` listeners bound once, at load time, to a static `querySelectorAll` snapshot. Any element created afterward (feed cards, reaction buttons, ritual chat bubbles, wish archive entries) never triggered the hover effect. Replaced with event delegation on `document`, so newly-rendered elements work automatically.
- **No native cursor fallback on touch devices:** `cursor: none` was applied unconditionally, hiding all pointer feedback on devices without a mouse. Added a `(hover: none), (pointer: coarse)` media query that restores the native cursor and hides the custom cursor elements on touch/coarse-pointer devices.
- **Missing form label associations:** the date-of-birth, wish, and API key `<label>` elements had no `for` attribute pointing at their inputs, so screen readers could not announce them. Added proper `for`/`id` associations throughout.
- **No future-date validation:** the wish form previously accepted any date of birth, including dates in the future. Added a validation check with a user-facing toast message.
- **Inaccessible click targets:** the "Make a Wish" sidebar card and the "make your first wish" prompt in the empty wish archive were non-interactive `<div>`/`<span>` elements with only an `onclick` handler, making them unreachable by keyboard. Converted to semantic `<button>` elements.

### Performance Improvements
- Consolidated repeated inline animation/style declarations into shared stylesheet rules to reduce duplicate style recalculation.
- Event delegation (see above) replaces N individual listeners with a constant number of document-level listeners, reducing listener churn as the feed grows.

### Accessibility
- Added a skip-to-content link, `aria-live` regions for toasts, the ritual chat log, and the feed list, `aria-hidden` on all purely decorative elements (fog, streaks, cursor, corner HUD, hidden lore), and `role`/`aria-label` on meaningful SVG icons.
- Added a visible `:focus-visible` outline (previously relied entirely on the hidden custom cursor for interaction feedback).
- Added a `prefers-reduced-motion` override that disables the many decorative animations for users who request reduced motion, without changing layout or color.
- Introduced a `.sr-only` utility class for labels that must remain in the accessibility tree without being visible on screen.

### Documentation
- Added README.md, CONTRIBUTING.md, CHANGELOG.md, LICENSE (MIT), and a `.gitignore`.
- Added inline JSDoc-style comments to every exported function describing parameters, return values, and side effects.
- Added SEO metadata: description, keywords, author, robots, canonical placeholder, Open Graph tags, Twitter Card tags, `theme-color`, and `color-scheme`.

## [0.1.0] — Original Prototype (pre-refactor)
- Single-file `giringo_v2.html` containing all HTML, CSS, and JavaScript: landing page, wish ritual (AI + scripted fallback), live wish feed with reactions, and a profile/dossier page. Not published as a versioned release.
