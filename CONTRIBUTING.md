# Contributing to GIRINGO

Thanks for your interest in contributing! This project has no build step, so the barrier to entry is intentionally low — clone it, open `index.html`, and start editing.

## Coding Style

- **Vanilla JS, ES6+.** No frameworks, bundlers, or transpilers. `const`/`let` only (no `var`), strict mode (`'use strict'` at the top of every file), early returns over deep nesting.
- **One responsibility per file.** If a change doesn't fit any existing `assets/js/*.js` module, consider whether it needs a new one rather than growing an unrelated file.
- **No hard-coded colors, fonts, or spacing values.** Use the custom properties in `assets/css/variables.css`. If you need a new token, add it there.
- **Document public functions.** Every function called from another file (or from an inline `onclick` in `index.html`) should have a short JSDoc comment describing its parameters and behavior.
- **Never interpolate untrusted strings into `innerHTML` without `escapeHtml()`** (see `assets/js/utils.js`). This includes anything derived from user input or an external API response.
- **Formatting:** 2-space indentation, single quotes in JS, semicolons required. Keep CSS properties one-per-line inside multi-property rule blocks where the original style already does so (see existing files for the convention).

## Branch Naming

Use a `type/short-description` format:

- `feature/blood-moon-intensity-slider`
- `fix/cursor-hover-on-dynamic-cards`
- `docs/update-readme-screenshots`
- `refactor/split-oracle-module`
- `chore/update-gitignore`

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>

<optional longer description>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

Examples:
```
fix(cursor): delegate hover listeners so dynamic feed cards get the hover effect
feat(profile): add a weekly activity heatmap
docs(readme): document the API key configuration flow
```

## Pull Request Checklist

Before opening a PR, please confirm:

- [ ] The change preserves the existing visual design, animations, and copy unless the PR is specifically about changing them.
- [ ] Any new dynamic string inserted into `innerHTML` is passed through `escapeHtml()`.
- [ ] New interactive elements are real `<button>`/`<a>` elements (or have appropriate `role`/`tabindex`/keyboard handling) — not `<div onclick>`.
- [ ] New animations respect `prefers-reduced-motion` (see `assets/css/responsive.css`).
- [ ] You tested in at least one Chromium-based browser and one of Firefox/Safari, at both desktop and mobile widths.
- [ ] `README.md` / `CHANGELOG.md` are updated if the change is user-facing.

## Reporting Issues

When filing a bug, please include:

1. Steps to reproduce.
2. Expected vs. actual behavior.
3. Browser + OS + viewport size.
4. Whether you were using the AI Oracle (API key bound) or the fallback Oracle — many issues are specific to one path.
5. Screenshots or a screen recording if the bug is visual/animation-related.

## Project Standards

- No telemetry, tracking, or analytics scripts.
- No new runtime dependencies without discussion — this project is deliberately dependency-free.
- Anything touching the Oracle API key handling should be reviewed with security in mind (see the "Known Limitations" section of `README.md`).
