
// Human-readable rewrite of the Norium/Srabon overlay script.
// No obfuscation, dynamic constructors, self-defending wrappers, or generated names.

(() => {
  "use strict";

  const CONFIG = {
    avatarUrl: "https://raw.githubusercontent.com/norium10/aincard/main/srabon.png",
    helpUrl: "https://t.me/norium100",
    updateUrl: "https://t.me/norium10",
    gatewayUrl: "https://zxi-file-loader.ah4734536.workers.dev?file=zxi.txt&key=Hey&user=2",
    overlayId: "akx_overlay_container",
    styleId: "akx_styles",
    loadingMessageId: "akmsg",
    cancelButtonId: "akx_cancel"
  };

  const UI = {
    loadingMessages: [
      "ESTABLISHING LINK...",
      "SYNCHRONIZING DATA...",
      "EXTRACTING TOKEN..."
    ],
    sessionCookie:
      "__session=eyJnZXRrZXlfaW5pdGlhdGVkX2F0IjoxNzg5Mzc2Mzc1NDQxLCJnZXRrZXlfY29tcGxldGVkIjpmYWxzZSwiYmFubmVkIjpmYWxzZX0%3D.m27QGejM%2Fe1p1g6eksDF6XfcPxFbVEsWWDmUbQFjxaM; path=/; max-age=86400; SameSite=Lax"
  };

  const STYLE_TEXT = `
    * { box-sizing: border-box; }
    @keyframes overlayFadeIn { from { opacity: 0; transform: scale(.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes loadingGlow { 0%,100% { box-shadow: 0 0 50px rgba(0,0,0,.9), 0 0 20px rgba(56,189,248,.4); } 50% { box-shadow: 0 0 50px rgba(0,0,0,.9), 0 0 40px rgba(56,189,248,.85); } }
    @keyframes successGlow { 0%,100% { box-shadow: 0 0 50px rgba(0,0,0,.9), 0 0 20px rgba(16,185,129,.4); } 50% { box-shadow: 0 0 50px rgba(0,0,0,.9), 0 0 40px rgba(16,185,129,.85); } }
    @keyframes errorGlow { 0%,100% { box-shadow: 0 0 50px rgba(0,0,0,.9), 0 0 20px rgba(239,68,68,.4); } 50% { box-shadow: 0 0 50px rgba(0,0,0,.9), 0 0 40px rgba(239,68,68,.85); } }
    @keyframes buttonBackground { 0%,100% { background-position: 0 50%; } 50% { background-position: 100% 50%; } }
    .norium-overlay { position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0,0,0,.85); backdrop-filter: blur(8px); font-family: system-ui, -apple-system, sans-serif; }
    .norium-card { width: 100%; max-width: 370px; min-height: 520px; border-radius: 24px; padding: 32px 24px 24px; display: flex; flex-direction: column; position: relative; color: #fff; background: linear-gradient(180deg,#111 0%,#000 100%); border: 1px solid rgba(255,255,255,.08); animation: overlayFadeIn .3s ease forwards; }
    .norium-loading { animation: overlayFadeIn .3s ease forwards, loadingGlow 2.5s infinite ease-in-out; }
    .norium-success { animation: overlayFadeIn .3s ease forwards, successGlow 2.5s infinite ease-in-out; }
    .norium-error { animation: overlayFadeIn .3s ease forwards, errorGlow 2.5s infinite ease-in-out; }
    .norium-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; text-align: center; }
    .norium-avatar { width: 90px; height: 90px; margin: 0 auto 16px; border-radius: 50%; object-fit: cover; }
    .norium-title { margin: 0 0 8px; font-size: 42px; font-weight: 900; letter-spacing: 6px; }
    .norium-status { color: #38bdf8; font-size: 12px; font-weight: 700; letter-spacing: 2px; }
    .norium-key-label { color: #047857; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; }
    .norium-key { width: 100%; margin: 12px 0; padding: 18px; color: #34d399; background: rgba(16,185,129,.05); border: 1px solid rgba(16,185,129,.2); border-radius: 14px; font: 700 18px ui-monospace, monospace; text-align: center; word-break: break-all; }
    .norium-expiry { color: #888; font-size: 11px; font-weight: 600; letter-spacing: 1px; }
    .norium-error-title { color: #ef4444; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; }
    .norium-error-message { width: 100%; padding: 16px; color: #a1a1aa; background: #09090b; border: 1px solid #27272a; border-radius: 14px; font-size: 12px; line-height: 1.6; text-align: center; }
    .norium-actions { display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
    .norium-row { display: flex; gap: 10px; width: 100%; }
    .norium-button { width: 100%; padding: 14px; color: #fff; border: 1px solid rgba(255,255,255,.1); border-radius: 12px; cursor: pointer; background: linear-gradient(90deg,#18181b,#27272a,#18181b); background-size: 200% 200%; animation: buttonBackground 4s infinite linear; font: 800 13px system-ui, sans-serif; letter-spacing: 1px; text-transform: uppercase; }
    .norium-button:active { transform: scale(.96); }
    .norium-button-small { padding: 10px; font-size: 12px; }
    .norium-button-success { background: linear-gradient(90deg,#064e3b,#047857,#064e3b); border-color: #059669; }
    .norium-button-dark { background: #000; }
    .norium-muted { color: #888; font-size: 11px; }
  `;

  function injectStyles() {
    if (document.getElementById(CONFIG.styleId)) return;
    const style = document.createElement("style");
    style.id = CONFIG.styleId;
    style.textContent = STYLE_TEXT;
    document.head.appendChild(style);
  }

  function createOverlay(className) {
    const overlay = document.createElement("div");
    overlay.id = CONFIG.overlayId;
    overlay.className = "norium-overlay";
    const card = document.createElement("div");
    card.className = `norium-card ${className}`;
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    return { overlay, card };
  }

  function removeOverlay() {
    document.getElementById(CONFIG.overlayId)?.remove();
  }

  function formatExpiry() {
    return new Date(Date.now() + 86_400_000).toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  }

  function renderLoading(card) {
    card.innerHTML = `
      <div class="norium-center">
        <img class="norium-avatar" src="${CONFIG.avatarUrl}" alt="Avatar">
        <h1 class="norium-title">SRABON</h1>
        <h2 id="${CONFIG.loadingMessageId}" class="norium-status">${UI.loadingMessages[0]}</h2>
      </div>
      <div class="norium-actions">
        <button id="${CONFIG.cancelButtonId}" class="norium-button norium-button-small">CANCEL</button>
      </div>
    `;
  }

  function renderSuccess(card, authorizationKey) {
    card.className = "norium-card norium-success";
    card.innerHTML = `
      <div class="norium-center">
        <div class="norium-key-label">AUTHORIZATION KEY</div>
        <div class="norium-key">${authorizationKey}</div>
        <div class="norium-expiry">EXPIRES: <strong>${formatExpiry()}</strong></div>
      </div>
      <div class="norium-actions">
        <button id="copyKeyButton" class="norium-button norium-button-success">COPY TO CLIPBOARD</button>
        <div class="norium-row">
          <button id="helpButton" class="norium-button norium-button-small norium-button-dark">GET HELP</button>
          <button id="updateButton" class="norium-button norium-button-small norium-button-dark">UPDATE</button>
        </div>
        <button id="closeButton" class="norium-button norium-button-small">DISMISS</button>
      </div>
    `;

    document.getElementById("copyKeyButton").onclick = async event => {
      await navigator.clipboard.writeText(authorizationKey);
      event.currentTarget.textContent = "COPIED TO CLIPBOARD";
      setTimeout(() => { event.currentTarget.textContent = "COPY TO CLIPBOARD"; }, 2000);
    };
    document.getElementById("helpButton").onclick = () => window.open(CONFIG.helpUrl, "_blank");
    document.getElementById("updateButton").onclick = () => window.open(CONFIG.updateUrl, "_blank");
    document.getElementById("closeButton").onclick = removeOverlay;
  }

  function renderError(card, error) {
    const message = error?.message || String(error || "Unknown error");
    card.className = "norium-card norium-error";
    card.innerHTML = `
      <div class="norium-center">
        <h2 class="norium-error-title">GATEWAY UNREACHABLE</h2>
        <p class="norium-error-message">Network connection interrupted or blocked by environment.<br><br>[ERR]: ${message}</p>
      </div>
      <div class="norium-actions">
        <button id="errorHelpButton" class="norium-button norium-button-small norium-button-dark">GET HELP</button>
        <button id="errorCloseButton" class="norium-button norium-button-small">DISMISS</button>
      </div>
    `;
    document.getElementById("errorHelpButton").onclick = () => window.open(CONFIG.helpUrl, "_blank");
    document.getElementById("errorCloseButton").onclick = removeOverlay;
  }

  async function fetchAuthorizationKey(signal) {
    const gatewayResponse = await fetch(CONFIG.gatewayUrl, { method: "GET", signal });
    const nextUrl = (await gatewayResponse.text()).trim();
    if (!nextUrl) throw new Error("Empty gateway response");

    const payloadResponse = await fetch(nextUrl, {
      method: "GET",
      credentials: "include",
      redirect: "follow",
      signal
    });
    const payload = await payloadResponse.text();
    const match = payload.match(/font-mono[^>]*>([\s\S]*?)<\/code/i);
    const authorizationKey = match ? match[1].trim() : "";
    if (!authorizationKey) throw new Error("Authorization token could not be retrieved from payload.");
    return authorizationKey;
  }

  function initialize() {
    injectStyles();
    removeOverlay();

    if (!document.cookie.includes("__session=")) {
      document.cookie = UI.sessionCookie;
    }

    const controller = new AbortController();
    const { overlay, card } = createOverlay("norium-loading");
    renderLoading(card);

    let messageIndex = 0;
    const messageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % UI.loadingMessages.length;
      const status = document.getElementById(CONFIG.loadingMessageId);
      if (status) status.textContent = UI.loadingMessages[messageIndex];
    }, 1000);

    document.getElementById(CONFIG.cancelButtonId).onclick = () => {
      controller.abort();
      clearInterval(messageTimer);
      overlay.remove();
    };

    fetchAuthorizationKey(controller.signal)
      .then(key => {
        clearInterval(messageTimer);
        if (!document.body.contains(overlay)) return;
        renderSuccess(card, key);
      })
      .catch(error => {
        clearInterval(messageTimer);
        if (error?.name === "AbortError") return;
        if (document.body.contains(overlay)) renderError(card, error);
      });
  }

  initialize();
})();
