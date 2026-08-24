document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');
  const scrollProgress = document.getElementById('scroll-progress');
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('.dot-nav-item');
  const pageIndicator = document.getElementById('page-indicator');
  const topbarLogo = document.getElementById('topbar-logo');
  const totalPages = pages.length;

  // --- Theme ---
  const saved = localStorage.getItem('bossint-theme') || 'light';
  html.setAttribute('data-theme', saved);
  setIcons(saved);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('bossint-theme', next);
    setIcons(next);
  });

  function setIcons(t) {
    sunIcon.style.display = t === 'dark' ? 'block' : 'none';
    moonIcon.style.display = t === 'dark' ? 'none' : 'block';
  }

  // --- Scroll progress + dots ---
  let currentPage = 0;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';

      const wh = window.innerHeight;
      pages.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (r.top + r.height / 2 > 0 && r.top + r.height / 2 < wh) {
          currentPage = i;
          dots.forEach(d => d.classList.remove('active'));
          if (dots[i]) dots[i].classList.add('active');
          if (pageIndicator) pageIndicator.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(totalPages).padStart(2, '0');
        }
      });

      if (topbarLogo) {
        if (currentPage > 0 || scrollTop > 100) {
          topbarLogo.classList.add('visible');
        } else {
          topbarLogo.classList.remove('visible');
        }
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Dot click ---
  dots.forEach((d, i) => d.addEventListener('click', () => pages[i].scrollIntoView({ behavior: 'smooth' })));

  // --- Keyboard ---
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); currentPage = Math.min(currentPage + 1, pages.length - 1); pages[currentPage].scrollIntoView({ behavior: 'smooth' }); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); currentPage = Math.max(currentPage - 1, 0); pages[currentPage].scrollIntoView({ behavior: 'smooth' }); }
  });

  // --- Reveal ---
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger-children').forEach(el => obs.observe(el));

  // --- Hide scroll hint ---
  const hint = document.querySelector('.scroll-hint');
  if (hint) {
    let hidden = false;
    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > 80) { hint.style.opacity = '0'; hint.style.transition = 'opacity .4s'; hidden = true; }
    }, { passive: true });
  }
});
