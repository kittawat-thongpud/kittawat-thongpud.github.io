export function initNavVisibility() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let lastY = window.scrollY;
  let hidden = false;
  const downThreshold = 4; // minimal downward scroll to hide
  const hero = document.querySelector('header.hero') as HTMLElement | null;

  const inHero = (): boolean => {
    if (!hero) return window.scrollY <= 0;
    const navH = (nav as HTMLElement).offsetHeight || 0;
    const threshold = Math.max(0, hero.offsetHeight - navH);
    return window.scrollY <= threshold;
  };

  const show = () => {
    // Always remove the class to avoid state desync
    nav.classList.remove('nav--hidden');
    hidden = false;
  };
  const hide = () => {
    nav.classList.add('nav--hidden');
    hidden = true;
  };

  const onScroll = () => {
    const y = window.scrollY;
    const delta = y - lastY;

    // Always show while within the first (hero) section
    if (inHero()) {
      show();
    } else if (delta < 0) {
      // Show immediately on any upward scroll for better usability
      show();
    } else if (delta > downThreshold) {
      // Hide when scrolling down past the threshold
      hide();
    }

    lastY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true } as any);

  // Keep visible when interacting with nav
  nav.addEventListener('mouseenter', show);
  nav.addEventListener('focusin', show);

  // Also react to input intent quickly
  window.addEventListener('wheel', (e: any) => { if (e.deltaY < 0) show(); }, { passive: true } as any);
  let touchStartY = 0;
  window.addEventListener('touchstart', (e: any) => { touchStartY = e.touches?.[0]?.clientY || 0; }, { passive: true } as any);
  window.addEventListener('touchmove', (e: any) => {
    const y = e.touches?.[0]?.clientY || 0;
    if (y > touchStartY + 2) show(); // finger moving down => page up
  }, { passive: true } as any);

  // Initial state
  show();
}
