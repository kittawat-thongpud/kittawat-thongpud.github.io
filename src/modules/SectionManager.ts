import { htmlToFragment, loadJSON, loadText } from '../lib/dom';

export type SectionItem = {
  id?: string;
  src?: string;        // full HTML fragment file
  template?: string;   // template file path
  html?: string;       // inline html string
};

export class SectionManager {
  constructor(private container: HTMLElement, private src: string = 'data/sections.json') {}

  private ensureSectionStructure(frag: DocumentFragment, item?: SectionItem): DocumentFragment {
    try {
      const sec = frag.querySelector('section');
      if (!sec) return frag;
      if (item?.id && !sec.id) sec.id = item.id;
      const hasDirectContainer = !!sec.querySelector(':scope > .container');
      if (!hasDirectContainer) {
        const wrap = document.createElement('div');
        wrap.className = 'container';
        while (sec.firstChild) wrap.appendChild(sec.firstChild);
        sec.appendChild(wrap);
      }
      return frag;
    } catch {
      return frag;
    }
  }

  private async insertSection(item: SectionItem): Promise<void> {
    if (!item) return;
    try {
      let frag: DocumentFragment | null = null;
      if (item.src) {
        const html = await loadText(item.src);
        frag = htmlToFragment(html);
        const sec = frag.querySelector('section');
        if (sec && item.id && !sec.id) sec.id = item.id;
      } else if (item.template) {
        const html = await loadText(item.template);
        frag = this.ensureSectionStructure(htmlToFragment(html), item);
      } else if (item.html) {
        frag = this.ensureSectionStructure(htmlToFragment(item.html), item);
      } else {
        console.warn('[sections] skip item without src/template/html', item);
        return;
      }
      this.container.appendChild(frag);
    } catch (e) {
      const label = item.src || item.template || '[inline html]';
      console.warn('[sections] failed to load', label, e);
    }
  }

  async load(): Promise<void> {
    try {
      const list = await loadJSON<any>(this.src);
      const sections: SectionItem[] = Array.isArray(list) ? list : (list.sections || []);
      for (const item of sections) {
        await this.insertSection(item);
      }
    } catch (e) {
      console.warn('[sections] cannot load configuration', this.src, e);
    }
  }
}