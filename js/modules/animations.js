import { setupScrollAnimations, countUp } from '../utils.js';

export function initAnimations() {
  setupScrollAnimations();
  initCountUpAnimation();
}

function initCountUpAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        let target, suffix = '';

        if (text.includes('+')) {
          target = parseInt(text.replace(/[^0-9]/g, ''));
          suffix = '+';
        } else if (text.includes('%')) {
          target = parseInt(text.replace(/[^0-9]/g, ''));
          suffix = '%';
        } else if (text.includes('Saat')) {
          target = parseInt(text.replace(/[^0-9]/g, ''));
          suffix = ' Saat';
        } else {
          target = parseInt(text.replace(/[^0-9]/g, ''));
        }

        if (!isNaN(target)) {
          countUp(el, target, 2000, suffix);
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}
