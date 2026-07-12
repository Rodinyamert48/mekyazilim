import { initLoadingScreen } from './modules/loader.js';
import { initNavbar } from './modules/navigation.js';
import { initAccordion } from './modules/accordion.js';
import { initAnimations } from './modules/animations.js';
import { initCustomCursor } from './modules/cursor.js';
import { initContactForm } from './modules/form.js';
import { setupScrollProgressBar, initScrollToTop } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initNavbar();
  initAccordion();
  initAnimations();
  initCustomCursor();
  initContactForm();
  setupScrollProgressBar();
  initScrollToTop();
});
