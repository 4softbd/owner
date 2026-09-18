(() => {
  function matchProductNavigation() {
    const nav = document.querySelector('.shared-nav > nav');
    if (!nav) return;
    const categories = nav.querySelector('.nav-drop');
    if (categories) {
      const loginTerms = document.createElement('a');
      loginTerms.href = 'legal.html#login';
      loginTerms.textContent = 'Login Terms';
      loginTerms.className = 'nav-login-terms';
      categories.replaceWith(loginTerms);
    }

    const cartCount = document.querySelector('[data-cart-count]');
    if (cartCount) cartCount.setAttribute('data-cart-count', cartCount.textContent.trim() || '0');

    const bottomNavigation = document.querySelector('.mobile-bottom');
    const bottomLinks = bottomNavigation?.querySelectorAll('a');
    if (bottomLinks?.length >= 4) {
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

    const productId = Number(new URLSearchParams(location.search).get('id'));
    const title = document.querySelector('.product-panel h1')?.textContent.trim() || '';
    if (productId === 11 || title === 'Netflix 4K Private') {
      document.body.classList.add('netflix-private-reference');
      const notice = document.querySelector('.product-panel .notice');
      if (notice) notice.textContent = 'Delivered instantly on your WhatsApp';
      const list = document.querySelector('.product-panel .included ul');
      if (list) {
        list.innerHTML = [
          '<li><strong>4K UHD Plan</strong><span>Enjoy Netflix in highest quality possible</span></li>',
          '<li><strong>Private profile</strong><span>You will get your own profile and can set a PIN</span></li>',
          '<li><strong>Devices</strong><span>Two devices can be logged in and verified</span></li>',
          '<li><strong>Activation</strong><span>Delivered as a dedicated profile with full warranty</span></li>'
        ].join('');
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', matchProductNavigation, { once: true });
  } else {
    matchProductNavigation();
  }
})();
