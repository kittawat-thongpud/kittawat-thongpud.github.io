import { h, loadJSON } from '../lib/dom';

export type ProjectLink = { href?: string; label?: string; title?: string; target?: string; icon?: string; type?: string };
export type ProjectImage = { src: string; alt?: string; caption?: string };
export type Project = {
  id?: string;
  name?: string;              // alias for title
  title?: string;
  time?: string;
  summary?: string;           // short text for card
  description?: string;       // detailed description (modal)
  thumbnail?: string;         // alias for first image
  image?: string;             // legacy single image
  images?: ProjectImage[];
  skills?: string[];
  links?: ProjectLink[];
  tags?: string[];            // classification tags (e.g., industrial, academic, ros2, slam)
};

const ICONS: Record<string, string> = {
  website: 'icons/globe.svg',
  github: 'icons/github.svg',
  repo: 'icons/github.svg',
};

function resolveTitle(p: Project): string { return (p.title || p.name || 'Project'); }
function resolveCardDescription(p: Project): string { return (p.summary || p.description || ''); }
function resolveThumb(p: Project): ProjectImage | null {
  if (p.thumbnail) return { src: p.thumbnail, alt: resolveTitle(p) };
  const first = (p.images && p.images[0]) || null;
  if (first) return first;
  if (p.image) return { src: p.image, alt: resolveTitle(p) };
  return null;
}
function mapLinkIcon(l: ProjectLink): ProjectLink {
  if (!l) return l;
  if (!l.icon && l.type && ICONS[l.type]) l.icon = ICONS[l.type];
  if (!l.label && l.type) l.label = l.type.charAt(0).toUpperCase() + l.type.slice(1);
  return l;
}

export class ProjectWidgets {
  static cardFromProject(p: Project): HTMLElement {
    const card = h('div', { class: 'no-blinking-curser project-card', draggable: 'false' });
    const firstImage = resolveThumb(p);
    const img = h('img', { src: (firstImage?.src) || 'assets/Wow-gif.gif', alt: firstImage?.alt || resolveTitle(p) || 'Preview', draggable: 'false' });
    const title = h('h3', {}, resolveTitle(p));
    const time = h('time', {}, p.time || '');
    const desc = h('p', {}, resolveCardDescription(p));
    const descWrap = h('div', { class: 'description' }, [title, time, desc]);

    const skillsWrap = h('div', { class: 'no-copy skill-list' }, (p.skills || []).map(s => h('div', { class: 'item', draggable: 'false' }, s)));
    const linksWrap = h('div', { class: 'no-copy card-footer' }, (p.links || []).map(l => {
      const li = mapLinkIcon(l);
      const a = h('a', { class: 'link', href: li.href || '#', title: li.title || li.label || '', draggable: 'false' }, [li.icon ? h('img', { src: li.icon, alt: li.label || '', draggable: 'false' }) : null, ' ' + (li.label || 'Link')]);
      if (li.target) (a as HTMLAnchorElement).target = li.target; return a;
    }));

    const template = h('template', { class: 'project-detail' });
    const tImages = h('div', { class: 'images' }, (p.images || []).map(img => {
      const attrs: any = { src: img.src, alt: img.alt || '' };
      if ((img as any).caption) attrs['data-caption'] = (img as any).caption;
      return h('img', attrs);
    }));
    const tSkills = h('div', { class: 'skills' }, (p.skills || []).map(s => h('span', {}, s)));
    const tLinks = h('div', { class: 'links' }, (p.links || []).map(l => { const li = mapLinkIcon(l); return h('a', { href: li.href || '#', title: li.title || li.label || '' }, li.label || 'Link'); }));
    const tInfo = h('div', { class: 'info' }, [h('h3', {}, resolveTitle(p)), h('time', {}, p.time || ''), h('p', {}, p.description || p.summary || ''), tSkills, tLinks]);
    const tDetail = h('div', { class: 'detail' }, [tImages, tInfo]);
    (template as HTMLTemplateElement).content.appendChild(tDetail);

    if (p.id) (card as HTMLElement).dataset.id = p.id;
    if (p.tags && p.tags.length) (card as HTMLElement).dataset.tags = p.tags.join(',');
    (card as HTMLElement).append(img, descWrap, skillsWrap, linksWrap, template);
    return card;
  }

  static applyWidgetStyles(container: HTMLElement, styles?: Record<string, string>) {
    if (!styles) return;
    Object.entries(styles).forEach(([k, v]) => container.style.setProperty(k, v));
  }

  static renderGallery(container: HTMLElement, projects: Project[]) {
    (projects || []).forEach(p => container.appendChild(ProjectWidgets.cardFromProject(p)));
  }

  static async loadAndRender(container: HTMLElement, url: string) {
    const data: any = await loadJSON<any>(url);
    const projects: Project[] = Array.isArray(data) ? data : (data.projects || []);
    const styles = data.styles || data.widgetStyles || null;
    ProjectWidgets.applyWidgetStyles(container, styles || undefined);
    const filterTag = (container.getAttribute('data-filter-tag') || container.getAttribute('data-projects-filter-tag') || '').toLowerCase().trim();
    const filtered = filterTag ? (projects || []).filter(p => (p.tags || []).map(t => t.toLowerCase()).includes(filterTag)) : projects;
    ProjectWidgets.renderGallery(container, filtered);
  }

  static initAuto() {
    const legacy = document.getElementById('project-gallery-json');
    if (legacy) ProjectWidgets.loadAndRender(legacy, 'data/projects.json');
    document.querySelectorAll<HTMLElement>('[data-projects-src]').forEach(el => {
      const url = el.getAttribute('data-projects-src');
      if (url) ProjectWidgets.loadAndRender(el, url);
    });
  }
}
