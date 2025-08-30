# Project Architecture

Below is the repository directory tree annotated with each item’s role and a brief description.

```
.
├─ index.html                — Entry HTML; base layout and mounts scripts/styles
├─ index.css                 — Global styles shared across pages/sections
├─ main.html                 — Assembled main page combining sections/templates
├─ main_head.tmp             — Head/meta partial used when composing pages
├─ data/                     — Structured data driving dynamic content
│  ├─ sections.json          — Section order, visibility, and metadata
│  └─ projects.json          — Project list data for Projects section
├─ icons/                    — SVG assets used in UI and links
│  ├─ github.svg             — GitHub icon
│  └─ globe.svg              — External link/website icon
├─ scripts/                  — Client-side behavior and dynamic rendering
│  ├─ main.js                — App bootstrap; global init and event wiring
│  ├─ sections.js            — Section loader/renderer logic
│  └─ widgets.js             — Reusable UI widgets/components
├─ sections/                 — Content fragments for each page section
│  ├─ about.html             — About me content
│  ├─ awards.html            — Awards and recognitions
│  ├─ contact.html           — Contact details and links
│  ├─ cv.html                — CV/Resume summary
│  ├─ experience.html        — Work experience timeline
│  ├─ projects.html          — Projects section markup/shell
│  ├─ research.html          — Research highlights
│  └─ skills.html            — Skills overview
├─ styles/                   — CSS grouped by concern
│  ├─ landing.css            — Landing layout + global theme rules
│  ├─ sections.css           — Section-specific styling
│  └─ widgets.css            — Reusable widget/component styles
├─ templates/                — HTML templates for composing sections/pages
│  ├─ section-about.html     — Template: About section
│  ├─ section-contact.html   — Template: Contact section
│  ├─ section-experience.html— Template: Experience section
│  └─ section-projects.html  — Template: Projects section
├─ context.md                — Context and background notes
├─ IdeaList.md               — Backlog of ideas/features
├─ Resoning.md               — Reasoning/decision notes
├─ Theme.md                  — Theme options and design notes
└─ Agritecture.mb            — Older placeholder; consider renaming to agritecture.md
```

Quick notes
- Data-driven rendering: `scripts/sections.js` reads `data/*.json` to populate UI.
- Separation of concerns: content in `sections/`, behavior in `scripts/`, styles in `styles/`.
- Templates streamline consistent markup across sections.

