export function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!header || !content) return;

    if (!content.id) {
      content.id = `accordion-panel-${index}`;
    }
    header.setAttribute('aria-controls', content.id);

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      accordionItems.forEach(otherItem => {
        const otherHeader = otherItem.querySelector('.accordion-header');
        const otherContent = otherItem.querySelector('.accordion-content');
        otherItem.classList.remove('active');
        if (otherHeader) {
          otherHeader.setAttribute('aria-expanded', 'false');
        }
        if (otherContent) {
          otherContent.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}
