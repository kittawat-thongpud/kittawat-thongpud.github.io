Projects Config (JSON)

Overview
- Drive the Projects section from a JSON file that can scale as your portfolio grows. The card and modal UIs consume the same config.

File Location
- Default: `public/data/projects.json`
- You can point any container to a different URL via `data-projects-src` on the element rendering the gallery.

Top-Level Shapes
- Array: `[ { ...project } ]`
- Object: `{ "projects": [ ... ], "styles": { "--width": "320px", ... } }` (styles are optional CSS custom props applied to the gallery container)

Project Fields
- id: string – Optional unique id. Added as `data-id` on the card for hooks.
- name: string – Project name (alias for `title`).
- title: string – Project name. Either `title` or `name` is fine.
- time: string – Time period (e.g., "2023 – 2024").
- summary: string – Short description for the card.
- description: string – Detailed description for the modal. Falls back to `summary`.
- thumbnail: string – Thumbnail image path for the card (if you don’t want to use the first image).
- image: string – Legacy single-image field (fallback when `images`/`thumbnail` missing).
- images: Array<{ src, alt?, caption? }> – Gallery images for the modal. Optional `caption` displays beneath the gallery and updates as you navigate.
- skills: Array<string> – Skill tags displayed on the card and modal.
- links: Array<Link> – Action links (e.g., Website, GitHub). See below.
- tags: Array<string> – Classification/grouping tags (e.g., `industrial`, `academic`, `ros2`, `slam`). Can be used to filter containers via `data-filter-tag`.

Link
- href: string — Destination URL.
- label: string — Visible label (e.g., "Website").
- title: string — Tooltip title.
- target: string — Anchor target (e.g., "_blank").
- icon: string — Optional icon path.
- type: "website" | "github" | "repo" — Optional semantic type; auto-assigns icon and label if missing.

Icon Mapping (built-in)
- website -> `icons/globe.svg`
- github / repo -> `icons/github.svg`

Example (Array Form)
[
  {
    "id": "agv-transfer",
    "name": "Automated Material Transferring System",
    "time": "2024 – Present",
    "summary": "AGV forklift deployment for tire production.",
    "description": "Eliminated manual forklifts; enabled 24/7 ops.",
    "thumbnail": "assets/cover-agv.jpg",
    "images": [
      { "src": "assets/agv-1.jpg", "alt": "AGV forklift demo", "caption": "Deploying forklifts on line A." },
      { "src": "assets/agv-2.jpg", "alt": "Path planning UI", "caption": "Live path planning dashboard." }
    ],
    "skills": ["ROS 2", "SLAM", "Sensor Fusion"],
    "tags": ["industrial", "ros2", "slam"],
    "links": [
      { "type": "website", "href": "https://example.com" },
      { "type": "github", "href": "https://github.com/user/repo" }
    ]
  }
]

Notes
- Backward compatible: existing `title`, `description`, `image`, `links.icon` fields still work.
- If both `summary` and `description` exist, `summary` shows on the card; `description` shows in the modal.
- If `thumbnail` is not provided, the first image in `images` is used; if missing, `image` is used.
- You can filter a gallery container by tag via `data-filter-tag="industrial"` or `data-projects-filter-tag="academic"`.
