import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, signOut, reload } from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js';

// Firebase browser configuration is public. Payment credentials remain server-side.
const app = initializeApp({ apiKey: 'FIREBASE_BROWSER_API_KEY_REMOVED',
  authDomain: 'wallpaper-5b02e.firebaseapp.com', projectId: 'wallpaper-5b02e', appId: '1:817689287186:web:5024c448678fc3520296cb' });
const auth = getAuth(app);
const ENDPOINT = 'https://europe-west2-wallpaper-5b02e.cloudfunctions.net/myCamWebStore';
const $ = id => document.getElementById(id);
const show = (id, visible) => { $(id).hidden = !visible; };
const money = value => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
const date = value => value ? new Date(value).toLocaleString() : '';
const icons = () => window.lucide?.createIcons();
let catalog, account, project, keyCursor, chatCursor, authMode = 'signin', pendingView = 'wallet', working = false, loading = false;
let projectRequestId, messageRequestId, accountEpoch = 0;
const statusNames = { waiting: 'Awaiting payment', creating: 'Preparing checkout', create_failed: 'Checkout needs review',
  partially_paid: 'Partial payment', confirmed: 'Confirming payment', confirming: 'Confirming payment', sending: 'Processing payment',
  finished: 'Paid', refunded: 'Refunded', expired: 'Expired', failed: 'Failed', unused: 'Ready to activate',
  activated: 'Activated', scheduled: 'Scheduled', revoked: 'Revoked', pending: 'Awaiting admin', approved: 'Approved', declined: 'Declined' };
function node(tag, text, className) { const el = document.createElement(tag); if (text != null) el.textContent = text; if (className) el.className = className; return el; }
function notice(text, error = false) { $('store-status').textContent = text; $('store-status').dataset.error = String(error); show('store-status', true); }
function errorMessage(error) {
  const messages = { 'auth/invalid-credential': 'Email or password is incorrect.', 'auth/email-already-in-use': 'That email already has an account. Sign in or reset your password.',
    'auth/weak-password': 'Choose a stronger password with at least eight characters.', 'auth/invalid-email': 'Enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.', 'auth/network-request-failed': 'Connection failed. Check your network and retry.' };
  return messages[error.code] || error.message || 'Something went wrong. Please retry.';
}
async function api(action, data = {}) {
  if (!auth.currentUser) throw new Error('Sign in to continue.');
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...data, action }), signal: AbortSignal.timeout(115000), cache: 'no-store' });
  const value = await response.json();
  if (!response.ok || value.ok === false) throw new Error(value.error || 'Request failed. Please retry.');
  return value;
}
function view(name, scroll = false) {
  pendingView = name;
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
  for (const item of ['wallet', 'orders', 'project']) show(`view-${item}`, item === name);
  if (scroll) $('account').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function openAuth(target = 'wallet') { pendingView = target; $('auth-error').textContent = ''; $('auth-dialog').showModal(); }
async function work(button, action) {
  if (working) return;
  working = true; const wasDisabled = button?.disabled;
  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
  try { await action(); } catch (error) { notice(errorMessage(error), true); }
  finally { working = false; if (button) { button.disabled = wasDisabled; button.removeAttribute('aria-busy'); } }
}
function selectedProvider() { return document.querySelector('[name=provider]:checked').value; }
function quote() {
  if (!catalog) return;
  const provider = selectedProvider(), unit = catalog.keys[provider], quantity = Number($('quantity').value);
  $('key-price').textContent = money(unit); $('key-total').textContent = money(unit * (Number.isInteger(quantity) && quantity >= 1 ? quantity : 1));
  show('crypto-note', provider === 'nowpayments');
  $('buy-keys').disabled = !catalog.keys.enabled;
  $('buy-keys').textContent = catalog.keys.enabled ? `Buy keys with ${provider === 'paypal' ? 'PayPal' : 'crypto'}` : 'Key sales currently unavailable';
}
async function loadCatalog() {
  const response = await fetch(ENDPOINT, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('Prices are unavailable. Please refresh prices.');
  catalog = await response.json();
  $('quantity').max = catalog.keys.maxQuantity;
  document.querySelector('[value=paypal]').disabled = !catalog.keys.paypalAvailable;
  $('paypal-note').textContent = catalog.keys.paypalAvailable ? 'Card or PayPal account' : 'Currently unavailable';
  if (!catalog.keys.paypalAvailable) document.querySelector('[value=nowpayments]').checked = true;
  quote();
}
function safeCheckout(url) {
  try { const u = new URL(url); return u.protocol === 'https:' && !u.username && !u.password && !u.port &&
    (u.hostname === 'nowpayments.io' && /^\/payment\/?$/.test(u.pathname) || u.hostname === 'www.paypal.com' && /^\/checkoutnow\/?$/.test(u.pathname)); } catch { return false; }
}
function checkoutWindow() {
  const win = window.open('about:blank', '_blank');
  if (win) { win.opener = null; win.document.title = 'Preparing secure checkout'; win.document.body.textContent = 'Preparing your secure checkout...'; }
  return win;
}
function launchCheckout(result, win) {
  if (!safeCheckout(result.invoiceUrl)) { win?.close(); throw new Error('Unexpected payment link. Contact support.'); }
  if (win) win.location.replace(result.invoiceUrl);
  notice('Checkout is ready. Your purchase will appear here after payment is verified.');
  const link = node('a', 'Open secure checkout', 'text-link'); link.href = result.invoiceUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
  $('store-status').append(document.createElement('br'), link);
}
function renderKeys(keys, append = false) {
  if (!append) $('wallet-list').replaceChildren();
  if (!append && !keys.length) $('wallet-list').append(node('p', 'No keys yet. Completed purchases will appear here.', 'empty-state'));
  keys.forEach(key => {
    const row = node('article', null, 'wallet-item'), details = node('div');
    details.append(node('span', statusNames[key.status] || key.status, 'status-badge'));
    if (key.code) details.append(node('code', key.code));
    details.append(node('p', key.accessUntilMillis ? `Access ends ${date(key.accessUntilMillis)}` : 'One calendar month from activation.'));
    row.append(details);
    if (key.code) {
      const copy = node('button', 'Copy', 'button small outline'); copy.type = 'button';
      copy.onclick = () => work(copy, async () => { try { await navigator.clipboard.writeText(key.code); notice('Key copied.'); } catch { notice('Select the key text to copy it.'); } }); row.append(copy);
    }
    $('wallet-list').append(row);
  });
}
function renderOrders(orders) {
  $('order-list').replaceChildren();
  if (!orders.length) $('order-list').append(node('p', 'No orders yet.', 'empty-state'));
  orders.forEach(order => {
    const row = node('article', null, 'order-item'), info = node('div'), actions = node('div', null, 'order-actions');
    info.append(node('strong', `${order.quantity} key${order.quantity === 1 ? '' : 's'} / ${money(order.priceAmount)}`),
      node('p', `${order.provider === 'paypal' ? 'PayPal' : 'Crypto'} · ${date(order.createdAtMillis)}`), node('p', order.orderId));
    actions.append(node('span', statusNames[order.paymentStatus] || order.paymentStatus, 'status-badge'));
    if (!['finished', 'refunded', 'expired', 'failed'].includes(order.paymentStatus)) {
      if (safeCheckout(order.invoiceUrl)) { const link = node('a', 'Continue payment', 'plain-link'); link.href = order.invoiceUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; actions.append(link); }
      const check = node('button', 'Check payment', 'button small outline'); check.type = 'button';
      check.onclick = () => work(check, async () => { const result = await api('keys.check', { orderId: order.orderId }); await loadAccount();
        notice(result.issued ? 'Payment verified. Your keys are ready in My keys.' : result.verification === 'unavailable' ? 'Provider verification is unavailable. Do not pay again; retry shortly.' : 'Payment checked. Keys appear once the full payment is verified.'); }); actions.append(check);
    }
    row.append(info, actions); $('order-list').append(row);
  });
}
function renderProject(value) {
  const oldScope = project?.scope;
  project = value;
  show('gold-form', !value); show('gold-thread', Boolean(value));
  if (!value) {
    for (const id of ['project-state', 'project-contact', 'project-brief', 'project-reference', 'decision-text', 'gold-payment-message']) $(id).textContent = '';
    $('gold-pay-consent').checked = false;
    return;
  }
  if (oldScope !== value.scope) $('gold-pay-consent').checked = false;
  $('project-state').textContent = value.refundedAtMillis ? 'Refunded' : value.paidAtMillis ? 'Gold paid' : statusNames[value.approvalStatus] || value.approvalStatus;
  $('project-contact').textContent = `${value.email} · ${value.telegram}`; $('project-brief').textContent = value.brief;
  $('project-reference').textContent = value.orderId;
  show('project-decision', Boolean(value.scope || value.decisionReason));
  $('decision-title').textContent = value.approvalStatus === 'declined' ? 'Request declined' : 'Agreed scope & terms';
  $('decision-text').textContent = value.scope || value.decisionReason || '';
  show('gold-pay-form', value.approvalStatus === 'approved' && !value.paidAtMillis && !value.refundedAtMillis);
  $('gold-payment-message').textContent = value.paidAtMillis ? (value.refundedAtMillis ? 'This payment was refunded.' : 'Payment verified. Your Gold project is active.') :
    value.approvalStatus === 'pending' ? 'Payment stays locked while you discuss the project with admin.' :
    value.approvalStatus === 'declined' ? 'No payment was requested for this project.' : `Payment: ${statusNames[value.paymentStatus] || 'Not opened'}. Gold uses NOWPayments only.`;
  show('message-form', value.approvalStatus !== 'declined'); show('new-project', value.approvalStatus === 'declined');
}
async function loadThread(older = false) {
  if (!project) return;
  const epoch = accountEpoch, id = project.orderId;
  const result = await api('gold.thread', { orderId: id, ...(older ? { before: chatCursor } : {}) });
  if (epoch !== accountEpoch || project?.orderId !== id) return;
  if (!older) renderProject(result.project);
  chatCursor = result.nextCursor; show('older-messages', Boolean(chatCursor));
  const log = $('messages'), atBottom = log.scrollHeight - log.clientHeight - log.scrollTop < 60;
  const existing = older ? Array.from(log.children) : [];
  const content = result.messages.map(message => {
    const el = node('article', null, `chat-message ${message.sender}`);
    el.append(node('small', `${message.sender === 'admin' ? 'MYCAM team' : 'You'} · ${date(message.createdAtMillis)}`), node('p', message.text)); return el;
  });
  log.replaceChildren(...content, ...existing);
  if (!log.children.length) log.append(node('p', 'Your request is with the MYCAM team. You can add more details here.', 'empty-state'));
  if (atBottom && !older) log.scrollTop = log.scrollHeight;
}
async function loadAccount() {
  if (!auth.currentUser || loading) return;
  loading = true; const epoch = accountEpoch;
  try {
    const result = await api('account'); if (epoch !== accountEpoch) return;
    account = result; keyCursor = result.nextCursor;
    renderKeys(result.keys || []); renderOrders(result.orders || []); renderProject(result.project);
    show('more-keys', Boolean(keyCursor)); show('verification', !result.verified);
    $('account-email').textContent = result.email; $('gold-email').textContent = `Contact email: ${result.email}`;
    await loadThread();
  } finally {
    loading = false;
    if (epoch !== accountEpoch && auth.currentUser) loadAccount().catch(error => notice(errorMessage(error), true));
  }
}
document.querySelectorAll('[data-view]').forEach(button => button.onclick = () => view(button.dataset.view));
document.querySelectorAll('[data-auth]').forEach(button => button.onclick = () => {
  authMode = button.dataset.auth;
  document.querySelectorAll('[data-auth]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  $('auth-title').textContent = authMode === 'signin' ? 'Welcome back' : 'Your MYCAM account';
  $('auth-submit').textContent = authMode === 'signin' ? 'Sign in' : 'Create account';
  $('auth-password').autocomplete = authMode === 'signin' ? 'current-password' : 'new-password';
  $('auth-password').minLength = authMode === 'signin' ? 1 : 8;
  $('auth-error').textContent = '';
});
$('login-button').onclick = () => auth.currentUser ? view('wallet', true) : openAuth();
$('account-signin').onclick = () => openAuth();
$('close-auth').onclick = () => $('auth-dialog').close();
$('auth-form').onsubmit = async event => {
  event.preventDefault(); const button = $('auth-submit'); if (button.disabled) return; button.disabled = true; $('auth-error').textContent = '';
  try {
    const email = $('auth-email').value.trim(), password = $('auth-password').value;
    if (authMode === 'register') { const result = await createUserWithEmailAndPassword(auth, email, password);
      try { await sendEmailVerification(result.user); notice('Account created. Check your inbox to verify your email.'); }
      catch { notice('Account created. Use Send verification email in My account.', true); }
    } else await signInWithEmailAndPassword(auth, email, password);
    $('auth-password').value = ''; $('auth-dialog').close(); view(pendingView, true);
  } catch (error) { $('auth-error').textContent = errorMessage(error); } finally { button.disabled = false; }
};
$('reset-password').onclick = async () => {
  if (!$('auth-email').reportValidity()) return;
  const button = $('reset-password'); button.disabled = true;
  try { await sendPasswordResetEmail(auth, $('auth-email').value.trim()); $('auth-error').textContent = 'If this email has an account, a reset link will arrive shortly.'; }
  catch (error) { $('auth-error').textContent = errorMessage(error); } finally { button.disabled = false; }
};
$('send-verification').onclick = () => work($('send-verification'), async () => { await sendEmailVerification(auth.currentUser); notice('Verification email sent. Check your inbox and spam folder.'); });
$('check-verification').onclick = () => work($('check-verification'), async () => { await reload(auth.currentUser); await auth.currentUser.getIdToken(true); await loadAccount(); notice(auth.currentUser.emailVerified ? 'Email verified.' : 'Your email is not verified yet.'); });
$('logout').onclick = () => work($('logout'), () => signOut(auth));
$('refresh-account').onclick = () => work($('refresh-account'), loadAccount);
$('reload-prices').onclick = () => work($('reload-prices'), loadCatalog);
document.querySelectorAll('[name=provider]').forEach(el => el.onchange = quote); $('quantity').oninput = quote;
$('key-form').onsubmit = event => {
  event.preventDefault(); if (!auth.currentUser) return openAuth('orders');
  if (!auth.currentUser.emailVerified) { notice('Verify your email in My account first.', true); return view('orders', true); }
  if (working || !catalog) return;
  const win = checkoutWindow();
  work($('buy-keys'), async () => { try {
    const provider = selectedProvider(), quantity = Number($('quantity').value);
    const result = await api('keys.checkout', { provider, quantity, expectedAmount: catalog.keys[provider] * quantity, acceptTerms: $('key-consent').checked });
    launchCheckout(result, win); view('orders', true); await loadAccount();
  } catch (error) { win?.close(); throw error; } });
};
$('request-gold').onclick = () => { if (!auth.currentUser) openAuth('project'); else { view('project', true); } };
$('gold-form').onsubmit = event => { event.preventDefault(); const button = event.submitter;
  work(button, async () => { projectRequestId ||= crypto.randomUUID();
    const result = await api('gold.request', { telegram: $('telegram').value, brief: $('brief').value, acceptTerms: $('gold-consent').checked, requestId: projectRequestId });
    projectRequestId = null; renderProject(result.project); await loadThread(); notice('Request sent. Chat with the team here before any payment.'); });
};
$('gold-pay-form').onsubmit = event => { event.preventDefault(); if (working || !project) return; const win = checkoutWindow();
  work(event.submitter, async () => { try { const result = await api('gold.checkout', { orderId: project.orderId, expectedAmount: 3000,
    acceptTerms: $('gold-pay-consent').checked, acceptedScope: project.scope }); launchCheckout(result, win); await loadAccount(); }
  catch (error) { win?.close(); throw error; } });
};
$('message-form').onsubmit = event => { event.preventDefault(); if (!project) return;
  work(event.submitter, async () => { messageRequestId ||= crypto.randomUUID(); await api('gold.message', { orderId: project.orderId, text: $('message').value, requestId: messageRequestId });
    messageRequestId = null; $('message').value = ''; await loadThread(); $('messages').scrollTop = $('messages').scrollHeight; });
};
$('new-project').onclick = () => { projectRequestId = null; $('gold-form').reset(); renderProject(null); };
$('older-messages').onclick = () => work($('older-messages'), () => loadThread(true));
$('more-keys').onclick = () => work($('more-keys'), async () => { const epoch = accountEpoch, next = await api('account', { cursor: keyCursor });
  if (epoch !== accountEpoch) return; renderKeys(next.keys || [], true); keyCursor = next.nextCursor; show('more-keys', Boolean(keyCursor)); });
onAuthStateChanged(auth, user => {
  accountEpoch++; account = null; project = null; keyCursor = null; chatCursor = null; projectRequestId = null; messageRequestId = null;
  $('wallet-list').replaceChildren(); $('order-list').replaceChildren(); $('messages').replaceChildren(); $('brief').value = ''; $('message').value = ''; $('telegram').value = '';
  renderProject(null); $('gold-email').textContent = ''; $('gold-consent').checked = false;
  show('account-content', Boolean(user)); show('signed-out', !user); show('logout', Boolean(user)); show('refresh-account', Boolean(user)); show('verification', Boolean(user && !user.emailVerified));
  $('login-button').textContent = user ? 'My account' : 'Sign in';
  $('account-email').textContent = user?.email || 'Sign in to view your keys, payments and project chat.';
  if (user) { view(pendingView); loadAccount().catch(error => notice(errorMessage(error), true)); }
});
let polling = false;
setInterval(async () => {
  if (!auth.currentUser || document.hidden || working || polling) return;
  polling = true;
  try { if (pendingView === 'project' && project) await loadThread(); } catch { /* Explicit refresh reports connection failures. */ }
  finally { polling = false; }
}, 15000);
window.addEventListener('focus', () => { if (auth.currentUser && !working) loadAccount().catch(error => notice(errorMessage(error), true)); });
if (location.hash === '#gold') pendingView = 'project';
loadCatalog().catch(error => { $('buy-keys').textContent = 'Prices unavailable'; notice(errorMessage(error), true); });
icons();
