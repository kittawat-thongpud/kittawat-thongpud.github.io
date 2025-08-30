import { onReady } from './lib/dom';
import { SectionManager } from './modules/SectionManager';
import { ProjectWidgets } from './modules/ProjectWidgets';
import { ProjectModal } from './modules/ProjectModal';
import { initScrollFade } from './modules/ScrollFade';
import { initNavVisibility } from './modules/NavVisibility';
import { ToolsWidget } from './modules/ToolsWidget';

onReady(async () => {
  const year = document.getElementById('y');
  if (year) year.textContent = String(new Date().getFullYear());

  const main = document.getElementById('app-main') as HTMLElement | null;
  if (main) {
    const src = main.getAttribute('data-sections-src') || 'data/sections.json';
    const sm = new SectionManager(main, src);
    await sm.load();
  }

  // Initialize effects after sections are in the DOM
  initScrollFade();
  initNavVisibility();
  ToolsWidget.initAuto();

  ProjectWidgets.initAuto();

  const modalEl = document.getElementById('project-modal') as HTMLElement | null;
  if (modalEl) {
    const pm = new ProjectModal(modalEl);
    // Optional: expose minimal API for programmatic open
    (window as any).ProjectModal = {
      open: (data: any) => pm.open(data)
    };
  }
});
