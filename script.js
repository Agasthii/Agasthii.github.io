(() => {
  const header = document.querySelector('.nav-wrap');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;

  function updateNavigation() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    header.style.setProperty('--scroll-progress', progress);
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    let active = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= header.offsetHeight + 100) active = index;
    });
    if (progress >= 0.99 && scrollable > 0) active = sections.length - 1;
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  updateNavigation();

  // Animate on arrival without hiding content when JavaScript is unavailable.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.about-grid, .research-intro, .research-card, .publication, .contact-grid').forEach(element => {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
    });
  }
})();
