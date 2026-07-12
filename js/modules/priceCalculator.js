export function initPriceCalculator() {
  const pagesInput = document.getElementById('calc-pages');
  const pagesValue = document.getElementById('calc-pages-value');
  const priceEl = document.getElementById('calc-price');
  const perPageEl = document.getElementById('calc-per-page');
  const extrasEl = document.getElementById('calc-extras');
  const checkboxes = document.querySelectorAll('.calculator-controls input[type="checkbox"]');

  const BASE_PRICE = 2500;
  const PAGE_RATE = 1000;

  if (!pagesInput) return;

  function calculate() {
    const pages = parseInt(pagesInput.value);
    const seo = document.getElementById('calc-seo').checked;
    const responsive = document.getElementById('calc-responsive').checked;
    const performance = document.getElementById('calc-performance').checked;
    const support = document.getElementById('calc-support').checked;
    const ecommerce = document.getElementById('calc-ecommerce').checked;

    let extras = 0;
    if (seo) extras += 500;
    if (responsive) extras += 500;
    if (performance) extras += 750;
    if (support) extras += 500;
    if (ecommerce) extras += 2500;

    const pageCost = pages * PAGE_RATE;
    const total = BASE_PRICE + pageCost + extras;

    pagesValue.textContent = pages;

    const oldPrice = priceEl.textContent;
    const newPrice = formatPrice(total);
    if (oldPrice !== newPrice) {
      priceEl.classList.add('pop');
      setTimeout(() => priceEl.classList.remove('pop'), 200);
    }

    priceEl.textContent = newPrice;
    perPageEl.textContent = formatPrice(pageCost);
    extrasEl.textContent = formatPrice(extras);
  }

  function formatPrice(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₺';
  }

  pagesInput.addEventListener('input', calculate);
  checkboxes.forEach(cb => cb.addEventListener('change', calculate));

  calculate();
}

export function initCompareTable() {
  const toggle = document.getElementById('compare-toggle');
  const table = document.getElementById('compare-table');

  if (!toggle || !table) return;

  toggle.addEventListener('click', () => {
    const isHidden = table.hasAttribute('hidden');
    table.toggleAttribute('hidden');
    toggle.setAttribute('aria-expanded', !isHidden);
    toggle.textContent = isHidden ? '📊 Karşılaştırmayı Gizle' : '📊 Paketleri Karşılaştır';
  });
}
