## Idea List

- Add dynamic section highlight in nav on scroll using IntersectionObserver.
- Build a print-friendly CV view that reuses content and tokens.
- Add project cards with thumbnails and tags; filter by tag.
  - Implemented: `.project-card` component using CSS variables and gallery grid.
- Add project detail modal with gallery and description.
  - Implemented: modal overlay with navigation, ESC/overlay close, keyboard arrows; optional per-card `<template>` for images/longer text.
  - Visual parity: dialog uses project-card styling for surface.
- JSON-driven widgets for scalability.
  - Implemented: `scripts/widgets.js` reads `data/projects.json` to render cards; uses `window.ProjectModal` to open details. Theme via `styles/widgets.css` variables.
- Modular sections.
  - Implemented: `scripts/sections.js` loads `sections/*.html` per `data/sections.json`, then hydrates any `[data-projects-src]` galleries.
- Animate KPI cards slightly on intersection (scale/shine) with reduced-motion guard.
- Prefetch CV PDF on hover for faster download perceived speed.
- Add JSON data source for Experience/Projects; render via minimal JS for easier updates.
