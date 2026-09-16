(() => {
  function applyShopReference() {
    if (!document.body.classList.contains('shop-page')) return;

    const more = document.querySelector('[data-category="more"]');
    if (more) more.textContent = 'More Plans';

    const sort = document.querySelector('#shop-sort');
    if (sort?.options?.length) sort.options[0].textContent = 'Default sorting';

    const grid = document.querySelector('#shop-grid');
    if (grid && (!sort || sort.value === 'featured')) {
      const priority = [
        'Lovable Lite on mail',
        'Google Ai pro (on',
        '2-in-1 Combo',
        'Prime Video 4K',
        'Hotstar (On Number)',
        'Netflix Premium 4K',
        'Prime Video 4K (On Mail)',
        'Zee5 Premium',
        'Hotstar 4K',
        'Anime Premium',
        'Apple TV+',
        'Premium VPN 2',
        'Netflix 4K Private',
        'Designer Pro (On Mail)',
        'Premium VPN'
      ];
      const cards = [...grid.querySelectorAll('.product-card')];
      const rank = card => {
        const name = card.querySelector('.product-info h4')?.textContent.trim() || '';
        const index = priority.findIndex(item => name.startsWith(item));
        return index < 0 ? priority.length + cards.indexOf(card) : index;
      };
      const sorted = [...cards].sort((a, b) => rank(a) - rank(b));
      if (cards.some((card, index) => card !== sorted[index])) {
        sorted.forEach(card => grid.appendChild(card));
      }
    }
  }

  const run = () => applyShopReference();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  [50, 250, 800, 1600].forEach(delay => setTimeout(run, delay));
})();
