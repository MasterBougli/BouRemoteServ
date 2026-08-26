from __future__ import annotations

import threading
import webbrowser
from dataclasses import dataclass

import pystray
from PIL import Image, ImageDraw

from remote_dock.config import save_settings, set_windows_autostart


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


@dataclass
class TrayController:
    server: object
    quit_event: threading.Event

    def toggle_autostart(self, icon: pystray.Icon, item) -> None:
        enabled = not self.server.settings.autostart
        self.server.settings.autostart = enabled
        set_windows_autostart(enabled)
        save_settings(self.server.settings)

    def open_dashboard(self, icon: pystray.Icon, item) -> None:
        webbrowser.open(self.server.base_url)

    def quit_app(self, icon: pystray.Icon, item) -> None:
        self.server.stop()
        self.quit_event.set()
        icon.stop()

    def build_menu(self) -> pystray.Menu:
        return pystray.Menu(
            pystray.MenuItem("Open dashboard", self.open_dashboard),
            pystray.MenuItem("Autostart with Windows", self.toggle_autostart, checked=lambda item: self.server.settings.autostart),
            pystray.MenuItem("Quit", self.quit_app),
        )


def run_tray(server) -> None:
    quit_event = threading.Event()
    controller = TrayController(server=server, quit_event=quit_event)
    icon = pystray.Icon("RemoteDock", _build_icon_image(), "RemoteDock", controller.build_menu())
    icon.run()
