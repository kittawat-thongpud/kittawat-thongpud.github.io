export class ToolsWidget {
  private static ensureMarkup(): HTMLElement {
    let el = document.getElementById('tools-grid') as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'tools-grid';
      el.className = 'tools-grid';
      el.innerHTML = `
        <button type="button" class="tbtn tbtn-top" title="Go to top" aria-label="Go to top"><img alt="" src="icons/arrow-up.svg"/></button>
        <button type="button" class="tbtn tbtn-theme" title="Toggle theme" aria-label="Toggle theme"><img alt=""/></button>
      `;
      document.body.appendChild(el);
    }
    return el;
  }

  private static applyThemeIcon(btn: HTMLButtonElement) {
    const light = document.body.classList.contains('theme-light');
    const img = btn.querySelector('img') as HTMLImageElement | null;
    if (img) img.src = light ? 'icons/moon.svg' : 'icons/sun.svg';
    btn.title = light ? 'Switch to dark theme' : 'Switch to light theme';
    btn.setAttribute('aria-label', btn.title);
  }

  private static setTheme(mode: 'light'|'dark') {
    if (mode === 'light') document.body.classList.add('theme-light');
    else document.body.classList.remove('theme-light');
    try { localStorage.setItem('theme', mode); } catch {}
  }

  static initAuto() {
    const host = ToolsWidget.ensureMarkup();
    const btnTop = host.querySelector('.tbtn-top') as HTMLButtonElement | null;
    const btnTheme = host.querySelector('.tbtn-theme') as HTMLButtonElement | null;

    // Restore persisted theme
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') ToolsWidget.setTheme(saved);
    } catch {}
    if (btnTheme) ToolsWidget.applyThemeIcon(btnTheme);

    btnTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnTheme?.addEventListener('click', () => {
      const light = document.body.classList.contains('theme-light');
      ToolsWidget.setTheme(light ? 'dark' : 'light');
      if (btnTheme) ToolsWidget.applyThemeIcon(btnTheme);
    });
  }
}

