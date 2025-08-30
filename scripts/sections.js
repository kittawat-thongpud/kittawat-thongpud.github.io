// Section loader: imports section fragments defined in data/sections.json
(function(){
  function onReady(fn){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  async function loadText(url){
    const res = await fetch(url, { headers: { 'Content-Type':'text/html' } });
    if(!res.ok) throw new Error('Failed to load ' + url);
    return res.text();
  }

  function htmlToFragment(html){
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content;
  }

  function ensureSectionStructure(frag, item){
    try{
      const sec = frag.querySelector('section');
      if(!sec) return frag;
      // Ensure section id for in-page navigation
      if(item && item.id && !sec.id){ sec.id = item.id; }
      // Ensure a container wrapper for consistent layout
      const hasDirectContainer = !!sec.querySelector(':scope > .container');
      if(!hasDirectContainer){
        const wrap = document.createElement('div');
        wrap.className = 'container';
        while(sec.firstChild){ wrap.appendChild(sec.firstChild); }
        sec.appendChild(wrap);
      }
      return frag;
    } catch(_) { return frag; }
  }

  async function insertSection(container, item){
    if(!item) return;
    try{
      let frag = null;
      if(item.src){
        // Legacy: load full section fragment
        const html = await loadText(item.src);
        frag = htmlToFragment(html);
        // If missing id/container, lightly normalize
        const sec = frag.querySelector('section');
        if(sec && item.id && !sec.id) sec.id = item.id;
      } else if(item.template){
        // Template: load template and normalize structure
        const html = await loadText(item.template);
        frag = htmlToFragment(html);
        frag = ensureSectionStructure(frag, item);
      } else if(item.html){
        // Inline HTML string
        frag = htmlToFragment(item.html);
        frag = ensureSectionStructure(frag, item);
      } else {
        console.warn('[sections] skip item without src/template/html', item);
        return;
      }
      container.appendChild(frag);
    }catch(e){
      const label = item.src || item.template || '[inline html]';
      console.warn('[sections] failed to load', label, e);
    }
  }

  function hydrateWidgets(scope){
    // Project galleries
    const galleries = scope.querySelectorAll('[data-projects-src]');
    galleries.forEach(el => {
      const url = el.getAttribute('data-projects-src');
      if(window.ProjectWidgets && typeof window.ProjectWidgets.loadAndRender === 'function'){
        window.ProjectWidgets.loadAndRender(el, url);
      } else {
        // fallback: just inject a message
        el.textContent = 'Loading projects...';
      }
    });
  }

  async function init(){
    const main = document.getElementById('app-main');
    if(!main) return;
    const src = main.getAttribute('data-sections-src') || 'data/sections.json';
    try{
      const list = await (await fetch(src, { headers:{'Content-Type':'application/json'} })).json();
      const sections = Array.isArray(list) ? list : (list.sections || []);
      for(const item of sections){
        await insertSection(main, item);
      }
      hydrateWidgets(main);
    }catch(e){
      console.warn('[sections] cannot load configuration', src, e);
    }
  }

  onReady(init);
})();
