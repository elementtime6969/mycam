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
  function render(language) {
    const code = Object.hasOwn(messages, language) ? language : 'en';
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
  const preferred = (navigator.languages || [navigator.language]).map(code => code.toLowerCase().split(/[-_]/)[0]).find(code => Object.hasOwn(messages, code));
  render(preferred || 'en');
  for (const panel of panels) panel.querySelector('select').addEventListener('change', event => render(event.target.value));
})();
