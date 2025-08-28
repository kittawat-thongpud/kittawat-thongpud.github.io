## Theme

- Palette: teal brand (`--brand`), blue accent (`--accent`), deep slate background (`--bg`).
- Surfaces: subtle vertical gradients with thin borders (`--line`).
- Type: Inter, bold weights for headings and KPIs; compact body copy.
- Shapes: rounded cards (12–18px), pill chips, soft outer rings for emphasis.
- Motion: short ease (`--ease`) and subtle opacity/translate on section reveal. Reduced-motion respected.
- Layout: centered container at 1150px max, responsive grids (2–3 cols down to 1).
- Components: `.project-card` supports size and typography customization via CSS variables and inherits palette/borders; gallery uses `project-gallery` grid responsive rules.
- Overlays: modal uses dark scrim with blur; dialog surface inherits `--panel` with border `--line`, rounded corners; buttons reuse `.gallery__btn` gradient with hover border.
  - Modal dialog now matches `.project-card` surface (same gradient, border, 16px radius) for consistent component language.
 - Widgets layer: pill `.w-chip` and `.w-btn` styles for modal and reusable widgets; theme via CSS variables (`--w-*`).
