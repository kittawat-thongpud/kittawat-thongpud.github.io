import { clearChildren } from '../lib/dom-clear';

export type ProjectModalData = {
  title?: string;
  time?: string;
  description?: string;
  skills?: string[];
  links?: { href?: string; label?: string; title?: string; target?: string; icon?: string }[];
  images?: { src: string; alt?: string }[];
};

export class ProjectModal {
  private currentIndex = 0;
  private images: { src: string; alt?: string }[] = [];
  private lastFocus: Element | null = null;

  constructor(private modal: HTMLElement) {
    this.init();
  }

  private get els() {
    return {
      dlg: this.modal.querySelector('.modal__dialog') as HTMLElement,
      titleEl: this.modal.querySelector('#project-modal-title') as HTMLElement,
      timeEl: this.modal.querySelector('.modal__time') as HTMLElement,
      descEl: this.modal.querySelector('.modal__desc') as HTMLElement,
      skillsEl: this.modal.querySelector('.modal__skills') as HTMLElement,
      linksEl: this.modal.querySelector('.modal__links') as HTMLElement,
      track: this.modal.querySelector('.gallery__track') as HTMLElement,
      prevBtn: this.modal.querySelector('.gallery__prev') as HTMLButtonElement,
      nextBtn: this.modal.querySelector('.gallery__next') as HTMLButtonElement,
      closeBtn: this.modal.querySelector('.modal__close') as HTMLButtonElement
    };
  }

  private setGallery(idx: number) {
    if (!this.images.length) return;
    this.currentIndex = Math.max(0, Math.min(idx, this.images.length - 1));
    const x = -this.currentIndex * 100;
    this.els.track.style.transform = `translateX(${x}%)`;
    const vis = this.images.length > 1 ? 'visible' : 'hidden';
    this.els.prevBtn.style.visibility = vis;
    this.els.nextBtn.style.visibility = vis;
  }

  private fillFromData(data: ProjectModalData) {
    const { titleEl, timeEl, descEl, skillsEl, linksEl, track } = this.els;
    titleEl.textContent = data.title || 'Project';
    timeEl.textContent = data.time || '';
    descEl.textContent = data.description || '';

    clearChildren(skillsEl);
    (data.skills || []).forEach((label) => {
      const span = document.createElement('div');
      span.className = 'item';
      span.textContent = label;
      skillsEl.appendChild(span);
    });

    clearChildren(linksEl);
    (data.links || []).forEach((linkData) => {
      const link = document.createElement('a');
      link.className = 'link';
      link.href = linkData.href || '#';
      link.title = linkData.title || linkData.label || '';
      if (linkData.target) link.target = linkData.target;
      if (linkData.icon) {
        const icon = document.createElement('img');
        icon.src = linkData.icon; icon.alt = linkData.label || '';
        icon.setAttribute('draggable', 'false');
        link.appendChild(icon);
      }
      link.appendChild(document.createTextNode(' ' + (linkData.label || 'Link')));
      linksEl.appendChild(link);
    });

    this.images = [];
    clearChildren(track);
    (data.images || []).forEach(({ src, alt }) => {
      if (!src) return;
      const el = document.createElement('img');
      el.className = 'gallery__img';
      el.loading = 'lazy';
      el.src = src; el.alt = alt || '';
      track.appendChild(el);
      this.images.push({ src, alt });
    });
    this.setGallery(0);
  }

  openFromCard(card: HTMLElement) {
    const { titleEl, timeEl, descEl, skillsEl, linksEl, track } = this.els;

    const h3 = card.querySelector('.description h3');
    const t = card.querySelector('.description time');
    const p = card.querySelector('.description p');

    titleEl.textContent = h3 ? (h3.textContent || '').trim() : 'Project';
    timeEl.textContent = t ? (t.textContent || '').trim() : '';
    if (p) {
      const pClone = p.cloneNode(true) as HTMLElement;
      pClone.querySelectorAll('a').forEach((a) => a.remove());
      descEl.textContent = (pClone.textContent || '').trim();
    } else {
      descEl.textContent = '';
    }

    clearChildren(skillsEl);
    card.querySelectorAll('.skill-list .item').forEach((node) => {
      const span = document.createElement('div');
      span.className = 'item';
      span.textContent = (node.textContent || '').trim();
      skillsEl.appendChild(span);
    });

    clearChildren(linksEl);
    card.querySelectorAll('.card-footer a').forEach((a) => {
      const link = document.createElement('a');
      link.className = 'link';
      link.href = a.getAttribute('href') || '#';
      link.title = a.getAttribute('title') || '';
      link.target = (a as HTMLAnchorElement).target || '';
      const img = a.querySelector('img');
      if (img) {
        const icon = document.createElement('img');
        icon.src = img.getAttribute('src') || '';
        icon.alt = img.getAttribute('alt') || '';
        icon.setAttribute('draggable', 'false');
        link.appendChild(icon);
      }
      link.appendChild(document.createTextNode(' ' + (a.textContent || '').trim()));
      linksEl.appendChild(link);
    });

    this.images = [];
    clearChildren(track);
    const tpl = card.querySelector('template.project-detail') as HTMLTemplateElement | null;
    if (tpl) {
      const frag = tpl.content.cloneNode(true) as DocumentFragment;
      const imgs = frag.querySelectorAll('img');
      imgs.forEach((im) => { this.images.push({ src: im.getAttribute('src') || '', alt: im.getAttribute('alt') || '' }); });
    }
    if (!this.images.length) {
      const im = card.querySelector('img');
      if (im) this.images.push({ src: im.getAttribute('src') || '', alt: im.getAttribute('alt') || '' });
    }
    this.images.forEach(({ src, alt }) => {
      const el = document.createElement('img');
      el.className = 'gallery__img';
      el.loading = 'lazy';
      el.src = src; el.alt = alt || '';
      track.appendChild(el);
    });
    this.setGallery(0);

    this.lastFocus = document.activeElement;
    document.body.classList.add('modal-open');
    this.modal.hidden = false;
    this.modal.setAttribute('aria-hidden', 'false');
    this.els.closeBtn.focus();
  }

  open(data: ProjectModalData) {
    this.fillFromData(data || {});
    this.lastFocus = document.activeElement;
    document.body.classList.add('modal-open');
    this.modal.hidden = false;
    this.modal.setAttribute('aria-hidden', 'false');
    this.els.closeBtn.focus();
  }

  close() {
    this.modal.hidden = true;
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    const lf = this.lastFocus as any;
    if (lf && typeof lf.focus === 'function') lf.focus();
  }

  private init() {
    const { prevBtn, nextBtn, closeBtn } = this.els;
    prevBtn?.addEventListener('click', () => this.setGallery(this.currentIndex - 1));
    nextBtn?.addEventListener('click', () => this.setGallery(this.currentIndex + 1));
    closeBtn?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.close(); });
    document.addEventListener('keydown', (e) => {
      if (this.modal.hidden) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.setGallery(this.currentIndex - 1);
      if (e.key === 'ArrowRight') this.setGallery(this.currentIndex + 1);
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const a = target && target.closest('a.details-trigger');
      if (a) {
        e.preventDefault();
        const card = (a as HTMLElement).closest('.project-card') as HTMLElement | null;
        if (card) this.openFromCard(card);
      }
    });
  }
}