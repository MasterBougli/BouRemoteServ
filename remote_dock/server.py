from __future__ import annotations

import json
import socket
import threading
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import qrcode
from PIL import Image

from remote_dock.config import Settings, save_settings, set_windows_autostart
from remote_dock.input_control import mouse_click, move_mouse, next_track, play_pause, previous_track


ROOT_DIR = Path(__file__).resolve().parents[1]
WEB_DIR = ROOT_DIR / "web"


# Détecte l'adresse locale à utiliser pour la connexion depuis le téléphone.
def get_local_ip() -> str:
    probe = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        probe.connect(("8.8.8.8", 80))
        return probe.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        probe.close()


# Répond avec du JSON propre et sans cache.
def _json_response(handler: BaseHTTPRequestHandler, status: int, payload: dict[str, Any]) -> None:
    data = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(data)


# Répond avec du texte brut ou HTML.
def _text_response(handler: BaseHTTPRequestHandler, status: int, content: str, content_type: str = "text/plain; charset=utf-8") -> None:
    data = content.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Content-Length", str(len(data)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(data)


# Répond avec des données binaires, comme une image PNG.
def _binary_response(handler: BaseHTTPRequestHandler, status: int, data: bytes, content_type: str) -> None:
    handler.send_response(status)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Content-Length", str(len(data)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(data)


# Charge un fichier statique depuis le dossier web.
def _load_static_file(name: str) -> bytes:
    return (WEB_DIR / name).read_bytes()


# Génère le QR code PNG de l'URL locale.
def _generate_qr_png(url: str) -> bytes:
    qr = qrcode.QRCode(border=2, box_size=8)
    qr.add_data(url)
    qr.make(fit=True)
    image = qr.make_image(fill_color="#0f172a", back_color="#f8fafc").convert("RGB")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


# Serveur HTTP local enrichi avec l'état partagé de l'application.
class RemoteDockHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True

    # Stocke l'état partagé entre le serveur et les requêtes HTTP.
    def __init__(self, server_address, RequestHandlerClass, app_state):
        super().__init__(server_address, RequestHandlerClass)
        self.app_state = app_state


# Gestionnaire des requêtes HTTP pour l'interface et l'API locale.
class RemoteDockHandler(BaseHTTPRequestHandler):
    server_version = "RemoteDock"

    # Sert les fichiers web et les points de terminaison de lecture.
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        state = self.server.app_state

        # Pages statiques de l'interface web.
        if path in {"/", "/index.html"}:
            _binary_response(self, HTTPStatus.OK, _load_static_file("index.html"), "text/html; charset=utf-8")
            return
        if path == "/styles.css":
            _binary_response(self, HTTPStatus.OK, _load_static_file("styles.css"), "text/css; charset=utf-8")
            return
        if path == "/app.js":
            _binary_response(self, HTTPStatus.OK, _load_static_file("app.js"), "application/javascript; charset=utf-8")
            return

        # Points de lecture utilisés par le tableau de bord.
        if path == "/api/status":
            _json_response(
                self,
                HTTPStatus.OK,
                {
                    "ok": True,
                    "name": "RemoteDock",
                    "language": state.settings.language,
                    "autostart": state.settings.autostart,
                    "port": state.port,
                    "host": state.host,
                    "url": state.base_url,
                    "lastAction": state.last_action,
                },
            )
            return
        if path == "/api/qr.png":
            _binary_response(self, HTTPStatus.OK, _generate_qr_png(state.base_url), "image/png")
            return
        _json_response(self, HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})

    # Traite les actions envoyées depuis l'interface web.
    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        state = self.server.app_state
        payload = self._read_json()

        try:
            # Mouvement de souris envoyé par le pavé tactile.
            if path == "/api/mouse/move":
                move_mouse(int(payload.get("dx", 0)), int(payload.get("dy", 0)))
                state.last_action = "mouse"
                _json_response(self, HTTPStatus.OK, {"ok": True})
                return
            # Clics souris.
            if path == "/api/mouse/click":
                button = str(payload.get("button", "left"))
                mouse_click(button)
                state.last_action = f"{button}-click"
                _json_response(self, HTTPStatus.OK, {"ok": True})
                return
            # Raccourcis multimédia.
            if path == "/api/media/playpause":
                play_pause()
                state.last_action = "playpause"
                _json_response(self, HTTPStatus.OK, {"ok": True})
                return
            if path == "/api/media/next":
                next_track()
                state.last_action = "next"
                _json_response(self, HTTPStatus.OK, {"ok": True})
                return
            if path == "/api/media/previous":
                previous_track()
                state.last_action = "previous"
                _json_response(self, HTTPStatus.OK, {"ok": True})
                return
            # Réglages de l'application.
            if path == "/api/settings/autostart":
                enabled = bool(payload.get("enabled", False))
                state.settings.autostart = enabled
                set_windows_autostart(enabled)
                save_settings(state.settings)
                _json_response(self, HTTPStatus.OK, {"ok": True, "autostart": enabled})
                return
            if path == "/api/settings/language":
                language = str(payload.get("language", "fr"))
                if language not in {"fr", "en"}:
                    raise ValueError("Unsupported language")
                state.settings.language = language
                save_settings(state.settings)
                _json_response(self, HTTPStatus.OK, {"ok": True, "language": language})
                return
        except Exception as exc:
            _json_response(self, HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})
            return

        _json_response(self, HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})

    # Désactive les logs HTTP par défaut pour garder la console propre.
    def log_message(self, format: str, *args) -> None:
        return

    # Lit un corps JSON depuis la requête courante.
    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)


# Conteneur simple pour l'état partagé entre le serveur et l'interface.
class AppState:
    # Prépare l'état partagé utilisé par le serveur et l'interface.
    def __init__(self, settings: Settings, port: int, host: str):
        self.settings = settings
        self.port = port
        self.host = host
        self.base_url = f"http://{host}:{port}"
        self.last_action = "ready"


# Orchestration du serveur, du port et de l'adresse locale.
class RemoteDockServer:
    # Crée le serveur local avec ses paramètres de départ.
    def __init__(self, settings: Settings):
        self.settings = settings
        self.port = settings.port
        self.host = get_local_ip()
        self.state = AppState(settings, self.port, self.host)
        self._server: RemoteDockHTTPServer | None = None
        self._thread: threading.Thread | None = None

    # Expose l'URL de base utilisée par le téléphone.
    @property
    def base_url(self) -> str:
        return self.state.base_url

    # Démarre le serveur HTTP en arrière-plan.
    def start(self) -> None:
        # Le serveur écoute sur toutes les interfaces, mais on publie une URL locale.
        bind_host = "0.0.0.0"
        port = self._choose_port(bind_host, self.settings.port)
        self.port = port
        self.settings.port = port
        self.state.port = port
        self.state.host = self.host
        self.state.base_url = f"http://{self.host}:{port}"
        self._server = RemoteDockHTTPServer((bind_host, port), RemoteDockHandler, self.state)
        self._thread = threading.Thread(target=self._server.serve_forever, name="RemoteDockHTTP", daemon=True)
        self._thread.start()
        save_settings(self.settings)

    # Arrête proprement le serveur HTTP.
    def stop(self) -> None:
        if self._server:
            self._server.shutdown()
            self._server.server_close()
            self._server = None
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2.0)
            self._thread = None

    # Cherche un port libre à partir du port demandé.
    def _choose_port(self, host: str, start_port: int) -> int:
        # On tente une petite plage pour éviter les conflits de ports courants.
        for port in range(start_port, start_port + 20):
            try:
                test = ThreadingHTTPServer((host, port), RemoteDockHandler)
                test.server_close()
                return port
            except OSError:
                continue
        raise RuntimeError("No free port available for RemoteDock.")
