const text = {
  fr: {
    appbarEyebrow: "Console locale premium",
    brandTitle: "BouRemoteServ",
    chipLocalOnly: "Réseau local uniquement",
    chipNoInstall: "Sans installation sur le téléphone",
    chipTaskbar: "Discret dans la barre des tâches",
    heroEyebrow: "Telecommande locale Windows",
    heroTitle: "BouRemoteServ",
    heroText: "Controle la souris et les commandes media depuis votre telephone, sans rien installer.",
    heroStatOneLabel: "Mode",
    heroStatOneValue: "Local only",
    heroStatTwoLabel: "Téléphone",
    heroStatTwoValue: "Seulement le navigateur",
    heroStatThreeLabel: "Focus",
    heroStatThreeValue: "Discret dans la barre des tâches",
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
    readyStatus: "Pret",
    offlineStatus: "Hors ligne",
    copiedStatus: "Copie",
    mouseStatus: "Mouvement souris",
    leftClickStatus: "Clic gauche",
    rightClickStatus: "Clic droit",
    playPauseStatus: "Lecture basculee",
    nextStatus: "Piste suivante",
    previousStatus: "Piste precedente",
    autostartOnStatus: "Demarrage automatique active",
    autostartOffStatus: "Demarrage automatique desactive",
    languageFrenchStatus: "Langue: francais",
    languageEnglishStatus: "Langue: anglais",
  },
  en: {
    appbarEyebrow: "Premium local console",
    brandTitle: "BouRemoteServ",
    chipLocalOnly: "Local network only",
    chipNoInstall: "No install on the phone",
    chipTaskbar: "Discreet in the taskbar",
    heroEyebrow: "Windows local remote",
    heroTitle: "BouRemoteServ",
    heroText: "Control the mouse and media keys from your phone without installing anything on it.",
    heroStatOneLabel: "Mode",
    heroStatOneValue: "Local only",
    heroStatTwoLabel: "Phone",
    heroStatTwoValue: "Browser only",
    heroStatThreeLabel: "Focus",
    heroStatThreeValue: "Taskbar discreet",
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
    readyStatus: "Ready",
    offlineStatus: "Offline",
    copiedStatus: "Copied",
    mouseStatus: "Mouse move",
    leftClickStatus: "Left click",
    rightClickStatus: "Right click",
    playPauseStatus: "Playback toggled",
    nextStatus: "Next track",
    previousStatus: "Previous track",
    autostartOnStatus: "Autostart enabled",
    autostartOffStatus: "Autostart disabled",
    languageFrenchStatus: "Language: French",
    languageEnglishStatus: "Language: English",
  },
};

const state = {
  url: "",
  language: "fr",
  connectionCode: "ready",
  lastActionCode: "ready",
  pointerDown: false,
  lastPoint: null,
  dragged: false,
  queuedDx: 0,
  queuedDy: 0,
  raf: 0,
  holdTimer: null,
};

// Raccourci léger pour cibler les éléments de l'interface.
const $ = (selector) => document.querySelector(selector);
const trackpad = $("#trackpad");
const serverUrl = $("#serverUrl");
const serverUrlInput = $("#serverUrlInput");
const qrCode = $("#qrCode");
const lastAction = $("#lastAction");
const connectionPill = $("#connectionPill");
const languageSelect = $("#languageSelect");
const autostartToggle = $("#autostartToggle");

// Retourne le texte courant dans la langue active.
function t(key) {
  const dict = text[state.language] || text.fr;
  return dict[key] || text.fr[key] || key;
}

// Traduit un code d'action interne en libellé lisible.
function actionLabel(code) {
  const actionToKey = {
    ready: "readyStatus",
    offline: "offlineStatus",
    mouse: "mouseStatus",
    copied: "copiedStatus",
    "left-click": "leftClickStatus",
    "right-click": "rightClickStatus",
    playpause: "playPauseStatus",
    next: "nextStatus",
    previous: "previousStatus",
    "autostart-on": "autostartOnStatus",
    "autostart-off": "autostartOffStatus",
    fr: "languageFrenchStatus",
    en: "languageEnglishStatus",
  };
  return t(actionToKey[code] || code);
}

// Applique la langue choisie à tous les textes marqués dans le DOM.
function applyLanguage(language) {
  const dict = text[language] || text.fr;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
  connectionPill.textContent = actionLabel(state.connectionCode);
  lastAction.textContent = actionLabel(state.lastActionCode);
}

// Affiche la dernière action effectuée dans l'interface.
function showActionCode(code) {
  state.lastActionCode = code;
  lastAction.textContent = actionLabel(code);
  connectionPill.textContent = actionLabel("ready");
  connectionPill.dataset.state = "ready";
}

// Met à jour l'état visuel de connexion.
function setConnectionCode(code) {
  state.connectionCode = code;
  connectionPill.textContent = actionLabel(code);
  connectionPill.dataset.state = code;
}

// Envoie une requête JSON vers l'API locale.
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

// Regroupe les petits déplacements pour éviter de saturer l'API.
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
    showActionCode("mouse");
  });
}

// Active ou désactive l'état de glissement du pavé tactile.
function setTouchState(active) {
  state.pointerDown = active;
  if (!active) {
    state.lastPoint = null;
  }
}

// Enregistre le point de départ d'un geste sur le trackpad.
function handlePointerDown(event) {
  event.preventDefault();
  setTouchState(true);
  state.dragged = false;
  state.lastPoint = { x: event.clientX, y: event.clientY };
  if (trackpad.setPointerCapture) {
    trackpad.setPointerCapture(event.pointerId);
  }
}

// Calcule le déplacement du curseur pendant un glissement.
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

// Déclenche un clic si le geste n'était pas un glissement.
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

// Envoie un clic visuel et haptique côté téléphone.
function pulseClick(button = "left") {
  requestJson("/api/mouse/click", { button });
  showActionCode(button === "left" ? "left-click" : "right-click");
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

// Attache un maintien de pression à un bouton de déplacement.
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

// Rafraîchit l'état affiché depuis le serveur local.
async function refreshStatus() {
  const response = await fetch("/api/status", { cache: "no-store" });
  const data = await response.json();
  state.url = data.url;
  state.language = data.language || "fr";
  serverUrl.textContent = data.url;
  serverUrlInput.value = data.url;
  qrCode.src = "/api/qr.png";
  state.lastActionCode = data.lastAction || "ready";
  autostartToggle.checked = Boolean(data.autostart);
  languageSelect.value = state.language;
  connectionPill.dataset.state = state.connectionCode;
  applyLanguage(state.language);
}

// Initialise toute l'interface et ses événements.
async function init() {
  const data = await (await fetch("/api/status", { cache: "no-store" })).json();
  state.url = data.url;
  state.language = data.language || "fr";
  serverUrl.textContent = data.url;
  serverUrlInput.value = data.url;
  qrCode.src = "/api/qr.png";
  state.lastActionCode = data.lastAction || "ready";
  autostartToggle.checked = Boolean(data.autostart);
  languageSelect.value = state.language;
  connectionPill.dataset.state = state.connectionCode;
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
      showActionCode(action);
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
    showActionCode("copied");
  });

  languageSelect.addEventListener("change", async () => {
    const language = languageSelect.value;
    await requestJson("/api/settings/language", { language });
    applyLanguage(language);
    showActionCode(language);
  });

  autostartToggle.addEventListener("change", async () => {
    const enabled = autostartToggle.checked;
    await requestJson("/api/settings/autostart", { enabled });
    showActionCode(enabled ? "autostart-on" : "autostart-off");
  });

  window.setInterval(refreshStatus, 5000);
}

init().catch((error) => {
  setConnectionCode("offline");
  connectionPill.style.background = "rgba(255, 106, 136, 0.14)";
  connectionPill.style.borderColor = "rgba(255, 106, 136, 0.3)";
  console.error(error);
});
