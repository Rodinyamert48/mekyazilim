function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

function setupIntersectionObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const config = { ...defaultOptions, ...options };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
        observer.unobserve(entry.target);
      }
    });
  }, config);

  return observer;
}

function setupScrollAnimations(selector = '.fade-in, .fade-in-left, .fade-in-right, .scale-in') {
  const elements = document.querySelectorAll(selector);

  const observer = setupIntersectionObserver((entry) => {
    entry.target.classList.add('visible');
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

function initScrollToTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function countUp(element, target, duration = 2000, suffix = '') {
  let start = 0;
  const increment = target / (duration / 16);
  const isFloat = !Number.isInteger(target);

  function updateCount() {
    start += increment;
    if (start >= target) {
      element.textContent = isFloat ? target.toFixed(0) : formatNumber(target) + suffix;
      return;
    }
    element.textContent = isFloat ? Math.floor(start).toFixed(0) : formatNumber(Math.floor(start)) + suffix;
    requestAnimationFrame(updateCount);
  }

  requestAnimationFrame(updateCount);
}

function setCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

export {
  smoothScrollTo,
  setupIntersectionObserver,
  setupScrollAnimations,
  setupScrollProgressBar,
  initScrollToTop,
  debounce,
  throttle,
  isElementInViewport,
  formatNumber,
  countUp,
  setCopyrightYear
};
