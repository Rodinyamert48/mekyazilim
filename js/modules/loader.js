export function initLoadingScreen() {
  const loader = document.getElementById('loader');

  if (!loader) return;

  let hidden = false;

  function hideLoader() {
    if (hidden) return;
    hidden = true;
    loader.classList.add('loader-hidden');

    setTimeout(() => {
      loader.style.display = 'none';
      document.body.style.overflow = '';
    }, 600);
  }

  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 1200);
  });

  // Fallback: never leave page locked if load hangs
  setTimeout(hideLoader, 3000);
}
