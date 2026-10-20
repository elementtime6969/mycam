import { mountReferrals } from './referrals.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, signOut, reload } from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js';

const IOS_ENDPOINT = 'https://europe-west2-wallpaper-5b02e.cloudfunctions.net/mycamIosWebStoreV1';
const ENDPOINT = 'https://europe-west2-wallpaper-5b02e.cloudfunctions.net/myCamWebStore';
async function startStore() {
const response = await fetch(`${ENDPOINT}?config=web`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error('Store connection unavailable');
const config = await response.json();
if (config.projectId !== 'wallpaper-5b02e' || !config.apiKey || !config.authDomain || !config.appId) throw new Error('Store configuration unavailable');
const auth = getAuth(initializeApp(config));
const referrals = mountReferrals(auth, onAuthStateChanged);
const $ = id => document.getElementById(id);
const show = (id, visible) => { $(id).hidden = !visible; };
const money = (value, currency = 'GBP') => new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(value);
const date = value => value ? new Date(value).toLocaleString() : '';
const icons = () => window.lucide?.createIcons();
let iosCatalog, iosAccount, platform = null;
let catalog, account, project, keyCursor, chatCursor, authMode = 'signin', pendingView = 'wallet', working = false, loading = false;
let projectRequestId, messageRequestId, accountEpoch = 0;
let keyCheckoutRequest;
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
async function api(action, data = {}, endpoint = ENDPOINT) {
  if (!auth.currentUser) throw new Error('Sign in to continue.');
  const uid = auth.currentUser.uid;
  const token = await auth.currentUser.getIdToken();
  if(auth.currentUser?.uid !== uid) throw new Error("Your account changed. Sign in again.");
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...data, action }), signal: AbortSignal.timeout(115000), cache: 'no-store' });
  const value = await response.json();
  if(auth.currentUser?.uid !== uid) throw new Error("Your account changed. Reopen your purchases.");
  if (!response.ok || value.ok === false) throw new Error(value.error || 'Request failed. Please retry.');
  return value;
}
function view(name, scroll = false) {
  pendingView = name;
  if (name === 'referrals') referrals.refresh();
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
  for (const item of ['wallet', 'orders', 'project', 'referrals']) show(`view-${item}`, item === name);
  if (scroll) $('account').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function openAuth(target = 'wallet') { pendingView = target; $('auth-error').textContent = ''; $('auth-dialog').showModal(); }
async function work(button, action) {
  if (working) return;
  working = true;$('key-platforms').disabled=true;$('key-methods').disabled=true;$('key-consent').disabled=true; const wasDisabled = button?.disabled;
  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
  try { await action(); } catch (error) { notice(errorMessage(error), true); }
  finally { working = false;$('key-platforms').disabled=false;$('key-methods').disabled=false;$('key-consent').disabled=false; if (button) { button.disabled = wasDisabled; button.removeAttribute('aria-busy'); } quote(); }
}
const platformName = value => value === 'ios' ? 'iPhone / iPad' : 'Android';
const providerName = value => ({paypal:'PayPal',paystack:'Paystack',flutterwave:'Flutterwave',nowpayments:'crypto'}[value] || value);
function keyApi(value,action,data={}) {
  return value === 'ios' ? api({'keys.checkout':'checkout','keys.check':'check',account:'account'}[action] || action,{...data,platform:'ios'},IOS_ENDPOINT)
    : api(action,{...data,platform:'android'});
}
function selectedProvider() { return document.querySelector('[name=provider]:checked')?.value; }
function currentPrices() {
  if(platform === 'ios') return iosCatalog ? {...iosCatalog.prices,enabled:iosCatalog.enabled,maxQuantity:1,
    providers:iosCatalog.providers || []} : null;
  return platform === 'android' && catalog ? {...catalog.keys,providers:['nowpayments','paystack',...(catalog.keys.paypalAvailable?['paypal']:[])]} : null;
}
function quote() {
  const prices = currentPrices();
  show('flutterwave-option',platform === 'ios');show('paystack-option',platform !== 'ios');
  show('ios-quantity-note',platform === 'ios');
  $('quantity').max = prices?.maxQuantity || 50;$('quantity').disabled = working || platform === 'ios';
  if(platform === 'ios') $('quantity').value = '1';
  document.querySelectorAll('[name=provider]').forEach(input => { input.disabled = !prices?.providers.includes(input.value); });
  if(prices && !prices.providers.includes(selectedProvider())) {
    const available = document.querySelector(`[name=provider][value="${prices.providers[0]}"]`);if(available) available.checked=true;
  }
  const provider=selectedProvider(),unit=prices?.[provider],quantity=Number($('quantity').value);
  const currency=['paystack','flutterwave'].includes(provider)?'NGN':'GBP';
  $('key-currency').textContent = `${currency} / ${platform ? platformName(platform)+' key' : 'key'}`;
  $('key-price').textContent = Number.isFinite(unit)?money(unit,currency):'—';
  $('key-total').textContent = Number.isFinite(unit)?money(unit*(Number.isInteger(quantity)&&quantity>=1?quantity:1),currency):'—';
  $('key-duration').textContent = platform === 'ios' ? '30 days per iPhone / iPad key, starting at first activation.' : platform === 'android' ? 'One calendar month per Android key, starting at first activation.' : 'Choose your phone to see the right key and access period.';
  $('platform-summary').textContent = platform ? `You are buying an ${platformName(platform)} key. It only activates MYCAM for ${platform === 'ios' ? 'iOS / iPadOS' : 'Android'}.` : 'Android and iPhone keys are separate. Choose your phone before buying.';
  $('platform-consent').textContent = platform ? `I am buying an ${platformName(platform)} key for ${platformName(platform)} only.` : 'I have selected the correct phone platform.';
  $('paypal-note').textContent = prices?.providers.includes('paypal')?'Card or PayPal account':'Currently unavailable';
  show('crypto-note',Boolean(platform)&&provider === 'nowpayments');
  show('paystack-note',Boolean(platform)&&['paystack','flutterwave'].includes(provider));
  $('paystack-note').textContent = `${provider === 'flutterwave' ? 'Flutterwave' : 'Paystack'} checkout is in naira. For an international card, your bank handles currency conversion and may charge conversion fees.`;
  const enabled=Boolean(prices?.enabled && prices.providers.includes(provider));
  $('buy-keys').disabled = working || !enabled;
  $('buy-keys').textContent = !platform?'Choose Android or iPhone':enabled?`Buy ${platformName(platform)} ${quantity === 1 ? 'key' : 'keys'} with ${providerName(provider)}`:'Key sales currently unavailable';
}
function selectPlatform(value) {
  platform=['android','ios'].includes(value)?value:null;
  document.querySelectorAll('[name=platform]').forEach(input => {input.checked=input.value===platform;});
  $('key-consent').checked=false;quote();
  const url=new URL(location.href);if(platform) url.searchParams.set('platform',platform);else url.searchParams.delete('platform');history.replaceState(null,'',url);
}
async function loadCatalog() {
  const fetchCatalog=async endpoint=>{const response=await fetch(endpoint,{cache:'no-store',signal:AbortSignal.timeout(30000)});if(!response.ok) throw new Error('Prices are unavailable. Refresh prices before buying.');return response.json();};
  const [android,ios]=await Promise.allSettled([fetchCatalog(ENDPOINT),fetchCatalog(IOS_ENDPOINT)]);
  if(android.status==='fulfilled') catalog=android.value;
  if(ios.status==='fulfilled' && ios.value.platform==='ios') iosCatalog=ios.value;
  quote();
  if(android.status==='rejected' || ios.status==='rejected') notice('Some platform prices could not load. Refresh prices before buying.',true);
}
function safeCheckout(url) {
  try { const u = new URL(url); return u.protocol === 'https:' && !u.username && !u.password && !u.port &&
    (u.hostname === 'nowpayments.io' && /^\/payment\/?$/.test(u.pathname) || u.hostname === 'www.paypal.com' && /^\/checkoutnow\/?$/.test(u.pathname) ||
      u.hostname === 'checkout.flutterwave.com' && /^\/v3\/hosted\/pay\/[^/]+$/.test(u.pathname) || u.hostname === 'checkout.paystack.com' && !u.search && !u.hash && /^\/[A-Za-z0-9_-]{3,200}$/.test(u.pathname)); } catch { return false; }
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
    details.append(node('strong', `${platformName(key.platform)} key`, 'key-platform-label'),node('span', statusNames[key.status] || key.status, 'status-badge'));
    if (key.code) details.append(node('code', key.code));
    details.append(node('p', key.accessUntilMillis ? `Access ends ${date(key.accessUntilMillis)}` : (key.platform === 'ios' ? '30 days from first activation. iPhone / iPad only.' : 'One calendar month from activation. Android only.')));
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
    if (keyCheckoutRequest?.orderId === order.orderId && ['finished', 'refunded', 'expired', 'failed'].includes(order.paymentStatus)) keyCheckoutRequest = null;
    const row = node('article', null, 'order-item'), info = node('div'), actions = node('div', null, 'order-actions');
    info.append(node('strong', `${platformName(order.platform)} · ${order.quantity} key${order.quantity === 1 ? '' : 's'} / ${money(order.priceAmount, order.priceCurrency?.toUpperCase() || (order.provider === 'paystack' ? 'NGN' : 'GBP'))}`),
      node('p', `${providerName(order.provider)} · ${date(order.createdAtMillis)}`), node('p', order.orderId));
    actions.append(node('span', statusNames[order.paymentStatus] || order.paymentStatus, 'status-badge'));
    if (!['finished', 'refunded', 'expired', 'failed'].includes(order.paymentStatus)) {
      if (safeCheckout(order.invoiceUrl)) { const link = node('a', 'Continue payment', 'plain-link'); link.href = order.invoiceUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; actions.append(link); }
      const check = node('button', 'Check payment', 'button small outline'); check.type = 'button';
      check.onclick = () => work(check, async () => { const result = await keyApi(order.platform,'keys.check', { orderId: order.orderId }); await loadAccount();
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
    const [android,ios]=await Promise.allSettled([api('account'),keyApi('ios','account')]);
    if(epoch !== accountEpoch) return;
    if(android.status==='fulfilled') account=android.value;
    if(ios.status==='fulfilled') iosAccount=ios.value;
    keyCursor=account?.nextCursor;
    renderKeys([...(account?.keys||[]).map(key=>({...key,platform:'android'})),...(iosAccount?.keys||[])]);
    renderOrders([...(account?.orders||[]).map(order=>({...order,platform:'android'})),...(iosAccount?.orders||[])].sort((a,b)=>b.createdAtMillis-a.createdAtMillis));
    if(android.status==='fulfilled') renderProject(account.project);
    show('more-keys',Boolean(keyCursor));show('verification',!auth.currentUser?.emailVerified);
    $('account-email').textContent=auth.currentUser?.email||'';$('gold-email').textContent=`Contact email: ${auth.currentUser?.email||''}`;
    if(android.status==='rejected'||ios.status==='rejected') notice('Some purchases could not refresh. Your existing keys are safe; refresh your account to retry.',true);
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
$('account-signin').onclick = () => openAuth(pendingView);
$('referral-nav').onclick = event => { event.preventDefault(); if (auth.currentUser) view('referrals', true); else openAuth('referrals'); };
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
document.querySelectorAll('[name=platform]').forEach(el => el.onchange = () => {if(!working) selectPlatform(el.value);});
document.querySelectorAll('[name=provider]').forEach(el => el.onchange = () => {$('key-consent').checked=false;quote();}); $('quantity').oninput = quote;
$('key-form').onsubmit = event => {
  event.preventDefault(); if (!auth.currentUser) return openAuth('orders');
  if (!auth.currentUser.emailVerified) { notice('Verify your email in My account first.', true); return view('orders', true); }
  if (working || !platform || !currentPrices()?.enabled) return;
  const win = checkoutWindow();
  work($('buy-keys'), async () => { try {
    const selectedPlatform=platform,prices=currentPrices();
    const provider = selectedProvider(), quantity = Number($('quantity').value);
    const signature = `${auth.currentUser.uid}:${selectedPlatform}:${provider}:${quantity}:${prices[provider]}`;
    if (keyCheckoutRequest?.signature !== signature) keyCheckoutRequest = { signature, id: crypto.randomUUID() };
    const result = await keyApi(selectedPlatform,'keys.checkout', { provider, quantity, requestId: keyCheckoutRequest.id, expectedAmount: prices[provider] * quantity, expectedCurrency:['paystack','flutterwave'].includes(provider)?'NGN':'GBP', acceptTerms: $('key-consent').checked });
    keyCheckoutRequest.orderId = result.orderId;
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
  accountEpoch++; account = null; iosAccount = null; keyCheckoutRequest = null; project = null; keyCursor = null; chatCursor = null; projectRequestId = null; messageRequestId = null;
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
if (location.hash === '#referrals' || new URL(location.href).searchParams.has('ref')) pendingView = 'referrals';
selectPlatform(new URL(location.href).searchParams.get('platform'));
loadCatalog().catch(error => { $('buy-keys').textContent = 'Prices unavailable'; notice(errorMessage(error), true); });
icons();

}
startStore().catch(() => {
  const status = document.getElementById('store-status');
  status.textContent = 'The store could not connect. Please reload the page to sign in or buy keys.';
  status.dataset.error = 'true'; status.hidden = false;
  for (const id of ['buy-keys', 'login-button', 'account-signin', 'request-gold']) document.getElementById(id).disabled = true;
});
