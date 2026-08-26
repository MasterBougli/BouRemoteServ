# BouRemoteServ

**Language:** [English](README.md) | [Français](README.fr.md) | [Español](README.es.md)

BouRemoteServ is a Windows tray app that exposes a local web interface so your phone can control your PC without installing anything on the phone.

## What it does

- Move the mouse from a phone trackpad
- Use directional nudges for precise movement
- Trigger `Play / Pause`, `Next`, and `Previous`
- Stay discreet in the Windows taskbar
- Start manually or automatically with Windows
- Switch the interface between French and English
- Connect by local IP address or QR code

## Why this stack

- Windows first, as requested
- Phone uses the browser only
- Local network only, no cloud dependency
- Tray-based app feels native and unobtrusive
- Single responsive UI works on both phone and desktop

## Project layout

- `main.py` launches the tray app and local server
- `remote_dock/` contains the Windows control logic
- `web/` contains the responsive mobile-first interface
- `docs/` contains the installation and usage guide
- `scripts/` contains Windows build helpers

## Quick start

1. Install the dependencies.
2. Run `python main.py`.
3. Open the shown local address on your phone.
4. Use the QR code or the manual address to connect.

## Run locally

1. Install Python 3.12 or newer.
2. Install the dependencies:

```powershell
pip install -r requirements.txt
```

3. Start the app:

```powershell
python main.py
```

4. Open the URL shown in the tray menu or scan the QR code from the dashboard.

## Windows build

Use the packaging helper:

```powershell
.\scripts\build_windows.ps1
```

The build output lands in `dist/`.

## Notes

- The app listens on your local network, so your phone and PC must be on the same Wi-Fi.
- The current version is intentionally minimal: mouse movement plus media controls only.
- The interface is designed to feel premium and dark by default.

## Documentation

- [Tutorial](docs/TUTORIAL.md)
- [Installation](docs/INSTALLATION.md)
- [Usage](docs/USAGE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Build Windows](docs/BUILD_WINDOWS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Support the project](DONATE.md)

## Documentation language

Pick the version you want to read:

| Language | Open |
| --- | --- |
| English | [Open EN docs](docs/README.md) |
| Français | [Ouvrir les docs FR](docs/README.fr.md) |
| Español | [Abrir docs ES](docs/README.es.md) |

### French docs

- [Tutoriel FR](docs/TUTORIAL.fr.md)
- [Installation FR](docs/INSTALLATION.fr.md)
- [Utilisation FR](docs/USAGE.fr.md)
- [Architecture FR](docs/ARCHITECTURE.fr.md)
- [Build Windows FR](docs/BUILD_WINDOWS.fr.md)
- [Depannage FR](docs/TROUBLESHOOTING.fr.md)
- [Documentation FR index](docs/README.fr.md)

## License and contributions

- Licensed under AGPLv3 or later
- Contributions require DCO sign-off
- See [LICENSE](LICENSE) and [DCO.md](DCO.md)

## Next upgrades

- Add volume controls
- Add clipboard sync
- Add keyboard shortcuts
- Add multi-PC selection
- Package as a signed Windows installer
