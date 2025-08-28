// Widgets: JSON-driven project cards and modal launcher
(function(){
  function onReady(fn){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  function h(tag, props={}, children=[]) {
    const el = document.createElement(tag);
    Object.entries(props || {}).forEach(([k,v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') {
        Object.entries(v).forEach(([sk,sv]) => el.style.setProperty(sk, sv));
      } else if (k in el) el[k] = v; else el.setAttribute(k, v);
    });
    (Array.isArray(children)?children:[children]).forEach(c => { if(c!=null){ el.append(c.nodeType?c:document.createTextNode(c)); }});
    return el;
  }

  function cardFromProject(p){
    const card = h('div', { class: 'no-blinking-curser project-card', draggable: 'false' });
    const img = h('img', { src: (p.images && p.images[0] && p.images[0].src) || p.image || 'assets/Wow-gif.gif', alt: (p.images && p.images[0] && p.images[0].alt) || p.title || 'Preview', draggable:'false' });
    const title = h('h3', {}, p.title || 'Project');
    const time = h('time', {}, p.time || '');
    const desc = h('p', {}, (p.description || ''));
    const details = h('a', { href:'#', class:'details-trigger', draggable:'false' }, 'Details');
    desc.append(' ', details);
    const descWrap = h('div', { class:'description' }, [title, time, desc]);

    const skillsWrap = h('div', { class:'no-copy skill-list' }, (p.skills||[]).map(s=> h('div', { class:'item' }, s)));
    const linksWrap = h('div', { class:'no-copy card-footer' }, (p.links||[]).map(l => {
      const a = h('a', { class:'link', href:l.href||'#', title:l.title||l.label||'' }, [ l.icon ? h('img',{ src:l.icon, alt:l.label||'' }) : null, ' ' + (l.label||'Link') ]);
      if(l.target) a.target = l.target; return a;
    }));

    // Optional embedded template to carry full details (not necessary with JSON but supported)
    const template = h('template', { class:'project-detail' });
    const tImages = h('div', { class:'images' }, (p.images||[]).map(img => h('img',{ src:img.src, alt:img.alt||'' })));
    const tSkills = h('div', { class:'skills' }, (p.skills||[]).map(s=> h('span',{},s)));
    const tLinks = h('div', { class:'links' }, (p.links||[]).map(l=> h('a',{ href:l.href||'#', title:l.title||l.label||'' }, l.label||'Link')));
    const tInfo = h('div', { class:'info' }, [ h('h3',{},p.title||'Project'), h('time',{},p.time||''), h('p',{},p.description||''), tSkills, tLinks ]);
    const tDetail = h('div', { class:'detail' }, [ tImages, tInfo ]);
    template.content.appendChild(tDetail);

    card.append(img, descWrap, skillsWrap, linksWrap, template);
    return card;
  }

  async function loadJSON(url){
    const res = await fetch(url, { headers: { 'Content-Type':'application/json' } });
    if(!res.ok) throw new Error('Failed to load ' + url);
    return res.json();
  }

  function applyWidgetStyles(container, styles){
    if(!styles) return;
    Object.entries(styles).forEach(([k,v]) => container.style.setProperty(k, v));
  }

  function renderGallery(container, projects){
    (projects || []).forEach(p => container.appendChild(cardFromProject(p)));
  }

  async function loadAndRender(container, url){
    try{
      const data = await loadJSON(url);
      const projects = Array.isArray(data) ? data : (data.projects || []);
      const styles = data.styles || data.widgetStyles || null;
      applyWidgetStyles(container, styles);
      renderGallery(container, projects);
    }catch(e){
      console.warn('[widgets] failed to load', url, e);
    }
  }

  // Auto-run for legacy container id and data attribute
  onReady(async function initProjectWidgets(){
    const legacy = document.getElementById('project-gallery-json');
    if(legacy){ await loadAndRender(legacy, 'data/projects.json'); }
    document.querySelectorAll('[data-projects-src]').forEach(el => {
      const url = el.getAttribute('data-projects-src');
      if(url) loadAndRender(el, url);
    });
  });

  // Expose API
  window.ProjectWidgets = { renderGallery, loadAndRender };
})();
