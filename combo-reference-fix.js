(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('id') !== '1') return;

  function applyComboReference() {
    const page = document.querySelector('.page-shell');
    const image = document.querySelector('.detail-image');
    const panel = document.querySelector('.product-panel');
    if (!page || !image || !panel) return;

    document.body.classList.add('combo-reference');
    image.textContent = '';
    image.removeAttribute('style');
    image.setAttribute('role', 'img');
    image.setAttribute('aria-label', 'Netflix and Prime Video 2-in-1 Combo');

    const values = [215, 200, 183, 158];
    panel.querySelectorAll('.duration-row button').forEach((button, index) => {
      if (values[index] == null) return;
      button.dataset.value = String(values[index]);
    });

    const notice = panel.querySelector('.notice');
    if (notice) notice.textContent = 'Delivered instantly on your WhatsApp';

    const included = panel.querySelector('.included');
    if (included) {
      included.innerHTML = `
        <h3>What’s included</h3>
        <ul>
          <li><strong>4K UHD</strong><span>Experience crystal-clear visuals & 4K quality on supported titles from both Netflix and Prime.</span></li>
          <li><strong>Offline Downloads</strong><span>Save shows and films from either platform to watch anytime, anywhere.</span></li>
          <li><strong>Single-Screen Access</strong><span>Stream on one fixed device with limitless entertainment.</span></li>
        </ul>
        <h4>Good to know</h4>
        <details>
          <summary>Will the subscription be activated on my number or Gmail?<span>⌄</span></summary>
          <p>Activation details and login instructions will be delivered on WhatsApp after payment confirmation.</p>
        </details>
      `;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyComboReference, { once: true });
  } else {
    applyComboReference();
  }
})();
