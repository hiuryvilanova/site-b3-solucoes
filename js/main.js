/* ============================================
   B3 Soluções — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initAccordion();
  initFilterPills();
  initScrollProgress();
  initBackToTop();
  initFaqSearch();
});

/* ── Sticky Header ── */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Smooth Scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ── Accordion ── */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all siblings
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item.active').forEach(activeItem => {
          if (activeItem !== item) {
            activeItem.classList.remove('active');
            const activeContent = activeItem.querySelector('.accordion-content');
            activeContent.style.maxHeight = null;
          }
        });
      }

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ── Filter Pills (Projects page) ── */
function initFilterPills() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('[data-sector]');
  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

      // Filter cards with animation
      cards.forEach(card => {
        if (filter === 'todos' || card.dataset.sector === filter) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.style.display = '';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}


/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const container = document.createElement('div');
  container.className = 'scroll-progress-container';
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  container.appendChild(bar);
  document.body.appendChild(container);

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (windowScroll / height) * 100 : 0;
    bar.style.width = scrolled + '%';
  }, { passive: true });
}

/* ── Back to Top Button ── */
function initBackToTop() {
  const button = document.createElement('div');
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Voltar ao topo');
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(button);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  }, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ── FAQ Search (Services Page) ── */
function initFaqSearch() {
  // Find FAQ section on services page
  const faqSection = document.querySelector('#faq') || 
                     Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Dúvidas Frequentes') && s.querySelector('.accordion'));
  
  if (!faqSection) return;
  const accordion = faqSection.querySelector('.accordion');
  if (!accordion) return;

  // Prevent multiple creations
  if (faqSection.querySelector('.faq-search-wrapper')) return;

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'faq-search-wrapper reveal revealed';
  searchWrapper.style.cssText = 'margin: 2.5rem auto 0; max-width: 540px; position: relative; width: 100%;';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Busque por uma dúvida regulatória (ex: prazos, taxas, EIA/RIMA)...';
  searchInput.className = 'form-control faq-search-input';
  searchInput.style.cssText = 'width: 100%; padding: 14px 44px 14px 20px; border-radius: var(--radius-full); border: 1px solid var(--color-border-light); font-size: var(--fs-small); box-shadow: var(--shadow-sm); outline: none; transition: border-color 0.2s ease;';
  
  searchInput.addEventListener('focus', () => {
    searchInput.style.borderColor = 'var(--color-primary)';
  });
  searchInput.addEventListener('blur', () => {
    searchInput.style.borderColor = 'var(--color-border-light)';
  });

  const searchIcon = document.createElement('div');
  searchIcon.style.cssText = 'position: absolute; right: 18px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); display: flex; align-items: center; pointer-events: none;';
  searchIcon.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  searchWrapper.appendChild(searchInput);
  searchWrapper.appendChild(searchIcon);

  // Insert before FAQ accordion
  accordion.parentNode.insertBefore(searchWrapper, accordion);

  const items = accordion.querySelectorAll('.accordion-item');
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    items.forEach(item => {
      const question = item.querySelector('.accordion-trigger').textContent.toLowerCase();
      const answer = item.querySelector('.accordion-content').textContent.toLowerCase();

      if (question.includes(term) || answer.includes(term)) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.display = 'none';
      }
    });
  });
}
