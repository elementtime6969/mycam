(() => {
  'use strict';
  const apk = document.querySelector('.hero-actions a').href;
  const tutorials = {
    standalone: { video: '57yzC7uYvX0', title: 'MYCAM standalone tutorial', url: 'https://youtu.be/57yzC7uYvX0?is=32Vgl2QqTEK6dMv6' },
    nonroot: { video: 'N-sgR6y6h9s', title: 'MYCAM non-root + MOCHI tutorial', url: 'https://youtu.be/N-sgR6y6h9s?is=lj3b_pDY7KCkOEXu' },
    legacy: { video: 'dzsUGq8qy1Y', title: 'MYCAM Legacy LSPosed tutorial', url: 'https://youtu.be/dzsUGq8qy1Y?si=q0GkRN_WRSyMR5h4' },
    windows: { video: '7yKQAaP4SZ0', title: 'MYCAM Windows PC Studio tutorial', url: 'https://youtu.be/7yKQAaP4SZ0?si=lLMXI89LKjY_VblE' },
    obs: { video: '4k45NKvzP4k', title: 'MYCAM OBS live streaming tutorial', url: 'https://youtu.be/4k45NKvzP4k?is=LY8h0Eux9Xc-1cVY' },
    ios: { video: 'JaYVvwRQ4vU', title: 'MYCAM iOS setup tutorial', url: 'https://youtu.be/JaYVvwRQ4vU?is=_dEw0d2QL0_TNPTS' }
  };
  const engines = {
    standalone: { requirement: 'ROOTED ANDROID', title: 'Standalone. Direct by design.', description: 'Prepare your target app directly inside MYCAM. The standalone engine works without an LSPosed setup on supported rooted phones.', steps: ['Install the latest MYCAM APK.', 'Select the standalone engine.', 'Choose and prepare your target app.'], download: apk, downloadLabel: 'Download MYCAM', label: 'STANDALONE / DEMO & SETUP' },
    nonroot: { requirement: 'SUPPORTED NON-ROOT ANDROID', title: 'Your phone. No rooting.', description: 'Use the non-root engine with the required MOCHI helper. Keep your phone unrooted and follow the tutorial for a supported app setup.', steps: ['Install MYCAM and the MOCHI helper.', 'Follow the non-root setup tutorial.', 'Prepare a supported app and select your media.'], download: 'https://raw.githubusercontent.com/elementtime6969/mycam/main/downloads/MOCHI.apk', downloadLabel: 'Download MOCHI', label: 'NON-ROOT / DEMO & SETUP' },
    legacy: { requirement: 'ROOT + LSPOSED', title: 'Legacy. A familiar route.', description: 'Use MYCAM Legacy when your rooted setup relies on LSPosed module activation. The Legacy mode is included in the same MYCAM app.', steps: ['Install MYCAM on a compatible rooted phone.', 'Follow the LSPosed activation tutorial.', 'Set up your target apps in MYCAM Legacy.'], download: apk, downloadLabel: 'Download MYCAM', label: 'LEGACY LSPOSED / DEMO & SETUP' }
  };
  const icons = () => window.lucide?.createIcons();
  icons();
  function loadVideo(player, autoplay = true) {
    const id = player.dataset.video;
    if (!/^[\w-]{11}$/.test(id)) return;
    document.querySelectorAll('.video-player iframe').forEach(frame => {
      const other = frame.parentElement;
      if (other !== player) thumbnail(other, {video: other.dataset.video, title: other.dataset.title});
    });
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay ? '1' : '0'}&rel=0&playsinline=1`;
    frame.title = player.dataset.title;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const external = document.createElement('a');
    external.href = `https://www.youtube.com/watch?v=${id}`;
    external.textContent = 'Open on YouTube'; external.target = '_blank'; external.rel = 'noopener noreferrer'; external.className = 'player-external';
    player.replaceChildren(frame, external);
    frame.focus();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.video-play');
    if (button) loadVideo(button.closest('.video-player'));
  });
  function thumbnail(player, tutorial) {
    player.dataset.video = tutorial.video; player.dataset.title = tutorial.title;
    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${tutorial.video}/hqdefault.jpg`; img.alt = `${tutorial.title} thumbnail`; img.width = 480; img.height = 360;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'video-play';
    button.setAttribute('aria-label', `Play ${tutorial.title}`);
    button.innerHTML = '<span class="play-circle"><i data-lucide="play" aria-hidden="true"></i></span><span>Watch the engine in action</span>';
    player.replaceChildren(img, button); icons();
  }
  const tabs = [...document.querySelectorAll('[data-engine]')];
  function selectEngine(key, focus = false) {
    const engine = engines[key]; if (!engine) return;
    tabs.forEach(tab => { const selected = tab.dataset.engine === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); });
    document.getElementById('engine-panel').setAttribute('aria-labelledby', `tab-${key}`);
    document.getElementById('engine-title').textContent = engine.title;
    document.getElementById('engine-requirement').textContent = engine.requirement;
    document.getElementById('engine-description').textContent = engine.description;
    document.getElementById('engine-demo-label').textContent = engine.label;
    document.getElementById('engine-steps').replaceChildren(...engine.steps.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    const download = document.getElementById('engine-download'); download.href = engine.download;
    download.innerHTML = `${engine.downloadLabel} <i data-lucide="download" aria-hidden="true"></i>`;
    document.getElementById('engine-youtube').href = tutorials[key].url;
    thumbnail(document.getElementById('engine-player'), tutorials[key]);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectEngine(tab.dataset.engine));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectEngine(tabs[next].dataset.engine, true); }
    });
  });
  const menuToggle = document.querySelector('.menu-toggle'); const menu = document.getElementById('mobile-nav');
  function closeMenu() { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); }
  menuToggle.addEventListener('click', () => { menu.hidden = !menu.hidden; menuToggle.setAttribute('aria-expanded', String(!menu.hidden)); menuToggle.setAttribute('aria-label', menu.hidden ? 'Open navigation' : 'Close navigation'); });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuToggle.focus(); } });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  let dialogTrigger;
  function showDialog(dialog, trigger) {
    if (typeof dialog.showModal !== 'function') return false;
    dialogTrigger = trigger; closeMenu(); document.getElementById('nonroot-notice').hidden = true;
    // Stop inline playback when another tutorial opens.
    document.querySelectorAll('main .video-player iframe').forEach(frame => { const player = frame.parentElement; thumbnail(player, {video: player.dataset.video, title: player.dataset.title}); });
    dialog.showModal(); document.body.classList.add('modal-open'); dialog.querySelector('[data-close-dialog]').focus(); return true;
  }
  const tutorialDialog = document.getElementById('tutorial-dialog');
  document.querySelectorAll('[data-tutorial]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!showDialog(tutorialDialog, link)) return;
    event.preventDefault(); const tutorial = tutorials[link.dataset.tutorial];
    document.getElementById('tutorial-title').textContent = tutorial.title; document.getElementById('tutorial-external').href = tutorial.url;
    const player = document.createElement('div'); player.className = 'video-player'; player.dataset.video = tutorial.video; player.dataset.title = tutorial.title;
    document.getElementById('tutorial-mount').replaceChildren(player); loadVideo(player);
  }));
  document.getElementById('open-pro').addEventListener('click', event => showDialog(document.getElementById('mycam-pro'), event.currentTarget));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
    dialog.addEventListener('close', () => { if (dialog === tutorialDialog) document.getElementById('tutorial-mount').replaceChildren(); document.body.classList.remove('modal-open'); dialogTrigger?.focus({preventScroll: true}); });
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold: 0.08});
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  }
  const progress = document.querySelector('.scroll-progress'); const hero = document.querySelector('.hero-product'); const notice = document.getElementById('nonroot-notice');
  let noticeDismissed = false;
  try { noticeDismissed = sessionStorage.getItem('mycam-nonroot-dismissed') === '1'; } catch (_) { /* Private browsing may disable storage. */ }
  let scheduled = false;
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight; const ratio = max > 0 ? scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    hero.style.transform = !reduced.matches && innerWidth > 760 ? `translateY(${Math.min(scrollY * .06, 30)}px)` : '';
    if (ratio > .3 && !noticeDismissed && !document.querySelector('dialog[open]')) { notice.hidden = false; noticeDismissed = true; }
    scheduled = false;
  }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(onScroll); } }, {passive: true}); addEventListener('resize', onScroll); onScroll();
  function dismissNotice() { notice.hidden = true; noticeDismissed = true; try { sessionStorage.setItem('mycam-nonroot-dismissed', '1'); } catch (_) {} }
  document.getElementById('close-notice').addEventListener('click', dismissNotice);
  document.getElementById('notice-engine').addEventListener('click', () => { selectEngine('nonroot'); dismissNotice(); });
  document.addEventListener('error', event => { if (event.target.tagName === 'IMG' && event.target.src.includes('i.ytimg.com')) event.target.src = 'assets/mycam-logo.png'; }, true);
})();
