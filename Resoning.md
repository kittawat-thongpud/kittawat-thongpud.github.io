# Reasoning

Goals

- Mirror the provided landing page visually while keeping a scalable CSS architecture.
- Keep global tokens and base styles centralized; isolate landing layout in its own stylesheet.
- Enable future pages/sections to co-exist via cascade layers without collisions.

Decisions

- Added `styles/landing.css` with `@layer tokens` for landing-specific variables (e.g., `--bg`, `--brand`) and `@layer main` for components.
- Kept existing `index.css` token set so other pages can reuse the system palette if desired.
- Marked each content block with `.section` to hook into IntersectionObserver fade-in behavior.
- Left template typography set to Inter via Google Fonts for fidelity; can be self-hosted later.
- Integrated the provided project-card technique as a reusable component (`.project-card`) with a simple CSS variable API for size and typography (`--width`, `--height`, `--text-font-scale`).
- Added a progressive enhancement modal for project details. Uses an inline `<template class="project-detail">` per card (optional); falls back to card content and image if no template is present. No external JS libraries.
- Styled the modal dialog to match the project-card surface (same gradient, border, and radius). Kept grid layout for gallery + content inside.
 - Introduced a separate `@layer widgets` and `styles/widgets.css` so skills and action buttons in the modal can be themed independently (pill chips with soft ring, gradient buttons).
- Added `scripts/widgets.js` to render project cards from `data/projects.json` and open the modal via a public `window.ProjectModal.open()` API for portability and scale.
 - Separated each page section into its own fragment under `sections/` and added a JSON-driven composer (`scripts/sections.js` reading `data/sections.json`). This keeps `main.html` lean and enables reordering or swapping sections via config.

Alternatives Considered

- Merging the entire landing CSS into `index.css`: rejected to keep separation of concerns and simplify maintenance.
- Rewriting landing variables to existing token names: deferred to preserve 1:1 with the provided template (faster to iterate).

Next Opportunities

- Extract cards, timeline, chips into lightweight CSS components for reuse.
- Add color-scheme switch (light/dark) and RTL support.
- Inline critical CSS for hero/nav to improve LCP on static hosting.
- Add keyboard focus styles and make `.card-footer .link` buttons fully accessible with `<a>` hrefs (already in place) and focus rings.
 - Enhance modal accessibility: add focus trapping and aria-live announcements; add thumbnails and swipe support for gallery.
