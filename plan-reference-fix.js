(() => {
  function applyShopReference() {
    if (!document.body.classList.contains('shop-page')) return;

    const more = document.querySelector('[data-category="more"]');
    if (more) more.textContent = 'More Plans';

    const sort = document.querySelector('#shop-sort');
    if (sort?.options?.length) sort.options[0].textContent = 'Default sorting';
    if (sort && !sort.dataset.referenceBound) {
      sort.dataset.referenceBound = '1';
      sort.addEventListener('change', () => setTimeout(applyShopReference, 0));
    }

    const grid = document.querySelector('#shop-grid');

    grid?.querySelectorAll('.product-card').forEach(card => {
      const heading = card.querySelector('.product-info h4');
      const link = heading?.querySelector('a');
      if (heading && /^Google Ai pro \(on$/.test(heading.textContent.trim())) {
        if (link) link.textContent = 'Google Ai pro (on email)';
        else heading.textContent = 'Google Ai pro (on email)';
        const image = card.querySelector('img');
        if (image) image.alt = 'Google Ai pro (on email)';
      }
    });
    if (grid) {
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
        let index = priority.indexOf(name);
        if (index < 0 && name.startsWith('Google Ai pro')) index = priority.indexOf('Google Ai pro (on');
        return index < 0 ? priority.length + cards.indexOf(card) : index;
      };
      const price = card => Number((card.querySelector('.price b')?.textContent || '').replace(/[^0-9.]/g, '')) || 0;
      const mode = sort?.value || 'featured';
      let sorted = [...cards];
      if (mode === 'low') sorted.sort((a, b) => price(a) - price(b));
      else if (mode === 'high') sorted.sort((a, b) => price(b) - price(a));
      else if (mode === 'stock') sorted.sort((a, b) => Number(!b.querySelector('.instant-tag')) - Number(!a.querySelector('.instant-tag')));
      else sorted.sort((a, b) => rank(a) - rank(b));
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
