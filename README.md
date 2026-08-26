# RemoteDock

RemoteDock is a Windows tray app that exposes a local web interface so your phone can control your PC without installing anything on the phone.

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

## Notes

- The app listens on your local network, so your phone and PC must be on the same Wi-Fi.
- The current version is intentionally minimal: mouse movement plus media controls only.
- The interface is designed to feel premium and dark by default.

## Next upgrades

- Add volume controls
- Add clipboard sync
- Add keyboard shortcuts
- Add multi-PC selection
- Package as a signed Windows installer

