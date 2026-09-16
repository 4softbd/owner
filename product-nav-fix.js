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
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', matchProductNavigation, { once: true });
  } else {
    matchProductNavigation();
  }
})();
