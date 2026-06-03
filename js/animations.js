/* ============================================
   B3 Soluções — Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParallax();
});

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function initParallax() {
  const heroes = document.querySelectorAll('.hero-bg img');
  if (!heroes.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroes.forEach(img => {
      if (scrollY < window.innerHeight) {
        img.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      }
    });
  }, { passive: true });
}
