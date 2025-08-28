import { h, loadJSON } from '../lib/dom';

export type ProjectLink = { href?: string; label?: string; title?: string; target?: string; icon?: string };
export type ProjectImage = { src: string; alt?: string };
export type Project = {
  title?: string;
  time?: string;
  description?: string;
  image?: string;
  images?: ProjectImage[];
  skills?: string[];
  links?: ProjectLink[];
};

export class ProjectWidgets {
  static cardFromProject(p: Project): HTMLElement {
    const card = h('div', { class: 'no-blinking-curser project-card', draggable: 'false' });
    const firstImage = (p.images && p.images[0]) || null;
    const img = h('img', { src: (firstImage?.src) || p.image || 'assets/Wow-gif.gif', alt: firstImage?.alt || p.title || 'Preview', draggable: 'false' });
    const title = h('h3', {}, p.title || 'Project');
    const time = h('time', {}, p.time || '');
    const desc = h('p', {}, (p.description || ''));
    const details = h('a', { href: '#', class: 'details-trigger', draggable: 'false' }, 'Details');
    (desc as HTMLElement).append(' ', details);
    const descWrap = h('div', { class: 'description' }, [title, time, desc]);

    const skillsWrap = h('div', { class: 'no-copy skill-list' }, (p.skills || []).map(s => h('div', { class: 'item' }, s)));
    const linksWrap = h('div', { class: 'no-copy card-footer' }, (p.links || []).map(l => {
      const a = h('a', { class: 'link', href: l.href || '#', title: l.title || l.label || '' }, [l.icon ? h('img', { src: l.icon, alt: l.label || '' }) : null, ' ' + (l.label || 'Link')]);
      if (l.target) (a as HTMLAnchorElement).target = l.target; return a;
    }));

    const template = h('template', { class: 'project-detail' });
    const tImages = h('div', { class: 'images' }, (p.images || []).map(img => h('img', { src: img.src, alt: img.alt || '' })));
    const tSkills = h('div', { class: 'skills' }, (p.skills || []).map(s => h('span', {}, s)));
    const tLinks = h('div', { class: 'links' }, (p.links || []).map(l => h('a', { href: l.href || '#', title: l.title || l.label || '' }, l.label || 'Link')));
    const tInfo = h('div', { class: 'info' }, [h('h3', {}, p.title || 'Project'), h('time', {}, p.time || ''), h('p', {}, p.description || ''), tSkills, tLinks]);
    const tDetail = h('div', { class: 'detail' }, [tImages, tInfo]);
    (template as HTMLTemplateElement).content.appendChild(tDetail);

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
    ProjectWidgets.renderGallery(container, projects);
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