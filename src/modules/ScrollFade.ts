export function initScrollFade() {
  const sections = Array.from(document.querySelectorAll('.section')) as HTMLElement[];
  if (!sections.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    sections.forEach((s) => s.classList.add('in-view'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
          (entry.target as HTMLElement).classList.add('in-view');
        } else {
          (entry.target as HTMLElement).classList.remove('in-view');
        }
      });
    }, { threshold: [0, 0.15, 0.4, 0.75] });

    sections.forEach((s) => io.observe(s));
  } else {
    const reveal = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
        s.classList.toggle('in-view', visible);
      });
    };
    window.addEventListener('scroll', reveal, { passive: true } as any);
    window.addEventListener('resize', reveal);
    reveal();
  }
}