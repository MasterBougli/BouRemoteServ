const text = {
  fr: {
    heroEyebrow: "Telecommande locale Windows",
    heroTitle: "RemoteDock",
    heroText: "Controle la souris et les commandes media depuis votre telephone, sans rien installer.",
    localAddress: "Adresse locale",
    lastAction: "Derniere action",
    touchpadEyebrow: "Controle souris",
    touchpadTitle: "Trackpad",
    touchpadHint: "Glissez pour bouger le curseur. Tap = clic gauche.",
    trackpadLabel: "Glissez ici",
    leftClick: "Clic gauche",
    rightClick: "Clic droit",
    directionEyebrow: "Controle precision",
    directionTitle: "Pavé directionnel",
    directionHint: "Parfait pour les petits ajustements.",
    mediaEyebrow: "Commandes media",
    mediaTitle: "Lecture",
    mediaHint: "Play, pause, suivant, precedent.",
    previous: "Precedent",
    playPause: "Play / Pause",
    next: "Suivant",
    connectEyebrow: "Acces",
    connectTitle: "Connexion",
    connectHint: "Utilisez le QR code ou saisissez l'adresse manuellement.",
    manualAddress: "Adresse manuelle",
    copy: "Copier",
    networkNote: "Restez sur le meme Wi-Fi local.",
    settingsEyebrow: "Parametres",
    settingsTitle: "Systeme",
    settingsHint: "Langue et demarrage automatique.",
    languageLabel: "Langue",
    autostartLabel: "Demarrer avec Windows",
  },
  en: {
    heroEyebrow: "Windows local remote",
    heroTitle: "RemoteDock",
    heroText: "Control the mouse and media keys from your phone without installing anything on it.",
    localAddress: "Local address",
    lastAction: "Last action",
    touchpadEyebrow: "Mouse control",
    touchpadTitle: "Trackpad",
    touchpadHint: "Swipe to move the cursor. Tap = left click.",
    trackpadLabel: "Swipe here",
    leftClick: "Left click",
    rightClick: "Right click",
    directionEyebrow: "Precision control",
    directionTitle: "Directional pad",
    directionHint: "Perfect for small adjustments.",
    mediaEyebrow: "Media controls",
    mediaTitle: "Playback",
    mediaHint: "Play, pause, next, previous.",
    previous: "Previous",
    playPause: "Play / Pause",
    next: "Next",
    connectEyebrow: "Access",
    connectTitle: "Connect",
    connectHint: "Use the QR code or type the address manually.",
    manualAddress: "Manual address",
    copy: "Copy",
    networkNote: "Stay on the same local Wi-Fi.",
    settingsEyebrow: "Settings",
    settingsTitle: "System",
    settingsHint: "Language and startup behavior.",
    languageLabel: "Language",
    autostartLabel: "Start with Windows",
  },
};

const state = {
  url: "",
  language: "fr",
  pointerDown: false,
  lastPoint: null,
  dragged: false,
  queuedDx: 0,
  queuedDy: 0,
  raf: 0,
  holdTimer: null,
};

const $ = (selector) => document.querySelector(selector);
const trackpad = $("#trackpad");
const serverUrl = $("#serverUrl");
const serverUrlInput = $("#serverUrlInput");
const qrCode = $("#qrCode");
const lastAction = $("#lastAction");
const connectionPill = $("#connectionPill");
const languageSelect = $("#languageSelect");
const autostartToggle = $("#autostartToggle");

function applyLanguage(language) {
  const dict = text[language] || text.fr;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
}

function showAction(label) {
  lastAction.textContent = label;
  connectionPill.textContent = "Ready";
}

async function requestJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });
  return response.json();
}

function scheduleMove(dx, dy) {
  state.queuedDx += dx;
  state.queuedDy += dy;
  if (state.raf) {
    return;
  }
  state.raf = requestAnimationFrame(async () => {
    const payload = { dx: Math.round(state.queuedDx), dy: Math.round(state.queuedDy) };
    state.queuedDx = 0;
    state.queuedDy = 0;
    state.raf = 0;
    if (!payload.dx && !payload.dy) {
      return;
    }
    await requestJson("/api/mouse/move", payload);
    showAction(`Mouse ${payload.dx}, ${payload.dy}`);
  });
}

function setTouchState(active) {
  state.pointerDown = active;
  if (!active) {
    state.lastPoint = null;
  }
}

function handlePointerDown(event) {
  event.preventDefault();
  setTouchState(true);
  state.dragged = false;
  state.lastPoint = { x: event.clientX, y: event.clientY };
  if (trackpad.setPointerCapture) {
    trackpad.setPointerCapture(event.pointerId);
  }
}

function handlePointerMove(event) {
  if (!state.pointerDown || !state.lastPoint) {
    return;
  }
  const dx = event.clientX - state.lastPoint.x;
  const dy = event.clientY - state.lastPoint.y;
  if (Math.abs(dx) + Math.abs(dy) > 4) {
    state.dragged = true;
  }
  state.lastPoint = { x: event.clientX, y: event.clientY };
  scheduleMove(dx * 1.8, dy * 1.8);
}

function handlePointerUp(event) {
  if (trackpad.releasePointerCapture) {
    try {
      trackpad.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Ignore capture errors on browsers that release automatically.
    }
  }
  const shouldClick = state.pointerDown && !state.dragged;
  setTouchState(false);
  if (shouldClick) {
    pulseClick("left");
  }
}

function pulseClick(button = "left") {
  requestJson("/api/mouse/click", { button });
  showAction(button === "left" ? "Left click" : "Right click");
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

function bindHoldMove(button, direction) {
  const step = direction === "up" || direction === "down" ? 12 : 12;
  const vector = {
    up: [0, -step],
    down: [0, step],
    left: [-step, 0],
    right: [step, 0],
  }[direction];
  const start = () => {
    scheduleMove(vector[0], vector[1]);
    state.holdTimer = window.setInterval(() => scheduleMove(vector[0], vector[1]), 70);
  };
  const stop = () => {
    if (state.holdTimer) {
      window.clearInterval(state.holdTimer);
      state.holdTimer = null;
    }
  };
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    start();
  });
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("pointerleave", stop);
}

async function refreshStatus() {
  const response = await fetch("/api/status", { cache: "no-store" });
  const data = await response.json();
  state.url = data.url;
  state.language = data.language || "fr";
  serverUrl.textContent = data.url;
  serverUrlInput.value = data.url;
  qrCode.src = "/api/qr.png";
  lastAction.textContent = data.lastAction || "ready";
  autostartToggle.checked = Boolean(data.autostart);
  languageSelect.value = state.language;
  applyLanguage(state.language);
}

async function init() {
  const data = await (await fetch("/api/status", { cache: "no-store" })).json();
  state.url = data.url;
  state.language = data.language || "fr";
  serverUrl.textContent = data.url;
  serverUrlInput.value = data.url;
  qrCode.src = "/api/qr.png";
  lastAction.textContent = data.lastAction || "ready";
  autostartToggle.checked = Boolean(data.autostart);
  languageSelect.value = state.language;
  applyLanguage(state.language);

  trackpad.addEventListener("pointerdown", handlePointerDown);
  trackpad.addEventListener("pointermove", handlePointerMove);
  trackpad.addEventListener("pointerup", handlePointerUp);
  trackpad.addEventListener("pointercancel", handlePointerUp);

  document.querySelectorAll("[data-move]").forEach((button) => {
    bindHoldMove(button, button.dataset.move);
  });

  document.querySelectorAll("[data-action='left-click']").forEach((button) => {
    button.addEventListener("click", () => pulseClick("left"));
  });

  document.querySelectorAll("[data-action='right-click']").forEach((button) => {
    button.addEventListener("click", () => pulseClick("right"));
  });

  document.querySelectorAll("[data-media]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.media;
      await requestJson(`/api/media/${action}`, {});
      showAction(action);
    });
  });

  $("#copyButton").addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(serverUrlInput.value);
      } else {
        serverUrlInput.focus();
        serverUrlInput.select();
        document.execCommand("copy");
      }
    } catch (error) {
      serverUrlInput.focus();
      serverUrlInput.select();
      document.execCommand("copy");
    }
    showAction("Copied");
  });

  languageSelect.addEventListener("change", async () => {
    const language = languageSelect.value;
    await requestJson("/api/settings/language", { language });
    applyLanguage(language);
    showAction(language.toUpperCase());
  });

  autostartToggle.addEventListener("change", async () => {
    const enabled = autostartToggle.checked;
    await requestJson("/api/settings/autostart", { enabled });
    showAction(enabled ? "Autostart on" : "Autostart off");
  });

  window.setInterval(refreshStatus, 5000);
}

init().catch((error) => {
  connectionPill.textContent = "Offline";
  connectionPill.style.background = "rgba(255, 106, 136, 0.14)";
  connectionPill.style.borderColor = "rgba(255, 106, 136, 0.3)";
  console.error(error);
});
