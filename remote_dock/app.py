from __future__ import annotations

from remote_dock.config import load_settings, read_windows_autostart, save_settings
from remote_dock.server import RemoteDockServer
from remote_dock.tray import run_tray


def run() -> None:
    settings = load_settings()
    settings.autostart = read_windows_autostart()
    save_settings(settings)

    server = RemoteDockServer(settings)
    server.start()
    print(f"BouRemoteServ is ready at {server.base_url}")
    run_tray(server)
