// IntersectionObserver-based fade-in on scroll for .section containers
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  onReady(function initScrollFade() {
    const sections = Array.from(document.querySelectorAll('.section'));
    if (!sections.length) return;

    // Respect reduced motion users
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      sections.forEach(s => s.classList.add('in-view'));
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      }, { threshold: [0, 0.15, 0.4, 0.75] });

      sections.forEach((s) => io.observe(s));
    } else {
      // Fallback: basic onscroll check
      const reveal = () => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        sections.forEach((s) => {
          const rect = s.getBoundingClientRect();
          const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
          s.classList.toggle('in-view', visible);
        });
      };
      window.addEventListener('scroll', reveal, { passive: true });
      window.addEventListener('resize', reveal);
      reveal();
    }
  });
})();

// Project detail modal with gallery
(function(){
  function onReady(fn){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  onReady(function initProjectModal(){
    const modal = document.getElementById('project-modal');
    if(!modal) return;
    const dlg = modal.querySelector('.modal__dialog');
    const titleEl = modal.querySelector('#project-modal-title');
    const timeEl = modal.querySelector('.modal__time');
    const descEl = modal.querySelector('.modal__desc');
    const skillsEl = modal.querySelector('.modal__skills');
    const linksEl = modal.querySelector('.modal__links');
    const track = modal.querySelector('.gallery__track');
    const prevBtn = modal.querySelector('.gallery__prev');
    const nextBtn = modal.querySelector('.gallery__next');
    const closeBtn = modal.querySelector('.modal__close');

    let currentIndex = 0;
    let images = [];
    let lastFocus = null;

    function setGallery(idx){
      if(!images.length) return;
      currentIndex = Math.max(0, Math.min(idx, images.length - 1));
      const x = -currentIndex * 100;
      track.style.transform = `translateX(${x}%)`;
      prevBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
      nextBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
    }

    function clearChildren(el){ while(el && el.firstChild){ el.removeChild(el.firstChild);} }

    function fillFromData(data){
      // Title, time, desc
      titleEl.textContent = data.title || 'Project';
      timeEl.textContent = data.time || '';
      descEl.textContent = data.description || '';

      // Skills
      clearChildren(skillsEl);
      (data.skills || []).forEach(label => {
        const span = document.createElement('div');
        span.className = 'item';
        span.textContent = label;
        skillsEl.appendChild(span);
      });

      // Links
      clearChildren(linksEl);
      (data.links || []).forEach(linkData => {
        const link = document.createElement('a');
        link.className = 'link';
        link.href = linkData.href || '#';
        link.title = linkData.title || linkData.label || '';
        if(linkData.target) link.target = linkData.target;
        if(linkData.icon){
          const icon = document.createElement('img');
          icon.src = linkData.icon; icon.alt = linkData.label || '';
          icon.setAttribute('draggable','false');
          link.appendChild(icon);
        }
        link.appendChild(document.createTextNode(' ' + (linkData.label || 'Link')));
        linksEl.appendChild(link);
      });

      // Images
      images = [];
      clearChildren(track);
      (data.images || []).forEach(({src, alt}) => {
        if(!src) return;
        const el = document.createElement('img');
        el.className = 'gallery__img';
        el.loading = 'lazy';
        el.src = src; el.alt = alt || '';
        track.appendChild(el);
        images.push({src, alt});
      });
      setGallery(0);
    }

    function openFromCard(card){
      // Title, time, desc
      const h3 = card.querySelector('.description h3');
      const t = card.querySelector('.description time');
      const p = card.querySelector('.description p');

      titleEl.textContent = h3 ? h3.textContent.trim() : 'Project';
      timeEl.textContent = t ? t.textContent.trim() : '';
      if(p){
        const pClone = p.cloneNode(true);
        // remove any details link
        pClone.querySelectorAll('a').forEach(a=>a.remove());
        descEl.textContent = pClone.textContent.trim();
      } else {
        descEl.textContent = '';
      }

      // Skills
      clearChildren(skillsEl);
      card.querySelectorAll('.skill-list .item').forEach(node => {
        const span = document.createElement('div');
        span.className = 'item';
        span.textContent = node.textContent.trim();
        skillsEl.appendChild(span);
      });

      // Links
      clearChildren(linksEl);
      card.querySelectorAll('.card-footer a').forEach(a => {
        const link = document.createElement('a');
        link.className = 'link';
        link.href = a.getAttribute('href') || '#';
        link.title = a.getAttribute('title') || '';
        link.target = a.target || '';
        // icon
        const img = a.querySelector('img');
        if(img){
          const icon = document.createElement('img');
          icon.src = img.getAttribute('src');
          icon.alt = img.getAttribute('alt') || '';
          icon.setAttribute('draggable','false');
          link.appendChild(icon);
        }
        link.appendChild(document.createTextNode(' ' + a.textContent.trim()));
        linksEl.appendChild(link);
      });

      // Images from template or card <img>
      images = [];
      clearChildren(track);
      const tpl = card.querySelector('template.project-detail');
      if(tpl){
        const frag = tpl.content.cloneNode(true);
        const imgs = frag.querySelectorAll('img');
        imgs.forEach((im) => { images.push({ src: im.getAttribute('src'), alt: im.getAttribute('alt') || '' }); });
      }
      if(!images.length){
        const im = card.querySelector('img');
        if(im) images.push({ src: im.getAttribute('src'), alt: im.getAttribute('alt') || '' });
      }
      images.forEach(({src, alt}) => {
        const el = document.createElement('img');
        el.className = 'gallery__img';
        el.loading = 'lazy';
        el.src = src; el.alt = alt;
        track.appendChild(el);
      });
      setGallery(0);

      // Open modal
      lastFocus = document.activeElement;
      document.body.classList.add('modal-open');
      modal.hidden = false;
      modal.setAttribute('aria-hidden','false');
      closeBtn.focus();
    }

    function openFromData(data){
      fillFromData(data || {});
      // Open modal
      lastFocus = document.activeElement;
      document.body.classList.add('modal-open');
      modal.hidden = false;
      modal.setAttribute('aria-hidden','false');
      closeBtn.focus();
    }

    function close(){
      modal.hidden = true;
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      if(lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    // Events
    prevBtn.addEventListener('click', () => setGallery(currentIndex - 1));
    nextBtn.addEventListener('click', () => setGallery(currentIndex + 1));
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if(e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
      if(modal.hidden) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') setGallery(currentIndex - 1);
      if(e.key === 'ArrowRight') setGallery(currentIndex + 1);
    });

    // Open from Details link
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a.details-trigger');
      if(a){
        e.preventDefault();
        const card = a.closest('.project-card');
        if(card) openFromCard(card);
      }
    });

    // Expose global API for widgets
    window.ProjectModal = {
      open: openFromData,
      openFromCard
    };
  });
})();
