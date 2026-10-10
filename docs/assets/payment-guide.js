(() => {
  'use strict';
  const videos = {
    en: 'A-nVZqbEzdc',
    fr: 'B3G80XloARw',
    es: 'WnyNgGWxoGI',
    hi: 'HB3ZVIAa10I',
    ru: 'K9ltlWo3M9o',
    zh: 'o0ih62T4tmM'
  };
  const messages = {
    en: ['How to pay', 'Watch the crypto payment tutorial on YouTube.', 'Watch on YouTube', 'Tutorial link language'],
    es: ['Cómo pagar', 'Mira el tutorial de pago con criptomonedas en YouTube.', 'Ver en YouTube', 'Idioma del enlace al tutorial'],
    fr: ['Comment payer', 'Regardez le tutoriel de paiement en cryptomonnaie sur YouTube.', 'Regarder sur YouTube', 'Langue du lien vers le tutoriel'],
    ru: ['Как оплатить', 'Посмотрите инструкцию по оплате криптовалютой на YouTube.', 'Смотреть на YouTube', 'Язык ссылки на инструкцию'],
    hi: ['भुगतान कैसे करें', 'YouTube पर क्रिप्टो भुगतान का ट्यूटोरियल देखें।', 'YouTube पर देखें', 'ट्यूटोरियल लिंक की भाषा'],
    zh: ['如何付款', '在 YouTube 上观看加密货币付款教程。', '在 YouTube 上观看', '教程链接语言'],
    ar: ['كيفية الدفع', 'شاهد شرح الدفع بالعملات المشفرة على YouTube.', 'شاهد على YouTube', 'لغة رابط الشرح']
  };
  const panels = [...document.querySelectorAll('[data-payment-guide]')];
  const storageKey = 'mycam-payment-guide-language';
  const normalize = language => String(language || '').toLowerCase().split(/[-_]/)[0];
  const supported = language => Object.prototype.hasOwnProperty.call(messages, language);
  function savedLanguage() {
    try {
      const code = normalize(localStorage.getItem(storageKey));
      return supported(code) ? code : null;
    } catch { return null; }
  }
  function render(language) {
    const normalized = normalize(language);
    const code = supported(normalized) ? normalized : 'en';
    for (const panel of panels) {
      panel.lang = code;
      panel.dir = code === 'ar' ? 'rtl' : 'ltr';
      panel.querySelector('[data-guide-link]').href = `https://www.youtube.com/shorts/${videos[code] || videos.en}`;
      ['title', 'description', 'link'].forEach((key, index) => {
        panel.querySelector(`[data-guide-${key}]`).textContent = messages[code][index];
      });
      const select = panel.querySelector('select');
      select.value = code;
      select.setAttribute('aria-label', messages[code][3]);
    }
  }
  const preferred = (navigator.languages || [navigator.language]).map(normalize).find(supported);
  render(savedLanguage() || preferred || 'en');
  for (const panel of panels) {
    const select = panel.querySelector('select');
    const applySelection = () => {
      const code = normalize(select.value);
      render(code);
      try { localStorage.setItem(storageKey, code); } catch { /* Storage may be disabled. */ }
      window.dispatchEvent(new CustomEvent('mycam-language-change', { detail: code }));
    };
    select.addEventListener('input', applySelection);
    select.addEventListener('change', applySelection);
    panel.querySelector('[data-guide-link]').addEventListener('click', applySelection);
  }
  window.addEventListener('pageshow', () => render(savedLanguage() || panels[0]?.querySelector('select').value || preferred || 'en'));
  window.addEventListener('mycam-language-change', event => render(event.detail));
})();
