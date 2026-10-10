(() => {
  'use strict';
  // Independent of sign-in, prices and payment services so help appears immediately.
  const messages = {
    en: {
      title: 'Pay by card through PayPal',
      intro: 'You do not need a PayPal account when card guest checkout is offered. Use your debit or credit card on PayPal’s secure checkout page.',
      steps: [
        'Sign in to your MYCAM Store account, or create one and verify your email. This is your MYCAM account, separate from PayPal.',
        'In the activation key section, select PayPal and choose how many keys you need. Review the total and accept the purchase terms.',
        'Select “Buy keys with PayPal”. The secure PayPal checkout opens in a new tab. If the tab does not open, use “Open secure checkout” on the store page.',
        'On PayPal, choose “Pay with Debit or Credit Card” or the guest checkout option instead of signing in. The wording can vary by country.',
        'Enter your email, card details and billing information on PayPal. If offered, decline the optional account creation. Review the amount, confirm payment and complete any bank verification.',
        'Return to MYCAM Store after payment. Once verified, your keys appear under “My keys”. Use the refresh button if needed.'
      ],
      note: 'Card guest checkout depends on your country and PayPal’s eligibility checks. If it is not shown, contact MYCAM support or use another available payment option.',
      source: 'PayPal guest checkout help', close: 'Got it', dismiss: 'Close payment guide', language: 'Guide language', reopen: 'How to pay by card with PayPal'
    },
    es: {
      title: 'Paga con tarjeta a través de PayPal',
      intro: 'No necesitas una cuenta de PayPal cuando se ofrece el pago con tarjeta como invitado. Usa tu tarjeta de débito o crédito en la página segura de PayPal.',
      steps: [
        'Inicia sesión en MYCAM Store o crea una cuenta y verifica tu correo. Tu cuenta de MYCAM es independiente de PayPal.',
        'En la sección de claves de activación, selecciona PayPal y la cantidad de claves. Revisa el total y acepta las condiciones de compra.',
        'Pulsa “Buy keys with PayPal” (comprar claves con PayPal). Se abre una nueva pestaña de pago seguro. Si no se abre, usa “Open secure checkout” en la tienda.',
        'En PayPal, elige “Pagar con tarjeta de débito o crédito” o la opción de invitado en lugar de iniciar sesión. El texto puede variar según el país.',
        'Introduce tu correo, los datos de la tarjeta y la información de facturación en PayPal. Si se ofrece crear una cuenta opcional, recházalo. Revisa el importe, confirma el pago y completa la verificación bancaria.',
        'Vuelve a MYCAM Store tras pagar. Una vez verificado el pago, las claves aparecen en “My keys” (mis claves). Usa el botón de actualizar si es necesario.'
      ],
      note: 'El pago como invitado depende de tu país y de las comprobaciones de PayPal. Si no aparece, contacta con el soporte de MYCAM o usa otra opción de pago disponible.',
      source: 'Ayuda de PayPal para pagar como invitado', close: 'Entendido', dismiss: 'Cerrar guía de pago', language: 'Idioma de la guía', reopen: 'Cómo pagar con tarjeta mediante PayPal'
    },
    fr: {
      title: 'Payez par carte via PayPal',
      intro: 'Vous n’avez pas besoin de compte PayPal lorsque le paiement par carte en tant qu’invité est proposé. Utilisez votre carte de débit ou de crédit sur la page sécurisée de PayPal.',
      steps: [
        'Connectez-vous à MYCAM Store, ou créez un compte et vérifiez votre adresse e-mail. Ce compte MYCAM est distinct de PayPal.',
        'Dans la section des clés d’activation, choisissez PayPal et le nombre de clés. Vérifiez le total et acceptez les conditions d’achat.',
        'Sélectionnez « Buy keys with PayPal » (acheter des clés avec PayPal). Le paiement sécurisé s’ouvre dans un nouvel onglet. Sinon, utilisez « Open secure checkout » dans la boutique.',
        'Sur PayPal, choisissez « Payer par carte bancaire » ou le paiement en tant qu’invité au lieu de vous connecter. Le libellé peut varier selon le pays.',
        'Saisissez votre e-mail, les données de votre carte et vos coordonnées de facturation sur PayPal. Si la création d’un compte est facultative, refusez-la. Vérifiez le montant, confirmez le paiement et effectuez la vérification bancaire.',
        'Revenez à MYCAM Store après le paiement. Une fois celui-ci vérifié, vos clés apparaissent dans « My keys » (mes clés). Utilisez le bouton d’actualisation si nécessaire.'
      ],
      note: 'Le paiement en tant qu’invité dépend de votre pays et des vérifications de PayPal. S’il n’est pas proposé, contactez l’assistance MYCAM ou choisissez un autre moyen de paiement disponible.',
      source: 'Aide PayPal sur le paiement en tant qu’invité', close: 'Compris', dismiss: 'Fermer le guide de paiement', language: 'Langue du guide', reopen: 'Comment payer par carte via PayPal'
    },
    ru: {
      title: 'Оплата картой через PayPal',
      intro: 'Аккаунт PayPal не нужен, если доступна гостевая оплата картой. Используйте дебетовую или кредитную карту на защищённой странице PayPal.',
      steps: [
        'Войдите в MYCAM Store или создайте аккаунт и подтвердите электронную почту. Аккаунт MYCAM не связан с аккаунтом PayPal.',
        'В разделе ключей активации выберите PayPal и количество ключей. Проверьте итоговую сумму и примите условия покупки.',
        'Нажмите «Buy keys with PayPal» (купить ключи через PayPal). Оплата откроется в новой вкладке. Если этого не произошло, нажмите «Open secure checkout» в магазине.',
        'На странице PayPal выберите оплату дебетовой или кредитной картой либо гостевую оплату вместо входа в аккаунт. Название зависит от страны.',
        'Введите электронную почту, данные карты и платёжный адрес на PayPal. Если создание аккаунта необязательно, откажитесь. Проверьте сумму, подтвердите оплату и пройдите проверку банка.',
        'После оплаты вернитесь в MYCAM Store. После проверки платежа ключи появятся в «My keys» (мои ключи). При необходимости нажмите кнопку обновления.'
      ],
      note: 'Гостевая оплата зависит от страны и проверок PayPal. Если её нет, обратитесь в поддержку MYCAM или выберите другой доступный способ оплаты.',
      source: 'Справка PayPal о гостевой оплате', close: 'Понятно', dismiss: 'Закрыть инструкцию', language: 'Язык инструкции', reopen: 'Как оплатить картой через PayPal'
    },
    hi: {
      title: 'PayPal के ज़रिए कार्ड से भुगतान करें',
      intro: 'जब कार्ड से गेस्ट चेकआउट उपलब्ध हो, तो PayPal खाते की ज़रूरत नहीं है। PayPal के सुरक्षित भुगतान पेज पर अपना डेबिट या क्रेडिट कार्ड इस्तेमाल करें।',
      steps: [
        'MYCAM Store में साइन इन करें या खाता बनाकर ईमेल सत्यापित करें। यह MYCAM खाता है, PayPal खाते से अलग।',
        'एक्टिवेशन की वाले भाग में PayPal और की की संख्या चुनें। कुल राशि देखें और खरीद की शर्तें स्वीकार करें।',
        '“Buy keys with PayPal” पर क्लिक करें। सुरक्षित PayPal भुगतान नई टैब में खुलेगा। टैब न खुले तो स्टोर पर “Open secure checkout” इस्तेमाल करें।',
        'PayPal पर साइन इन करने के बजाय “Pay with Debit or Credit Card” या गेस्ट चेकआउट चुनें। देश के अनुसार बटन का नाम बदल सकता है।',
        'PayPal पर ईमेल, कार्ड की जानकारी और बिलिंग विवरण भरें। खाता बनाना वैकल्पिक हो तो उसे मना कर दें। राशि जाँचें, भुगतान की पुष्टि करें और बैंक का सत्यापन पूरा करें।',
        'भुगतान के बाद MYCAM Store पर लौटें। भुगतान सत्यापित होने पर आपकी की “My keys” में दिखेंगी। ज़रूरत हो तो रीफ़्रेश बटन दबाएँ।'
      ],
      note: 'गेस्ट चेकआउट आपके देश और PayPal की पात्रता जाँच पर निर्भर है। यह विकल्प न दिखे तो MYCAM सहायता से संपर्क करें या दूसरा उपलब्ध भुगतान विकल्प चुनें।',
      source: 'PayPal गेस्ट चेकआउट सहायता', close: 'समझ गया', dismiss: 'भुगतान गाइड बंद करें', language: 'गाइड की भाषा', reopen: 'PayPal के ज़रिए कार्ड से भुगतान कैसे करें'
    },
    zh: {
      title: '通过 PayPal 使用银行卡付款',
      intro: '如果提供银行卡访客付款，就无需 PayPal 账户。您可以在 PayPal 的安全结账页面使用借记卡或信用卡。',
      steps: [
        '登录 MYCAM Store，或创建账户并验证邮箱。这是 MYCAM 账户，与 PayPal 账户不同。',
        '在激活密钥区域选择 PayPal 和密钥数量。核对总金额并同意购买条款。',
        '点击“Buy keys with PayPal”（通过 PayPal 购买密钥）。安全结账页面会在新标签页打开。如果未打开，请点击商店中的“Open secure checkout”。',
        '在 PayPal 页面选择“使用借记卡或信用卡付款”或访客结账，而不是登录。按钮文字可能因国家或地区而异。',
        '在 PayPal 页面填写邮箱、银行卡信息和账单资料。如果创建账户是可选的，可以拒绝。核对金额，确认付款，并完成银行验证。',
        '付款后返回 MYCAM Store。付款验证完成后，密钥会出现在“My keys”（我的密钥）中。如有需要，点击刷新按钮。'
      ],
      note: '访客结账是否可用取决于所在国家或地区及 PayPal 的资格检查。如果没有该选项，请联系 MYCAM 支持或选择其他可用付款方式。',
      source: 'PayPal 访客结账帮助', close: '知道了', dismiss: '关闭付款指南', language: '指南语言', reopen: '如何通过 PayPal 使用银行卡付款'
    },
    ar: {
      title: 'ادفع ببطاقتك عبر PayPal',
      intro: 'لا تحتاج إلى حساب PayPal عندما يتوفر الدفع بالبطاقة كضيف. استخدم بطاقة الخصم أو الائتمان في صفحة الدفع الآمنة لدى PayPal.',
      steps: [
        'سجّل الدخول إلى MYCAM Store أو أنشئ حسابًا وأكّد بريدك الإلكتروني. هذا حساب MYCAM منفصل عن حساب PayPal.',
        'في قسم مفاتيح التفعيل، اختر PayPal وحدّد عدد المفاتيح. راجع الإجمالي واقبل شروط الشراء.',
        'اضغط “Buy keys with PayPal” لشراء المفاتيح. تفتح صفحة الدفع الآمنة في تبويب جديد. إن لم تفتح، استخدم “Open secure checkout” في المتجر.',
        'في PayPal، اختر الدفع ببطاقة الخصم أو الائتمان أو الدفع كضيف بدلًا من تسجيل الدخول. قد تختلف تسمية الخيار حسب البلد.',
        'أدخل بريدك الإلكتروني وبيانات البطاقة والفوترة في PayPal. إذا كان إنشاء الحساب اختياريًا، ارفضه. راجع المبلغ وأكّد الدفع وأكمل أي تحقق يطلبه البنك.',
        'عد إلى MYCAM Store بعد الدفع. بعد التحقق من الدفع تظهر المفاتيح ضمن “My keys”. استخدم زر التحديث عند الحاجة.'
      ],
      note: 'يتوقف توفر الدفع كضيف على بلدك وفحوص الأهلية لدى PayPal. إذا لم يظهر الخيار، تواصل مع دعم MYCAM أو اختر وسيلة دفع أخرى متاحة.',
      source: 'مساعدة PayPal للدفع كضيف', close: 'فهمت', dismiss: 'إغلاق دليل الدفع', language: 'لغة الدليل', reopen: 'كيفية الدفع بالبطاقة عبر PayPal'
    }
  };
  const storageKey = 'mycam-payment-guide-language';
  const cardLabels = { en: 'PayPal / Card', es: 'PayPal / Tarjeta', fr: 'PayPal / Carte', ru: 'PayPal / Карта', hi: 'PayPal / कार्ड', zh: 'PayPal / 银行卡', ar: 'PayPal / البطاقة' };
  const normalize = value => String(value || '').toLowerCase().split(/[-_]/)[0];
  const supported = code => Object.prototype.hasOwnProperty.call(messages, code);
  const readLanguage = () => { try { return normalize(localStorage.getItem(storageKey)); } catch { return ''; } };
  const dialog = document.createElement('dialog');
  dialog.id = 'paypal-guide';
  dialog.className = 'paypal-guide';
  dialog.setAttribute('aria-labelledby', 'paypal-guide-title');
  dialog.innerHTML = `<div class="paypal-guide-top"><span>PayPal / Card</span><button type="button" data-paypal-dismiss data-close-dialog class="paypal-guide-x">×</button></div>
    <h2 id="paypal-guide-title" tabindex="-1" autofocus></h2><p data-paypal-intro></p>
    <label class="paypal-guide-language"><span data-paypal-language></span><select translate="no">
    <option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="ru">Русский</option><option value="hi">हिन्दी</option><option value="zh">简体中文</option><option value="ar">العربية</option></select></label>
    <ol class="paypal-guide-steps"></ol><p class="paypal-guide-note" data-paypal-note></p>
    <div class="paypal-guide-footer"><a href="https://www.paypal.com/uk/cshelp/article/help307" target="_blank" rel="noopener noreferrer" data-paypal-source></a><button type="button" data-paypal-dismiss class="paypal-guide-done"></button></div>`;
  document.body.append(dialog);
  const select = dialog.querySelector('select');
  let currentLanguage;
  function render(code) {
    if (!supported(code) || code === currentLanguage) return;
    currentLanguage = code;
    const text = messages[code];
    dialog.lang = code;
    dialog.dir = code === 'ar' ? 'rtl' : 'ltr';
    dialog.querySelector('.paypal-guide-top > span').textContent = cardLabels[code];
    dialog.querySelector('h2').textContent = text.title;
    for (const key of ['intro', 'note', 'source', 'language']) dialog.querySelector(`[data-paypal-${key}]`).textContent = text[key];
    dialog.querySelector('.paypal-guide-x').setAttribute('aria-label', text.dismiss);
    dialog.querySelector('.paypal-guide-done').textContent = text.close;
    dialog.querySelector('ol').replaceChildren(...text.steps.map(step => { const li = document.createElement('li'); li.textContent = step; return li; }));
    select.value = code;
    document.querySelectorAll('[data-paypal-guide-open]').forEach(button => { button.textContent = text.reopen; button.lang = code; });
  }
  const pageLanguage = normalize(document.documentElement.lang);
  const preferred = (navigator.languages || [navigator.language]).map(normalize).find(supported);
  render(pageLanguage !== 'en' && supported(pageLanguage) ? pageLanguage : supported(readLanguage()) ? readLanguage() : preferred || 'en');
  select.addEventListener('change', () => {
    render(select.value);
    try { localStorage.setItem(storageKey, currentLanguage); } catch { /* Storage can be disabled. */ }
    window.dispatchEvent(new CustomEvent('mycam-language-change', { detail: currentLanguage }));
  });
  window.addEventListener('mycam-language-change', event => render(normalize(event.detail)));
  window.addEventListener('storage', event => { if (event.key === storageKey) render(normalize(event.newValue)); });
  // Follow a translated page without repeatedly resetting browser-translated text.
  new MutationObserver(() => render(normalize(document.documentElement.lang))).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  let returnFocus;
  function open(trigger) {
    if (dialog.open) return;
    returnFocus = trigger || document.querySelector('[data-paypal-guide-open]');
    dialog.showModal();
    document.body.classList.add('paypal-guide-open');
    dialog.querySelector('h2').focus({ preventScroll: true });
  }
  dialog.querySelectorAll('[data-paypal-dismiss]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('paypal-guide-open'); returnFocus?.focus({ preventScroll: true }); });
  document.querySelectorAll('[data-paypal-guide-open]').forEach(button => button.addEventListener('click', () => open(button)));
  open();
})();
