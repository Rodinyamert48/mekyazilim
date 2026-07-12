export function initPriceCalculator() {
  const pagesInput = document.getElementById('calc-pages');
  const pagesValue = document.getElementById('calc-pages-value');
  const deliveryInput = document.getElementById('calc-delivery');
  const deliveryValue = document.getElementById('calc-delivery-value');
  const priceEl = document.getElementById('calc-price');
  const totalEl = document.getElementById('calc-total');
  const perPageEl = document.getElementById('calc-per-page');
  const extrasEl = document.getElementById('calc-extras');
  const speedFactorEl = document.getElementById('calc-speed-factor');
  const checkboxes = document.querySelectorAll('.feature-chip input[type="checkbox"]');

  const BASE = 2500;
  const PAGE_RATE = 1000;

  if (!pagesInput) return;

  function getSpeedMultiplier(hours) {
    if (hours <= 48) return 1.5;
    if (hours <= 72) return 1.25;
    if (hours <= 96) return 1.0;
    if (hours <= 128) return 0.8;
    return 0.65;
  }

  function getSpeedLabel(hours) {
    if (hours <= 48) return 'Ekspres';
    if (hours <= 72) return 'Hızlı';
    if (hours <= 96) return 'Normal';
    if (hours <= 128) return 'Ekonomik';
    return 'Standart';
  }

  function calculate() {
    const pages = parseInt(pagesInput.value);
    const deliveryHours = parseInt(deliveryInput.value);
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

    const speedMul = getSpeedMultiplier(deliveryHours);
    const pageCost = pages * PAGE_RATE;
    const subtotal = BASE + pageCost + extras;
    const total = Math.round(subtotal * speedMul);

    pagesValue.textContent = pages;
    deliveryValue.textContent = deliveryHours + ' Saat (' + getSpeedLabel(deliveryHours) + ')';

    const oldVal = priceEl.textContent;
    const newVal = formatPrice(total);
    if (oldVal !== newVal) {
      priceEl.classList.add('pop');
      totalEl.classList.add('pop');
      setTimeout(() => {
        priceEl.classList.remove('pop');
        totalEl.classList.remove('pop');
      }, 250);
    }

    priceEl.textContent = newVal;
    totalEl.textContent = newVal + ' ₺';
    perPageEl.textContent = formatPrice(pageCost) + ' ₺';
    extrasEl.textContent = formatPrice(extras) + ' ₺';
    speedFactorEl.textContent = speedMul.toFixed(1) + 'x';

    document.querySelectorAll('.feature-chip').forEach(chip => {
      const cb = chip.querySelector('input[type="checkbox"]');
      chip.classList.toggle('active', cb.checked);
    });
  }

  function formatPrice(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  pagesInput.addEventListener('input', calculate);
  deliveryInput.addEventListener('input', calculate);
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
