(() => {
  function applyShopReference() {
    if (!document.body.classList.contains('shop-page')) return;

    const more = document.querySelector('[data-category="more"]');
    if (more) more.textContent = 'More Plans';

    const sort = document.querySelector('#shop-sort');
    if (sort?.options?.length) sort.options[0].textContent = 'Default sorting';
    if (sort && !sort.dataset.referenceBound) {
      sort.dataset.referenceBound = '1';
      sort.addEventListener('change', () => [0, 80, 240].forEach(delay => setTimeout(applyShopReference, delay)));
    }

    const cartCount = document.querySelector('[data-cart-count]');
    if (cartCount) cartCount.setAttribute('data-cart-count', cartCount.textContent.trim() || '0');

    const bottomNavigation = document.querySelector('.mobile-bottom');
    const bottomLinks = bottomNavigation?.querySelectorAll('a');
    if (bottomNavigation && bottomLinks?.length >= 4) {
      bottomNavigation.classList.add('plan-mobile-dock');
      bottomNavigation.setAttribute('aria-label', 'Mobile navigation');
      const bottomItems = [
        ['index.html', 'https://www.figma.com/api/mcp/asset/e1054686-0953-4d6e-9c67-835f0463da9a.svg', 'Home'],
        ['/plan', 'https://www.figma.com/api/mcp/asset/8a6df5e3-4265-4b5b-9822-4b8bad8864e0.svg', 'Shop'],
        ['account.html#credentials', 'https://www.figma.com/api/mcp/asset/812bc584-8adf-4ab6-aef2-cdaa5e9bb22d.svg', 'My Creds'],
        ['account.html', 'https://www.figma.com/api/mcp/asset/68c3922f-7946-482a-825a-3b18a062d016.svg', 'Account']
      ];
      bottomLinks.forEach((link, index) => {
        const [href, icon, label] = bottomItems[index];
        link.href = href;
        link.innerHTML = `<i><img src="${icon}" alt="" width="23" height="23"></i><span>${label}</span>`;
        link.removeAttribute('aria-current');
      });
      bottomLinks[1].setAttribute('aria-current', 'page');
    }

    const grid = document.querySelector('#shop-grid');

    if (grid && typeof BF_PRODUCTS !== 'undefined' && typeof bfCard === 'function') {
      const required = [
        product => product.name.startsWith('Google Ai pro'),
        product => /coursera/i.test(product.name)
      ];
      required.forEach(match => {
        const visible = [...grid.querySelectorAll('.product-info h4')].some(node => {
          const product = { name: node.textContent.trim() };
          return match(product);
        });
        const product = BF_PRODUCTS.find(match);
        if (!visible && product) {
          const holder = document.createElement('div');
          holder.innerHTML = bfCard(product);
          const card = holder.firstElementChild;
          if (card) {
            if (grid.children.length >= 30) grid.lastElementChild?.remove();
            grid.appendChild(card);
          }
        }
      });
    }

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
        'Coursera on your mail',
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
  [0, 50, 250, 800, 1600].forEach(delay => setTimeout(run, delay));
})();
