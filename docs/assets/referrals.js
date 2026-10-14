const ENDPOINT = 'https://europe-west2-wallpaper-5b02e.cloudfunctions.net/myCamReferrals';
const TERMS = 'referral-20261014';
export function mountReferrals(auth, onAuthStateChanged) {
  const $ = id => document.getElementById(id);
  let data = null, busy = false, epoch = 0, refreshVersion = 0, requestId = crypto.randomUUID();
  const invite = new URL(location.href).searchParams.get('ref') || '';
  const validInvite = /^MC-?[A-F0-9]{12}$/i.test(invite) ? invite.toUpperCase() : '';
  $('referral-invite').hidden = !validInvite;
  $('referral-invite-code').textContent = validInvite;
  $('referral-invite-copy').onclick = () => navigator.clipboard.writeText(validInvite).catch(() => status('Copy the code shown above.'));
  function status(text) { $('referral-status').textContent = text; }
  async function api(action, body = {}) {
    const user = auth.currentUser; if (!user) throw new Error('Sign in to continue.');
    const token = await user.getIdToken(true);
    const response = await fetch(ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, action }), signal: AbortSignal.timeout(30000), cache: 'no-store' });
    let value; try { value = await response.json(); } catch { throw new Error('Referral service is not available yet. Existing purchases are unaffected.'); }
    if (auth.currentUser?.uid !== user.uid) throw new Error('Account changed. Refresh.');
    if (!response.ok || value.ok === false) throw new Error(value.error || 'Referral request failed.');
    return value;
  }
  async function refresh() {
    if (!auth.currentUser || busy) return;
    const started = epoch;
    const version = ++refreshVersion;
    try { const value = await api('dashboard'); if (started !== epoch || version !== refreshVersion || busy) return; data = value; status(''); render(); }
    catch (error) { if (started === epoch && version === refreshVersion) status(error.message); }
  }
  async function work(action) {
    if (busy) return; busy = true; status(''); render();
    let failure = '';
    try { await action(); } catch (error) { failure = error.message; status(failure); }
    finally { busy = false; render(); await refresh(); if (failure) status(failure); }
  }
  function render() {
    const profile = data?.profile, wallet = data?.wallet;
    $('referral-enrol').hidden = !auth.currentUser || !!profile;
    $('referral-dashboard').hidden = !profile;
    $('referral-enrol-button').disabled = busy || !auth.currentUser?.emailVerified || !$('referral-consent').checked;
    if (!profile) return;
    $('referral-code').textContent = profile.code;
    $('referral-progress').value = wallet.progress;
    $('referral-balance').textContent = `${wallet.progress}% · ${wallet.readyRewards} reward(s) ready · ${wallet.nextProgress}% toward the next cycle`;
    $('referral-pending').textContent = `${wallet.pendingPoints / 100}% pending payment hold.${wallet.debtPoints ? ' Reversed payments must be offset before another reward.' : ''}${data.config.earningEnabled ? '' : ' New referral earning is paused.'}`;
    const disabled = busy || profile.suspended || !data.config.requestsEnabled || wallet.readyRewards < 1 || !!wallet.activeRequest;
    $('referral-key').disabled = disabled;
    $('referral-amazon').disabled = disabled || !$('referral-marketplace').checked;
    const list = $('referral-requests'); list.replaceChildren();
    for (const request of data.requests) {
      const card = document.createElement('article'); card.className = 'key-card';
      const title = document.createElement('h4'); title.textContent = `${request.choice === 'key' ? 'MYCAM key' : '£10 Amazon.co.uk gift card'} · ${request.status}`; card.append(title);
      const detail = document.createElement('p'); detail.textContent = request.reason || (request.releaseAtMillis > Date.now() && ['requested', 'approved'].includes(request.status)
        ? `Payment hold until ${new Date(request.releaseAtMillis).toLocaleDateString()}` : ''); card.append(detail);
      if (request.rewardCode) {
        const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'button outline'; copy.textContent = 'Copy reward code';
        copy.onclick = () => navigator.clipboard.writeText(request.rewardCode).catch(() => status('Clipboard unavailable. Use a supported browser.')); card.append(copy);
      }
      if (['requested', 'approved'].includes(request.status)) {
        const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'plain-link'; cancel.textContent = 'Cancel request'; cancel.disabled = busy;
        cancel.onclick = () => work(() => api('cancel', { id: request.id })); card.append(cancel);
      }
      list.append(card);
    }
  }
  $('referral-consent').onchange = render;
  $('referral-marketplace').onchange = render;
  $('referral-enrol-button').onclick = () => work(() => api('enrol', { acceptTerms: true, termsVersion: TERMS }));
  $('referral-refresh').onclick = refresh;
  $('referral-copy').onclick = () => navigator.clipboard.writeText(data.profile.code).catch(() => status('Copy the code shown above.'));
  $('referral-share').onclick = async () => {
    const url = new URL('../store.html', import.meta.url); url.searchParams.set('ref', data.profile.code); url.hash = 'referrals';
    const text = `MYCAM referral promotion: enter ${data.profile.code} before paying for a subscription.`;
    try { if (navigator.share) await navigator.share({ title: 'MYCAM referral', text, url: url.href }); else { await navigator.clipboard.writeText(`${text} ${url.href}`); status('Referral link copied.'); } }
    catch (error) { if (error.name !== 'AbortError') status('Share unavailable. Copy your referral code instead.'); }
  };
  async function request(choice) {
    await api('request', { requestId, choice, acceptMarketplace: $('referral-marketplace').checked }); requestId = crypto.randomUUID();
  }
  $('referral-key').onclick = () => work(() => request('key'));
  $('referral-amazon').onclick = () => work(() => request('amazon'));
  onAuthStateChanged(auth, () => { epoch++; data = null; requestId = crypto.randomUUID(); $('referral-code').textContent = ''; $('referral-requests').replaceChildren(); render(); refresh(); });
  render(); return { refresh };
}
