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
      bottomLinks[1].href = '/plan';
      bottomLinks[1].setAttribute('aria-current', 'page');
      const credentialsLabel = bottomLinks[2].querySelector('span');
      if (credentialsLabel) credentialsLabel.textContent = 'My Creds';
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
