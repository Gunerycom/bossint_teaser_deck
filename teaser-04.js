document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');
  const scrollProgress = document.getElementById('scroll-progress');
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('.dot-nav-item');
  const pageIndicator = document.getElementById('page-indicator');
  const totalPages = pages.length;

  // --- Theme Initial Setup (Default to Dark for Command Aesthetics) ---
  const saved = localStorage.getItem('bossint-t4-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateThemeIcons(saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('bossint-t4-theme', next);
      updateThemeIcons(next);
    });
  }

  function updateThemeIcons(theme) {
    if (!sunIcon || !moonIcon) return;
    sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
    moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
  }

  const topbarLogoLink = document.querySelector('.topbar-logo-link');
  let currentPageIndex = 0;
  let isThrottled = false;

  function onScrollUpdate() {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollProgress) {
        scrollProgress.style.width = (scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0) + '%';
      }

      const viewportCenter = window.innerHeight / 2;
      pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          currentPageIndex = index;
          dots.forEach(dot => dot.classList.remove('active'));
          if (dots[index]) dots[index].classList.add('active');
          if (pageIndicator) {
            pageIndicator.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(totalPages).padStart(2, '0');
          }
          if (topbarLogoLink) {
            if (index === 0) {
              topbarLogoLink.classList.add('hide-on-cover');
            } else {
              topbarLogoLink.classList.remove('hide-on-cover');
            }
          }
        }
      });

      isThrottled = false;
    });
  }

  window.addEventListener('scroll', onScrollUpdate, { passive: true });
  onScrollUpdate();

  // --- Click to Navigate Dots ---
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (pages[index]) {
        pages[index].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Keyboard Navigation ---
  document.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        currentPageIndex = Math.min(currentPageIndex + 1, totalPages - 1);
        pages[currentPageIndex].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        currentPageIndex = Math.max(currentPageIndex - 1, 0);
        pages[currentPageIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // --- Reveal Observer ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .stagger-children').forEach(el => revealObserver.observe(el));
});
