from __future__ import annotations

import json
import os
import platform
import sys
import tempfile
from dataclasses import asdict, dataclass
from pathlib import Path


APP_NAME = "BouRemoteServ"
DEFAULT_PORT = 8765
DEFAULT_LANGUAGE = "fr"


@dataclass
class Settings:
    language: str = DEFAULT_LANGUAGE
    autostart: bool = False
    port: int = DEFAULT_PORT


def _candidate_config_dirs() -> list[Path]:
    candidates: list[Path] = []
    custom_dir = os.environ.get("BOUREMOTESERV_DATA_DIR")
    if custom_dir:
        candidates.append(Path(custom_dir))
    if platform.system() == "Windows":
        appdata = os.environ.get("APPDATA")
        localappdata = os.environ.get("LOCALAPPDATA")
        if appdata:
            candidates.append(Path(appdata) / APP_NAME)
        if localappdata:
            candidates.append(Path(localappdata) / APP_NAME)
    candidates.append(Path.cwd() / "remote_dock_data")
    candidates.append(Path(tempfile.gettempdir()) / APP_NAME)
    return candidates


# Cherche les emplacements possibles pour stocker la configuration locale.
def _config_dir() -> Path:
    for candidate in _candidate_config_dirs():
        try:
            candidate.mkdir(parents=True, exist_ok=True)
            return candidate
        except OSError:
            continue
    raise RuntimeError("BouRemoteServ could not create a writable settings directory.")


# Retourne le fichier de configuration local de l'application.
def config_path() -> Path:
    return _config_dir() / "settings.json"


# Charge les paramètres enregistrés, ou les valeurs par défaut si rien n'existe.
def load_settings() -> Settings:
    path = config_path()
    if not path.exists():
        return Settings()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return Settings()
    return Settings(
        language=str(data.get("language", DEFAULT_LANGUAGE)),
        autostart=bool(data.get("autostart", False)),
        port=int(data.get("port", DEFAULT_PORT)),
    )


# Enregistre les paramètres actuels sur le disque.
def save_settings(settings: Settings) -> None:
    path = config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(asdict(settings), indent=2), encoding="utf-8")


# Construit la commande de lancement utilisée pour le démarrage automatique.
def launcher_command(script_path: Path | None = None) -> str:
    script = script_path or Path(__file__).resolve().parents[1] / "main.py"
    python = Path(sys.executable)
    return f'"{python}" "{script}"'


# Active ou désactive le lancement automatique de BouRemoteServ sur Windows.
def set_windows_autostart(enabled: bool, script_path: Path | None = None) -> None:
    if platform.system() != "Windows":
        return

    import winreg

    run_key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, run_key_path, 0, winreg.KEY_SET_VALUE) as key:
        if enabled:
            winreg.SetValueEx(key, APP_NAME, 0, winreg.REG_SZ, launcher_command(script_path))
        else:
            try:
                winreg.DeleteValue(key, APP_NAME)
            except FileNotFoundError:
                pass


# Vérifie si le lancement automatique est actuellement activé sous Windows.
def read_windows_autostart() -> bool:
    if platform.system() != "Windows":
        return False

    import winreg

    run_key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, run_key_path, 0, winreg.KEY_READ) as key:
            winreg.QueryValueEx(key, APP_NAME)
            return True
    except FileNotFoundError:
        return False
