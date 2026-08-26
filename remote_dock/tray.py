from __future__ import annotations

import threading
import webbrowser
from dataclasses import dataclass

import pystray
from PIL import Image, ImageDraw

from remote_dock.config import save_settings, set_windows_autostart


# Génère l'icône de la zone de notification.
def _build_icon_image() -> Image.Image:
    size = 64
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((6, 6, size - 6, size - 6), radius=16, fill=(15, 23, 42, 255))
    draw.rounded_rectangle((11, 11, size - 11, size - 11), radius=12, outline=(148, 163, 184, 255), width=2)
    draw.rectangle((19, 19, 45, 23), fill=(96, 165, 250, 255))
    draw.rectangle((19, 29, 45, 33), fill=(96, 165, 250, 255))
    draw.rectangle((19, 39, 35, 43), fill=(248, 250, 252, 255))
    return image


# Contrôle de la zone de notification et des actions associées.
@dataclass
class TrayController:
    server: object
    quit_event: threading.Event

    # Bascule le démarrage automatique depuis le menu de la zone de notification.
    def toggle_autostart(self, icon: pystray.Icon, item) -> None:
        enabled = not self.server.settings.autostart
        self.server.settings.autostart = enabled
        set_windows_autostart(enabled)
        save_settings(self.server.settings)

    # Ouvre le tableau de bord local dans le navigateur.
    def open_dashboard(self, icon: pystray.Icon, item) -> None:
        webbrowser.open(self.server.base_url)

    # Ferme proprement le serveur puis quitte l'application.
    def quit_app(self, icon: pystray.Icon, item) -> None:
        self.server.stop()
        self.quit_event.set()
        icon.stop()

    # Construit le menu de la zone de notification.
    def build_menu(self) -> pystray.Menu:
        # L'ordre du menu suit le parcours attendu: ouvrir, régler, quitter.
        return pystray.Menu(
            pystray.MenuItem("Open dashboard", self.open_dashboard),
            pystray.MenuItem("Autostart with Windows", self.toggle_autostart, checked=lambda item: self.server.settings.autostart),
            pystray.MenuItem("Quit", self.quit_app),
        )


# Lance l'icône de la zone de notification et attend l'arrêt de l'application.
def run_tray(server) -> None:
    quit_event = threading.Event()
    controller = TrayController(server=server, quit_event=quit_event)
    icon = pystray.Icon("BouRemoteServ", _build_icon_image(), "BouRemoteServ", controller.build_menu())
    icon.run()
