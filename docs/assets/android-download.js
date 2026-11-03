(() => {
  'use strict';
  const dialog = document.getElementById('android-download-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const server1 = document.getElementById('android-server-one');
  const started = document.getElementById('android-download-started');
  let trigger;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || dialog.contains(link)) return;
    let url;
    try { url = new URL(link.href); } catch (_) { return; }
    if (url.hostname !== 'github.com' || !/^\/elementtime6969\/mycam\/releases\/download\/v[\d.]+\/Mycam-v[\d.]+\.apk$/i.test(url.pathname)) return;
    event.preventDefault();
    trigger = link; server1.href = link.href; started.hidden = true;
    dialog.showModal(); document.body.classList.add('modal-open');
    server1.focus();
  });
  dialog.querySelector('[data-close-download]').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('[data-download-server]').forEach(link => link.addEventListener('click', () => { started.hidden = false; }));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  });
})();
