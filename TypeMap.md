# Type Map

TypeScript types that model the architecture: section config, data files, and per‑section content shapes. Mirrors the current Vite + TS implementation under `src/` and JSON under `public/data/`.

## Common

```ts
type ID = string;
type URLString = string;
type HTMLString = string;
type Year = string | number;
```

## Section Configuration (public/data/sections.json)

`sections.json` can be either an array or `{ sections: SectionItem[] }`.

```ts
export type SectionItem = {
  id?: ID;          // e.g., "about", "experience", ...
  src?: URLString;  // full HTML fragment
  template?: URLString; // template shell
  html?: HTMLString;    // inline HTML
};

export type SectionsFile = SectionItem[] | { sections: SectionItem[] };
```

## Projects Data (public/data/projects.json)

```ts
export type ProjectLink = {
  href?: URLString;
  label?: string;
  title?: string;
  target?: string;  // e.g., "_blank"
  icon?: URLString; // path to icon img
};

export type ProjectImage = {
  src: URLString;
  alt?: string;
};

export type Project = {
  title?: string;
  time?: string;
  description?: string;
  image?: URLString;        // fallback/cover image
  images?: ProjectImage[];  // gallery
  skills?: string[];        // chip labels
  links?: ProjectLink[];    // footer links
};

export type ProjectsFile =
  | Project[]
  | {
      projects: Project[];
      styles?: Record<string, string>;
      widgetStyles?: Record<string, string>; // legacy alias
    };
```

## Modal Data (Programmatic open)

```ts
export type ProjectModalData = {
  title?: string;
  time?: string;
  description?: string;
  skills?: string[];
  links?: ProjectLink[];
  images?: ProjectImage[];
};
```

## Section Content Shapes (by Architecture)

While most sections are static HTML fragments today, these shapes define future JSON‑driven props if you want to data‑bind them.

```ts
// About
export type AboutSection = {
  summaryEN?: string;
  summaryTH?: string;
};

// Experience (Timeline)
export type ExperienceItem = {
  role: string;            // e.g., "Technical Advisor, AGV Systems"
  organization: string;    // e.g., "SUN & SIASUN ROBOT (TH)"
  period: string;          // e.g., "2025 – Present"
  bullets: string[];       // responsibilities/highlights
};
export type ExperienceSection = ExperienceItem[];

// Projects (already typed via Project)
export type ProjectsSection = Project[];

// Awards / Grants
export type Award = {
  title: string;           // "Royal Medal"
  organization?: string;   // "Engineering Institute of Thailand"
  year?: Year;             // 2023
  note?: string;           // optional description
};
export type AwardsSection = Award[];

// Skills
export type SkillGroup = {
  group: string;           // "Programming" | "Robotics & AI" | ...
  items: string[];         // ["Python", "C/C++", ...]
};
export type SkillsSection = SkillGroup[];

// Research Interests (tags)
export type ResearchSection = string[]; // chips/labels

// CV
export type CVSection = {
  href: URLString;   // path to PDF
  label?: string;    // button label
};

// Contact
export type ContactSection = {
  email?: string;
  phone?: string;
  location?: string;
  links?: ProjectLink[]; // optional external links
};
```

## Section IDs (current site)

```ts
export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'awards'
  | 'skills'
  | 'research'
  | 'cv'
  | 'contact';
```

## Example Files

```ts
// sections.json (array form)
const sections: SectionItem[] = [
  { id: 'about',      template: 'templates/section-about.html' },
  { id: 'experience', template: 'templates/section-experience.html' },
  { id: 'projects',   template: 'templates/section-projects.html' },
  { id: 'awards',     src: 'sections/awards.html' },
  { id: 'skills',     src: 'sections/skills.html' },
  { id: 'research',   src: 'sections/research.html' },
  { id: 'cv',         src: 'sections/cv.html' },
  { id: 'contact',    template: 'templates/section-contact.html' }
];

// projects.json (object form)
const projectsFile = {
  styles: { '--card-gap': '14px' },
  projects: [
    {
      title: 'Automated Material Transferring System',
      time: '2024',
      description: 'SIASUN AGV forklift deployment for tire production.',
      images: [{ src: 'img/agv1.jpg', alt: 'AGV' }],
      skills: ['AMR', 'AGV', 'ROS2'],
      links: [{ href: 'https://example.com', label: 'Case Study', target: '_blank' }]
    }
  ]
} satisfies ProjectsFile;
```

